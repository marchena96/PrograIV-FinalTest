import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://api.escuelajs.co/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message
      ?? error.message
      ?? 'Error de conexión'
    return Promise.reject(new Error(Array.isArray(message) ? message.join(', ') : message))
  },
)

export default axiosClient
