'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
  CircularProgress,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
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
}

export default function MessageBox({
  recipientId,
  recipientName,
  recipientAvatar,
}: MessageBoxProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
    
    if (!user?.id || !recipientId) return;

    // Use a unique channel ID to avoid React StrictMode mount/unmount conflicts
    const channelId = `chat_${user.id}_${recipientId}_${Date.now()}`;
    const channel = supabase.channel(channelId);
    
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      },
      (payload) => {
        const newMsg = payload.new as Message;
        // Verify it belongs to this conversation
        if (
          (newMsg.sender_id === user.id && newMsg.receiver_id === recipientId) ||
          (newMsg.sender_id === recipientId && newMsg.receiver_id === user.id)
        ) {
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === newMsg.id)) return prev;
            return [newMsg, ...prev];
          });
        }
      }
    ).subscribe((status) => {
      console.log('Realtime socket status:', status);
    });

    // FALLBACK: Since some browsers (like Brave) block WebSockets, 
    // we add a polling interval every 3 seconds to guarantee messages arrive.
    const pollInterval = setInterval(() => {
      loadMessages(true);
    }, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [user?.id, recipientId]);

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
        .order('created_at', { ascending: false })
        .limit(50);

      // If background polling, only update if there are new messages
      // This prevents React from doing unnecessary renders
      setMessages((prev) => {
        if (isBackground && data && prev.length > 0 && data.length > 0 && data[0].id === prev[0].id) {
          return prev; // No new messages
        }
        return data || [];
      });
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    const messageText = newMessage;
    setNewMessage(''); // Clear input immediately

    // Optimistic UI update: instantly show the message
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      sender_id: user.id,
      receiver_id: recipientId,
      content: messageText,
      created_at: new Date().toISOString(),
      sender: user,
    };
    
    setMessages((prev) => [optimisticMsg, ...prev]);

    try {
      const { data, error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: recipientId,
        content: messageText,
      }).select().single();

      if (error) throw error;
      
      // Update the temporary message with the real database ID
      if (data) {
        setMessages((prev) => 
          prev.map((msg) => msg.id === tempId ? { ...data, sender: user } : msg)
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message if it failed
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: { xs: 'calc(100vh - 220px)', md: 'calc(100vh - 160px)' },
        backgroundColor: '#161616',
        border: '1px solid #2d2d2d',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: '16px',
          backgroundColor: '#1a1a1a',
          borderBottom: '1px solid #2d2d2d',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar src={recipientAvatar || ''} sx={{ fontWeight: 700 }}>
          {recipientName?.[0] || 'U'}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {recipientName}
          </Typography>
          <Typography variant="caption">Online</Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: 1,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: '#FF9800' }} size={32} />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#a0aec0' }}>
              No messages yet. Start the conversation! 💬
            </Typography>
          </Box>
        ) : (
          messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.sender_id === user?.id ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <Paper
                sx={{
                  padding: '10px 14px',
                  maxWidth: '70%',
                  backgroundColor:
                    message.sender_id === user?.id
                      ? '#FF9800'
                      : '#2d2d2d',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
              >
                <Typography variant="body2" sx={{ wordBreak: 'break-word', color: message.sender_id === user?.id ? '#000' : '#fff' }}>
                  {message.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    color: message.sender_id === user?.id ? 'rgba(0,0,0,0.6)' : '#a0aec0',
                  }}
                >
                  {new Date(message.created_at).toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          ))
        )}
      </Box>

      {/* Input */}
      <Box
        sx={{
          padding: '12px',
          borderTop: '1px solid #2d2d2d',
          display: 'flex',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        />
        <IconButton
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          sx={{
            color: '#FF9800',
            '&:hover': { backgroundColor: 'rgba(255, 152, 0, 0.1)' },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
