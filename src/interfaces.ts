export interface WeatherResponse {
  weather: Weather[];
  timezone: number;
  name: string;
}

export interface AxiosError {
  response: { 
    data: {
      status: number;
      message: string;
    }
  }
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}
