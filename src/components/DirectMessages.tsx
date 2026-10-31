import React, { useState } from 'react';
import { ChatConversation, CurrentUser, StudentProfile } from '../types';
import {
  Send,
  Ghost,
  CheckCircle2,
  Gift,
  Shield,
  MessageCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface DirectMessagesProps {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  currentUser: CurrentUser;
  onSendMessage: (conversationId: string, text: string, isGhost: boolean) => void;
  onStartNewWithProfile?: (profile: StudentProfile) => void;
}

export const DirectMessages: React.FC<DirectMessagesProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  currentUser,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [sendAsGhost, setSendAsGhost] = useState(currentUser.isGhostMode);

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) || conversations[0] || null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    onSendMessage(activeConv.id, inputText.trim(), sendAsGhost);
    setInputText('');
  };

  const quickChips = [
    'Mwine! 🔥',
    'See you at Goma Lakes',
    'Hungry Lion on you tonight? 😂',
    'Did the HELSB allowance drop?',
    'Good luck in the test!',
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[560px]">
      {/* Conversations List Left Panel */}
      <div className="border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Whisper Chats</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              {conversations.length} Active
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No conversations yet. Visit Campus Encounters or tap a profile to whisper!
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = activeConv?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`w-full text-left p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                    isActive
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {conv.isIncognito ? (
                      <Ghost className="w-5 h-5 text-purple-200" />
                    ) : (
                      conv.partnerName.charAt(0)
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {conv.isIncognito ? conv.partnerAlias : conv.partnerName}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {conv.lastTimestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                      <span className="font-medium text-emerald-600 dark:text-emerald-400 uppercase">
                        {conv.partnerUniversity}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center ml-auto">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Active Conversation Chat Window Right Panel */}
      <div className="md:col-span-2 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
        {!activeConv ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <Ghost className="w-12 h-12 text-slate-300 mb-2" />
            <p className="text-sm font-semibold">Select a conversation to start whispering</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-3.5 px-5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {activeConv.isIncognito ? (
                    <Ghost className="w-4 h-4 text-purple-200" />
                  ) : (
                    activeConv.partnerName.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>
                      {activeConv.isIncognito ? activeConv.partnerAlias : activeConv.partnerName}
                    </span>
                    {activeConv.isIncognito ? (
                      <span className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.2 rounded font-normal">
                        Ghost Chat
                      </span>
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                  </h4>
                  <span className="text-[11px] text-slate-500 uppercase">
                    {activeConv.partnerUniversity} Campus
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">End-to-end encrypted</span>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3">
              {activeConv.messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                      }`}
                    >
                      {/* Attached gift if present */}
                      {msg.giftAttached && (
                        <div className="mb-2 p-2 rounded-xl bg-amber-500/20 border border-amber-300/40 text-[11px] font-semibold flex items-center gap-2 text-amber-200">
                          <Gift className="w-4 h-4 text-amber-300 shrink-0" />
                          <span>Sent Treat: {msg.giftAttached.name}</span>
                        </div>
                      )}

                      <p>{msg.text}</p>
                    </div>

                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick chips bar */}
            <div className="px-4 py-1.5 flex gap-1.5 overflow-x-auto scrollbar-none bg-white/70 dark:bg-slate-900/70 border-t border-slate-100 dark:border-slate-800">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(chip)}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 whitespace-nowrap cursor-pointer transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Input Footer */}
            <div className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSend} className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Sending as:</span>
                    <button
                      type="button"
                      onClick={() => setSendAsGhost(!sendAsGhost)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer ${
                        sendAsGhost
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {sendAsGhost ? <Ghost className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      <span>{sendAsGhost ? 'Ghost Persona' : currentUser.alias}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type an anonymous whisper message..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
