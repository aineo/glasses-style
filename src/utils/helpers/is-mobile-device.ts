export function isMobileDevice() {
  const deviceTypes = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ]

  return deviceTypes.some((type: RegExp) => {
    return navigator.userAgent.match(type)
  })
}
