
import React, { useRef, useEffect } from 'react';
import type { Conversation } from '../types';
import Message from './Message';
import ChatInput from './ChatInput';
import { BotIcon } from './icons';

interface ChatViewProps {
  conversation: Conversation | null;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({ conversation, onSendMessage, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  return (
    <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
      {conversation ? (
        <>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {conversation.messages.map((msg, index) => (
              <Message key={index} message={msg} />
            ))}
             {isLoading && conversation.messages.length > 0 && conversation.messages[conversation.messages.length - 1].role === 'user' && (
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <BotIcon className="w-5 h-5 text-white" />
                </div>
                <div className="animate-pulse flex space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="px-6 pb-4 bg-gray-900">
            <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-400">Gemini Pro Chat</h1>
            <p className="mt-2 text-gray-500">Click "New Chat" to start a conversation.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatView;
