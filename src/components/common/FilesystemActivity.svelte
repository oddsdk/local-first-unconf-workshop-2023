<script lang="ts">
  export let activity: 'Initializing' | 'Loading'
</script>

<div class="flex min-h-[80vh] min-w-full justify-center items-center">
  <div class="min-w-[50vw] flex flex-row justify-center items-center">
    <span
      class="rounded-full border-4 border-t-4 border-t-base-content border-base-100 w-8 h-8 inline-block animate-spin mr-4"
    />
    <h3 class="text-heading-lg">
      {activity} file system...
    </h3>
  </div>
</div>
