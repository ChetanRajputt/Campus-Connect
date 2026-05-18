'use client';

// app/groups/[id]/page.tsx
// यह page group chat room है
// This page is the live group chat room using Supabase Realtime

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Box, Typography, TextField, IconButton, CircularProgress, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase, Group, GroupMessage } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';

export default function GroupChat() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (user && id) {
      checkMembershipAndLoad();
    }
  }, [user, id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkMembershipAndLoad = async () => {
    if (!user) return;
    
    try {
      // 1. Check if user is actually a member
      const { data: memberData, error: memberError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', id)
        .eq('user_id', user.id)
        .single();

      if (memberError || !memberData) {
        // Not a member, redirect back to groups list
        router.push('/groups');
        return;
      }

      // 2. Fetch Group Details
      const { data: groupData } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single();
      
      setGroup(groupData);

      // 3. Fetch Initial Messages
      const { data: messagesData } = await supabase
        .from('group_messages')
        .select('*, sender:users(*)')
        .eq('group_id', id)
        .order('created_at', { ascending: true });
        
      setMessages(messagesData || []);
      setLoading(false);

      // 4. Subscribe to Realtime Messages
      const channel = supabase
        .channel(`group_${id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'group_messages',
            filter: `group_id=eq.${id}`
          },
          async (payload) => {
            // Fetch the sender details for the new message
            const { data: senderData } = await supabase
              .from('users')
              .select('*')
              .eq('id', payload.new.sender_id)
              .single();
              
            const newMessageWithSender = {
              ...payload.new,
              sender: senderData
            } as GroupMessage;

            setMessages((prev) => [...prev, newMessageWithSender]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };

    } catch (error) {
      console.error('Error loading chat:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    const messageText = newMessage;
    setNewMessage(''); // optimistic clear

    try {
      await supabase
        .from('group_messages')
        .insert({
          group_id: id,
          sender_id: user.id,
          content: messageText
        });
        
      // We don't need to manually update state here because the Realtime subscription 
      // will catch the INSERT and update the state automatically for us!
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress sx={{ color: '#FF9800' }} />
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a' }}>
        {/* Chat Header */}
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#1e293b', 
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <IconButton onClick={() => router.push('/groups')} sx={{ color: '#a0aec0' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>
              {group?.name || 'Group Chat'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#a0aec0' }}>
              {group?.description}
            </Typography>
          </Box>
        </Box>

        {/* Chat Messages Area */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography sx={{ color: '#a0aec0' }}>No messages yet. Be the first to say hi! 👋</Typography>
            </Box>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <Box 
                  key={msg.id} 
                  sx={{ 
                    display: 'flex', 
                    gap: 1.5,
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '80%'
                  }}
                >
                  {!isMe && (
                    <Avatar 
                      src={msg.sender?.avatar_url || ''} 
                      sx={{ width: 32, height: 32, backgroundColor: '#FF9800', fontSize: '0.875rem' }}
                    >
                      {msg.sender?.full_name?.[0] || 'U'}
                    </Avatar>
                  )}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    {!isMe && (
                      <Typography variant="caption" sx={{ color: '#a0aec0', mb: 0.5, ml: 1 }}>
                        {msg.sender?.full_name}
                      </Typography>
                    )}
                    <Box sx={{
                      backgroundColor: isMe ? '#FF9800' : '#1e293b',
                      color: isMe ? '#000' : '#fff',
                      p: 1.5,
                      borderRadius: 2,
                      borderTopRightRadius: isMe ? 0 : 2,
                      borderTopLeftRadius: !isMe ? 0 : 2,
                    }}>
                      <Typography variant="body2">{msg.content}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, fontSize: '0.65rem' }}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2, backgroundColor: '#1e293b', borderTop: '1px solid #334155' }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
            <TextField
              fullWidth
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '24px',
                  '& fieldset': { borderColor: '#334155' },
                  '&:hover fieldset': { borderColor: '#475569' },
                  '&.Mui-focused fieldset': { borderColor: '#FF9800' },
                }
              }}
            />
            <IconButton 
              type="submit" 
              disabled={!newMessage.trim()}
              sx={{ 
                backgroundColor: '#FF9800', 
                color: '#000',
                '&:hover': { backgroundColor: '#F57C00' },
                '&:disabled': { backgroundColor: '#334155', color: '#64748b' }
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </form>
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
