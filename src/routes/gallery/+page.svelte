<script lang="ts">
  import { AREAS, galleryStore } from '$routes/gallery/stores'
  import Dropzone from '$routes/gallery/components/upload/Dropzone.svelte'
  import ImageGallery from '$routes/gallery/components/imageGallery/ImageGallery.svelte'

  /**
   * Tab between the public/private areas and load associated images
   * @param area
   */
  const handleChangeTab: (area: AREAS) => void = area =>
    galleryStore.update(store => ({
      ...store,
      selectedArea: area
    }))
</script>

<div class="mt-6 p-2 mb-14">
  <h1 class="text-heading-lg mb-4">Photo Gallery</h1>
  <div class="flex justify-content-start">
    <div class="tabs border-2 overflow-hidden border-base-content">
      {#each Object.keys(AREAS) as area}
        <button
          on:click={() => handleChangeTab(AREAS[area])}
          class="tab font-sans uppercase text-heading-sm ease-in {$galleryStore.selectedArea ===
          AREAS[area]
            ? 'tab-active bg-base-content text-base-100'
            : 'bg-base-100 text-base-content'}"
        >
          {AREAS[area]}
        </button>
      {/each}
    </div>
  </div>

  <Dropzone>
    <ImageGallery />
  </Dropzone>
</div>
