import { API_URL } from "./config"

export default (user) => {
  return fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json',
    },
    body: JSON.stringify({
      email: user.email,
      password: user.password,
    })
  })
    .then(response => response.json());
}