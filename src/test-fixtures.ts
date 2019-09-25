export const successfullResponse = {
  coord: {
    lon: 36.82,
    lat: -1.28
  },
  weather: [
    {
      id: 803,
      main: 'Clouds',
      description: 'broken clouds',
      icon: '04d'
    }
  ],
  timezone: 10800,
  id: 184745,
  name: 'Nairobi',
  cod: 200
}

export const axiosResponseError = {
  response: {
    data: {
      status: 400,
      message: 'cannot find the city'
    }
  }
}
