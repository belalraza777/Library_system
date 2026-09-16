import axios from 'axios'

//Base URL for the API is set to the environment variable VITE_API_URL, or defaults to 'http://localhost:5000/api' if not provided. The axios instance is configured to include credentials (cookies) in requests and sets the 'Content-Type' header to 'application/json'. This instance is then exported for use in other parts of the application.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api