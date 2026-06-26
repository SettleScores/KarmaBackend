import { createTheme, alpha, type Shadows, type CSSObject } from '@mui/material/styles';
import { STATUS_LABEL } from './constants/status';

const family = {
  display: "'Fredoka', 'Nunito', system-ui, -apple-system, 'Segoe UI', sans-serif",
  body: "'Nunito', system-ui, -apple-system, 'Segoe UI', Helvetica, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",
};

const ink = { strong: '#16233B', soft: '#566782', faint: '#93A3BC' };
const surface = { canvas: '#EEF3FB', paper: '#FFFFFF', alt: '#F5F8FD', border: '#E3EAF4', borderStrong: '#CEDAEC' };
const brand = {
  azure: '#3B6FD4',
  azureDark: '#2C56AE',
  azureGlow: '#5C82E8',
  cyan: '#10C2E0',
  cyanDark: '#0E93AE',
  soft: '#E8EEFC',
  gradTop: '#5E7DE2',
  gradMid: '#3D93DD',
  gradBot: '#0BC7E5',
};
const onBrand = {
  text: '#FFFFFF',
  textSoft: 'rgba(255,255,255,0.72)',
  line: 'rgba(255,255,255,0.16)',
  fill: 'rgba(255,255,255,0.10)',
  fillStrong: 'rgba(255,255,255,0.18)',
  online: '#7CFAD6',
};
const status = {
  Done: { label: STATUS_LABEL.Done, fg: '#15803D', bg: '#E7F5EC', dot: '#16A34A' },
  Working: { label: STATUS_LABEL.Working, fg: '#0E7490', bg: '#E0F4F9', dot: '#0891B2' },
  Pending: { label: STATUS_LABEL.Pending, fg: '#B45309', bg: '#FBEFD6', dot: '#D97706' },
  Rejected: { label: STATUS_LABEL.Rejected, fg: '#B42318', bg: '#FCE8E6', dot: '#DC2626' },
  Unknown: { label: STATUS_LABEL.Unknown, fg: '#52647D', bg: '#EEF2F8', dot: '#93A3BC' },
};

const gradient = {
  brand: `linear-gradient(150deg, ${brand.gradTop} 0%, ${brand.gradMid} 48%, ${brand.gradBot} 100%)`,
  sidebar: `linear-gradient(190deg, ${brand.gradTop} 0%, ${brand.gradMid} 52%, ${brand.gradBot} 110%)`,
  login: `linear-gradient(177deg, ${brand.gradTop} 0%, ${brand.gradMid} 50%, #06CCE8 100%)`,
  text: `linear-gradient(120deg, ${brand.gradTop}, ${brand.gradMid} 55%, ${brand.cyan})`,
};
const radii = { sm: 12, md: 18, lg: 24, pill: 999 };
const glow = {
  brand: '0 14px 30px -10px rgba(59,111,212,0.50)',
  cyan: '0 16px 40px -14px rgba(16,194,224,0.45)',
  text: '0 2px 30px rgba(255,255,255,0.45), 0 0 2px rgba(255,255,255,0.6)',
  online: '0 0 0 3px rgba(124,250,214,0.25)',
};
const elevation = {
  sm: '0 1px 2px rgba(22,35,59,0.06), 0 2px 6px -2px rgba(22,35,59,0.08)',
  md: '0 10px 26px -10px rgba(22,35,59,0.18), 0 3px 8px -4px rgba(22,35,59,0.10)',
  lg: '0 30px 60px -18px rgba(22,35,59,0.28), 0 10px 22px -12px rgba(22,35,59,0.16)',
};
const shadows = Array.from({ length: 25 }, (_, i) =>
  i === 0 ? 'none' : i <= 2 ? elevation.sm : i <= 8 ? elevation.md : elevation.lg,
) as unknown as Shadows;

type StatusKey = keyof typeof status;
type Ramp = typeof status.Done;

declare module '@mui/material/styles' {
  interface Palette {
    ink: typeof ink;
    surface: typeof surface;
    brand: typeof brand;
    onBrand: typeof onBrand;
    status: Record<StatusKey, Ramp>;
  }
  interface PaletteOptions {
    ink: typeof ink;
    surface: typeof surface;
    brand: typeof brand;
    onBrand: typeof onBrand;
    status: Record<StatusKey, Ramp>;
  }
  interface Theme {
    gradient: typeof gradient;
    radii: typeof radii;
    glow: typeof glow;
  }
  interface ThemeOptions {
    gradient: typeof gradient;
    radii: typeof radii;
    glow: typeof glow;
  }
  interface TypographyVariants {
    stat: React.CSSProperties;
    mono: React.CSSProperties;
    eyebrow: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    stat?: React.CSSProperties;
    mono?: React.CSSProperties;
    eyebrow?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    stat: true;
    mono: true;
    eyebrow: true;
  }
}

const focusRing = `0 0 0 3px ${alpha(brand.azure, 0.34)}`;

export const theme = createTheme({
  gradient,
  radii,
  glow,
  palette: {
    mode: 'light',
    primary: { main: brand.azure, dark: brand.azureDark, light: brand.azureGlow, contrastText: onBrand.text },
    secondary: { main: brand.cyan, dark: brand.cyanDark, contrastText: '#06303A' },
    success: { main: status.Done.fg, light: status.Done.bg },
    info: { main: status.Working.fg, light: status.Working.bg },
    warning: { main: status.Pending.fg, light: status.Pending.bg },
    error: { main: status.Rejected.fg, light: status.Rejected.bg },
    background: { default: surface.canvas, paper: surface.paper },
    text: { primary: ink.strong, secondary: ink.soft, disabled: ink.faint },
    divider: surface.border,
    action: { hover: alpha(brand.azure, 0.05), selected: alpha(brand.azure, 0.1) },
    ink,
    surface,
    brand,
    onBrand,
    status,
  },
  shape: { borderRadius: radii.md },
  shadows,
  typography: {
    fontFamily: family.body,
    fontSize: 14,
    h1: { fontFamily: family.display, fontWeight: 600, fontSize: '3rem', lineHeight: 1.05, letterSpacing: '-0.01em' },
    h2: { fontFamily: family.display, fontWeight: 600, fontSize: '2.25rem', lineHeight: 1.08 },
    h3: { fontFamily: family.display, fontWeight: 600, fontSize: '1.75rem', lineHeight: 1.12 },
    h4: { fontFamily: family.display, fontWeight: 600, fontSize: '1.4rem', lineHeight: 1.18 },
    h5: { fontFamily: family.display, fontWeight: 500, fontSize: '1.15rem', lineHeight: 1.25 },
    h6: { fontFamily: family.display, fontWeight: 500, fontSize: '1rem' },
    subtitle1: { fontWeight: 700 },
    subtitle2: { fontWeight: 700 },
    body1: { lineHeight: 1.55 },
    body2: { lineHeight: 1.5 },
    button: { fontFamily: family.display, fontWeight: 500, textTransform: 'none', letterSpacing: '0.005em' },
    caption: { fontSize: '0.78rem', lineHeight: 1.45 },
    overline: { fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1.6 },
    eyebrow: { fontFamily: family.body, fontWeight: 800, fontSize: '0.66rem', letterSpacing: '0.2em', textTransform: 'uppercase', lineHeight: 1.6 },
    stat: { fontFamily: family.display, fontWeight: 600, fontSize: '2.1rem', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' },
    mono: { fontFamily: family.mono, fontSize: '0.8rem', letterSpacing: '-0.01em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          color: ink.strong,
          backgroundColor: surface.canvas,
          backgroundAttachment: 'fixed',
          backgroundImage: [
            `radial-gradient(1100px 620px at 6% -12%, ${alpha(brand.gradTop, 0.16)}, transparent 60%)`,
            `radial-gradient(940px 540px at 102% -4%, ${alpha(brand.cyan, 0.12)}, transparent 56%)`,
            `radial-gradient(1000px 720px at 50% 124%, ${alpha(brand.gradMid, 0.1)}, transparent 60%)`,
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.018'/%3E%3C/svg%3E\")",
          ].join(', '),
        },
        '::selection': { background: alpha(brand.azure, 0.24) },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: 'none' }, outlined: { borderColor: surface.border } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: radii.pill,
          paddingInline: 20,
          paddingBlock: 9,
          transition: 'transform .18s ease, box-shadow .22s ease, background-color .2s ease, border-color .2s ease',
          '&:active': { transform: 'translateY(1px)' },
          '&.Mui-focusVisible': { boxShadow: focusRing },
        },
        contained: { boxShadow: elevation.sm, '&:hover': { boxShadow: glow.brand, transform: 'translateY(-1px)' } },
        outlined: {
          borderColor: surface.borderStrong,
          color: ink.strong,
          backgroundColor: alpha(surface.paper, 0.5),
          '&:hover': { borderColor: brand.azure, color: brand.azureDark, backgroundColor: surface.paper },
        },
        text: { '&:hover': { backgroundColor: alpha(brand.azure, 0.08) } },
        sizeSmall: { paddingInline: 14, paddingBlock: 5, fontSize: '0.82rem' },
        sizeLarge: { paddingInline: 26, paddingBlock: 13, fontSize: '1.02rem' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: radii.sm,
          color: ink.soft,
          transition: 'background-color .18s ease, color .18s ease',
          '&:hover': { backgroundColor: alpha(brand.azure, 0.1), color: brand.azureDark },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radii.sm,
          backgroundColor: surface.paper,
          transition: 'box-shadow .2s ease',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: surface.borderStrong, transition: 'border-color .2s ease' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ink.faint },
          '&.Mui-focused': { boxShadow: `0 0 0 4px ${alpha(brand.azure, 0.16)}` },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: brand.azure, borderWidth: 1.5 },
        },
        input: { '&::placeholder': { color: ink.faint, opacity: 1 } },
      },
    },
    MuiTextField: { defaultProps: { variant: 'filled' } },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: `${radii.sm}px ${radii.sm}px 0 0`,
          backgroundColor: alpha(brand.azure, 0.06),
          transition: 'background-color .2s ease',
          '&:hover': { backgroundColor: alpha(brand.azure, 0.1) },
          '&.Mui-focused': { backgroundColor: alpha(brand.azure, 0.08) },
          '&:before': { borderBottom: `1px solid ${surface.borderStrong}` },
          '&:hover:not(.Mui-disabled, .Mui-error):before': { borderBottom: `1px solid ${ink.faint}` },
          '&:after': { borderBottomColor: brand.azure },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: ink.soft,
          fontWeight: 700,
          fontSize: '0.9rem',
          letterSpacing: '0.01em',
          '&.Mui-focused': { color: brand.azureDark },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontWeight: 700 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 700, borderRadius: radii.pill }, label: { paddingInline: 10 } } },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: ink.strong,
          color: onBrand.text,
          fontSize: '0.74rem',
          fontWeight: 600,
          borderRadius: 9,
          padding: '6px 10px',
          boxShadow: elevation.md,
        },
        arrow: { color: ink.strong },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: radii.lg, border: `1px solid ${surface.border}`, boxShadow: elevation.lg, backgroundColor: surface.paper },
      },
    },
    MuiDialogTitle: { styleOverrides: { root: { fontFamily: family.display, fontWeight: 600, fontSize: '1.4rem', paddingBottom: 4 } } },
    MuiBackdrop: {
      styleOverrides: {
        root: { backgroundColor: alpha('#0C1B33', 0.46), backdropFilter: 'blur(3px)' },
        invisible: { backgroundColor: 'transparent', backdropFilter: 'none' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: surface.border },
        head: { fontWeight: 700, color: ink.soft } as CSSObject,
      },
    },
    MuiAlert: { styleOverrides: { root: { borderRadius: radii.sm, alignItems: 'center' } } },
    MuiLink: { styleOverrides: { root: { color: brand.azureDark, textDecorationColor: alpha(brand.azureDark, 0.4) } } },
    MuiDivider: { styleOverrides: { root: { borderColor: surface.border } } },
  },
});
