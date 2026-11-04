import React from 'react'

interface MarkdownRendererProps {
  content: string
}

// Inline formatting: code `...`, bold **...**, italic *...*
const parseBoldItalicAndCode = (text: string, keyPrefix: string): React.ReactNode => {
  const parts: React.ReactNode[] = []
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    const token = match[1]
    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={`${keyPrefix}-c-${match.index}`}
          className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs select-all inline-block my-0.5"
        >
          {token.slice(1, -1)}
        </code>
      )
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={`${keyPrefix}-b-${match.index}`} className="font-bold text-white dark:text-white light:text-slate-900">
          {token.slice(2, -2)}
        </strong>
      )
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={`${keyPrefix}-i-${match.index}`} className="italic text-slate-200 dark:text-slate-200 light:text-slate-800">
          {token.slice(1, -1)}
        </em>
      )
    }
    lastIndex = tokenRegex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }
  return <React.Fragment key={keyPrefix}>{parts}</React.Fragment>
}

// Links [label](url) and inline styling
const renderFormattedText = (text: string): React.ReactNode => {
  if (!text) return null

  const parts: React.ReactNode[] = []
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseBoldItalicAndCode(text.substring(lastIndex, match.index), `txt-${lastIndex}`))
    }
    const label = match[1]
    const href = match[2]
    parts.push(
      <a
        key={`link-${match.index}`}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1"
      >
        {parseBoldItalicAndCode(label, `lbl-${match.index}`)}
      </a>
    )
    lastIndex = linkRegex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(parseBoldItalicAndCode(text.substring(lastIndex), `txt-${lastIndex}`))
  }
  return parts
}

const parseTableRow = (line: string): string[] => {
  let clean = line.trim()
  if (clean.startsWith('|')) clean = clean.slice(1)
  if (clean.endsWith('|')) clean = clean.slice(0, -1)
  return clean.split('|').map(cell => cell.trim())
}

type BlockType =
  | { type: 'hr' }
  | { type: 'code'; language: string; content: string }
  | { type: 'table'; header: string[]; rows: string[][] }
  | { type: 'heading'; level: 1 | 2 | 3 | 4; text: string }
  | { type: 'blockquote'; lines: string[] }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'paragraph'; text: string }

function normalizeMarkdown(raw: string): string {
  if (!raw) return ''
  // 1. Unescape literal \n if double-escaped in JSON/database
  let text = raw.replace(/\r\n/g, '\n').replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n')

  // 2. Fix collapsed table rows where rows are concatenated with `| |` or `||` on a single line
  // Example: "| H1 | H2 | |---|---| | R1 | R2 |" -> split into newlines
  text = text.replace(/\|\s*\|\s*(?=[-|:])/g, '|\n|')
  text = text.replace(/\|\s*\|\s*(?=\S)/g, '|\n|')
  text = text.replace(/\|\|(?=\S)/g, '|\n|')

  return text
}

function parseMarkdownBlocks(markdown: string): BlockType[] {
  const normalized = normalizeMarkdown(markdown)
  const lines = normalized.split('\n')
  const blocks: BlockType[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Skip empty lines
    if (!trimmed) {
      i++
      continue
    }

    // 1. Code Block (```)
    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // consume closing ```
      blocks.push({
        type: 'code',
        language,
        content: codeLines.join('\n')
      })
      continue
    }

    // 2. Horizontal Rule (--- or ***)
    if (/^(---|---|\*\*\*)$/.test(trimmed)) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    // 3. Table Block (lines containing | with a divider line below)
    if (trimmed.includes('|')) {
      let nextLineIdx = i + 1
      while (nextLineIdx < lines.length && !lines[nextLineIdx].trim()) {
        nextLineIdx++
      }

      const nextLine = nextLineIdx < lines.length ? lines[nextLineIdx].trim() : ''
      const isDivider =
        nextLine.includes('|') &&
        nextLine.split('|').map(s => s.trim()).filter(Boolean).length > 0 &&
        nextLine.split('|').map(s => s.trim()).filter(Boolean).every(cell => /^:?-+:?$/.test(cell))

      if (isDivider) {
        const header = parseTableRow(trimmed)
        i = nextLineIdx + 1
        const rows: string[][] = []

        while (i < lines.length && lines[i].trim().includes('|')) {
          const rowLine = lines[i].trim()
          const isRowDivider =
            rowLine.split('|').map(s => s.trim()).filter(Boolean).every(cell => /^:?-+:?$/.test(cell))
          if (!isRowDivider && rowLine) {
            rows.push(parseTableRow(rowLine))
          }
          i++
        }

        blocks.push({ type: 'table', header, rows })
        continue
      }
    }

    // 4. Headings
    if (trimmed.startsWith('#### ')) {
      blocks.push({ type: 'heading', level: 4, text: trimmed.slice(5).trim() })
      i++
      continue
    }
    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'heading', level: 3, text: trimmed.slice(4).trim() })
      i++
      continue
    }
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, text: trimmed.slice(3).trim() })
      i++
      continue
    }
    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'heading', level: 1, text: trimmed.slice(2).trim() })
      i++
      continue
    }

    // 5. Blockquote (>)
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ''))
        i++
      }
      blocks.push({ type: 'blockquote', lines: quoteLines })
      continue
    }

    // 6. Unordered List (- or *)
    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && (/^[-*+]\s+/.test(lines[i].trim()) || (lines[i].startsWith('  ') && items.length > 0))) {
        if (/^[-*+]\s+/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^[-*+]\s+/, ''))
        } else if (items.length > 0) {
          items[items.length - 1] += ' ' + lines[i].trim()
        }
        i++
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    // 7. Ordered List (1. )
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && (/^\d+\.\s+/.test(lines[i].trim()) || (lines[i].startsWith('  ') && items.length > 0))) {
        if (/^\d+\.\s+/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^\d+\.\s+/, ''))
        } else if (items.length > 0) {
          items[items.length - 1] += ' ' + lines[i].trim()
        }
        i++
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    // 8. Paragraph (contiguous non-empty lines that don't match other tokens)
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !/^[-*+]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^(---|---|\*\*\*)$/.test(lines[i].trim()) &&
      !lines[i].trim().includes('|')
    ) {
      paraLines.push(lines[i].trim())
      i++
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paraLines.join(' ') })
    }
  }

  return blocks
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null

  const blocks = parseMarkdownBlocks(content)

  return (
    <div className="prose max-w-none text-slate-300 dark:text-slate-300 light:text-slate-700">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'hr':
            return <hr key={idx} className="my-10 border-t border-white/10 dark:border-white/10 light:border-slate-200" />

          case 'code':
            return (
              <div key={idx} className="my-6 rounded-2xl border border-white/10 bg-[#030712] overflow-hidden shadow-2xl">
                {block.language && (
                  <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.03]">
                    <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono font-bold">
                      {block.language}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">architecture</span>
                  </div>
                )}
                <pre className="p-5 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-300/90 leading-relaxed">
                  <code>{block.content}</code>
                </pre>
              </div>
            )

          case 'table':
            return (
              <div
                key={idx}
                className="my-8 overflow-hidden rounded-2xl border border-white/15 dark:border-white/15 light:border-slate-200 shadow-2xl bg-[#060913]/90 dark:bg-[#060913]/90 light:bg-white backdrop-blur-md"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-white/15 dark:border-white/15 light:border-slate-200 bg-white/[0.05] dark:bg-white/[0.05] light:bg-slate-100">
                        {block.header.map((cell, hIdx) => (
                          <th
                            key={hIdx}
                            className="py-4 px-4 sm:px-6 font-bold text-white dark:text-white light:text-slate-900 font-display uppercase tracking-wider text-[11px] sm:text-xs whitespace-nowrap"
                          >
                            {renderFormattedText(cell)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 dark:divide-white/5 light:divide-slate-100">
                      {block.rows.map((row, rIdx) => {
                        const isHighlightRow = row.some(cell => /total|ownership|conversion|3-year|0\.5s/i.test(cell))
                        return (
                          <tr
                            key={rIdx}
                            className={`transition-colors ${
                              isHighlightRow
                                ? 'bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-50 font-semibold'
                                : 'hover:bg-white/[0.02] dark:hover:bg-white/[0.02] light:hover:bg-slate-50/60'
                            }`}
                          >
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`py-3.5 px-4 sm:px-6 leading-relaxed ${
                                  cIdx === 0
                                    ? 'font-medium text-slate-100 dark:text-slate-100 light:text-slate-900'
                                    : cIdx === row.length - 1
                                    ? 'text-emerald-400 dark:text-emerald-400 light:text-emerald-700 font-semibold'
                                    : 'text-slate-300 dark:text-slate-300 light:text-slate-700'
                                }`}
                              >
                                {renderFormattedText(cell)}
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )

          case 'heading': {
            if (block.level === 1) {
              return (
                <h2
                  key={idx}
                  className="text-2xl sm:text-3xl font-extrabold text-white dark:text-white light:text-slate-900 mt-10 mb-5 font-display border-b border-white/10 dark:border-white/10 light:border-slate-200 pb-3"
                >
                  {renderFormattedText(block.text)}
                </h2>
              )
            }
            if (block.level === 2) {
              return (
                <h3
                  key={idx}
                  className="text-xl sm:text-2xl font-bold text-white dark:text-white light:text-slate-900 mt-8 mb-4 font-display"
                >
                  {renderFormattedText(block.text)}
                </h3>
              )
            }
            if (block.level === 3) {
              return (
                <h4
                  key={idx}
                  className="text-lg sm:text-xl font-bold text-emerald-400 dark:text-emerald-400 light:text-emerald-600 mt-6 mb-3 font-display"
                >
                  {renderFormattedText(block.text)}
                </h4>
              )
            }
            return (
              <h5
                key={idx}
                className="text-base font-bold text-white dark:text-white light:text-slate-900 mt-5 mb-2 font-display"
              >
                {renderFormattedText(block.text)}
              </h5>
            )
          }

          case 'blockquote':
            return (
              <blockquote
                key={idx}
                className="border-l-4 border-emerald-500 pl-5 italic text-slate-200 dark:text-slate-200 light:text-slate-700 my-6 bg-emerald-500/5 dark:bg-emerald-500/5 light:bg-emerald-50/50 p-4 rounded-r-xl border border-white/5"
              >
                {renderFormattedText(block.lines.join(' '))}
              </blockquote>
            )

          case 'ul':
            return (
              <ul key={idx} className="list-disc pl-6 space-y-2.5 my-5">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed text-slate-300 dark:text-slate-300 light:text-slate-700 text-sm sm:text-base">
                    {renderFormattedText(item)}
                  </li>
                ))}
              </ul>
            )

          case 'ol':
            return (
              <ol key={idx} className="list-decimal pl-6 space-y-2.5 my-5">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed text-slate-300 dark:text-slate-300 light:text-slate-700 text-sm sm:text-base">
                    {renderFormattedText(item)}
                  </li>
                ))}
              </ol>
            )

          case 'paragraph':
            return (
              <p key={idx} className="leading-relaxed mb-5 text-slate-300 dark:text-slate-300 light:text-slate-700 text-sm sm:text-base">
                {renderFormattedText(block.text)}
              </p>
            )

          default:
            return null
        }
      })}
    </div>
  )
}

export default MarkdownRenderer
