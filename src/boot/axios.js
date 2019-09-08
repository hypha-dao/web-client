import axios from 'axios'

export const http = axios.create({
  baseURL: process.env.WEBSERVICE
})

http.interceptors.response.use(response => response.data || {})

export default ({ Vue }) => {
  Vue.prototype.$axios = http
}
