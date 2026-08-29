import katex from 'katex'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderLatex(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex.trim(), {
      displayMode,
      throwOnError: false,
      output: 'html',
      strict: 'ignore',
      trust: false,
    })
  } catch {
    return `<code>${escapeHtml(latex)}</code>`
  }
}

const SHAPES: Record<string, string> = {
  triangle: `<svg viewBox="0 0 220 160" class="math-shape" aria-label="مثلث"><polygon points="110,18 20,142 200,142" fill="#0f2744" stroke="#67e8f9" stroke-width="3"/><text x="110" y="14" text-anchor="middle" font-size="14" fill="#e2e8f0">A</text><text x="12" y="156" font-size="14" fill="#e2e8f0">B</text><text x="200" y="156" font-size="14" fill="#e2e8f0">C</text></svg>`,
  'right-triangle': `<svg viewBox="0 0 220 160" class="math-shape" aria-label="مثلث قائم"><polygon points="28,20 28,140 196,140" fill="#0f2744" stroke="#67e8f9" stroke-width="3"/><rect x="28" y="122" width="18" height="18" fill="none" stroke="#67e8f9" stroke-width="2"/><text x="20" y="16" font-size="14" fill="#e2e8f0">A</text><text x="16" y="156" font-size="14" fill="#e2e8f0">B</text><text x="200" y="156" font-size="14" fill="#e2e8f0">C</text></svg>`,
  circle: `<svg viewBox="0 0 200 160" class="math-shape" aria-label="دائرة"><circle cx="100" cy="80" r="58" fill="#0f2744" stroke="#67e8f9" stroke-width="3"/><line x1="100" y1="80" x2="158" y2="80" stroke="#38bdf8" stroke-width="2"/><circle cx="100" cy="80" r="3" fill="#e2e8f0"/><text x="100" y="74" text-anchor="middle" font-size="13" fill="#e2e8f0">م</text><text x="126" y="74" font-size="13" fill="#38bdf8">نق</text></svg>`,
  square: `<svg viewBox="0 0 180 160" class="math-shape" aria-label="مربع"><rect x="30" y="20" width="120" height="120" fill="#0f2744" stroke="#67e8f9" stroke-width="3"/><text x="22" y="18" font-size="14" fill="#e2e8f0">A</text><text x="150" y="18" font-size="14" fill="#e2e8f0">B</text><text x="150" y="156" font-size="14" fill="#e2e8f0">C</text><text x="22" y="156" font-size="14" fill="#e2e8f0">D</text></svg>`,
  rectangle: `<svg viewBox="0 0 220 140" class="math-shape" aria-label="مستطيل"><rect x="20" y="24" width="180" height="92" fill="#0f2744" stroke="#67e8f9" stroke-width="3"/><text x="14" y="20" font-size="14" fill="#e2e8f0">A</text><text x="198" y="20" font-size="14" fill="#e2e8f0">B</text><text x="198" y="132" font-size="14" fill="#e2e8f0">C</text><text x="14" y="132" font-size="14" fill="#e2e8f0">D</text></svg>`,
  parallelogram: `<svg viewBox="0 0 240 140" class="math-shape" aria-label="متوازي أضلاع"><polygon points="60,24 210,24 180,116 30,116" fill="#0f2744" stroke="#67e8f9" stroke-width="3"/><text x="52" y="18" font-size="14" fill="#e2e8f0">A</text><text x="210" y="18" font-size="14" fill="#e2e8f0">B</text><text x="184" y="134" font-size="14" fill="#e2e8f0">C</text><text x="22" y="134" font-size="14" fill="#e2e8f0">D</text></svg>`,
  trapezoid: `<svg viewBox="0 0 240 140" class="math-shape" aria-label="شبه منحرف"><polygon points="70,26 170,26 210,116 30,116" fill="#0f2744" stroke="#67e8f9" stroke-width="3"/><text x="62" y="20" font-size="14" fill="#e2e8f0">A</text><text x="172" y="20" font-size="14" fill="#e2e8f0">B</text><text x="214" y="134" font-size="14" fill="#e2e8f0">C</text><text x="22" y="134" font-size="14" fill="#e2e8f0">D</text></svg>`,
  angle: `<svg viewBox="0 0 200 140" class="math-shape" aria-label="زاوية"><path d="M20 120 L160 120 L160 20" fill="none" stroke="#67e8f9" stroke-width="3"/><path d="M160 120 A36 36 0 0 1 124 84" fill="none" stroke="#38bdf8" stroke-width="2"/><text x="12" y="136" font-size="14" fill="#e2e8f0">A</text><text x="166" y="136" font-size="14" fill="#e2e8f0">B</text><text x="166" y="16" font-size="14" fill="#e2e8f0">C</text><text x="118" y="100" font-size="14" fill="#38bdf8">θ</text></svg>`,
}

const MATH_PATTERN = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\)/g
const SHAPE_PATTERN = /\[\[shape:([a-z-]+)\]\]/g

function renderShapes(html: string): string {
  return html.replace(SHAPE_PATTERN, (_, name: string) => {
    const svg = SHAPES[name]
    return svg
      ? `<div class="math-shape-wrap">${svg}</div>`
      : escapeHtml(`[[shape:${name}]]`)
  })
}

export function renderMathHtml(text: string): string {
  if (!text) return ''

  const parts: string[] = []
  let lastIndex = 0
  const pattern = new RegExp(MATH_PATTERN.source, 'g')
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    parts.push(renderShapes(escapeHtml(text.slice(lastIndex, match.index)).replace(/\n/g, '<br/>')))
    if (match[1] != null) parts.push(renderLatex(match[1], true))
    else if (match[2] != null) parts.push(renderLatex(match[2], true))
    else if (match[3] != null) parts.push(renderLatex(match[3], false))
    else if (match[4] != null) parts.push(renderLatex(match[4], false))
    lastIndex = match.index + match[0].length
  }

  parts.push(renderShapes(escapeHtml(text.slice(lastIndex)).replace(/\n/g, '<br/>')))
  return parts.join('')
}
