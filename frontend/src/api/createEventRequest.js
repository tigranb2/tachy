import { API_URL } from "./config"

export default (event, token) => {
  return fetch(`${API_URL}/createEvent`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime
    })
  })
    .then(response => response.json())
}