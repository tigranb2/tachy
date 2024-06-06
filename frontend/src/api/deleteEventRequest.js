import { API_URL } from "./config"

export default (event, token) => {
  return fetch(`${API_URL}/deleteEvent/${event.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json'
    },
  })
    .then(response => response.json())
}