import * as odd from '@oddjs/odd'
import { get as getStore } from 'svelte/store'

import { appName } from '$lib/app-info'
import { filesystemStore, getStartedViewedStore } from '$src/stores'

type Username = {
  full: string
  hashed: string
  trimmed: string
}

export type Session = {
  username: Username
  session: odd.Session | null
  authStrategy: odd.AuthenticationStrategy | null
  program: odd.Program
  loading: boolean
  backupCreated: boolean
  error?: SessionError
}

type SessionError = 'Insecure Context' | 'Unsupported Browser'

export const errorToMessage = (error: SessionError): string => {
  switch (error) {
    case 'Insecure Context':
      return `${appName} requires a secure context (HTTPS)`

    case 'Unsupported Browser':
      return `Your browser does not support ${appName}`
  }
}

// Track whether the user has viewed the initial landing page. This
// page should only be viewed once across devices.

export type Started = {
  viewed: boolean
}

export async function setGetStartedViewed(): Promise<void> {
  const fs = getStore(filesystemStore)
  const path = odd.path.file('public', 'viewed-get-started')

  if (fs) {
    await fs.write(path, new TextEncoder().encode(JSON.stringify({ viewed: true })))
    await fs.publish()
  } else {
    console.error('File system not avaialable to write data.')
  }

  getStartedViewedStore.set(true)
}

export async function viewedGetStarted(): Promise<boolean> {
  const fs = getStore(filesystemStore)
  const path = odd.path.file('public', 'viewed-get-started')

  if (fs && await fs.exists(path)) {
    const started = JSON.parse(new TextDecoder().decode(
      await fs.read(path)
    )) as Started

    return started.viewed
  } else {
    return false
  }
}
