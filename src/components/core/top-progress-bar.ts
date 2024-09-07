'use client'
import Router from 'next/router'
import NProgress from 'nprogress'

let timer: NodeJS.Timeout | undefined
let state: 'loading' | 'stop' | undefined
let activeRequests = 0
const delay = 250

function load() {
  if (state === 'loading') {
    return
  }

  state = 'loading'

  timer = setTimeout(() => {
    NProgress.start()
  }, delay)
}

function stop() {
  if (activeRequests > 0) {
    return
  }

  state = 'stop'

  if (timer) {
    clearTimeout(timer)
  }
  NProgress.done()
}

Router.events.on('routeChangeStart', load)
Router.events.on('routeChangeComplete', stop)
Router.events.on('routeChangeError', stop)

const originalFetch = window.fetch
window.fetch = async function (...args: Parameters<typeof originalFetch>) {
  if (activeRequests === 0) {
    load()
  }

  activeRequests++

  try {
    const response = await originalFetch(...args)
    return response
  } catch (error) {
    return Promise.reject(error)
  } finally {
    activeRequests -= 1
    if (activeRequests === 0) {
      stop()
    }
  }
}

export default function NProgressHandler() {
  return null
}
