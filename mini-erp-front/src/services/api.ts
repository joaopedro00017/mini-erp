import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: extrai a mensagem da BusinessException do backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const mensagem: string =
      error.response?.data?.message ??
      error.response?.data?.erro ??
      'Erro inesperado. Tente novamente.'

    return Promise.reject(new Error(mensagem))
  }
)

export default api
