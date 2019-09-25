require('dotenv').config()

import { getWeather } from './src';

getWeather([['Dubai'], ['', '10005'], ['Nairobi']]);