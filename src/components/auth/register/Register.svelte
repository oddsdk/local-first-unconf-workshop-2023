<script lang="ts">
  import { get as getStore } from 'svelte/store'

  import { sessionStore } from '$src/stores'
  import {
    createDID,
    prepareUsername,
    register,
    USERNAME_STORAGE_KEY
  } from '$lib/auth/account'
  import FilesystemActivity from '$components/common/FilesystemActivity.svelte'

  let username: string = ''
  let encodedUsername: string = ''
  let usernameValid = true
  let usernameAvailable = true
  let registrationSuccess = true
  let checkingUsername = false

  let initializingFilesystem = false

  const checkUsername = async (event: Event) => {
    const { value } = event.target as HTMLInputElement
    const {
      program: {
        components: { crypto, storage }
      }
    } = getStore(sessionStore)

    username = value
    checkingUsername = true

    /**
     * Create a new DID for the user, which will be appended to their username, concatenated
     * via a `#`, hashed and encoded to ensure uniqueness
     */
    const did = await createDID(crypto)
    const fullUsername = `${value}#${did}`
    await storage.setItem(USERNAME_STORAGE_KEY, fullUsername)

    encodedUsername = await prepareUsername(fullUsername)

    checkingUsername = false
  }

  const registerUser = async (event: Event) => {
    event.preventDefault()

    if (checkingUsername) {
      return
    }

    initializingFilesystem = true

    registrationSuccess = await register(encodedUsername)

    if (!registrationSuccess) initializingFilesystem = false
  }

  $: usernameApproved =
    username.length > 0 &&
    !checkingUsername &&
    usernameValid &&
    usernameAvailable
  $: usernameError =
    username.length > 0 &&
    !checkingUsername &&
    (!usernameValid || !usernameAvailable)

  let existingAccount = false
  const toggleExistingAccount = () => (existingAccount = !existingAccount)
</script>

{#if initializingFilesystem}
  <FilesystemActivity activity="Initializing" />
{:else}
  <div
    class="flex flex-col items-center justify-center gap-4 min-h-[calc(100vh-128px)] md:min-h-[calc(100vh-160px)] max-w-[352px] m-auto"
  >
    <h1 class="text-heading-lg">Connect this device</h1>

    <!-- Registration Form -->
    <form
      on:submit={registerUser}
      class="w-full"
    >
      <h2 class="mb-2 text-heading-sm">Choose a username</h2>
      <div class="relative">
        <input
          id="registration"
          type="text"
          class="input input-bordered border-base-content focus:outline-none w-full px-3 block {usernameApproved
            ? '!border-odd-green-500'
            : ''} {usernameError ? '!border-odd-red-500' : ''}"
          class:input-error={username.length !== 0 &&
            (!usernameValid || !usernameAvailable)}
          on:input={checkUsername}
        />
        {#if checkingUsername}
          <span
            class="rounded-lg border-t-2 border-l-2 border-base-content w-4 h-4 block absolute top-4 right-4 animate-spin"
          />
        {/if}
      </div>

      {#if !registrationSuccess}
        <!-- Error when registration fails -->
        <label for="registration" class="label">
          <span class="text-body-xs !p-0 text-error text-left">
            There was an issue registering your account. Please try again.
          </span>
        </label>
      {/if}

      <div class="text-left mt-2">
        <input
          type="checkbox"
          id="shared-computer"
          class="peer checkbox checkbox-primary border-base-content hover:border-base-content checked:border-base-content rounded-lg border-2 border-base-content transition-colors duration-250 ease-in-out inline-grid align-bottom"
        />
        <!-- Warning when "This is a shared computer" is checked -->
        <label
          for="shared-computer"
          class="cursor-pointer ml-1 text-body-sm grid-inline"
        >
          This is a public or shared computer
        </label>
        <label
          for="registration"
          class="label mt-4 !p-0 hidden peer-checked:block"
        >
          <span class="text-odd-red-400 text-left text-body-sm">
            In order to ensure the security of your private data, the ODD SDK
            does not recommend creating an account from a public or shared
            computer.
          </span>
        </label>
      </div>

      <div class="flex items-center mt-4">
        <button
          class="flex-1 btn btn-primary"
          disabled={username.length === 0 ||
            !usernameValid ||
            !usernameAvailable ||
            checkingUsername}
          type="submit"
        >
          Create your account
        </button>
      </div>
    </form>

    <!-- Existing Account -->
    <div class="flex flex-col gap-5 w-full">
      <button
        class="btn btn-outline !h-[52px] w-full {existingAccount
          ? '!bg-base-content !text-base-100 !border-base-content'
          : ''}"
        on:click={toggleExistingAccount}
      >
        I have an existing account
      </button>
      {#if existingAccount}
        <div
          class="flex flex-col gap-4 p-6 rounded bg-odd-gray-200 text-odd-gray-500"
        >
          <h3 class="text-body-sm text-center">
            Which device are you connected on?
          </h3>
          <p>To connect your existing account, you'll need to:</p>
          <ol class="pl-6 list-decimal">
            <li>Find a device the account is already connected on</li>
            <li>Navigate to your Account Settings</li>
            <li>Click "Connect a new device"</li>
          </ol>
        </div>
      {/if}
    </div>

    <!-- Recovery Link -->
    <a href="/recover" class="btn btn-clear">
      Recover an account
    </a>
  </div>
{/if}
