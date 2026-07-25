import React from 'react'

interface MarkdownRendererProps {
  content: string
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null

  // Split content into paragraph/logical text blocks
  const blocks = content.split(/(?:\r?\n){2,}/)

  return (
    <div className="prose max-w-none text-slate-300 dark:text-slate-300 light:text-slate-800">
      {blocks.map((block, idx) => {
        const trimmed = block.trim()
        if (!trimmed) return null

        // 1. Code Fenced Block (```)
        if (trimmed.startsWith('```')) {
          const lines = trimmed.split('\n')
          const language = lines[0].replace('```', '').trim()
          // Exclude the starting and trailing backticks lines
          const codeLines = lines.slice(1, lines[lines.length - 1].trim() === '```' ? -1 : undefined).join('\n')
          return (
            <pre key={idx} className="bg-[#04060b] border border-white/5 p-5 rounded-2xl overflow-x-auto text-xs sm:text-sm font-mono text-brand-emerald my-6">
              {language && (
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 border-b border-white/5 pb-1 select-none">
                  {language}
                </div>
              )}
              <code>{codeLines}</code>
            </pre>
          )
        }

        // 2. Blockquotes (>)
        if (trimmed.startsWith('>')) {
          const quoteText = trimmed.replace(/^>\s*/gm, '')
          return (
            <blockquote key={idx} className="border-l-4 border-brand-emerald pl-5 italic text-slate-400 my-6 bg-white/2 p-4 rounded-r-xl">
              {quoteText}
            </blockquote>
          )
        }

        // 3. Headings (#)
        if (trimmed.startsWith('###')) {
          return (
            <h4 key={idx} className="text-lg font-bold text-white light:text-slate-900 mt-6 mb-3 font-display">
              {trimmed.replace(/^###\s+/, '')}
            </h4>
          )
        }
        if (trimmed.startsWith('##')) {
          return (
            <h3 key={idx} className="text-xl font-bold text-white light:text-slate-900 mt-8 mb-4 font-display">
              {trimmed.replace(/^##\s+/, '')}
            </h3>
          )
        }
        if (trimmed.startsWith('#')) {
          return (
            <h2 key={idx} className="text-2xl font-bold text-white light:text-slate-900 mt-10 mb-5 font-display border-b border-white/5 pb-2">
              {trimmed.replace(/^#\s+/, '')}
            </h2>
          )
        }

        // 4. Bullet lists (* or -)
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const listItems = trimmed.split(/\r?\n[*+-]\s+/)
          return (
            <ul key={idx} className="list-disc pl-6 space-y-2 my-5">
              {listItems.map((item, itemIdx) => (
                <li key={itemIdx}>
                  {itemIdx === 0 ? item.replace(/^[*+-]\s+/, '') : item}
                </li>
              ))}
            </ul>
          )
        }

        // 5. Numbered lists (1. )
        if (/^\d+\.\s+/.test(trimmed)) {
          const listItems = trimmed.split(/\r?\n\d+\.\s+/)
          return (
            <ol key={idx} className="list-decimal pl-6 space-y-2 my-5">
              {listItems.map((item, itemIdx) => (
                <li key={itemIdx}>
                  {itemIdx === 0 ? item.replace(/^\d+\.\s+/, '') : item}
                </li>
              ))}
            </ol>
          )
        }

        // Default Paragraph block
        return (
          <p key={idx} className="leading-relaxed mb-5 text-slate-300 dark:text-slate-300 light:text-slate-700">
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}
export default MarkdownRenderer
