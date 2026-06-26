import { styled } from '@mui/material/styles';

function initials(name?: string) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  return parts.length ? (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase() : '–';
}

const Root = styled('span', { shouldForwardProp: (prop) => prop !== 'dim' })<{ dim: number }>(({ theme, dim }) => ({
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
  width: dim,
  height: dim,
  borderRadius: '50%',
  color: theme.palette.onBrand.text,
  fontFamily: theme.typography.h1.fontFamily,
  fontWeight: 600,
  fontSize: Math.round(dim * 0.34),
  background: theme.gradient.brand,
  boxShadow: theme.shadows[2],
}));

export function InitialsAvatar({ name, size = 34 }: { name?: string; size?: number }) {
  return <Root dim={size}>{initials(name)}</Root>;
}
