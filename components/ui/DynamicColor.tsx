"use client"

import { useEffect, useRef } from "react"

interface DynamicColorProps {
  primaryColor: string
  secondaryColor?: string
  children: React.ReactNode
  className?: string
}

/**
 * Component that sets CSS custom properties for dynamic colors without inline styles
 * This allows CSS modules to access dynamic colors via data attributes
 */
export function DynamicColor({ primaryColor, secondaryColor, children, className }: DynamicColorProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty('--roster-primary', primaryColor)
      ref.current.style.setProperty('--roster-secondary', secondaryColor || primaryColor)
    }
  }, [primaryColor, secondaryColor])

  return (
    <div
      ref={ref}
      className={className}
      data-primary-color={primaryColor}
      data-secondary-color={secondaryColor || primaryColor}
    >
      {children}
    </div>
  )
}
