import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
  dark?: boolean
}

export function MarkdownContent({ content, dark = false }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // コードブロック
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className ?? '')
          const isBlock = !!match

          if (isBlock) {
            return (
              <SyntaxHighlighter
                style={oneLight}
                language={match[1]}
                PreTag="div"
                className="rounded-lg text-xs my-2 overflow-x-auto"
                customStyle={{ margin: 0, borderRadius: '0.5rem', fontSize: '0.75rem' }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            )
          }
          return (
            <code
              className={`text-xs px-1.5 py-0.5 rounded font-mono ${dark ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-800'}`}
              {...props}
            >
              {children}
            </code>
          )
        },
        // 見出し
        h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-bold mt-3 mb-1">{children}</h3>,
        // 段落
        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
        // リスト
        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        // 区切り線
        hr: () => <hr className="my-3 border-gray-200" />,
        // 太字・斜体
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        // 引用
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-gray-300 pl-3 text-gray-500 my-2">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
