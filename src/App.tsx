import { useState, type ChangeEvent, type FormEvent } from 'react';
import './App.css';
import type { WeatherData } from './Weather';

const App = () => {
  const [name, setName] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!name.trim()) {
      setError('Vui lòng nhập vị trí!')
      return
    }

    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const location = encodeURIComponent(name.trim())

      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=Z4PPH2S7YN5KW97YGERGTH4BJ`,
      )

      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu thời tiết!')
      }

      const data = (await response.json()) as WeatherData;
      setWeather(data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã xảy ra lỗi không xác định!');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-3 p-10">
      <div className="flex flex-col gap-5">
        <p> Vui lòng nhập vị trí của bạn để xem thông tin thời tiết: </p>
        
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="flex flex-row">
            <label>
              {' '}
              Vị trí:
              <input
                type="text"
                value={name}
                onChange={handleChange}
                className="border-2"
              />
            </label>
          </div>

          <div className="flex flex-row">
            <p className="basis-64"></p>
            <button
              className="border-2"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang tải...' : 'Xem thời tiết'}
            </button>
            <p className="basis-64"></p>
          </div>
          
        </form>

        {error && <p className="text-red-500">{error}</p>}

        {weather && (
          <div>
            <h2 className="text-xl font-bold">{weather.resolvedAddress}</h2>

            <p>Nhiệt độ: {weather.currentConditions.temp}°C</p>

            <p>Cảm giác như: {weather.currentConditions.feelslike}°C</p>

            <p>Độ ẩm: {weather.currentConditions.humidity}%</p>

            <p>Thời tiết: {weather.currentConditions.conditions}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
