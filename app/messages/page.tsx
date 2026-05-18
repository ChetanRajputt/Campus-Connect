'use client';

import { useEffect, useState } from 'react';
import { Container, Box, Typography, CircularProgress, List, ListItem, ListItemButton, Avatar, Paper, Divider } from '@mui/material';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { supabase, User } from '@/utils/supabase';
import MessageBox from '@/components/MessageBox';

interface Conversation {
  otherId: string;
  otherUser: User;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageSenderId: string;
}

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [readTimestamps, setReadTimestamps] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();

    // Polling fallback to update the sidebar conversations list silently
    const pollInterval = setInterval(() => {
      fetchData(true);
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [user?.id]);

  useEffect(() => {
    // Load read timestamps from local storage
    if (user && conversations.length > 0) {
       const timestamps: Record<string, string> = {};
       conversations.forEach(conv => {
          const t = localStorage.getItem(`lastRead_${user.id}_${conv.otherId}`);
          if (t) timestamps[conv.otherId] = t;
       });
       setReadTimestamps(timestamps);
    }
  }, [user?.id, conversations.length]);

  const fetchData = async (isBackground = false) => {
    if (!user) return;
    if (!isBackground) setLoading(true);

    try {
      // Fetch all users except current user
      const { data: users } = await supabase
        .from('users')
        .select('*')
        .neq('id', user.id);

      setAllUsers(users || []);

      // Fetch conversations
      const { data: messages } = await supabase
        .from('messages')
        .select('sender_id, receiver_id, content, created_at')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messages) {
        const conversationMap = new Map<string, Conversation>();

        for (const msg of messages) {
          const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;

          if (!conversationMap.has(otherId)) {
            const otherUser = (users || []).find(u => u.id === otherId);
            if (otherUser) {
              conversationMap.set(otherId, {
                otherId,
                otherUser,
                lastMessage: msg.content.substring(0, 50),
                lastMessageTime: msg.created_at,
                lastMessageSenderId: msg.sender_id,
              });
            }
          }
        }

        setConversations(Array.from(conversationMap.values()));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const handleSelectUser = (conversation: Conversation) => {
    setSelectedUserId(conversation.otherId);
    setSelectedUser(conversation.otherUser);
    
    // Mark as read when clicked
    if (user) {
      const now = new Date().toISOString();
      localStorage.setItem(`lastRead_${user.id}_${conversation.otherId}`, now);
      setReadTimestamps(prev => ({ ...prev, [conversation.otherId]: now }));
    }
  };

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: 'calc(100vh - 64px)', py: 4 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            💬 Messages
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3 }}>
            {/* Conversations List */}
            <Paper
              sx={{
                backgroundColor: '#161616',
                border: '1px solid #2d2d2d',
                borderRadius: '12px',
                height: { xs: '400px', md: 'calc(100vh - 160px)' },
                overflowY: 'auto',
              }}
            >
              <Box sx={{ padding: '16px', fontWeight: 700, fontSize: '0.9rem', color: '#FF9800' }}>
                People ({conversations.length + allUsers.filter(u => !conversations.some(c => c.otherId === u.id)).length})
              </Box>
              <Divider sx={{ borderColor: '#2d2d2d' }} />

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={32} sx={{ color: '#FF9800' }} />
                </Box>
              ) : (
                <List sx={{ padding: 0 }}>
                  {conversations.map((conv) => {
                    const isUnread = 
                      conv.lastMessageSenderId !== user?.id && // We didn't send it
                      selectedUserId !== conv.otherId && // We are not currently chatting with them
                      (!readTimestamps[conv.otherId] || new Date(conv.lastMessageTime) > new Date(readTimestamps[conv.otherId]));

                    return (
                      <ListItemButton
                        key={conv.otherId}
                        selected={selectedUserId === conv.otherId}
                        onClick={() => handleSelectUser(conv)}
                        sx={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #2d2d2d',
                          '&:hover': { backgroundColor: 'rgba(255, 152, 0, 0.05)' },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            borderLeft: '3px solid #FF9800',
                          },
                        }}
                      >
                        <Avatar src={conv.otherUser.avatar_url || ''} sx={{ mr: 2 }}>
                          {conv.otherUser.full_name?.[0] || 'U'}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ overflow: 'hidden' }}>
                            <Typography variant="body2" sx={{ fontWeight: isUnread ? 700 : 600, color: isUnread ? '#fff' : 'inherit' }}>
                              {conv.otherUser.full_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ 
                                color: isUnread ? '#e0e7ff' : '#a0aec0', 
                                display: 'block', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                fontWeight: isUnread ? 600 : 400
                              }}
                            >
                              {conv.lastMessage}
                            </Typography>
                          </Box>
                          {isUnread && (
                            <Box 
                              sx={{ 
                                width: 10, 
                                height: 10, 
                                borderRadius: '50%', 
                                backgroundColor: '#FF9800',
                                flexShrink: 0,
                                ml: 1
                              }} 
                            />
                          )}
                        </Box>
                      </ListItemButton>
                    );
                  })}

                  {/* Users to start a new chat with */}
                  {(() => {
                    const newContacts = allUsers.filter(u => !conversations.some(c => c.otherId === u.id));
                    return newContacts.length > 0 ? (
                      <>
                        {conversations.length > 0 && <Divider sx={{ my: 1, borderColor: '#2d2d2d' }} />}
                        <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: '#a0aec0', fontWeight: 600, letterSpacing: '0.5px' }}>
                          START NEW CHAT
                        </Typography>
                        {newContacts.map((contact) => (
                          <ListItemButton
                            key={contact.id}
                            selected={selectedUserId === contact.id}
                            onClick={() => {
                              setSelectedUserId(contact.id);
                              setSelectedUser(contact);
                            }}
                            sx={{
                              padding: '12px 16px',
                              borderBottom: '1px solid #2d2d2d',
                              '&:hover': { backgroundColor: 'rgba(255, 152, 0, 0.05)' },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                borderLeft: '3px solid #FF9800',
                              },
                            }}
                          >
                            <Avatar src={contact.avatar_url || ''} sx={{ mr: 2, width: 32, height: 32 }}>
                              {contact.full_name?.[0] || 'U'}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {contact.full_name}
                              </Typography>
                            </Box>
                          </ListItemButton>
                        ))}
                      </>
                    ) : null;
                  })()}

                  {conversations.length === 0 && allUsers.length === 0 && (
                    <Box sx={{ padding: '24px', textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#a0aec0' }}>
                        No users found
                      </Typography>
                    </Box>
                  )}
                </List>
              )}
            </Paper>

            {/* Chat Window */}
            {selectedUserId && selectedUser ? (
              <MessageBox
                recipientId={selectedUserId}
                recipientName={selectedUser.full_name || 'User'}
                recipientAvatar={selectedUser.avatar_url || undefined}
              />
            ) : (
              <Paper
                sx={{
                  backgroundColor: '#161616',
                  border: '1px solid #2d2d2d',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '500px',
                }}
              >
                <Typography variant="body1" sx={{ color: '#a0aec0', textAlign: 'center' }}>
                  Select a conversation to start messaging 💬
                </Typography>
              </Paper>
            )}
          </Box>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}
