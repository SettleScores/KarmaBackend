import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { styled } from '@mui/material/styles';

export const SpinningRefresh = styled(RefreshRoundedIcon, { shouldForwardProp: (prop) => prop !== 'spinning' })<{
  spinning: boolean;
}>(({ spinning }) => ({ transformOrigin: 'center', animation: spinning ? 'k-orbit .9s linear infinite' : 'none' }));
