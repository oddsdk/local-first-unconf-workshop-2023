<script lang="ts">
  import { sessionStore } from '../../../stores'
  import WelcomeCheckIcon from '$components/icons/WelcomeCheckIcon.svelte'

  import { createEventDispatcher } from 'svelte'
  import { goto } from '$app/navigation'

  import { appName } from '$lib/app-info'
  import type { BackupView } from '$lib/views'

  const dispatch = createEventDispatcher()

  const navigate = (view: BackupView) => {
    dispatch('navigate', { view })
  }
</script>

<div class="flex min-h-[80vh] min-w-full justify-center items-center">
  <div class="min-w-[50vw] flex flex-col items-center text-center text-body-lg">
    <h1 class="text-heading-xl">
      Welcome, {$sessionStore.username.trimmed}!
    </h1>
    <div
      class="flex justify-center my-16 text-odd-green-500 dark:text-odd-green-300"
    >
      <WelcomeCheckIcon />
    </div>
    <p class="mb-4">Your account has been created.</p>
    <p class="mb-8">
      Your account & data live only on your devices. We recommend connecting at
      least one additional device.
    </p>
    <button
      class="mb-4 btn btn-primary"
      on:click={() => goto('/delegate-account')}
    >
      Connect a backup device
    </button>
    <a class="mb-4 btn btn-outline" href="/backup?view=are-you-sure">
      Skip for now
    </a>
    <div class="">
      <input type="checkbox" id="password-message" class="peer hidden" />
      <label
        class="btn btn-clear hover:cursor-pointer peer-checked:hidden"
        for="password-message"
      >
        Wait&mdash;what's my password?
      </label>
      <p class="text-body-m hidden peer-checked:block">
        You don't need a password! {appName} uses public key cryptography to authenticate
        you with this device.
      </p>
    </div>
  </div>
</div>
