<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'

  import type { Avatar } from '$routes/avatars/lib/avatars'
  import Download from '$components/icons/Download.svelte'
  import Trash from '$components/icons/Trash.svelte'

  export let selectedAvatar: Avatar
  export let avatars: Avatar[]
  export let isModalOpen: boolean

  let previousAvatar: Avatar | undefined
  let nextAvatar: Avatar | undefined
  let showPreviousArrow: boolean
  let showNextArrow: boolean

  const dispatch = createEventDispatcher()

  /**
   * Clear state and dispatch an event to clear parent state
   */
  function handleCloseModal() {
    selectedAvatar = null
    previousAvatar = null
    nextAvatar = null
    isModalOpen = false

    dispatch('close')
  }

  /**
   * Delete an avatar from the user's WNFS
   */
  async function handleDeleteAvatar() {
    dispatch('delete', { avatar: selectedAvatar })

    handleCloseModal()
  }

  /**
   * Set the previous and next avatars to be toggled to when the arrows are clicked
   */
  function setCarouselState() {
    const currentIndex = avatars.findIndex(
      val => val.name === selectedAvatar.name
    )
    previousAvatar = avatars[currentIndex - 1] ?? avatars[avatars.length - 1]
    nextAvatar = avatars[currentIndex + 1] ?? avatars[0]

    showPreviousArrow = avatars.length > 1 && !!previousAvatar
    showNextArrow = avatars.length > 1 && !!nextAvatar
  }

  /**
   * Load an avatar when a user clicks the Next or Previous arrows
   * @param direction
   */
  function handleNextOrPrevAvatar(direction: 'next' | 'prev') {
    selectedAvatar = direction === 'prev' ? previousAvatar : nextAvatar

    setCarouselState()
  }

  /**
   * Detect `Escape` key presses to close the modal or `ArrowRight`/`ArrowLeft`
   * presses to navigate the carousel
   * @param event
   */
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') handleCloseModal()

    if (showNextArrow && event.key === 'ArrowRight')
      handleNextOrPrevAvatar('next')

    if (showPreviousArrow && event.key === 'ArrowLeft')
      handleNextOrPrevAvatar('prev')
  }

  async function copyCID() {
    dispatch('copycid', { fileName: selectedAvatar.name })
  }

  async function openLink() {
    dispatch('openlink', { fileName: selectedAvatar.name })
  }

  onMount(() => {
    setCarouselState()
  })
</script>

<svelte:window on:keydown={handleKeyDown} />

{#if !!selectedAvatar}
  <input
    type="checkbox"
    id={`avatar-modal-${selectedAvatar.name}`}
    class="modal-toggle"
    bind:checked={isModalOpen}
  />
  <label
    for={`avatar-modal-${selectedAvatar.name}`}
    class="modal cursor-pointer z-50"
    on:click|self={handleCloseModal}
    on:keypress|self={handleCloseModal}
  >
    <div class="modal-box relative text-center text-base-content">
      <label
        for={`avatar-modal-${selectedAvatar.name}`}
        class="btn btn-xs btn-circle absolute right-2 top-2"
        on:click|self={handleCloseModal}
        on:keypress|self={handleCloseModal}
      >
        ✕
      </label>
      <div>
        <h3 class="mb-7 text-body-lg break-all">{selectedAvatar.name}</h3>

        <div class="relative">
          {#if showPreviousArrow}
            <button
              class="absolute top-1/2 -left-[25px] -translate-y-1/2 inline-block text-center text-[40px]"
              on:click={() => handleNextOrPrevAvatar('prev')}
            >
              &#8249;
            </button>
          {/if}
          <img
            class="block object-cover object-center border-2 border-base-content w-full h-full mb-4 rounded-[1rem]"
            alt={`Avatar: ${selectedAvatar.name}`}
            src={selectedAvatar.src}
          />
          {#if showNextArrow}
            <button
              class="absolute top-1/2 -right-[25px] -translate-y-1/2 inline-block text-center text-[40px]"
              on:click={() => handleNextOrPrevAvatar('next')}
            >
              &#8250;
            </button>
          {/if}
        </div>
        <div class="flex flex-col items-center justify-center">
          <button
            class="underline mb-2 hover:text-neutral-500"
            on:click={openLink}
          >
            View on IPFS
          </button>

          <button class="btn mb-2 hover:text-neutral-500" on:click={copyCID}>
            Copy CID
          </button>

          <div
            class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4"
          >
            <a
              href={selectedAvatar.src}
              download={selectedAvatar.name}
              class="btn btn-primary gap-2"
            >
              <Download /> Download Avatar
            </a>
            <button class="btn btn-outline gap-2" on:click={handleDeleteAvatar}>
              <Trash /> Delete Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  </label>
{/if}
