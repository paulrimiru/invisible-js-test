import axios, { AxiosResponse } from 'axios'
import { left, right, isRight, Either } from 'fp-ts/lib/Either'

import { WeatherResponse, AxiosError } from './interfaces'

const defaultOptions = {
  method:'GET',
  url:'https://community-open-weather-map.p.rapidapi.com/weather',
  headers:{
    'content-type':'application/octet-stream',
    'x-rapidapi-host':'community-open-weather-map.p.rapidapi.com',
    'x-rapidapi-key': process.env.API_KEY
  },
  params:{
    'units':'\'metric\' or \'imperial\'',
  },
}

export const getWeather = async (locations: string[][]) => {
  const weatherResults =  await fetchWeatherData(locations)

  processWeatherResults(weatherResults)
}

export const fetchWeatherData = async (locations: string[][]) => {
  return await Promise.all(
    locations.map(
      async ([name, postalcode]) => {
        if ((!name && !postalcode) || (!name.length && !postalcode.length)) {
          throw new Error('Please provide either a city name or postal code')
        }

        return await axios({
          ...defaultOptions,
          params: {
            ...defaultOptions.params,
            ...(name.length ? { 'q': name } : { 'zip': postalcode })
          }
        } as any)
          .then((response: AxiosResponse<WeatherResponse>) => {
            return right(response.data)
          })
          .catch((error: AxiosError) => {
            return left(error)
          });
    })
  );
}

export const processWeatherResults = (weatherResults: Array<Either<AxiosError, WeatherResponse>>) => {
  weatherResults.forEach(weatherResult => {
    if (isRight(weatherResult)) {
      printWeatherInformation(weatherResult.right)
    }
    else {
      console.log(`Error: ${weatherResult.left.response.data.message}`)
    }
  });
}

const printWeatherInformation = (response: WeatherResponse) => {
  const offset = response.timezone / 3600
  const formatedTime = calculateLocalTime(offset)

  console.log(
    response.weather.map(
      ({ main, description }) => `${formatedTime} : ${response.name} : ${main} : ${description}`
    )
    .join('\n')
  );
}

export const calculateLocalTime = (offset) => {
  const clientTime = new Date()
  const utcDate = clientTime.getTime()
    + (clientTime.getTimezoneOffset()
        * 60000
      )
  const cityLocalTime = new Date(
    utcDate + (3600000*offset)
  )

  return cityLocalTime.toLocaleString()
}
