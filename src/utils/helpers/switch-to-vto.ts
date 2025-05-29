export const switchToVto = (function () {
  let switched = false
  return function (divLoading: HTMLDivElement, divContainer: HTMLDivElement) {
    if (!switched) {
      switched = true

      divLoading.style.visibility = 'hidden'
      divLoading.style.display = 'none'
      divContainer.style.visibility = 'visible'
    }
  }
})()
