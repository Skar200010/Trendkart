'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Hi! How can I help you today?',
        },
      ]);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || 'Sorry, I could not get a response.',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative"
          >
            <AnimatePresence>
              {showGreeting && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-full left-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap"
                >
                  Hi 👋 Need help?
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="absolute bottom-0 left-6 -mb-1"
                  >
                    <div className="w-2 h-2 bg-gray-900 rotate-45" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full shadow-2xl flex items-center justify-center cursor-pointer"
              aria-label="Open AI Chat"
            >
              <motion.div
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 text-white"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M8 10C8 8.9 8.9 8 10 8H14C14.55 8 15 8.45 15 9V10C15 11.1 14.1 12 13 12H11C9.9 12 9 11.1 9 10V9C9 8.45 9.45 8 10 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="9" cy="11" r="0.5" fill="currentColor" />
                  <circle cx="15" cy="11" r="0.5" fill="currentColor" />
                  <path
                    d="M12 16C13.5 16 15.5 16.5 16 17H8C8.5 16.5 10.5 16 12 16Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
              />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-[320px] md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                      fill="currentColor"
                      fillOpacity="0.2"
                    />
                    <path
                      d="M8 10C8 8.9 8.9 8 10 8H14C14.55 8 15 8.45 15 9V10C15 11.1 14.1 12 13 12H11C9.9 12 9 11.1 9 10V9C9 8.45 9.45 8 10 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="9" cy="11" r="0.5" fill="currentColor" />
                    <circle cx="15" cy="11" r="0.5" fill="currentColor" />
                    <path
                      d="M12 16C13.5 16 15.5 16.5 16 17H8C8.5 16.5 10.5 16 12 16Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Assistant</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-blue-100">Online</span>
                  </div>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-gray-200 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-200 rounded-2xl rounded-bl-md p-3 text-sm">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ scale: [0.8, 1, 0.8] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-gray-500 rounded-full"
                      />
                      <motion.span
                        animate={{ scale: [0.8, 1, 0.8] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-500 rounded-full"
                      />
                      <motion.span
                        animate={{ scale: [0.8, 1, 0.8] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-3 border-t bg-white">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
