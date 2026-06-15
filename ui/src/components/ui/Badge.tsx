import { ReactNode } from 'react';
import { styled, alpha } from '@mui/material/styles';

type Tone = 'brand' | 'neutral';

const filter = (prop: string) => prop !== 'tone' && prop !== 'capitalized';

const Root = styled('span', { shouldForwardProp: filter })<{ tone: Tone; capitalized: boolean }>(
  ({ theme, tone, capitalized }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    paddingInline: 9,
    paddingBlock: 3,
    borderRadius: theme.radii.pill,
    fontWeight: 700,
    fontSize: '0.78rem',
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
    textTransform: capitalized ? 'capitalize' : 'none',
    ...(tone === 'brand' && {
      color: theme.palette.brand.azureDark,
      background: theme.palette.brand.soft,
      border: `1px solid ${alpha(theme.palette.brand.azure, 0.22)}`,
    }),
    ...(tone === 'neutral' && {
      color: theme.palette.text.secondary,
      background: theme.palette.surface.alt,
      border: `1px solid ${theme.palette.divider}`,
    }),
  }),
);

export function Badge({
  children,
  tone = 'brand',
  capitalize = false,
}: {
  children: ReactNode;
  tone?: Tone;
  capitalize?: boolean;
}) {
  return (
    <Root tone={tone} capitalized={capitalize}>
      {children}
    </Root>
  );
}
