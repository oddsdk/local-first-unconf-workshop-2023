<script lang="ts">
  import { getStartedViewedStore, sessionStore } from '$src/stores'
  import Authed from '$components/home/Authed.svelte'
  import GetStarted from '$components/home/GetStarted.svelte'
  import Local from '$components/home/Local.svelte'
</script>

{#if $sessionStore?.session}
  <Authed />
{:else if $getStartedViewedStore}
  <Local />
{:else}
  <GetStarted />
{/if}
