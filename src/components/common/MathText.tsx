import type { FC } from 'react'
import { renderMathHtml } from '../../lib/math'

interface Props {
  text?: string | null
  className?: string
  as?: 'span' | 'div' | 'p' | 'h3'
}

export const MathText: FC<Props> = ({ text, className = '', as: Tag = 'span' }) => {
  if (!text) return null

  return (
    <Tag
      className={`math-content [&_.katex]:text-inherit [&_.katex-display]:my-2 ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMathHtml(text) }}
    />
  )
}
