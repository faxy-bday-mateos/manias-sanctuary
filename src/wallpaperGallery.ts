import { remoteImageStoreConfigured } from './firebase'
import type { SavedWallpaperUpload } from './firebaseClient'

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_INPUT_BYTES = 15 * 1024 * 1024
const MAX_EDGE = 900
const MAX_DATA_URL_LENGTH = 900_000

export function canSaveWallpaperImages() {
  return remoteImageStoreConfigured
}

async function prepareWallpaperUpload(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Choose a JPEG, PNG, or WebP image.')
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('Please choose an image smaller than 15 MB.')
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error('This image could not be opened.'))
      element.src = objectUrl
    })

    if (image.naturalWidth * image.naturalHeight > 40_000_000) {
      throw new Error('That image is too large to prepare here. Please choose a smaller photo.')
    }

    const scale = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Image resizing is not available in this browser.')

    context.fillStyle = '#fffdf8'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    const dataUrl = canvas.toDataURL('image/webp', 0.82)
    if (dataUrl.length > MAX_DATA_URL_LENGTH) {
      throw new Error('That image is too detailed to save. Please try a smaller photo.')
    }
    return dataUrl
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export async function saveWallpaperImage(file: File): Promise<SavedWallpaperUpload> {
  if (!remoteImageStoreConfigured) {
    throw new Error('Photo saving is not configured for this site.')
  }
  const dataUrl = await prepareWallpaperUpload(file)
  const { saveWallpaperUpload } = await import('./firebaseClient')
  const id = await saveWallpaperUpload({ name: file.name || 'wallpaper-photo', dataUrl })
  return {
    id,
    name: file.name || 'wallpaper-photo',
    dataUrl,
    createdAt: Date.now(),
  }
}

export async function loadWallpaperImages(): Promise<SavedWallpaperUpload[]> {
  if (!remoteImageStoreConfigured) return []
  const { loadWallpaperUploads } = await import('./firebaseClient')
  return loadWallpaperUploads()
}
