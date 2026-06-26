import { useId } from 'react';
import { Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

type Tone = 'ink' | 'light' | 'gradient';

const Orbit = styled('g', { shouldForwardProp: (prop) => prop !== 'animated' })<{ animated?: boolean }>(
  ({ animated }) => ({
    transformBox: 'view-box',
    transformOrigin: 'center',
    animation: animated ? 'k-orbit 16s linear infinite' : 'none',
  }),
);

const WordmarkText = styled('span', { shouldForwardProp: (prop) => prop !== 'tone' && prop !== 'size' })<{
  tone: Tone;
  size: string | number;
}>(({ theme, tone, size }) => ({
  fontFamily: theme.typography.h1.fontFamily,
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: '-0.01em',
  fontSize: size,
  ...(tone === 'light' && { color: theme.palette.onBrand.text }),
  ...(tone === 'ink' && { color: theme.palette.text.primary }),
  ...(tone === 'gradient' && {
    background: theme.gradient.text,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  }),
}));

const Eyebrow = styled(Typography, { shouldForwardProp: (prop) => prop !== 'tone' })<{ tone: Tone }>(
  ({ theme, tone }) => ({ color: tone === 'light' ? theme.palette.onBrand.textSoft : theme.palette.text.disabled }),
);

export function KarmaMark({
  size = 40,
  variant = 'seal',
  animated = false,
}: {
  size?: number;
  variant?: 'seal' | 'glyph';
  animated?: boolean;
}) {
  const { palette } = useTheme();
  const gid = useId().replace(/:/g, '');

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden display="block">
      <defs>
        <linearGradient id={gid} x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={palette.brand.gradTop} />
          <stop offset="0.5" stopColor={palette.brand.gradMid} />
          <stop offset="1" stopColor={palette.brand.gradBot} />
        </linearGradient>
      </defs>

      {variant === 'seal' && <rect x="2" y="2" width="60" height="60" rx="17" fill={`url(#${gid})`} />}

      <g fill="none" stroke={palette.onBrand.text} strokeLinecap="round">
        <circle cx="32" cy="32" r={variant === 'seal' ? 15 : 16} strokeOpacity={variant === 'seal' ? 0.5 : 0.42} strokeWidth={variant === 'seal' ? 2.4 : 2.6} />
        <circle cx="32" cy="32" r={variant === 'seal' ? 8 : 8.5} strokeOpacity={variant === 'seal' ? 0.92 : 0.95} strokeWidth={variant === 'seal' ? 2.8 : 3} />
      </g>
      <Orbit animated={animated}>
        <circle cx="32" cy={variant === 'seal' ? 11.5 : 10} r={variant === 'seal' ? 4.6 : 5} fill={palette.onBrand.text} />
        {variant === 'glyph' && <circle cx="32" cy="10" r="9" fill={palette.onBrand.text} opacity={animated ? 0.28 : 0.2} />}
      </Orbit>
    </svg>
  );
}

export function Wordmark({ tone = 'ink', size = '1.5rem' }: { tone?: Tone; size?: string | number }) {
  return (
    <WordmarkText tone={tone} size={size}>
      Karma
    </WordmarkText>
  );
}

export function BrandLockup({
  tone = 'ink',
  markSize = 38,
  markVariant,
  wordSize = '1.45rem',
  tagline = false,
  animated = false,
}: {
  tone?: Tone;
  markSize?: number;
  markVariant?: 'seal' | 'glyph';
  wordSize?: string | number;
  tagline?: boolean;
  animated?: boolean;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.4}>
      <KarmaMark size={markSize} variant={markVariant ?? (tone === 'light' ? 'glyph' : 'seal')} animated={animated} />
      <Stack spacing={0.1}>
        <Wordmark tone={tone} size={wordSize} />
        {tagline && (
          <Eyebrow tone={tone} variant="eyebrow">
            Admin
          </Eyebrow>
        )}
      </Stack>
    </Stack>
  );
}
