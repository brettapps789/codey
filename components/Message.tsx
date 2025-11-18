import React from 'react';
import type { Message as MessageType } from '../types';
import { UserIcon, BotIcon } from './icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start space-x-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <BotIcon className="w-5 h-5 text-white" />
        </div>
      )}
      <div
        className={`max-w-xl px-4 py-3 rounded-xl ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-700 text-gray-200 rounded-bl-none'
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{message.text}</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2" {...props} />,
              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 pl-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 pl-2" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              code: ({node, inline, className, children, ...props}) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline ? (
                  <div className="bg-gray-800 rounded-md my-2">
                    <div className="flex items-center justify-between px-3 py-1 bg-gray-900 rounded-t-md">
                        <span className="text-xs text-gray-400 capitalize">{match ? match[1] : 'code'}</span>
                    </div>
                    <pre className="p-3 overflow-x-auto"><code className={`font-mono text-sm ${className}`} {...props}>
                      {children}
                    </code></pre>
                  </div>
                ) : (
                  <code className="bg-gray-600 rounded px-1 py-0.5 font-mono text-sm" {...props}>
                    {children}
                  </code>
                )
              },
              a: ({node, ...props}) => <a className="text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
              em: ({node, ...props}) => <em className="italic" {...props} />,
              table: ({node, ...props}) => <div className="overflow-x-auto"><table className="table-auto w-full my-2 border-collapse border border-gray-500" {...props} /></div>,
              thead: ({node, ...props}) => <thead className="bg-gray-800" {...props} />,
              th: ({node, ...props}) => <th className="border border-gray-500 px-2 py-1 text-left" {...props} />,
              td: ({node, ...props}) => <td className="border border-gray-500 px-2 py-1" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-500 pl-4 italic my-2" {...props} />,
            }}
          >
            {message.text}
          </ReactMarkdown>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default Message;