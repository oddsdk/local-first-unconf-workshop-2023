<script lang="ts">
  import { goto } from '$app/navigation'

  import { filesystemStore, sessionStore } from '../../../stores'
  import { setBackupStatus } from '$lib/auth/backup'

  const skipBackup = () => {
    setBackupStatus($filesystemStore, { created: false })

    sessionStore.update(session => ({
      ...session,
      backupCreated: false
    }))

    goto('/')
  }
</script>

<input type="checkbox" id="are-you-sure-modal" checked class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative text-center">
    <div>
      <h3 class="mb-8 text-heading-lg">Are you sure?</h3>
      <p class="mb-7">
        Without a backup device, if you lose this device or reset your browser,
        you will not be able to recover your account data.
      </p>

      <button
        class="mb-4 btn btn-primary"
        on:click={() => goto('/delegate-account')}
      >
        Connect a backup device
      </button>
      <button
        class="btn btn-clear"
        on:click={skipBackup}
      >
        YOLO&mdash;I'll risk just one device for now
      </button>
    </div>
  </div>
</div>
