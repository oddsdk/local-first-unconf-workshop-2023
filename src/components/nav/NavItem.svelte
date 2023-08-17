<script lang="ts">
  import { page } from '$app/stores'

  export let handleCloseDrawer
  export let item
</script>

<li>
  {#if item.callback}
    <button
      class="flex py-2 px-0 items-center uppercase justify-start gap-2 font-sans text-heading-sm text-base-content hover:text-odd-pink-500 hover:bg-base-100 ease-in-out duration-[250ms] {$page
        .url.pathname === item.href
        ? '!text-odd-pink-500'
        : ''}"
      on:click={() => {
        handleCloseDrawer()
        item.callback()
      }}
    >
      <svelte:component this={item.icon} />{item.label}
    </button>
  {:else}
    <a
      class="flex py-2 px-0 items-center uppercase justify-start gap-2 font-sans text-heading-sm text-base-content hover:text-odd-pink-500 hover:bg-base-100 ease-in-out duration-[250ms] {$page
        .url.pathname === item.href
        ? '!text-odd-pink-500'
        : ''}"
      href={item.href}
      on:click={handleCloseDrawer}
    >
      <svelte:component this={item.icon} />{item.label}
    </a>
  {/if}
</li>
