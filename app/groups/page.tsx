'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, Box, Typography, Button, Card, CardContent, 
  CircularProgress, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Grid
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase, Group, GroupMember } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';

export default function GroupsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [userGroups, setUserGroups] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  
  // Create Group Modal State
  const [openModal, setOpenModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchGroups();
      fetchUserGroups();
    }
  }, [user]);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserGroups = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

      if (error) throw error;
      const joinedSet = new Set(data.map((m: any) => m.group_id));
      setUserGroups(joinedSet);
    } catch (error) {
      console.error('Error fetching user groups:', error);
    }
  };

  const handleCreateGroup = async () => {
    if (!user || !newGroupName.trim()) return;
    setCreating(true);

    try {
      // 1. Create the group
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: newGroupName,
          description: newGroupDesc,
          created_by: user.id
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // 2. Add the creator as a member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupData.id,
          user_id: user.id
        });

      if (memberError) throw memberError;

      // Reset and refresh
      setOpenModal(false);
      setNewGroupName('');
      setNewGroupDesc('');
      fetchGroups();
      fetchUserGroups();
      
      // Redirect to the new group
      router.push(`/groups/${groupData.id}`);
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;
    
    // If already joined, just go to the chat
    if (userGroups.has(groupId)) {
      router.push(`/groups/${groupId}`);
      return;
    }

    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id
        });

      if (error) throw error;
      
      router.push(`/groups/${groupId}`);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: 1, borderBottom: '1px solid #2d2d2d', pb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <GroupsIcon sx={{ color: '#FF9800', fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                 Campus Groups
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setOpenModal(true)}
              sx={{ backgroundColor: '#FF9800', color: '#000', fontWeight: 700, '&:hover': { backgroundColor: '#F57C00' } }}
            >
              Create Group
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#FF9800' }} />
            </Box>
          ) : groups.length > 0 ? (
            <Grid container spacing={3}>
              {groups.map((group) => {
                const isMember = userGroups.has(group.id);
                return (
                  <Grid item xs={12} sm={6} key={group.id}>
                    <Card sx={{ backgroundColor: '#161616', border: '1px solid #2d2d2d', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                          {group.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#a0aec0', mb: 3, minHeight: '40px' }}>
                          {group.description || 'No description provided.'}
                        </Typography>
                        <Button
                          fullWidth
                          variant={isMember ? "outlined" : "contained"}
                          endIcon={isMember ? <ArrowForwardIcon /> : null}
                          onClick={() => handleJoinGroup(group.id)}
                          sx={{ 
                            color: isMember ? '#FF9800' : '#000', 
                            backgroundColor: isMember ? 'transparent' : '#FF9800',
                            borderColor: '#FF9800',
                            fontWeight: 700,
                            '&:hover': { 
                              backgroundColor: isMember ? 'rgba(255, 152, 0, 0.1)' : '#F57C00',
                              borderColor: '#F57C00'
                            } 
                          }}
                        >
                          {isMember ? 'Enter Chat' : 'Join Group'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, backgroundColor: '#161616', borderRadius: 2, border: '1px solid #2d2d2d' }}>
              <GroupsIcon sx={{ fontSize: 60, color: '#404040', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#a0aec0', mb: 1 }}>
                No Groups Yet
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Be the first to create a campus group!
              </Typography>
            </Box>
          )}

          {/* Create Group Modal */}
          <Dialog open={openModal} onClose={() => setOpenModal(false)} PaperProps={{ sx: { backgroundColor: '#1e293b', color: '#fff', minWidth: '400px' } }}>
            <DialogTitle sx={{ borderBottom: '1px solid #334155' }}>Create a New Group</DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                label="Group Name"
                fullWidth
                variant="outlined"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff' }, '& .MuiInputLabel-root': { color: '#a0aec0' } }}
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { color: '#fff' }, '& .MuiInputLabel-root': { color: '#a0aec0' } }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid #334155' }}>
              <Button onClick={() => setOpenModal(false)} sx={{ color: '#a0aec0' }}>Cancel</Button>
              <Button 
                onClick={handleCreateGroup} 
                variant="contained"
                disabled={!newGroupName.trim() || creating}
                sx={{ backgroundColor: '#FF9800', color: '#000', '&:hover': { backgroundColor: '#F57C00' }, '&:disabled': { backgroundColor: '#334155' } }}
              >
                {creating ? 'Creating...' : 'Create Group'}
              </Button>
            </DialogActions>
          </Dialog>

        </Container>
      </Box>
    </ProtectedRoute>
  );
}
