import { useState, useContext } from 'react';
import { Alert, Button, Collapse, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useNavigate } from 'react-router-dom';

import { login } from '../../api/client';
import { SetAuthContext } from '../../state/authContext';
import { KarmaMark, Reveal, Ring, Wordmark } from '../ui';

const Page = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  background: theme.gradient.login,
}));

const Atmosphere = styled('div')({ position: 'absolute', inset: 0, pointerEvents: 'none' });

const RingA = styled(Ring)({ top: -160, left: -120, width: 420, height: 420 });
const RingB = styled(Ring)({ top: -90, left: -40, width: 260, height: 260 });
const RingC = styled(Ring)({ bottom: -180, right: -120, width: 460, height: 460 });

const WhiteBlob = styled('span')(({ theme }) => ({
  position: 'absolute',
  top: '12%',
  right: '14%',
  width: 320,
  height: 320,
  borderRadius: '50%',
  background: `radial-gradient(circle, ${theme.palette.onBrand.fillStrong}, transparent 70%)`,
  filter: 'blur(8px)',
}));
const CyanBlob = styled('span')(({ theme }) => ({
  position: 'absolute',
  bottom: '6%',
  left: '10%',
  width: 260,
  height: 260,
  borderRadius: '50%',
  background: `radial-gradient(circle, ${alpha(theme.palette.brand.cyan, 0.2)}, transparent 70%)`,
  filter: 'blur(10px)',
}));

const Content = styled(Stack)({ position: 'relative', width: '100%', maxWidth: 432 });

const Float = styled('div')({ animation: 'k-float 7s ease-in-out infinite' });

const HeroGlow = styled('div')(({ theme }) => ({ textAlign: 'center', color: theme.palette.onBrand.text, textShadow: theme.glow.text }));

const Card = styled(Reveal)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.radii.lg,
  boxShadow: theme.shadows[16],
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(3) },
}));

const FooterText = styled(Typography)(({ theme }) => ({ color: theme.palette.onBrand.textSoft, textAlign: 'center' }));

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setAuthContext = useContext(SetAuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const data = new FormData(event.currentTarget);
    try {
      const accessToken = await login(data.get('email') as string, data.get('password') as string);
      if (!accessToken) throw new Error('Invalid credentials');
      setAuthContext(accessToken);
      navigate('/dashboard');
    } catch {
      setError('Sign in failed. Please check your credentials and try again.');
      setSubmitting(false);
    }
  };

  return (
    <Page>
      <Atmosphere>
        <RingA />
        <RingB />
        <RingC />
        <WhiteBlob />
        <CyanBlob />
      </Atmosphere>

      <Content alignItems="center" spacing={3.5}>
        <Reveal>
          <Stack alignItems="center" spacing={1.5}>
            <Float>
              <KarmaMark size={68} variant="glyph" animated />
            </Float>
            <HeroGlow>
              <Wordmark tone="light" size="2.7rem" />
            </HeroGlow>
            <HeroGlow>
              <Typography variant="h5">Improve your life</Typography>
            </HeroGlow>
          </Stack>
        </Reveal>

        <Card delay={0.12}>
          <Stack spacing={0.5} mb={3}>
            <Typography variant="h4" color="text.primary">
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to the Karma admin console.
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.25}>
              <TextField label="Username / Email" id="email" name="email" type="email" placeholder="you@karma.app" autoComplete="username" autoFocus fullWidth />
              <TextField
                label="Password"
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" size="small" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Collapse in={!!error}>
                <Alert severity="error" variant="outlined">
                  {error}
                </Alert>
              </Collapse>

              <Button type="submit" size="large" fullWidth variant="contained" disabled={submitting} endIcon={!submitting && <ArrowForwardRoundedIcon />}>
                {submitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </Stack>
          </form>
        </Card>

        <Reveal delay={0.2}>
          <FooterText variant="caption">Karma · Admin console</FooterText>
        </Reveal>
      </Content>
    </Page>
  );
}
