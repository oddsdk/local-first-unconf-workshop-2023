<script lang="ts">
  import { themeStore } from '../stores'

  /**
   * Firefox doesn't fully support background-clip so the marquee text is cut off half way through the animation
   */
  const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1
</script>

<div
  class="fixed z-0 lg:z-20 right-0 bottom-0 left-0 h-8 flex items-center motion-reduce:justify-center motion-safe:justify-end bg-odd-gray-200 dark:bg-odd-gray-400 overflow-x-hidden"
>
  {#if $themeStore.selectedTheme === 'light'}
    <p
      class="motion-safe:animate-marquee motion-safe:left-full whitespace-nowrap font-bold text-body-xs text-odd-gray-500}"
    >
      *** Experimental *** - You are currently previewing ODD SDK Alpha 0.2
    </p>
  {:else}
    <p
      class="motion-safe:animate-marquee motion-safe:left-full whitespace-nowrap font-bold text-body-xs text-odd-yellow-500"
    >
      *** Experimental *** - You are currently previewing ODD SDK Alpha 0.2
    </p>
  {/if}
</div>
