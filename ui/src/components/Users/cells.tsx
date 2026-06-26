import { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { User } from '../../api/types';
import { Badge, InitialsAvatar } from '../ui';

const dateFmt = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
export function formatDate(value?: string) {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : dateFmt.format(d);
}

export function Mono({ children, dim = false }: { children: ReactNode; dim?: boolean }) {
  return (
    <Typography variant="mono" component="span" color={dim ? 'text.disabled' : 'text.secondary'}>
      {children}
    </Typography>
  );
}

const EllipsisName = styled(Typography)({ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });

export function MemberCell({ user }: { user: User }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.25} minWidth={0}>
      <InitialsAvatar name={user.fullName} />
      <EllipsisName variant="subtitle2" color="text.primary">
        {user.fullName || '—'}
      </EllipsisName>
    </Stack>
  );
}

export function SoftTag({ value }: { value?: string }) {
  return value ? (
    <Badge tone="neutral" capitalize>
      {value}
    </Badge>
  ) : (
    <Mono dim>—</Mono>
  );
}

export function RankBadge({ value }: { value?: number }) {
  return value == null ? <Mono dim>—</Mono> : <Badge>#{value}</Badge>;
}
