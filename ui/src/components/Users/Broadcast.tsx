import { useContext, useState } from 'react';
import { Alert, Button, Collapse, Stack, TextField, Typography } from '@mui/material';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

import { AuthContext } from '../../state/authContext';
import { sendPushForAll } from '../../api/client';
import { Panel } from '../ui';

type Feedback = { kind: 'success' | 'error'; text: string } | null;

export function Broadcast() {
  const authToken = useContext(AuthContext) as string;
  const [title, setTitle] = useState('Karma');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const canSend = body.trim().length > 0 && !sending;

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    setFeedback(null);
    try {
      const res = await sendPushForAll(authToken, title.trim() || 'Karma', body.trim());
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setFeedback({ kind: 'success', text: 'Broadcast delivered to every Karma member.' });
      setBody('');
    } catch (err) {
      setFeedback({ kind: 'error', text: err instanceof Error ? err.message : 'Could not send broadcast.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Panel title="Broadcast" subtitle="Push a notification to every member" icon={<CampaignRoundedIcon />}>
      <Stack spacing={2}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth inputProps={{ maxLength: 64 }} />
        <TextField
          label="Message"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write something that improves their day…"
          fullWidth
          multiline
          minRows={3}
        />

        <Collapse in={!!feedback}>
          {feedback && (
            <Alert severity={feedback.kind} variant="outlined" onClose={() => setFeedback(null)}>
              {feedback.text}
            </Alert>
          )}
        </Collapse>

        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={1.5}>
          <Typography variant="caption" color="text.disabled">
            Reaches all registered devices instantly.
          </Typography>
          <Button variant="contained" startIcon={<SendRoundedIcon />} onClick={handleSend} disabled={!canSend}>
            {sending ? 'Sending…' : 'Send broadcast'}
          </Button>
        </Stack>
      </Stack>
    </Panel>
  );
}
