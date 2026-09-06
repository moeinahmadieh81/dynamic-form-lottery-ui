import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

interface Props {
  to?: string;
  label?: string;
}

export function BackButton({ to, label = 'بازگشت' }: Props) {
  const navigate = useNavigate();

  return (
    <Button
      color="inherit"
      size="small"
      startIcon={<ArrowForwardRoundedIcon />}
      onClick={() => (to ? navigate(to) : navigate(-1))}
      sx={{
        alignSelf: 'flex-start',
        color: 'text.secondary',
        px: 1.25,
        '&:hover': { color: 'primary.main', bgcolor: alpha('#5B5BD6', 0.06) },
      }}
    >
      {label}
    </Button>
  );
}
