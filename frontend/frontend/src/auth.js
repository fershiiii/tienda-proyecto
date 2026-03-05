// src/auth.js
const KEY = "tienda_auth";

export function isLoggedIn() {
  return localStorage.getItem(KEY) === "1";
}

export function setLoggedIn(value) {
  if (value) localStorage.setItem(KEY, "1");
  else localStorage.removeItem(KEY);
}
