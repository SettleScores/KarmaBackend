import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { baseUrl } from '../../api/client';

import DocViewer from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

export default function FormDialog({ open, handleClose, accessToken, filename, taskDescription }: { filename: string; accessToken: string; taskDescription: string, open: boolean, handleClose: () => void }) {

    const file = { uri: `${baseUrl}api/karma/files/${filename}` }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        const email = formJson.email;
                        console.log(email);
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Review task</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {taskDescription}
                    </DialogContentText>

                    <DocViewer documents={[file]} prefetchMethod="GET" requestHeaders={{ 'Authorization': `Bearer ${accessToken}` }} />

                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="reason"
                        name="reason"
                        label="Reject Reason"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Approve</Button>
                    <Button type="submit">Reject</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}