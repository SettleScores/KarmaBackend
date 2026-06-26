import { styled, alpha } from '@mui/material/styles';

export const GlassBar = styled('header')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 5,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.75, 4),
  backgroundColor: alpha(theme.palette.surface.canvas, 0.82),
  backdropFilter: 'blur(10px)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: { padding: theme.spacing(1.5, 2) },
}));
