export function displayError(message: string) {
  const dots = document.getElementById('loading-dots')
  if (dots) dots.style.visibility = 'hidden'

  const title = document.getElementById('loading-title')
  if (title) title.innerHTML = message
}
