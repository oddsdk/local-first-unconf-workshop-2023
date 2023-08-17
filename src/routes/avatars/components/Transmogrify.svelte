<script lang="ts">
  import * as odd from '@oddjs/odd'
  import { onDestroy } from 'svelte'
  import FileUploadCard from '$routes/avatars/components/upload/FileUploadCard.svelte'

  import { type Avatar, checkInitialize, checkSaveAvatar, fileToUint8Array } from '$routes/avatars/lib/avatars'
  import { filesystemStore, themeStore } from '$src/stores'

  let fs: odd.FileSystem

  const unsubscribeFileSystemStore = filesystemStore.subscribe(fileSystem => {
    fs = fileSystem
  })

  async function initialize() {
    if (fs) {
      /**
       * Create an avatars directory.
       *
       * We will store avatars in an avatars directory in WNFS. Our first step
       * is to create the directory if it doesn't already exist. Fill in the
       * steps below to complete this activity.
       */

      /**
       * TODO Create a path object for the avatars directory.
       *
       * WNFS has public and private file system directories. We want to store avatars
       * in a "avatars" directory in the public directory. Our path should be like
       * "public/avatars/". Note that you won't need to create a "public" directory.
       *
       * See the path documentation for path examples: https://docs.odd.dev/file-system-wnfs#paths
       */
      const path = null

      /**
       * TODO Check if the directory exists and create it if not.
       *
       * The file system interface has functions to check for existence or make a directory.
       *   - Exists: https://docs.odd.dev/file-system-wnfs#exists
       *   - Make directory: https://docs.odd.dev/file-system-wnfs#mkdir
       *
       * Use the path we created above when calling these functions.
       */
      const exists = null

      if (!exists) {
        // TODO Create the avatars directory

        /**
         * We've created our directory locally but also want to publish it to IPFS.
         * The file system's publish function does this for us.
         */
        await fs.publish()
      }

      /**
       * This function checks your answer and logs the result to the devtools console.
       *
       * See https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools
       * for help opening the devtools and select the Console tab once you have opened them.
       */
      await checkInitialize(fs)
    }
  }

  async function saveAvatar(event: CustomEvent<{ avatar: Avatar }>) {
    const { avatar } = event.detail

    console.log('Avatar to save:', avatar)

    if (fs) {
      /**
       * Save an avatar to the avatars directory.
       *
       * We save the avatar after we have transmogrified an image uploaded by the user.
       * We'll use the name of the image as our file name.
       */

      /**
       * TODO Create a file path for the avatar. The file path should include each
       * path segment from the avatars directory followed by a file name.
       * 
       * The avatar object passed to this function has an image name we can use
       * for our file name.
       *
       * See the path documentation for path examples: https://docs.odd.dev/file-system-wnfs#paths
       */
      const path = null

      /**
       * Write the file to the avatars directory.
       *
       * The file system interface has a write function for saving files:
       * https://docs.odd.dev/file-system-wnfs#write
       *
       * Use the path we created above to write the file as bytes.
       */
      const bytes = await fileToUint8Array(avatar.file)

      // TODO Write the file

      // Publish the change to IPFS
      await fs.publish()

      /**
       * This function checks your answer and logs the result to the devtools console.
       */
      await checkSaveAvatar(fs, avatar.name)

      /**
       * OPTIONAL ADVANCED ACTIVITY
       *
       * Update this function to accept multiple avatars and write them to WNFS.
       * This optional activity will require changes to `src/routes/avatars/components/upload/FileUploadCard.svelte`.
       */
    }
  }

  initialize()

  onDestroy(unsubscribeFileSystemStore)
</script>

<section class="min-h-[calc(100vh-190px)] overflow-hidden">
  <FileUploadCard on:save={saveAvatar} />
</section>
