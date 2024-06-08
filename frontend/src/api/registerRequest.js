import { API_URL } from "./config"

export default (user) => {
  return fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      name: user.name,
      email: user.email,
      password: user.password,
    })
  })
    .then(response => response.json());
}