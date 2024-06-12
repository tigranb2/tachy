import { API_URL } from "./config"

export default (tag, token) => {
  return fetch(`${API_URL}/createTag`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      name: tag.name,
      color: tag.color,
    })
  })
    .then(response => response.json())
}