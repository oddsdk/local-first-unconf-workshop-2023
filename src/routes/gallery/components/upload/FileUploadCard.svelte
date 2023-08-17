<script lang="ts">
  import { galleryStore } from '$routes/gallery/stores'
  import { handleFileInput } from '$routes/gallery/lib/gallery'
  import FileUploadIcon from '$routes/gallery/components/icons/FileUploadIcon.svelte'

  // Handle files uploaded directly through the file input
  let files: FileList
  $: if (files) {
    handleFileInput(files)
  }
</script>

<label
  for="upload-file"
  class="group btn btn-primary !p-0 !h-auto flex flex-col justify-center items-center aspect-[22/23] object-cover overflow-hidden transition-colors ease-in  box-content cursor-pointer"
>
  {#if $galleryStore.loading}
    <div class="flex justify-center items-center p-12">
      <div
        class="loader ease-linear rounded-full border-4 border-t-4 border-t-odd-gray-100 border-odd-blue-500 h-16 w-16 animate-spin"
      />
    </div>
  {:else}
    <div class="flex flex-col justify-center items-center pt-5 pb-6">
      <FileUploadIcon />
      <p class="mt-2 text-body-sm">
        <span class="font-bold text-body-sm">Upload a photo</span>
      </p>
      <p class="text-body-xs">SVG, PNG, JPG or GIF</p>
    </div>
    <input
      bind:files
      id="upload-file"
      type="file"
      multiple
      accept="image/*"
      class="hidden"
    />
  {/if}
</label>
