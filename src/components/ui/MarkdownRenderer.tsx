import React from 'react'

interface MarkdownRendererProps {
  content: string
}

const renderFormattedText = (text: string): React.ReactNode => {
  if (!text) return null

  const parts: React.ReactNode[] = []
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseBoldItalic(text.substring(lastIndex, match.index), `txt-${lastIndex}`))
    }
    const label = match[1]
    const href = match[2]
    parts.push(
      <a
        key={`link-${match.index}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-500 dark:text-emerald-400 font-bold hover:underline"
      >
        {label}
      </a>
    )
    lastIndex = linkRegex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(parseBoldItalic(text.substring(lastIndex), `txt-${lastIndex}`))
  }
  return parts
}

const parseBoldItalic = (text: string, keyPrefix: string): React.ReactNode => {
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <React.Fragment key={keyPrefix}>
      {boldParts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-extrabold text-white dark:text-white light:text-slate-900">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return part
      })}
    </React.Fragment>
  )
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null

  // Split content into paragraph/logical text blocks
  const blocks = content.split(/(?:\r?\n){2,}/)

  return (
    <div className="prose max-w-none text-slate-300 dark:text-slate-300 light:text-slate-700">
      {blocks.map((block, idx) => {
        const trimmed = block.trim()
        if (!trimmed) return null

        // 1. Horizontal Rule (---)
        if (trimmed === '---') {
          return <hr key={idx} className="my-8 border-t dark:border-white/10 light:border-slate-200" />
        }

        // 2. Code Fenced Block (```)
        if (trimmed.startsWith('```')) {
          const lines = trimmed.split('\n')
          const language = lines[0].replace('```', '').trim()
          const codeLines = lines.slice(1, lines[lines.length - 1].trim() === '```' ? -1 : undefined).join('\n')
          return (
            <pre key={idx} className="bg-[#04060b] border border-white/10 p-5 rounded-2xl overflow-x-auto text-xs sm:text-sm font-mono text-emerald-400 my-6 shadow-md">
              {language && (
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 border-b border-white/10 pb-1 select-none">
                  {language}
                </div>
              )}
              <code>{codeLines}</code>
            </pre>
          )
        }

        // 3. Blockquotes (>)
        if (trimmed.startsWith('>')) {
          const quoteText = trimmed.replace(/^>\s*/gm, '')
          return (
            <blockquote key={idx} className="border-l-4 border-emerald-500 pl-5 italic text-slate-300 dark:text-slate-300 light:text-slate-700 my-6 dark:bg-white/5 light:bg-slate-100 p-4 rounded-r-xl border">
              {renderFormattedText(quoteText)}
            </blockquote>
          )
        }

        // 4. Headings (#)
        if (trimmed.startsWith('###')) {
          return (
            <h4 key={idx} className="text-lg font-bold text-white dark:text-white light:text-slate-900 mt-6 mb-3 font-display">
              {renderFormattedText(trimmed.replace(/^###\s+/, ''))}
            </h4>
          )
        }
        if (trimmed.startsWith('##')) {
          return (
            <h3 key={idx} className="text-xl font-bold text-white dark:text-white light:text-slate-900 mt-8 mb-4 font-display">
              {renderFormattedText(trimmed.replace(/^##\s+/, ''))}
            </h3>
          )
        }
        if (trimmed.startsWith('#')) {
          return (
            <h2 key={idx} className="text-2xl font-bold text-white dark:text-white light:text-slate-900 mt-10 mb-5 font-display border-b dark:border-white/10 light:border-slate-200 pb-2">
              {renderFormattedText(trimmed.replace(/^#\s+/, ''))}
            </h2>
          )
        }

        // 5. Bullet lists (* or -)
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const listItems = trimmed.split(/\r?\n[*+-]\s+/)
          return (
            <ul key={idx} className="list-disc pl-6 space-y-2.5 my-5">
              {listItems.map((item, itemIdx) => {
                const cleanItem = itemIdx === 0 ? item.replace(/^[*+-]\s+/, '') : item
                return (
                  <li key={itemIdx} className="leading-relaxed">
                    {renderFormattedText(cleanItem)}
                  </li>
                )
              })}
            </ul>
          )
        }

        // 6. Numbered lists (1. )
        if (/^\d+\.\s+/.test(trimmed)) {
          const listItems = trimmed.split(/\r?\n\d+\.\s+/)
          return (
            <ol key={idx} className="list-decimal pl-6 space-y-2.5 my-5">
              {listItems.map((item, itemIdx) => {
                const cleanItem = itemIdx === 0 ? item.replace(/^\d+\.\s+/, '') : item
                return (
                  <li key={itemIdx} className="leading-relaxed">
                    {renderFormattedText(cleanItem)}
                  </li>
                )
              })}
            </ol>
          )
        }

        // Default Paragraph block
        return (
          <p key={idx} className="leading-relaxed mb-5 text-slate-300 dark:text-slate-300 light:text-slate-700">
            {renderFormattedText(trimmed)}
          </p>
        )
      })}
    </div>
  )
}
export default MarkdownRenderer
