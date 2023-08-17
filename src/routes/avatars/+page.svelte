<script lang="ts">
  import { type Area, AREAS } from './lib/avatars'

  import { sessionStore } from '$src/stores'
  import { avatarsStore } from '$routes/avatars/stores'
  import Summon from '$routes/avatars/components/Summon.svelte';
  import Transmogrify from '$routes/avatars/components/Transmogrify.svelte';

  function handleChangeTab(area: Area) {
    avatarsStore.update(store => ({
      ...store,
      selectedArea: area
    }))
  }
</script>

<div class="mt-6 p-2 mb-14">
  <h1 class="text-heading-lg mb-4">ODD Avatar Generator</h1>
  {#if $sessionStore.session}
    <div class="flex justify-content-start mb-8">
      <div class="tabs border-2 overflow-hidden border-base-content">
        {#each AREAS as area}
          <button
            on:click={() => handleChangeTab(area)}
            class="tab font-sans uppercase text-heading-sm ease-in {$avatarsStore.selectedArea ===
            area
              ? 'tab-active bg-base-content text-base-100'
              : 'bg-base-100 text-base-content'}"
          >
            {area}
          </button>
        {/each}
      </div>
    </div>

    {#if $avatarsStore.selectedArea === 'Transmogrify'}
      <Transmogrify />
    {:else if $avatarsStore.selectedArea === 'Summon'}
      <Summon />
    {/if}
  {/if}
</div>
