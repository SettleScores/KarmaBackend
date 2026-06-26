import { KeyboardEvent, ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { IconBadge } from './IconBadge';

const filter = (prop: string) => prop !== 'accent' && prop !== 'interactive' && prop !== 'active';

const Card = styled('div', { shouldForwardProp: filter })<{ accent: string; interactive: boolean; active: boolean }>(
  ({ theme, accent, interactive, active }) => ({
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    padding: theme.spacing(2.5),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${active ? accent : theme.palette.divider}`,
    borderRadius: theme.radii.md,
    boxShadow: active ? `0 0 0 1.5px ${accent}` : theme.shadows[1],
    cursor: interactive ? 'pointer' : 'default',
    outline: 'none',
    transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
    ...(interactive && {
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: active ? `0 0 0 1.5px ${accent}, ${theme.shadows[2]}` : theme.shadows[2],
        borderColor: active ? accent : alpha(accent, 0.6),
      },
      '&:focus-visible': { boxShadow: `0 0 0 3px ${alpha(accent, 0.34)}` },
    }),
  }),
);

const Glow = styled('span', { shouldForwardProp: (prop) => prop !== 'accent' })<{ accent: string }>(({ accent }) => ({
  position: 'absolute',
  top: -42,
  right: -42,
  width: 130,
  height: 130,
  borderRadius: '50%',
  background: `radial-gradient(circle, ${alpha(accent, 0.18)}, transparent 70%)`,
  pointerEvents: 'none',
}));

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
  gradientIcon = false,
  loading = false,
  onClick,
  active = false,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: ReactNode;
  accent: string;
  gradientIcon?: boolean;
  loading?: boolean;
  onClick?: () => void;
  active?: boolean;
}) {
  const interactive = !!onClick;
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <Card
      accent={accent}
      interactive={interactive}
      active={active}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? active : undefined}
      onKeyDown={interactive ? onKeyDown : undefined}
    >
      <Glow accent={accent} />
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Stack spacing={0.5} minWidth={0}>
          <Typography variant="overline" color="text.disabled">
            {label}
          </Typography>
          <Typography variant="stat" color="text.primary">
            {loading ? '—' : value}
          </Typography>
          {hint && (
            <Typography variant="caption" color="text.secondary">
              {hint}
            </Typography>
          )}
        </Stack>
        <IconBadge tone={gradientIcon ? 'gradient' : 'accent'} accent={accent} size={48}>
          {icon}
        </IconBadge>
      </Stack>
    </Card>
  );
}
