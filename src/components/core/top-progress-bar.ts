'use client'
import { useEffect } from 'react'
import Router from 'next/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
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
    NProgress.configure({
      showSpinner: true,
      minimum: 0.1,
      easing: 'ease',
      speed: 800
    })
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

function handleFetch() {
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
}

export default function NProgressHandler() {
  useEffect(() => {
    Router.events.on('routeChangeStart', load)
    Router.events.on('routeChangeComplete', stop)
    Router.events.on('routeChangeError', stop)
    handleFetch()
    return () => {
      Router.events.off('routeChangeStart', load)
      Router.events.off('routeChangeComplete', stop)
      Router.events.off('routeChangeError', stop)
    }
  }, [])

  return null
}
