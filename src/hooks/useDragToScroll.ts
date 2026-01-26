'use client'

import { useEffect, useRef } from 'react'

/**
 * Hook to enable "Grab and Drag" scrolling with a mouse.
 * Useful for kiosk applications where users might expect touch-like behavior.
 */
export default function useDragToScroll() {
    const isDown = useRef(false)
    const startX = useRef(0)
    const startY = useRef(0)
    const scrollLeft = useRef(0)
    const scrollTop = useRef(0)

    useEffect(() => {
        // We target elements with the 'overflow-y-auto' or 'overflow-x-auto' classes
        const containers = document.querySelectorAll('.overflow-y-auto, .overflow-x-auto, .custom-scrollbar')

        const mouseDown = (e: MouseEvent, slider: HTMLElement) => {
            isDown.current = true
            slider.classList.add('active-dragging')
            startX.current = e.pageX - slider.offsetLeft
            startY.current = e.pageY - slider.offsetTop
            scrollLeft.current = slider.scrollLeft
            scrollTop.current = slider.scrollTop
            slider.style.cursor = 'grabbing'
            slider.style.userSelect = 'none'
        }

        const mouseLeave = (slider: HTMLElement) => {
            isDown.current = false
            slider.classList.remove('active-dragging')
            slider.style.cursor = ''
        }

        const mouseUp = (slider: HTMLElement) => {
            isDown.current = false
            slider.classList.remove('active-dragging')
            slider.style.cursor = ''
        }

        const mouseMove = (e: MouseEvent, slider: HTMLElement) => {
            if (!isDown.current) return
            e.preventDefault()
            const x = e.pageX - slider.offsetLeft
            const y = e.pageY - slider.offsetTop
            const walkX = (x - startX.current) * 2 // Scroll speed multiplier
            const walkY = (y - startY.current) * 2
            slider.scrollLeft = scrollLeft.current - walkX
            slider.scrollTop = scrollTop.current - walkY
        }

        containers.forEach((container) => {
            const slider = container as HTMLElement
            // Add visual cues
            slider.style.cursor = 'grab'

            slider.addEventListener('mousedown', (e) => mouseDown(e, slider))
            slider.addEventListener('mouseleave', () => mouseLeave(slider))
            slider.addEventListener('mouseup', () => mouseUp(slider))
            slider.addEventListener('mousemove', (e) => mouseMove(e, slider))
        })

        return () => {
            containers.forEach((container) => {
                const slider = container as HTMLElement
                slider.removeEventListener('mousedown', (e) => mouseDown(e, slider))
                slider.removeEventListener('mouseleave', () => mouseLeave(slider))
                slider.removeEventListener('mouseup', () => mouseUp(slider))
                slider.removeEventListener('mousemove', (e) => mouseMove(e, slider))
            })
        }
    }, [])
}
