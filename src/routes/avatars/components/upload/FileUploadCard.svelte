<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { transmogrify } from '$routes/avatars/lib/avatars'
  import FileUploadIcon from '$routes/avatars/components/icons/FileUploadIcon.svelte'

  const dispatch = createEventDispatcher()
  let input

  async function handleFileInput(event: { currentTarget: HTMLInputElement }) {
    const avatars = await transmogrify(event.currentTarget.files)

    if (avatars.length > 0) {
      dispatch('save', { avatar: avatars[0] })
    }

    input['value'] = null
  }
</script>

<label
  for="upload-file"
  class="btn btn-primary !p-0 !h-40 flex flex-col justify-center items-center aspect-[22/23] object-cover overflow-hidden transition-colors ease-in  box-content cursor-pointer"
>
  <div class="flex flex-col justify-center items-center pt-5 pb-6">
    <FileUploadIcon />
    <span class="mt-2 font-bold text-body-sm">Upload a photo</span>
    <p class="text-body-xs">SVG, PNG, JPG or GIF</p>
  </div>
  <input
    bind:this={input}
    id="upload-file"
    type="file"
    multiple={false}
    accept="image/*"
    class="hidden"
    on:input={handleFileInput}
  />
</label>
