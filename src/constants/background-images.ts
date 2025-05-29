export interface IBackgroundImage {
  name: string
  url: string
}

const backgroundNames = ['Office', 'Forest', 'Beach', 'Club']

export const backgroundImages = backgroundNames.map((name: string) => {
  return {
    name,
    url: `/glasses-style/assets/backgrounds/${name.toLowerCase()}.png`
  }
})

backgroundImages.push({ name: 'None', url: '' })
