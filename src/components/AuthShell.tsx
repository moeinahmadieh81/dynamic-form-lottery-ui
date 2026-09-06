import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Box, Paper, Stack, Typography } from '@mui/material';
import type { PropsWithChildren } from 'react';

export function AuthShell({ children }: PropsWithChildren) {
  return (
    <Box
      minHeight="100vh"
      sx={{
        display: 'grid',
        placeItems: 'center',
        p: { xs: 2, md: 4 },
        background: 'linear-gradient(140deg, #F7F8FC 0%, #EEF1FF 50%, #F2FBF8 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""', position: 'absolute', width: 480, height: 480, borderRadius: '50%',
          top: -240, right: -180, background: 'rgba(91,91,214,.10)', filter: 'blur(2px)',
        },
        '&::after': {
          content: '""', position: 'absolute', width: 380, height: 380, borderRadius: '50%',
          bottom: -220, left: -120, background: 'rgba(15,157,138,.09)',
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 1040,
          minHeight: { md: 610 },
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.02fr .98fr' },
          border: '1px solid rgba(255,255,255,.8)',
          boxShadow: '0 28px 90px rgba(49,54,87,.14)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            p: 5,
            color: 'common.white',
            background: 'linear-gradient(145deg, #4D4DC4 0%, #6868E5 56%, #0F9D8A 145%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""', position: 'absolute', width: 300, height: 300, borderRadius: '50%',
              top: -120, left: -90, background: 'rgba(255,255,255,.11)',
            },
            '&::after': {
              content: '""', position: 'absolute', width: 240, height: 240, borderRadius: '50%',
              bottom: -120, right: -100, background: 'rgba(255,255,255,.08)',
            },
          }}
        >
          <Stack justifyContent="space-between" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
            <Stack direction="row" alignItems="center" gap={1.2}>
              <Box sx={{ width: 46, height: 46, borderRadius: 2.5, bgcolor: 'rgba(255,255,255,.15)', display: 'grid', placeItems: 'center' }}>
                <AutoAwesomeRoundedIcon />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={950}>فرمینو</Typography>
                <Typography variant="caption" sx={{ opacity: .8 }}>فرم‌ساز پویا و قرعه‌کشی</Typography>
              </Box>
            </Stack>

            <Stack spacing={2.2}>
              <Typography variant="h3" sx={{ lineHeight: 1.25 }}>
                فرم بساز، مشارکت بگیر، عادلانه قرعه‌کشی کن.
              </Typography>
              <Typography sx={{ opacity: .84, maxWidth: 440, lineHeight: 2 }}>
                یک تجربه ساده و مدرن برای ساخت فرم‌های پویا، جمع‌آوری پاسخ‌ها و مدیریت شفاف قرعه‌کشی.
              </Typography>
              <Stack spacing={1.4} sx={{ pt: 1 }}>
                {['فرم‌ساز کاملاً پویا', 'اعتبارسنجی امن سمت سرور', 'قرعه‌کشی قابل پیگیری و شفاف'].map((text) => (
                  <Stack key={text} direction="row" gap={1} alignItems="center">
                    <CheckCircleRoundedIcon sx={{ fontSize: 20, opacity: .92 }} />
                    <Typography variant="body2" fontWeight={700}>{text}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>

            <Typography variant="caption" sx={{ opacity: .65 }}>
              یک سامانه کوچک با معماری تمیز و آماده رشد
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 3, sm: 5, md: 6 }, display: 'grid', alignItems: 'center', bgcolor: 'background.paper' }}>
          {children}
        </Box>
      </Paper>
    </Box>
  );
}
