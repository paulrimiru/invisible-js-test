import moxios from 'moxios'
import { expect } from 'chai'
import sinon from 'sinon';

import { successfullResponse, axiosResponseError } from './test-fixtures'
import * as weather from './index';
import { isRight, right, left } from 'fp-ts/lib/Either';

describe('The getWeather function', () => {
  let sandbox: sinon.SinonSandbox; 
  beforeEach(() => {
    moxios.install()
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    moxios.uninstall()
    sandbox.restore()
  })

  it('should process weather data successfully', async () => {
    const fetchWeatherDataStub = sandbox.stub(weather, 'fetchWeatherData')
    const processWeatherResultStub = sandbox.stub(weather, 'processWeatherResults')

    fetchWeatherDataStub.resolves([right(successfullResponse)])

    await weather.getWeather([['Nairobi']]);

    expect(fetchWeatherDataStub.callCount).equal(1);
    expect(fetchWeatherDataStub.calledWith([['Nairobi']])).true

    expect(processWeatherResultStub.callCount).equal(1)
    expect(processWeatherResultStub.calledWith([right(successfullResponse)]))
  })

  it('should show error message if weather data is not available', async () => {
    const fetchWeatherDataStub = sandbox.stub(weather, 'fetchWeatherData')
    const processWeatherResultStub = sandbox.stub(weather, 'processWeatherResults')

    fetchWeatherDataStub.resolves([left(axiosResponseError)])

    await weather.getWeather([['Invalid']]);

    expect(fetchWeatherDataStub.callCount).equal(1);
    expect(fetchWeatherDataStub.calledWith([['Invalid']])).true

    expect(processWeatherResultStub.callCount).equal(1)
    expect(processWeatherResultStub.calledWith([left(axiosResponseError)]))
  })

  it('should calculate correct city local time', () => {
    const offset = '+4'
    const cityTime = new Date(
      weather.calculateLocalTime(offset)
    )

    const currentDate = new Date()

    expect(cityTime).greaterThan(currentDate)
  })
})
