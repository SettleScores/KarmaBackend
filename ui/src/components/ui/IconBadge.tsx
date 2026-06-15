import { ReactNode } from 'react';
import { styled, alpha } from '@mui/material/styles';

type Tone = 'brand' | 'accent' | 'gradient';

const filter = (prop: string) => prop !== 'tone' && prop !== 'accent' && prop !== 'dim';

const Tile = styled('span', { shouldForwardProp: filter })<{ tone: Tone; accent?: string; dim: number }>(
  ({ theme, tone, accent, dim }) => ({
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    width: dim,
    height: dim,
    borderRadius: theme.radii.sm,
    '& svg': { fontSize: Math.round(dim * 0.52) },
    ...(tone === 'brand' && { backgroundColor: theme.palette.brand.soft, color: theme.palette.brand.azureDark }),
    ...(tone === 'accent' && {
      backgroundColor: alpha(accent ?? theme.palette.brand.azure, 0.12),
      color: accent ?? theme.palette.brand.azure,
    }),
    ...(tone === 'gradient' && {
      background: theme.gradient.brand,
      color: theme.palette.onBrand.text,
      boxShadow: theme.glow.brand,
    }),
  }),
);

export function IconBadge({
  children,
  tone = 'brand',
  accent,
  size = 36,
}: {
  children: ReactNode;
  tone?: Tone;
  accent?: string;
  size?: number;
}) {
  return (
    <Tile tone={tone} accent={accent} dim={size}>
      {children}
    </Tile>
  );
}
