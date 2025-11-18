
import React from 'react';
import type { Conversation } from '../types';
import { PlusIcon } from './icons';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
}) => {
  return (
    <aside className="w-64 bg-gray-800 flex flex-col p-2">
      <button
        onClick={onNewChat}
        className="flex items-center justify-center w-full px-4 py-2 mb-4 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        New Chat
      </button>
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {conversations.map((conv) => (
            <a
              key={conv.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectConversation(conv.id);
              }}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md truncate ${
                conv.id === activeConversationId
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {conv.title}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
