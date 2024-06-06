import { API_URL } from "./config";

export default (token) => {
    return fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
    })
      .then(response => response)
}