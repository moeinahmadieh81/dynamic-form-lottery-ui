import axios from 'axios';
import { http } from '../../api/http';
import type {
  AdminLotteryWinner,
  LotteryResponse,
  PublicLotteryResult,
} from '../../types/api';

export async function getPublicLotteryResult(formId: number): Promise<PublicLotteryResult> {
  const { data } = await http.get<PublicLotteryResult>(`/forms/${formId}/lottery`);
  return data;
}

export async function getAdminLotteryForForm(formId: number): Promise<PublicLotteryResult | null> {
  try {
    const { data } = await http.get<PublicLotteryResult>(`/forms/${formId}/lottery`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getAdminLotteryWinners(lotteryId: number): Promise<AdminLotteryWinner[]> {
  const { data } = await http.get<AdminLotteryWinner[]>(`/lotteries/${lotteryId}/winners`);
  return data;
}

export async function createLottery(formId: number, winnerCount: number): Promise<LotteryResponse> {
  const { data } = await http.post<LotteryResponse>(`/forms/${formId}/lotteries`, { winnerCount });
  return data;
}

export async function runLottery(lotteryId: number): Promise<LotteryResponse> {
  const { data } = await http.post<LotteryResponse>(`/lotteries/${lotteryId}/run`);
  return data;
}
