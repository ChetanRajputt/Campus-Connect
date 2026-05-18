-- ============================================================================
-- MESSAGES TABLE (for Direct Messaging/Chat Feature)
-- ============================================================================

-- Create messages table
CREATE TABLE public.messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT sender_not_receiver CHECK (sender_id != receiver_id)
);

-- Create index for faster queries
CREATE INDEX messages_sender_receiver_idx ON public.messages(sender_id, receiver_id);
CREATE INDEX messages_receiver_sender_idx ON public.messages(receiver_id, sender_id);
CREATE INDEX messages_created_at_idx ON public.messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- MESSAGES TABLE RLS POLICIES
-- ============================================================================

-- Policy: Everyone can view messages they sent or received
CREATE POLICY "Users can view their messages"
ON public.messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Policy: Users can insert their own messages
CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Policy: Users can delete their sent messages
CREATE POLICY "Users can delete their sent messages"
ON public.messages FOR DELETE
USING (auth.uid() = sender_id);
