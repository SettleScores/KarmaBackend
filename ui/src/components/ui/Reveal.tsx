import { styled } from '@mui/material/styles';

export const Reveal = styled('div', { shouldForwardProp: (prop) => prop !== 'delay' })<{ delay?: number }>(
  ({ delay = 0 }) => ({
    opacity: 0,
    animation: 'k-rise .62s cubic-bezier(.2,.7,.2,1) both',
    animationDelay: `${delay}s`,
  }),
);
