import { API_URL } from "./config"

export default (tag, token) => {
  return fetch(`${API_URL}/deleteTag/${tag._id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json'
    },
  })
    .then(response => response.json())
}