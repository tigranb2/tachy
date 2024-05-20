import { API_URL } from "./config"

export default (event) => {
  return fetch(`${API_URL}/createEvent`, {
    method: 'POST',
    headers: {
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