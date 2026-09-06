import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { Alert, Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getApiErrorMessage } from '../api/error';
import { BackButton } from '../components/BackButton';
import { getPublicLotteryResult } from '../features/lottery/lotteryApi';

export function LotteryResultPage() {
  const { id } = useParams();
  const formId = Number(id);
  const query = useQuery({ queryKey: ['lottery-result', formId], queryFn: () => getPublicLotteryResult(formId), enabled: Number.isFinite(formId) });

  if (query.isLoading) return <Typography color="text.secondary">در حال دریافت نتیجه...</Typography>;
  if (query.isError) return <Alert severity="error">{getApiErrorMessage(query.error)}</Alert>;
  if (!query.data) return null;

  const currentUserWon = query.data.winners.some((winner) => winner.currentUser);

  return (
    <Stack spacing={3}>
      <BackButton to={`/forms/${formId}`} label="بازگشت به فرم" />

      <Box
        sx={{
          position: 'relative', overflow: 'hidden', borderRadius: 4, p: { xs: 3, md: 5 }, textAlign: 'center',
          color: 'common.white', background: currentUserWon
            ? 'linear-gradient(135deg,#0F9D8A 0%,#32B79E 55%,#5B5BD6 135%)'
            : 'linear-gradient(135deg,#4D4DC4 0%,#6C6CE7 100%)',
          boxShadow: '0 24px 54px rgba(58,63,125,.18)',
        }}
      >
        <Box sx={{ width: 76, height: 76, mx: 'auto', mb: 2, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: 'rgba(255,255,255,.15)' }}>
          <EmojiEventsRoundedIcon sx={{ fontSize: 42 }} />
        </Box>
        <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.7rem' } }}>نتیجه قرعه‌کشی</Typography>
        <Typography sx={{ mt: 1, opacity: .85 }}>{query.data.participantCount} شرکت‌کننده، {query.data.winnerCount} برنده</Typography>
      </Box>

      <Alert severity={currentUserWon ? 'success' : 'info'} sx={{ borderRadius: 3 }}>
        {currentUserWon ? '🎉 تبریک! شما یکی از برندگان این قرعه‌کشی هستید.' : 'این بار نام شما در میان برندگان نیست؛ امیدواریم دفعه بعد خوش‌شانس باشید.'}
      </Alert>

      <Grid container spacing={2}>
        {query.data.winners.map((winner) => (
          <Grid key={winner.position} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card sx={{ height: '100%', borderColor: winner.currentUser ? alpha('#0F9D8A', .35) : 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <Box sx={{ width: 52, height: 52, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: winner.currentUser ? alpha('#0F9D8A', .1) : alpha('#5B5BD6', .08), color: winner.currentUser ? 'secondary.main' : 'primary.main', fontWeight: 950 }}>
                    #{winner.position}
                  </Box>
                  <Box>
                    <Typography variant="h6">{winner.displayName}</Typography>
                    <Typography color="text.secondary" variant="body2">رتبه {winner.position}</Typography>
                  </Box>
                  {winner.currentUser && <Chip color="success" label="این شما هستید ✨" />}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
