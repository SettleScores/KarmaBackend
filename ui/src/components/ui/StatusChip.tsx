import { styled, alpha, useTheme } from '@mui/material/styles';
import type { TaskStatus } from '../../api/types';

type RawStatus = TaskStatus['status'];

const filter = (prop: string) => prop !== 'status' && prop !== 'small';

const Pill = styled('span', { shouldForwardProp: filter })<{ status: RawStatus; small: boolean }>(
  ({ theme, status, small }) => {
    const ramp = theme.palette.status[status];
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: small ? 5 : 6,
      paddingInline: small ? 7 : 9,
      paddingBlock: small ? 3 : 5,
      borderRadius: theme.radii.pill,
      backgroundColor: ramp.bg,
      color: ramp.fg,
      border: `1px solid ${alpha(ramp.fg, 0.12)}`,
      fontFamily: theme.typography.fontFamily,
      fontWeight: 700,
      fontSize: small ? '0.72rem' : '0.78rem',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
    };
  },
);

const Dot = styled('span', { shouldForwardProp: filter })<{ status: RawStatus; small: boolean }>(
  ({ theme, status, small }) => {
    const ramp = theme.palette.status[status];
    return {
      width: small ? 6 : 7,
      height: small ? 6 : 7,
      borderRadius: '50%',
      backgroundColor: ramp.dot,
      boxShadow: `0 0 0 3px ${alpha(ramp.dot, 0.13)}`,
      flexShrink: 0,
    };
  },
);

export function StatusChip({ status, size = 'md' }: { status?: RawStatus | null; size?: 'sm' | 'md' }) {
  const resolved: RawStatus = status ?? 'Unknown';
  const small = size === 'sm';
  const { label } = useTheme().palette.status[resolved];

  return (
    <Pill status={resolved} small={small}>
      <Dot status={resolved} small={small} />
      {label}
    </Pill>
  );
}
