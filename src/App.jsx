import React from 'react'
import './App.css'
import { useState } from 'react'

const App = () => {
  const [name, setName] = useState('')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')

  function handleChange(e) {
    setName(e.target.value)
  }

  async function handleSubmit(e) {
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

      const data = await response.json()
      setWeather(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="border-3 p-10">
      <div class="flex flex-col gap-5">
        <p> Vui lòng nhập vị trí của bạn để xem thông tin thời tiết: </p>
        <form class="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div class="flex flex-row">
            <label>
              {' '}
              Vị trí:
              <input
                type="text"
                value={name}
                onChange={handleChange}
                class="border-2"
              />
            </label>
          </div>
          <div class="flex flex-row">
            <p class="basis-64"></p>
            <input class="border-2" type="submit" />
            <p class="basis-64"></p>
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
