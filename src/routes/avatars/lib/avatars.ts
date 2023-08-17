import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import * as odd from '@oddjs/odd'
import { isFile } from '@oddjs/odd/fs/types/check'
import { Canvg, presets } from 'canvg'
import type { Link } from '@oddjs/odd/fs/types'
import type { FaceLandmarksDetector } from '@tensorflow-models/face-landmarks-detection'
import type PublicFile from '@oddjs/odd/fs/v1/PublicFile'

import { addNotification } from '$lib/notifications'

export type Avatar = {
  name: string
  file: File
  src?: string
}


/**
 * Render images ODD by transmogrification
 */
export const transmogrify: (
  files: FileList
) => Promise<Avatar[] | null> = async files => {
  const avatars = await Promise.all(
    Array.from(files).map(async file => {
      // Draw image
      const imageBitmap = await createImageBitmap(file)
      const offscreen = new OffscreenCanvas(imageBitmap.width, imageBitmap.height)
      const ctx = offscreen.getContext('2d')
      ctx.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height)

      // Estimate eye placement in image
      const imageData = ctx.getImageData(0, 0, imageBitmap.width, imageBitmap.height)
      const estimatedEyes = await estimateEyes(imageData)

      if (estimatedEyes) {
        // Prepare ODD eye and draw it left and right
        const eyeBlob = await prepareEye(estimatedEyes.oddWidth, estimatedEyes.oddHeight)
        const eyeBitmap = await createImageBitmap(eyeBlob)
        ctx.drawImage(eyeBitmap, estimatedEyes.leftEye.dx, estimatedEyes.leftEye.dy, estimatedEyes.oddWidth, estimatedEyes.oddHeight)
        ctx.drawImage(eyeBitmap, estimatedEyes.rightEye.dx, estimatedEyes.rightEye.dy, estimatedEyes.oddWidth, estimatedEyes.oddHeight)

        // Convert image to base64
        const blob = await offscreen.convertToBlob()
        const renderedFile = new File([blob], file.name )

        addNotification(`Avatar ${file.name} transmogrified and available for summoning.`, 'success')

        return { name: file.name, file: renderedFile }
      } else {
        addNotification(`Could not detect a face in ${file.name}. Please try again.`)

        return null
      }
    })
  )

  return avatars.filter(avatar => avatar !== null)
}

export async function getAvatarsFromListing(listing: { [ name: string ]: Link }, fs: odd.FileSystem): Promise<Avatar[]> {
  return await Promise.all(Object.keys(listing).map(async name => {
    const filePath = odd.path.file('public', 'avatars', name)
    const bytes = await fs.read(filePath)
    const file = new File([ bytes ], name)
    const src = URL.createObjectURL(file)

    return { name, file, src }
  }))
}

export async function getContentCID(fileName: string, fs: odd.FileSystem): Promise<string> {
  const filePath = odd.path.file('public', 'avatars', `${fileName}`)

  const file = await fs.get(filePath)

  if (!isFile(file)) {
    addNotification(`Could not find public/avatars/${fileName}.`, 'error')
    return ''
  }

  const cid = (file as PublicFile).cid.toString()

  return cid
}

// Image processing

type EyeEstimates = {
  leftEye: { dx: number; dy: number }
  rightEye: { dx: number; dy: number }
  oddWidth: number
  oddHeight: number
}


let detector: FaceLandmarksDetector

async function initializeModel() {
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
  const detectorConfig = {
    runtime: 'tfjs' as const,
    refineLandmarks: true
  }
  detector = await faceLandmarksDetection.createDetector(model, detectorConfig)
}

initializeModel().catch(err => console.log('Could not initialize face landmark model', err))

/**
 * Estimate eye placements and calculate target width and height
 * based on the widest eye.
 *
 * @param imageData 
 * @returns EyeEstimates
 */
async function estimateEyes(imageData: ImageData): Promise<EyeEstimates> {
  // Finds one face if any
  const faces = await detector.estimateFaces(imageData)

  if (faces.length === 1) {
    const leftEye = faces[ 0 ].keypoints.filter(keypoint => keypoint.name === 'leftEye')
    const rightEye = faces[ 0 ].keypoints.filter(keypoint => keypoint.name === 'rightEye')

    const scalingFactor = 2.5

    const { width, height } = getOddDimensions({ left: leftEye, right: rightEye }, scalingFactor)
    const xTranslate = width / (scalingFactor * 1.5)
    const leftYTranslate = getYTranslation(width, leftEye)
    const rightYTranslate = getYTranslation(width, rightEye)

    return {
      leftEye: {
        dx: Math.min(...leftEye.map(keypoint => keypoint.x)) - xTranslate,
        dy: Math.min(...leftEye.map(keypoint => keypoint.y)) - leftYTranslate,
      },
      rightEye: {
        dx: Math.min(...rightEye.map(keypoint => keypoint.x)) - xTranslate,
        dy: Math.min(...rightEye.map(keypoint => keypoint.y)) - rightYTranslate,
      },
      oddWidth: width,
      oddHeight: height,
    }
  } else {
    return null
  }
}

/**
 * Get ODD eye dimensions
 *
 * @param keypoints Detected eye keypoints
 * @returns ODD eye width and height
 */
function getOddDimensions(keypoints: {
  left: faceLandmarksDetection.Keypoint[]
  right: faceLandmarksDetection.Keypoint[]
}, scaleFactor: number
): { width: number; height: number } {
  const leftWidth = getWidth(keypoints.left)
  const rightWidth = getWidth(keypoints.right)
  const width = leftWidth > rightWidth ? leftWidth * scaleFactor : rightWidth * scaleFactor

  // ODD eye is wider than it is tall
  const height = width / 0.97

  return { width, height }
}

/**
 * Prepare ODD eye
 *
 * @param width target width
 * @param height target height
 * @returns ODD eye as a blob
 */
async function prepareEye(width: number, height: number): Promise<Blob> {
  const preset = presets.offscreen()
  const canvas = new OffscreenCanvas(0, 0)
  const ctx = canvas.getContext('2d')

  const v = await Canvg.from(ctx, '../eye.svg', preset)
  v.resize(width, height)
  await v.render()

  return await canvas.convertToBlob()
}

/**
 * Calculate Y offset over the actual eye.
 * 
 * The ODD eye is rounder and taller than actual eyes. We often need
 * to translate it up on the actual eye.
 * 
 * @param oddWidth width of the ODD eye
 * @param keypoints actual eye keypoints
 * @returns 
 */
function getYTranslation(oddWidth: number, keypoints: faceLandmarksDetection.Keypoint[]): number {
  const height = getHeight(keypoints)

  return oddWidth - height > 0 ? (oddWidth - height) / 2 : 0
}


// Utils

export async function fileToUint8Array(file: File): Promise<Uint8Array> {
  return new Uint8Array(
    await new Blob([ file ]).arrayBuffer()
  )
}

function getWidth(keypoints: faceLandmarksDetection.Keypoint[]): number {
  return Math.max(...keypoints.map(keypoint => keypoint.x)) - Math.min(...keypoints.map(keypoint => keypoint.x))
}

function getHeight(keypoints: faceLandmarksDetection.Keypoint[]): number {
  return Math.max(...keypoints.map(keypoint => keypoint.y)) - Math.min(...keypoints.map(keypoint => keypoint.y))
}


// Checks

export async function checkInitialize(fs: odd.FileSystem): Promise<void> {
  /**
   * Hey there! You might be inspecting this check to look for a hint. We have
   * lightly obfuscated this check to make that slightly harder, but go ahead and
   * de-obfuscate if that's your preferred method of arriving at a solution.
   */

  // @ts-ignore Ignore intentional obfuscation
  const exists = await fs.exists(odd.path.directory(atob('cHVibGlj'), atob('YXZhdGFycw==')))

  console.log(
    `Checking initialize activity: %c${exists ? 'Looks good!👌' : 'Avatars directory is missing.'}`,
    `${exists ? 'color: #15803D' : 'color: #DC2626'}`
  )
}

export async function checkSaveAvatar(fs: odd.FileSystem, avatarName: string): Promise<void> {
  const obfuscatedFileName = btoa([String(avatarName)].join(''))

  // @ts-ignore Ignore intentional obfuscation
  const exists = await fs.exists(odd.path.file(atob('cHVibGlj'), atob('YXZhdGFycw=='), atob(obfuscatedFileName)))

  console.log(
    `Checking saveAvatar activity: %c${exists ? `${atob(obfuscatedFileName)} was found.💯` : `${atob(obfuscatedFileName)} was not found.`}`,
    `${exists ? 'color: #15803D' : 'color: #DC2626'}`
  )
}

export async function checkDeleteAvatar(fs: odd.FileSystem, avatarName: string): Promise<void> {
  const obfuscatedFileName = btoa([String(avatarName)].join(''))

  // @ts-ignore Ignore intentional obfuscation
  const exists = await fs.exists(odd.path.file(atob('cHVibGlj'), atob('YXZhdGFycw=='), atob(obfuscatedFileName)))

  console.log(
    `Checking deleteAvatar activity: %c${exists ? `${atob(obfuscatedFileName)} was not deleted.` : `${atob(obfuscatedFileName)} was deleted.💯`}`,
    `${exists ? 'color: #DC2626' : 'color: #15803D'}`
  )
}


// UI State and Controls

export type AvatarsState = {
  selectedArea: Area
}

export const AREAS = [ 'Transmogrify', 'Summon' ] as const
export type Area = typeof AREAS[ number ]