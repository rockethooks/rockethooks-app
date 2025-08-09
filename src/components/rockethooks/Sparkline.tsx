import type * as React from 'react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

export interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  showTooltip?: boolean
  gradient?: boolean
  className?: string
}

/**
 * Sparkline component - lightweight chart for activity visualization
 *
 * @example
 * ```tsx
 * <Sparkline data={[1, 5, 3, 8, 2, 9, 4]} />
 * <Sparkline data={responseTimeData} color="text-success" gradient />
 * <Sparkline data={errorRateData} showTooltip width={120} height={40} />
 * ```
 */
function Sparkline({
  data,
  width = 80,
  height = 24,
  color = 'text-primary',
  showTooltip = false,
  gradient = false,
  className,
}: SparklineProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number
    value: number
    x: number
    y: number
  } | null>(null)

  if (data.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center text-muted-foreground text-xs',
          className
        )}
        style={{ width, height }}
      >
        No data
      </div>
    )
  }

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1 // Prevent division by zero

  // Create SVG path
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${String(x)},${String(y)}`
    })
    .join(' ')

  const pathD =
    data.length > 1
      ? `M ${points.split(' ').join(' L ')}`
      : `M 0,${String(height / 2)} L ${String(width)},${String(height / 2)}`

  // Create area path for gradient fill
  const areaD =
    data.length > 1
      ? `${pathD} L ${String(width)},${String(height)} L 0,${String(height)} Z`
      : `M 0,${String(height)} L ${String(width)},${String(height)} L ${String(width)},${String(height / 2)} L 0,${String(height / 2)} Z`

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!showTooltip) return

    const rect = event.currentTarget.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const dataIndex = Math.round((mouseX / width) * (data.length - 1))
    const clampedIndex = Math.max(0, Math.min(data.length - 1, dataIndex))

    const pointValue = data[clampedIndex]
    if (pointValue === undefined) return

    setHoveredPoint({
      index: clampedIndex,
      value: pointValue,
      x: (clampedIndex / (data.length - 1)) * width,
      y: height - ((pointValue - min) / range) * height,
    })
  }

  const handleMouseLeave = () => {
    if (showTooltip) {
      setHoveredPoint(null)
    }
  }

  const gradientId = `sparkline-gradient-${Math.random().toString(36).substring(2, 11)}`

  return (
    <div className={cn('relative inline-block', className)}>
      <svg
        width={width}
        height={height}
        className={cn('overflow-visible', color)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="img"
        aria-label={`Sparkline chart with ${String(data.length)} data points ranging from ${min.toFixed(1)} to ${max.toFixed(1)}`}
      >
        {gradient && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        )}

        {gradient && (
          <path
            d={areaD}
            fill={`url(#${gradientId})`}
            className="transition-all duration-300"
          />
        )}

        <path
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />

        {hoveredPoint && (
          <circle
            cx={hoveredPoint.x}
            cy={hoveredPoint.y}
            r="2"
            fill="currentColor"
            className="transition-all duration-150"
          />
        )}
      </svg>

      {/* Tooltip */}
      {showTooltip && hoveredPoint && (
        <div
          className="absolute z-10 px-2 py-1 text-xs font-medium text-white bg-black rounded shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: hoveredPoint.x,
            top: hoveredPoint.y - 30,
            transform: 'translateX(-50%)',
          }}
        >
          {hoveredPoint.value.toFixed(1)}
        </div>
      )}
    </div>
  )
}

export { Sparkline }
