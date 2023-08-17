<script lang="ts">
  import { accountSettingsStore, sessionStore } from '$src/stores'
  import { getAvatarFromWNFS } from '$lib/account-settings'

  export let size = 'large'

  const sizeClasses =
    size === 'large'
      ? 'w-[88px] h-[88px] text-[40px]'
      : 'w-[32px] h-[32px] text-body-sm'

  const loaderSizeClasses =
    size === 'large' ? 'w-[28px] h-[28px]' : 'w-[16px] h-[16px]'

  getAvatarFromWNFS()
</script>

{#if $accountSettingsStore.avatar}
  {#if $accountSettingsStore.loading}
    <div
      class="flex items-center justify-center object-cover rounded-full {sizeClasses}"
    >
      <span
        class="animate-spin ease-linear rounded-full border-2 border-t-2 border-t-odd-gray-500 border-base-content {loaderSizeClasses}"
      />
    </div>
  {:else}
    <img
      class="object-cover rounded-full border-2 border-base-content {sizeClasses}"
      src={$accountSettingsStore.avatar.src}
      alt="User Avatar"
    />
  {/if}
{:else}
  <div
    class="flex items-center justify-center bg-odd-gray-200 text-odd-gray-500 uppercase font-sans rounded-full {sizeClasses}"
  >
    {$sessionStore.username.trimmed[0]}
  </div>
{/if}
