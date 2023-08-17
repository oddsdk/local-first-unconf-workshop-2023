<script lang="ts">
  import * as odd from '@oddjs/odd'
  import { onDestroy } from 'svelte'
  import clipboardCopy from 'clipboard-copy'

  import { checkDeleteAvatar, fileToUint8Array, getAvatarsFromListing, getContentCID, type Avatar } from '$routes/avatars/lib/avatars'
  import { filesystemStore, themeStore } from '$src/stores'
  import AvatarCard from '$routes/avatars/components/summon/AvatarCard.svelte'
  import AvatarModal from '$routes/avatars/components/summon/AvatarModal.svelte'

  let fs: odd.FileSystem
  let avatars: Avatar[] = []
  let cidQuery = ''
  let isModalOpen: boolean
  let selectedAvatar: Avatar = null

  const unsubscribeFileSystemStore = filesystemStore.subscribe(fileSystem => {
    fs = fileSystem
  })

  async function loadAvatars() {
    if (fs) {
      /**
       * Load stored avatars from the file system.
       *
       * We want to load and display avatars when we view the summon tab.
       * In this activity, we'll get a listing of the contents in the
       * avatars directory. We've provided code for parsing the listing
       * into an array of avatars.
       */

      /**
       * TODO Create a path object for the avatars directory. See
       * the instructions in Transmogrify.svelte and complete the Transmogrify
       * exercises before starting this one.
       *
       * See the path documentation for path examples: https://docs.odd.dev/file-system-wnfs#paths
       */
      const path = null

      /**
       * TODO List the contents of the avatars directory.
       *
       * The file system interface has a function to list directory contents:
       * https://docs.odd.dev/file-system-wnfs#ls
       *
       * To be safe, check that the directory exists before listing its contents.
       */
      const exists = null

      if (exists) {
        // TODO List the contents of the avatars directory
        const listing = null

        avatars = await getAvatarsFromListing(listing, fs)
      }
    }
  }

  async function deleteAvatar(event: CustomEvent<{ avatar: Avatar }>) {
    const { avatar } = event.detail

    console.log('Avatar to delete:', avatar)

    if (fs) {
      /**
       * Delete an avatar from the avatars directory.
       */

      /**
       * TODO Create a file path for the avatar. The file path should include each
       * path segment from the avatars directory followed by the file name.
       *
       * See the path documentation for path examples: https://docs.odd.dev/file-system-wnfs#paths
       */
      const path = null

      /**
       * Delete the file from the avatars directory.
       *
       * The file system interface has a delete function for deleting files:
       * https://docs.odd.dev/file-system-wnfs#rm
       *
       * Use the path we created above to delete the file.
       */

      // TODO Delete the file

      // Publish the change to IPFS
      await fs.publish()

      /**
       * This function checks your answer and logs the result to the devtools console.
       */
      await checkDeleteAvatar(fs, avatar.name)
    }
  }

  async function copyCID(event: CustomEvent<{ fileName: string }>) {
    const { fileName } = event.detail

    if (fs) {
      /**
       * Content identifiers (CIDs) are labels that point to content on
       * IPFS using content addressing. Read the IPFS docs for more information
       * about CIDs: https://docs.ipfs.tech/concepts/content-addressing/
       */
      const cid = await getContentCID(fileName, fs)
      await clipboardCopy(cid)
    }
  }

  async function openLink(event: CustomEvent<{ fileName: string }>) {
    const { fileName } = event.detail

    if (fs) {
      const cid = await getContentCID(fileName, fs)

      /**
       * We can view data on IPFS using an HTTP gateway. Content on IPFS
       * is distributed across IPFS nodes, which means we can view data on
       * any IPFS node that exposes an HTTP gateway.
       *
       * TODO The URL below links to a avatar on the Fission HTTP gateway.
       * Replace "ipfs.runfission.com" with "ipfs.io" to view the avatar on
       * the Protocol Labs HTTP gateway.
       */
      const url = `https://ipfs.runfission.com/ipfs/${cid}/userland`

      window.open(url, '_newtab')
    }
  }

  async function addAvatar() {
    /**
     * OPTIONAL ADVANCED ACTIVITY
     *
     * Add a an avatar loaded by CID from an HTTP gateway.
     *
     * The openLink function above shows how to view avatars on IPFS
     * once saved to the file system and published. We can also load an
     * avatar from an HTTP gateway and add it to our collection.
     *
     * Fetch an avatar using the cidQuery variable and write it to the
     * avatars directory. The avatar will be a Blob with a blob.type that
     * contains it MIME type. The file name won't be available, but we can use
     * the CID for the file name with an extension derived from blob.type.
     *
     * You won't be able to add an avatar that is already in your file
     * system, so ask one of your neighbors for a CID to test your implementation.
     */
  }

  $: {
    // Open modal when an avatar is selected
    isModalOpen = selectedAvatar !== null
  }

  onDestroy(unsubscribeFileSystemStore)

  loadAvatars()
</script>

<section
  class="min-h-[calc(100vh-190px)] overflow-hidden {$themeStore.selectedTheme ===
  'light'
    ? 'text-gray-800'
    : 'text-gray-200'}"
>
  <div
    class="grid grid-flow-row grid-rows-[2rem_auto] gap-8 w-full min-h-[calc(100vh-190px)]"
  >
    <div class="grid grid-flow-col grid-cols-[1fr_4rem] gap-2">
      <input
        class="w-full p-2 bg-base-100 border-2 border-base-content rounded text-base-content"
        type="text"
        placeholder="Enter a CID"
        bind:value={cidQuery}
      />
      <button
        class="btn btn-primary"
        on:click|preventDefault={addAvatar}
        on:keypress|preventDefault={addAvatar}
      >
        Add
      </button>
    </div>

    <div
      class="grid grid-cols-2 lg:grid-cols-4 xl:lg:grid-cols-6 gap-4"
    >
      {#each avatars as avatar}
        <AvatarCard {avatar} openModal={() => (selectedAvatar = avatar)} />
      {/each}
    </div>
  </div>

  {#if selectedAvatar}
    <AvatarModal
      bind:isModalOpen
      {selectedAvatar}
      {avatars}
      on:close={() => (selectedAvatar = null)}
      on:copycid={copyCID}
      on:delete={deleteAvatar}
      on:openlink={openLink}
    />
  {/if}
</section>
