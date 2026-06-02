export function getStoredAuth(key) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export function persistAuth(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeStoredAuth(key) {
  window.localStorage.removeItem(key)
}
