import { ReactNode, useContext, useState } from 'react';
import { ButtonBase, Drawer, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';

import { BrandLockup, GlassBar, KarmaMark, Ring } from '../ui';
import { SetAuthContext } from '../../state/authContext';

const SIDEBAR_WIDTH = 268;

const NAV = [{ key: 'overview', label: 'Overview', to: '/dashboard', icon: <GridViewRoundedIcon /> }];

const Shell = styled('div')({ display: 'flex', minHeight: '100vh' });

const Column = styled('div')({ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' });

const DesktopAside = styled('aside')(({ theme }) => ({
  width: SIDEBAR_WIDTH,
  flexShrink: 0,
  position: 'sticky',
  top: 0,
  alignSelf: 'flex-start',
  height: '100vh',
  display: 'none',
  [theme.breakpoints.up('lg')]: { display: 'block' },
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, border: 0 },
  [theme.breakpoints.up('lg')]: { display: 'none' },
}));

const SidebarSurface = styled(Stack)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  overflow: 'hidden',
  padding: theme.spacing(2.5),
  background: theme.gradient.sidebar,
  color: theme.palette.onBrand.text,
}));

const RingLarge = styled(Ring)({ right: -120, bottom: -90, width: 320, height: 320 });
const RingSmall = styled(Ring)({ left: -70, top: 120, width: 180, height: 180 });

const SidebarLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.onBrand.textSoft,
  paddingInline: theme.spacing(1),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
}));

const NavButton = styled(ButtonBase, { shouldForwardProp: (prop) => prop !== 'active' })<{ active: boolean }>(
  ({ theme, active }) => ({
    justifyContent: 'flex-start',
    gap: theme.spacing(1.4),
    width: '100%',
    padding: theme.spacing(1.15, 1.6),
    borderRadius: theme.radii.sm,
    fontFamily: theme.typography.fontFamily,
    fontWeight: 700,
    fontSize: '0.95rem',
    color: active ? theme.palette.onBrand.text : theme.palette.onBrand.textSoft,
    backgroundColor: active ? theme.palette.onBrand.fillStrong : 'transparent',
    boxShadow: active ? `inset 0 0 0 1px ${theme.palette.onBrand.line}` : 'none',
    transition: 'background-color .18s ease, color .18s ease',
    '&:hover': {
      backgroundColor: active ? theme.palette.onBrand.fillStrong : theme.palette.onBrand.fill,
      color: theme.palette.onBrand.text,
    },
    '& svg': { fontSize: 21 },
  }),
);

const AdminCard = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1.5),
  borderRadius: theme.radii.sm,
  backgroundColor: theme.palette.onBrand.fill,
  border: `1px solid ${theme.palette.onBrand.line}`,
}));

const AdminAvatar = styled('span')(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  width: 38,
  height: 38,
  borderRadius: '50%',
  backgroundColor: theme.palette.onBrand.fillStrong,
  color: theme.palette.onBrand.text,
  '& svg': { fontSize: 20 },
}));

const OnlineDot = styled('span')(({ theme }) => ({
  width: 7,
  height: 7,
  borderRadius: '50%',
  backgroundColor: theme.palette.onBrand.online,
  boxShadow: theme.glow.online,
}));

const SignOutButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.onBrand.text,
  '&:hover': { backgroundColor: theme.palette.onBrand.fillStrong, color: theme.palette.onBrand.text },
}));

const MutedOnBrand = styled(Typography)(({ theme }) => ({ color: theme.palette.onBrand.textSoft }));

const Main = styled('main')(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3.5, 4),
  [theme.breakpoints.down('md')]: { padding: theme.spacing(2.5, 2) },
}));

const MenuButton = styled(IconButton)(({ theme }) => ({ [theme.breakpoints.up('lg')]: { display: 'none' } }));
const MobileMark = styled('span')(({ theme }) => ({ display: 'flex', [theme.breakpoints.up('lg')]: { display: 'none' } }));
const Subtitle = styled(Typography)(({ theme }) => ({ [theme.breakpoints.down('sm')]: { display: 'none' } }));

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useContext(SetAuthContext);

  const go = (to: string) => {
    navigate(to);
    onNavigate?.();
  };

  const signOut = () => {
    setAuth(null);
    navigate('/sign');
  };

  return (
    <SidebarSurface>
      <RingLarge />
      <RingSmall />

      <BrandLockup tone="light" markVariant="glyph" markSize={40} wordSize="1.5rem" tagline animated />

      <SidebarLabel variant="eyebrow">Workspace</SidebarLabel>

      <Stack spacing={0.6} position="relative">
        {NAV.map((item) => (
          <NavButton key={item.key} active={location.pathname === item.to} onClick={() => go(item.to)}>
            {item.icon}
            {item.label}
          </NavButton>
        ))}
      </Stack>

      <Stack flex={1} />

      <AdminCard>
        <Stack direction="row" alignItems="center" spacing={1.3}>
          <AdminAvatar>
            <ShieldRoundedIcon />
          </AdminAvatar>
          <Stack minWidth={0} flex={1}>
            <Typography variant="subtitle2">Administrator</Typography>
            <Stack direction="row" alignItems="center" spacing={0.6}>
              <OnlineDot />
              <MutedOnBrand variant="caption">Signed in</MutedOnBrand>
            </Stack>
          </Stack>
          <Tooltip title="Sign out" arrow>
            <SignOutButton onClick={signOut} size="small">
              <LogoutRoundedIcon fontSize="small" />
            </SignOutButton>
          </Tooltip>
        </Stack>
      </AdminCard>
    </SidebarSurface>
  );
}

export function DashboardLayout({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Shell>
      <DesktopAside>
        <SidebarContent />
      </DesktopAside>

      <MobileDrawer open={open} onClose={() => setOpen(false)}>
        <SidebarContent onNavigate={() => setOpen(false)} />
      </MobileDrawer>

      <Column>
        <GlassBar>
          <MenuButton onClick={() => setOpen(true)} aria-label="Open navigation">
            <MenuRoundedIcon />
          </MenuButton>
          <MobileMark>
            <KarmaMark size={34} variant="seal" />
          </MobileMark>

          <Stack minWidth={0} flex={1}>
            <Typography variant="h4" color="text.primary" lineHeight={1.1}>
              {title}
            </Typography>
            {subtitle && (
              <Subtitle variant="body2" color="text.secondary">
                {subtitle}
              </Subtitle>
            )}
          </Stack>

          {actions && (
            <Stack direction="row" spacing={1} alignItems="center">
              {actions}
            </Stack>
          )}
        </GlassBar>

        <Main>{children}</Main>
      </Column>
    </Shell>
  );
}
