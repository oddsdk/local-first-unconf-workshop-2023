<script lang="ts">
  import { setGetStartedViewed } from '$lib/session'
  import { appName } from '$lib/app-info'
  import { isSupported } from '@oddjs/odd'
  import Alert from '$components/icons/Alert.svelte'

  let supported = false

  async function getStarted() {
    await setGetStartedViewed()
  }

  async function checkSupport() {
    supported = await isSupported()
  }

  checkSupport()
</script>

<div
  class="min-h-[calc(100vh-96px)] flex flex-col items-start justify-center max-w-[560px] m-auto gap-6 pb-5"
>
  <h1 class="text-heading-lg">Welcome to the {appName}</h1>

  <div class="max-w-[590px]">
    <p class="mb-4">
      The ODD SDK is a true local-first edge computing stack. Effortlessly give
      your users:
    </p>

    <ul class="mb-8 pl-10 list-disc">
      <li>
        <span class="font-bold">modern, passwordless accounts</span>
        , without a complex and costly cloud-native back-end
      </li>
      <li>
        <span class="font-bold">user-controlled data</span>
        , secured by default with our encrypted-at-rest file storage protocol
      </li>
      <li>
        <span class="font-bold">local-first functionality</span>
        , including the ability to work offline and collaborate across multiple devices
      </li>
    </ul>

    {#if !supported}
      <div class="p-4 rounded-lg bg-base-content text-neutral-50">
        <h3 class="flex items-center gap-2 text-body-m">
          <span class="-translate-y-[2px]"><Alert /></span>
          Unsupported device
        </h3>
        <p>
          It appears this device isn't supported. ODD requires IndexedDB in
          order to function. This browser doesn't appear to implement this API.
          Are you in a Firefox private window?
        </p>
      </div>
    {:else}
      <div class="flex flex-row items-start gap-4">
        <button
          class="btn btn-primary gap-2"
          on:click={getStarted}
          on:keypress={getStarted}
        >
          Get Started
        </button>
        <a href="/recover" class="btn btn-clear">Recover an account</a>
      </div>
    {/if}
  </div>
</div>
