import React, { useState } from 'react';
import { CurrentUser } from '../types';
import { UNIVERSITIES } from '../data/mockData';
import {
  X,
  User,
  GraduationCap,
  ShieldCheck,
  Gift,
  Ghost,
  CheckCircle2,
  Bookmark,
  Heart,
  Smartphone,
  Trash2,
  Sparkles,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onToggleGhostMode: () => void;
  onClearSession: () => void;
  onOpenQrModal?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onToggleGhostMode,
  onClearSession,
  onOpenQrModal,
}) => {
  const [peerPhone, setPeerPhone] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  if (!isOpen) return null;

  const currentUni = UNIVERSITIES.find((u) => u.id === currentUser.university) || UNIVERSITIES[1];

  const getWhatsAppRelayUrl = (inputNumber: string) => {
    let clean = inputNumber.replace(/[^0-9]/g, '');
    if (clean.startsWith('0') && clean.length === 10) {
      clean = '260' + clean.slice(1);
    }
    const token = `ZW-${currentUser.university.toUpperCase()}-${currentUser.id.slice(-4)}`;
    const text = encodeURIComponent(
      `🔒 ZedWhisper Campus Secure Match\n` +
      `Hello! Connecting with ${currentUser.alias} from ${currentUni.shortName}.\n` +
      `Verification Token: [${token}]\n` +
      `Identity Shield: Protected by ZedWhisper Zambia Relay.\n` +
      `Let's chat!`
    );
    return clean ? `https://wa.me/${clean}?text=${text}` : `https://wa.me/?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {currentUser.realName.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{currentUser.realName}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </h2>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                @{currentUser.alias}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Academic Affiliation Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>{currentUni.name}</span>
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              Verified Student
            </span>
          </div>

          <div className="text-slate-600 dark:text-slate-300 space-y-0.5">
            <p className="font-medium">{currentUser.program}</p>
            <p className="text-slate-500">
              {currentUser.campus} · Year {currentUser.year}
            </p>
          </div>
        </div>

        {/* Persona Mode Switch */}
        <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                {currentUser.isGhostMode ? <Ghost className="w-4 h-4 text-purple-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                <span>Active Persona: {currentUser.isGhostMode ? 'Incognito Ghost Mode' : 'Verified Identity'}</span>
              </h4>
              <p className="text-[11px] text-purple-700 dark:text-purple-400 mt-0.5">
                {currentUser.isGhostMode
                  ? 'Your real name and verified ID are hidden on all new posts and comments.'
                  : 'Your verified campus badge (@' + currentUser.alias + ') is visible.'}
              </p>
            </div>

            <button
              onClick={onToggleGhostMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentUser.isGhostMode
                  ? 'bg-purple-700 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              Switch Mode
            </button>
          </div>
        </div>

        {/* Campus QR & WhatsApp Gateway Button */}
        {onOpenQrModal && (
          <button
            onClick={() => {
              onClose();
              onOpenQrModal();
            }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs flex items-center justify-between shadow-sm cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Show My Campus Social QR Code</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">
              WhatsApp Shield Active
            </span>
          </button>
        )}

        {/* Dedicated WhatsApp Direct Chat Button (wa.me) */}
        <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  WhatsApp Direct Relay (wa.me)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Chat privately with peers without exposing details to public feed
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPhoneInput(!showPhoneInput)}
              className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              {showPhoneInput ? 'Hide Number' : 'Peer Number'}
            </button>
          </div>

          {showPhoneInput && (
            <div className="flex items-center gap-2">
              <input
                type="tel"
                value={peerPhone}
                onChange={(e) => setPeerPhone(e.target.value)}
                placeholder="Peer's number (e.g. 097xxxxxxx or 096...)"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <a
            href={getWhatsAppRelayUrl(peerPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>
              {peerPhone.trim() ? `Chat on WhatsApp with ${peerPhone}` : 'Trigger Protected wa.me Chat'}
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>


        {/* Student Activity & Karma Stats */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Campus Activity & Social Karma
          </h4>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Gift className="w-4 h-4 text-pink-500 mx-auto mb-1" />
              <span className="text-base font-bold tabular-nums text-slate-900 dark:text-white block">
                {currentUser.treatsSentCount}
              </span>
              <span className="text-[10px] text-slate-500">Treats Sent</span>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Heart className="w-4 h-4 text-rose-500 mx-auto mb-1" />
              <span className="text-base font-bold tabular-nums text-slate-900 dark:text-white block">
                {currentUser.secretCrushesSubmitted.length}
              </span>
              <span className="text-[10px] text-slate-500">Secret Crushes</span>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Bookmark className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <span className="text-base font-bold tabular-nums text-slate-900 dark:text-white block">
                {currentUser.bookmarkedPostIds.length}
              </span>
              <span className="text-[10px] text-slate-500">Saved Whispers</span>
            </div>
          </div>
        </div>

        {/* Emergency Panic Wipe Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Smartphone className="w-4 h-4 text-slate-400" />
            <span>Public Lab Session?</span>
          </div>

          <button
            onClick={onClearSession}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Panic Wipe & Reset Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
