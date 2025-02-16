import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { baseUrl, getVideoUrl } from '../../api/client';

import DocViewer from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import { Box } from '@mui/material';
import { Task, TaskStatus } from '../../api/types';

function isVideo(fileName?: string) {
    if (!fileName) return false;
    return fileName.includes('mp4');
}

export default function FormDialog({ open, handleClose, handleValidate, accessToken, task }: { task: TaskStatus & Task | null, accessToken: string; open: boolean; handleClose: () => void; handleValidate: (approve: boolean, rejectReason?: string) => void }) {
    const [videoUrl, setVideoUrl] = React.useState('');

    React.useEffect(() => {
        if (isVideo(task?.fileName)) {
            getVideoUrl(accessToken, task!.fileName).then(({ url }) => setVideoUrl(url));
        } else {
            setVideoUrl('');
        }
    }, [task, accessToken]);

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Review task</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {task?.description}
                    </DialogContentText>
                    <Box maxHeight={400} overflow='auto'>
                        <DocViewer documents={[{ uri: videoUrl || `${baseUrl}api/karma/files/${task?.fileName}` }]} config={{ header: { disableFileName: true } }} prefetchMethod="GET" requestHeaders={{ 'Authorization': `Bearer ${accessToken}` }} />
                    </Box>

                </DialogContent>
                <DialogAct handleClose={handleClose} handleValidate={handleValidate} />
            </Dialog>
        </React.Fragment>
    );
}

function DialogAct({ handleClose, handleValidate }: { handleClose: () => void; handleValidate: (approve: boolean, rejectReason?: string) => void; }) {
    const [rejectReason, setRejectReason] = React.useState('');

    return <>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="reason"
                name="reason"
                label="Reject Reason"
                type="text"
                fullWidth
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                variant="standard"
            />
        </DialogContent>

        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => {
                handleValidate(true);
            }}>Approve</Button>
            <Button onClick={() => {
                handleValidate(false, rejectReason);
            }} disabled={rejectReason.length < 5}>Reject</Button>
        </DialogActions>
    </>
}