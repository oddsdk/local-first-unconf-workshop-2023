import * as odd from '@oddjs/odd'
import { createEmitter, type FileSystem as FileSystemEvents } from '@oddjs/odd/events'
import { isCID } from '@oddjs/odd/fs/types/check'
import { getAvatarsExport, type AvatarsExport } from '$routes/avatars/lib/avatars'
import { setGetStartedViewed, viewedGetStarted } from '$lib/session'
import { type CID, decodeCID, encodeCID } from '@oddjs/odd/common/cid'
import { FileSystem, type Program } from '@oddjs/odd'
import { ACCOUNT_SETTINGS_DIR } from '$lib/account-settings'
import { AREAS } from '$routes/gallery/stores'
import { GALLERY_DIRS, getImagesExport, type ImagesExport } from '$routes/gallery/lib/gallery'
import { filesystemStore } from '$src/stores'

const LOCAL_ONLY_FS_KEY = 'local-only-fs'

function setupHooks(fs: odd.FileSystem, program: Program): void {
  fs.publish = async function () {
    const cid: CID = await this.root.put()
    await program.components.storage.setItem(LOCAL_ONLY_FS_KEY, encodeCID(cid))
    return cid
  }
}

/**
 * Retrieves a local-only filesystem or creates a new filesystem if
 * does not exist.
 * 
 * @param program an ODD program
 */
async function localOnlyFileSystem(program: Program): Promise<odd.FileSystem> {
  const account = { rootDID: await program.agentDID() }
  const dependencies = program.components
  const fsEvents = createEmitter<FileSystemEvents>()

  // Load existing filesystem
  const rootCID = await program.components.storage.getItem(LOCAL_ONLY_FS_KEY)
  if (rootCID && isCID(rootCID)) {
    const existingFs = await FileSystem.fromCID(decodeCID(rootCID), {
      account,
      dependencies,
      eventEmitter: fsEvents,
      localOnly: true
    })

    setupHooks(existingFs, program)
    return existingFs
  }

  // Create a new filesystem
  const newFs = await FileSystem.empty({
    account,
    dependencies,
    eventEmitter: fsEvents,
    localOnly: true
  })

  setupHooks(newFs, program)
  await newFs.publish()

  return newFs
}

export function getLocalOnlyFs(): Promise<odd.FileSystem> {
  return odd
    .program({
      namespace: 'local-only',
      debug: true
    })
    .then(async (program) => {
      return await localOnlyFileSystem(program)
    })
}

export async function initializeLocalOnlyFs(fs: odd.FileSystem): Promise<void> {
  await fs.mkdir(GALLERY_DIRS[ AREAS.PUBLIC ])
  await fs.mkdir(GALLERY_DIRS[ AREAS.PRIVATE ])
}

export const migrateToLocalOnlyFs = async (): Promise<void> => {
  // Load data from synced file system
  const imagesExport = await getImagesExport()
  const avatarsExport = await getAvatarsExport()
  const getStartedViewed = await viewedGetStarted()

  // Use local-only file system
  const localOnlyFS = await getLocalOnlyFs()
  filesystemStore.set(localOnlyFS)

  // Copy over data
  await localOnlyFS.mkdir(GALLERY_DIRS[ AREAS.PUBLIC ])
  await localOnlyFS.mkdir(GALLERY_DIRS[ AREAS.PRIVATE ])
  await localOnlyFS.mkdir(ACCOUNT_SETTINGS_DIR)

  for (const image of imagesExport.public) {
    await localOnlyFS.write(image.path, image.file)
  }

  for (const image of imagesExport.private) {
    await localOnlyFS.write(image.path, image.file)
  }

  for (const avatar of avatarsExport) {
    await localOnlyFS.write(avatar.path, avatar.file)
  }

  if (getStartedViewed) await setGetStartedViewed()
}