import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

import type { AvatarsState } from '$routes/avatars/lib/avatars'


export const avatarsStore: Writable<AvatarsState> = writable({
  selectedArea: 'Transmogrify'
})