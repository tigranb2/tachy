import { API_URL } from "./config"

export default (token) => {
  return fetch(`${API_URL}/readEvents`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json'
    }
  })
    .then(response => response.json())
}