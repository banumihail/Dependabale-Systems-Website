import { useEffect, useRef, useCallback } from 'react'

export default function useScrollReveal(deps = []) {
  const ref = useRef(null)
  const observerRef = useRef(null)

  const setupObserver = useCallback(() => {
    // Disconnect previous observer if any
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    )

    observerRef.current = observer

    const el = ref.current
    if (el) {
      const fadeElements = el.querySelectorAll('.fade-in')
      fadeElements.forEach((elem) => observer.observe(elem))
    }

    return observer
  }, [])

  useEffect(() => {
    const observer = setupObserver()

    // Also use a MutationObserver to catch dynamically added .fade-in elements
    const el = ref.current
    let mutationObserver
    if (el) {
      mutationObserver = new MutationObserver(() => {
        // Re-observe all .fade-in elements whenever DOM children change
        const fadeElements = el.querySelectorAll('.fade-in:not(.visible)')
        fadeElements.forEach((elem) => observer.observe(elem))
      })
      mutationObserver.observe(el, { childList: true, subtree: true })
    }

    return () => {
      observer.disconnect()
      if (mutationObserver) mutationObserver.disconnect()
    }
  }, deps)

  return ref
}
