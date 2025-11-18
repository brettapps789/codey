
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import type { Conversation, Message } from './types';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatSessions = useRef(new Map<string, Chat>());

  const ai = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    if (process.env.API_KEY) {
      ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  }, []);

  const handleNewChat = () => {
    const newConversationId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'New Chat',
      messages: [],
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversationId);

    if (ai.current) {
        const chat = ai.current.chats.create({ model: 'gemini-2.5-pro' });
        chatSessions.current.set(newConversationId, chat);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!activeConversationId || !ai.current) return;

    const userMessage: Message = { role: 'user', text };
    
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, userMessage] }
          : conv
      )
    );
    
    setIsLoading(true);

    try {
        const chat = chatSessions.current.get(activeConversationId);
        if (!chat) {
            throw new Error("Chat session not found");
        }
        
        const result = await chat.sendMessage(text);
        const modelResponse = result.text;
        
        const modelMessage: Message = { role: 'model', text: modelResponse };

        setConversations(prev => {
            return prev.map(conv => {
              if (conv.id === activeConversationId) {
                const updatedConv = { ...conv, messages: [...conv.messages, modelMessage] };
                if (conv.messages.length === 1) { // It was just the user's first message
                    updatedConv.title = text.substring(0, 30) + (text.length > 30 ? '...' : '');
                }
                return updatedConv;
              }
              return conv;
            });
        });

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { role: 'model', text: 'Sorry, something went wrong. Please try again.' };
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? { ...conv, messages: [...conv.messages, errorMessage] }
            : conv
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId]);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  if (!ai.current) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold mb-4">API Key Not Found</h1>
          <p>Please make sure the API_KEY environment variable is set.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />
      <main className="flex-1 flex flex-col">
        <ChatView
          conversation={activeConversation}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default App;
