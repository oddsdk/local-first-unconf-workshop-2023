<script lang="ts">
  import { goto } from '$app/navigation'

  import { sessionStore } from '../../stores'
</script>

<div
  class="min-h-[calc(100vh-128px)] md:min-h-[calc(100vh-160px)] py-8 flex flex-col items-start max-w-[690px] m-auto gap-10 text-body-m"
>
  <h1 class="text-heading-lg">Welcome, {$sessionStore.username.trimmed}!</h1>

  <div class="flex flex-col items-start justify-center gap-5">
    <h2 class="text-heading-m">Photo Gallery Demo</h2>
    <p>
      The ODD SDK makes it easy to implement private, encrypted, user-owned
      storage in your app. See it in action with our photo gallery demo.
    </p>
    <a class="btn btn-primary" href="/gallery">Try the Demo</a>
  </div>

  <div class="flex flex-col items-start justify-center gap-5">
    <h2 class="text-heading-m">Device Connection Demo</h2>
    <p>
      With the ODD SDK, a user’s account lives only on their connected devices —
      entirely under their control. It’s easy for them to connect as many
      devices as they’d like. For recoverability, we recommend they always
      connect at least two.
    </p>
    <button class="btn btn-primary" on:click={() => goto('/delegate-account')}>
      Connect an Additional Device
    </button>
  </div>
</div>
