export function useHaptic() {
  function trigger(type = 'light') {
    if (!window.navigator?.vibrate) return
    const patterns = { light: [10], medium: [20], heavy: [30, 10, 30] }
    window.navigator.vibrate(patterns[type] || [10])
  }
  return { trigger }
}
