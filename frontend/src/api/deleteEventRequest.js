import { API_URL } from "./config"

export default (event) => {
  return fetch(`${API_URL}/deleteEvent/${event.id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": 'application/json'
    },
  })
    .then(response => response.json())
}