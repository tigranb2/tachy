import { API_URL } from "./config"

export default() => {
  return fetch(`${API_URL}/readEvent`, {
    method: 'GET',
    headers: {
      "Content-Type": 'application/json'
    }
  })
    .then(response => response.json())
}