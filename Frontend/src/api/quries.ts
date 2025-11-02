import { useQuery } from '@tanstack/react-query';
// import type { WeatherResponse } from '@/types';
import { getWeather } from './api';

export function useGetWeather() {
  return useQuery({
    queryKey: ['weather'],
    queryFn: () => getWeather(),
  });
}
