import { memo, useEffect, useMemo, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import DocViewer from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';

import { baseUrl, getVideoUrl } from '../../api/client';
import { Task, TaskStatus } from '../../api/types';
import { IconBadge, StatusChip } from '../ui';

function isVideo(fileName?: string) {
  return !!fileName && fileName.includes('mp4');
}

const Title = styled(DialogTitle)({ paddingRight: 56 });

const CloseButton = styled(IconButton)({ position: 'absolute', top: 14, right: 14 });

const ChipSlot = styled('span')(({ theme }) => ({ display: 'inline-flex', [theme.breakpoints.down('sm')]: { display: 'none' } }));

const Deed = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.25, 1.75),
  borderRadius: theme.radii.sm,
  backgroundColor: theme.palette.surface.alt,
  borderLeft: `3px solid ${theme.palette.primary.main}`,
}));

const Viewer = styled('div')(({ theme }) => ({
  maxHeight: 420,
  overflow: 'auto',
  borderRadius: theme.radii.sm,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.surface.alt,
}));

const Actions = styled(DialogActions)(({ theme }) => ({ padding: theme.spacing(1, 3, 2.5) }));

const Spacer = styled('div')({ flexGrow: 1 });

const DOC_CONFIG = { header: { disableFileName: true } };

const DocPreview = memo(function DocPreview({ uri, accessToken }: { uri: string; accessToken: string }) {
  const documents = useMemo(() => [{ uri }], [uri]);
  const requestHeaders = useMemo(() => ({ Authorization: `Bearer ${accessToken}` }), [accessToken]);
  return <DocViewer documents={documents} config={DOC_CONFIG} prefetchMethod="GET" requestHeaders={requestHeaders} />;
});

export default function ApproveDialog({
  open,
  handleClose,
  handleValidate,
  accessToken,
  task,
}: {
  task: (TaskStatus & Task) | null;
  accessToken: string;
  open: boolean;
  handleClose: () => void;
  handleValidate: (approve: boolean, rejectReason?: string) => void;
}) {
  const [videoUrl, setVideoUrl] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (isVideo(task?.fileName)) {
      getVideoUrl(accessToken, task!.fileName).then(({ url }) => setVideoUrl(url));
    } else {
      setVideoUrl('');
    }
  }, [task, accessToken]);

  useEffect(() => {
    if (open) setRejectReason('');
  }, [open, task?.id]);

  const canReject = rejectReason.trim().length >= 5;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Title>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={1.4}>
            <IconBadge size={38}>
              <RateReviewRoundedIcon />
            </IconBadge>
            <Stack>
              <Typography variant="h5" color="text.primary">
                Review deed
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Approve or reject this submission
              </Typography>
            </Stack>
          </Stack>
          <ChipSlot>
            <StatusChip status="Pending" size="sm" />
          </ChipSlot>
        </Stack>
        <CloseButton onClick={handleClose} aria-label="Close">
          <CloseRoundedIcon />
        </CloseButton>
      </Title>

      <DialogContent>
        <Stack spacing={2.25} mt={0.5}>
          {task?.description && (
            <Deed>
              <Stack spacing={0.25}>
                <Typography variant="overline" color="text.disabled">
                  Deed
                </Typography>
                <Typography variant="subtitle2" color="text.primary">
                  {task.description}
                </Typography>
              </Stack>
            </Deed>
          )}

          <Viewer>
            <DocPreview uri={videoUrl || `${baseUrl}api/karma/files/${task?.fileName}`} accessToken={accessToken} />
          </Viewer>

          <TextField
            label="Reject reason"
            placeholder="Explain why this submission is being rejected (min. 5 characters)…"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
        </Stack>
      </DialogContent>

      <Actions>
        <Button color="inherit" onClick={handleClose}>
          Cancel
        </Button>
        <Spacer />
        <Tooltip title={canReject ? '' : 'You cannot reject without a reason (min. 5 characters)'} arrow>
          <span>
            <Button variant="outlined" color="error" startIcon={<CancelRoundedIcon />} disabled={!canReject} onClick={() => handleValidate(false, rejectReason.trim())}>
              Reject
            </Button>
          </span>
        </Tooltip>
        <Button variant="contained" color="success" startIcon={<CheckCircleRoundedIcon />} onClick={() => handleValidate(true)}>
          Approve
        </Button>
      </Actions>
    </Dialog>
  );
}
