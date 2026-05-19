'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { supabase, User } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender?: User;
  receiver?: User;
}

interface MessageBoxProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  onBack?: () => void;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

const isSameDay = (a: string, b: string) =>
  new Date(a).toDateString() === new Date(b).toDateString();

const dayLabel = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function MessageBox({
  recipientId,
  recipientName,
  recipientAvatar,
  onBack,
}: MessageBoxProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();

    if (!user?.id || !recipientId) return;

    const channelId = `chat_${user.id}_${recipientId}_${Date.now()}`;
    const channel = supabase.channel(channelId);

    channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as Message;
        if (
          (newMsg.sender_id === user.id && newMsg.receiver_id === recipientId) ||
          (newMsg.sender_id === recipientId && newMsg.receiver_id === user.id)
        ) {
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          scrollToBottom();
        }
      })
      .subscribe();

    const poll = setInterval(() => loadMessages(true), 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(poll);
    };
  }, [user?.id, recipientId]);

  const scrollToBottom = () =>
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

  const loadMessages = async (isBackground = false) => {
    if (!user) return;
    if (!isBackground) setLoading(true);
    try {
      const { data } = await supabase
        .from('messages')
        .select('*, sender:sender_id(*), receiver:receiver_id(*)')
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true })
        .limit(100);

      setMessages(prev => {
        if (
          isBackground &&
          data &&
          prev.length > 0 &&
          data.length > 0 &&
          data[data.length - 1].id === prev[prev.length - 1].id
        )
          return prev;
        return data || [];
      });
      if (!isBackground) scrollToBottom();
    } catch (e) {
      console.error(e);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!user || !newMessage.trim()) return;

    const text = newMessage.trim();
    setNewMessage('');

    const tempId = `temp-${Date.now()}`;
    const optimistic: Message = {
      id: tempId,
      sender_id: user.id,
      receiver_id: recipientId,
      content: text,
      created_at: new Date().toISOString(),
      sender: user,
    };
    setMessages(prev => [...prev, optimistic]);
    scrollToBottom();

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({ sender_id: user.id, receiver_id: recipientId, content: text })
        .select()
        .single();
      if (error) throw error;
      if (data) {
        setMessages(prev => prev.map(m => (m.id === tempId ? { ...data, sender: user } : m)));
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  // Group messages by date
  const groupedMessages: { date: string; msgs: Message[] }[] = [];
  messages.forEach(msg => {
    const last = groupedMessages[groupedMessages.length - 1];
    if (!last || !isSameDay(last.date, msg.created_at)) {
      groupedMessages.push({ date: msg.created_at, msgs: [msg] });
    } else {
      last.msgs.push(msg);
    }
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: { xs: 'calc(100vh - 56px)', md: 'calc(100vh - 160px)' },
        backgroundColor: '#0f172a',
        borderRadius: { xs: 0, md: '12px' },
        overflow: 'hidden',
        border: { xs: 'none', md: '1px solid #334155' },
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 1.5,
          py: 1,
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          flexShrink: 0,
          minHeight: 56,
        }}
      >
        {onBack && (
          <IconButton
            onClick={onBack}
            sx={{ display: { xs: 'flex', md: 'none' }, color: '#94a3b8', p: 0.5 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Avatar
          src={recipientAvatar || ''}
          sx={{
            width: 38,
            height: 38,
            backgroundColor: '#ff9500',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {recipientName?.[0] || 'U'}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#f1f5f9', lineHeight: 1.2 }}>
            {recipientName}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#22c55e' }}>
            online
          </Typography>
        </Box>
      </Box>

      {/* ── Messages Area ── */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: { xs: 1.5, sm: 2.5 },
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.25,
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#334155', borderRadius: '4px' },
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <CircularProgress sx={{ color: '#ff9500' }} size={28} />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Box
              sx={{
                textAlign: 'center',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                px: 3,
                py: 1.5,
                borderRadius: '12px',
              }}
            >
              <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                No messages yet. Say hi! 👋
              </Typography>
            </Box>
          </Box>
        ) : (
          groupedMessages.map(({ date, msgs }) => (
            <Box key={date}>
              {/* Date divider */}
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.5 }}>
                <Box
                  sx={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    px: 2,
                    py: 0.4,
                    borderRadius: '20px',
                  }}
                >
                  <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                    {dayLabel(date)}
                  </Typography>
                </Box>
              </Box>

              {msgs.map((msg, idx) => {
                const isMine = msg.sender_id === user?.id;
                const nextSameSender =
                  idx < msgs.length - 1 && msgs[idx + 1].sender_id === msg.sender_id;

                return (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      justifyContent: isMine ? 'flex-end' : 'flex-start',
                      mb: nextSameSender ? '2px' : '6px',
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: { xs: '78%', sm: '62%' },
                        backgroundColor: isMine
                          ? 'rgba(255, 149, 0, 0.15)'
                          : '#1e293b',
                        border: isMine
                          ? '1px solid rgba(255, 149, 0, 0.3)'
                          : '1px solid #334155',
                        borderRadius: isMine
                          ? '16px 16px 4px 16px'
                          : '16px 16px 16px 4px',
                        px: 1.5,
                        pt: 0.75,
                        pb: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.9rem',
                          color: '#e2e8f0',
                          wordBreak: 'break-word',
                          lineHeight: 1.55,
                        }}
                      >
                        {msg.content}
                      </Typography>
                      {/* Time + double-tick */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          gap: 0.25,
                          mt: 0.25,
                        }}
                      >
                        <Typography sx={{ fontSize: '0.62rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {formatTime(msg.created_at)}
                        </Typography>
                        {isMine && (
                          <DoneAllIcon sx={{ fontSize: '0.8rem', color: '#ff9500' }} />
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ))
        )}
        <div ref={bottomRef} />
      </Box>

      {/* ── Input Bar ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
          px: 1.5,
          py: 1,
          backgroundColor: '#1e293b',
          borderTop: '1px solid #334155',
          flexShrink: 0,
        }}
      >
        <TextField
          fullWidth
          size="small"
          multiline
          maxRows={4}
          placeholder="Type a message…"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              fontSize: '0.9rem',
              color: '#f1f5f9',
              '& fieldset': { borderColor: '#334155' },
              '&:hover fieldset': { borderColor: '#475569' },
              '&.Mui-focused fieldset': { borderColor: '#ff9500', borderWidth: '2px' },
            },
            '& .MuiOutlinedInput-input::placeholder': { color: '#64748b', opacity: 1 },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!newMessage.trim()}
          sx={{
            width: 42,
            height: 42,
            backgroundColor: newMessage.trim() ? '#ff9500' : '#334155',
            color: newMessage.trim() ? '#0f172a' : '#64748b',
            flexShrink: 0,
            mb: 0.25,
            borderRadius: '12px',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: newMessage.trim() ? '#f59e0b' : '#334155',
              transform: newMessage.trim() ? 'scale(1.05)' : 'none',
            },
            '&:active': { transform: 'scale(0.95)' },
            '&.Mui-disabled': { backgroundColor: '#334155', color: '#64748b' },
          }}
        >
          <SendIcon sx={{ fontSize: '1.1rem' }} />
        </IconButton>
      </Box>
    </Box>
  );
}
