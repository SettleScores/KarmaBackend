import { styled } from '@mui/material/styles';

export const Ring = styled('span')(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  border: `1px solid ${theme.palette.onBrand.line}`,
  pointerEvents: 'none',
}));
