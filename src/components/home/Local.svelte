<script lang="ts">
  import { goto } from '$app/navigation'
</script>

<div
  class="min-h-[calc(100vh-128px)] md:min-h-[calc(100vh-160px)] py-8 flex flex-col items-start max-w-[690px] m-auto gap-10 text-body-m"
>
  <h1 class="text-heading-lg">Welcome!</h1>

  <div class="flex flex-col items-start justify-center gap-5">
    <h2 class="text-heading-m">Photo Gallery Demo</h2>
    <p>
      The ODD SDK makes it easy to implement private, encrypted, user-owned
      storage in your app. See it in action with our photo gallery demo.
    </p>
    <a class="btn btn-primary" href="/gallery">Try the Demo</a>
  </div>

  <div class="flex flex-col items-start justify-center gap-5">
    <h2 class="text-heading-m">Account Creation Demo</h2>
    <p>
      You have a local-first file system already on this device, but you haven’t
      yet created an account. You’ll need an account in order to backup your
      file system and access it on your other devices — or browsers.
    </p>
    <button class="btn btn-primary" on:click={() => goto('/register')}>
      Create Your Account
    </button>
  </div>
</div>
