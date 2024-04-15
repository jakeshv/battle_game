import { Assets, Texture } from 'pixi.js'

export async function loadTexturesByPath(firstElementPath: string, frameNumber: number): Promise<Texture[]> {
  const fileParts = firstElementPath.split('.')
  const fileExt = fileParts.pop()
  firstElementPath = fileParts.join('').slice(0, -3) // последние три цифры с конца, не больше 999 елементов
  const loaders = []
  for (let i = 0; i < frameNumber; i++) {
    let imgPath = firstElementPath + (i < 100 ? '0' : '') + (i < 10 ? '0' : '') + i + '.' + fileExt
    loaders.push(Assets.load(imgPath))
  }
  return await Promise.all(loaders)
}