import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
}

export function PageHero({ title, subtitle, eyebrow, actions }: Props) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: { xs: 3, md: 4 },
        p: { xs: 2.5, md: 4 },
        color: 'common.white',
        background: 'linear-gradient(135deg, #4D4DC4 0%, #6666E3 48%, #0F9D8A 130%)',
        boxShadow: '0 24px 54px rgba(69,69,176,.18)',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 260,
          height: 260,
          borderRadius: '50%',
          top: -150,
          left: -70,
          background: 'rgba(255,255,255,.12)',
          filter: 'blur(2px)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: 180,
          height: 180,
          borderRadius: '50%',
          bottom: -100,
          right: '22%',
          background: 'rgba(255,255,255,.08)',
        },
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ md: 'center' }}
        gap={3}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Stack spacing={1}>
          {eyebrow && (
            <Stack direction="row" alignItems="center" gap={0.75}>
              <AutoAwesomeRoundedIcon sx={{ fontSize: 18, opacity: 0.9 }} />
              <Typography variant="caption" fontWeight={850} sx={{ opacity: 0.88 }}>
                {eyebrow}
              </Typography>
            </Stack>
          )}
          <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.7rem' }, lineHeight: 1.2 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ maxWidth: 720, opacity: 0.86, fontSize: { xs: '.95rem', md: '1.05rem' } }}>
              {subtitle}
            </Typography>
          )}
        </Stack>
        {actions}
      </Stack>
    </Box>
  );
}
