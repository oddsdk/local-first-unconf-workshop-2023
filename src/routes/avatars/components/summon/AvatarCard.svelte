<script lang="ts">
  import type { Avatar } from '$routes/avatars/lib/avatars'

  export let avatar: Avatar
  export let openModal: (avatar: Avatar) => void
</script>

<div
  class="relative group w-full aspect-[22/23] rounded-lg border-2 border-transparent hover:border-base-content box-border overflow-hidden transition-colors ease-in"
  on:click={() => openModal(avatar)}
  on:keypress={() => openModal(avatar)}
>
  <div
    class="flex items-center justify-center absolute z-10 top-0 right-0 bottom-0 left-0 bg-[#00000035] opacity-0 group-hover:opacity-100 transition-opacity ease-in"
  />
  <div class="relative pb-[105%]">
    <img
      class="absolute block object-cover object-center w-full h-full"
      alt={`Avatar: ${avatar.name}`}
      src={avatar.src}
    />
  </div>
</div>
