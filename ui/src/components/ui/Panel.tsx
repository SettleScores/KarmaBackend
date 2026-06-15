import { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconBadge } from './IconBadge';

const Surface = styled('section')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.radii.md,
  boxShadow: theme.shadows[1],
  overflow: 'hidden',
}));

const Header = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1.75, 2.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.75, 2) },
}));

const Body = styled('div', { shouldForwardProp: (prop) => prop !== 'padded' })<{ padded: boolean }>(
  ({ theme, padded }) => ({
    padding: padded ? theme.spacing(2.5) : 0,
    [theme.breakpoints.down('sm')]: { padding: padded ? theme.spacing(2) : 0 },
  }),
);

export function Panel({
  title,
  subtitle,
  icon,
  actions,
  children,
  padded = true,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  padded?: boolean;
}) {
  return (
    <Surface>
      {(title || actions) && (
        <Header direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1.4} minWidth={0}>
            {icon && <IconBadge>{icon}</IconBadge>}
            <Stack minWidth={0}>
              {title && (
                <Typography variant="h5" color="text.primary">
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Stack>
          </Stack>
          {actions && (
            <Stack direction="row" alignItems="center" spacing={1} flexShrink={0}>
              {actions}
            </Stack>
          )}
        </Header>
      )}
      <Body padded={padded}>{children}</Body>
    </Surface>
  );
}
