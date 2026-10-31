import React, { useState } from 'react';
import { CurrentUser, StudentProfile } from '../types';
import confetti from 'canvas-confetti';
import { EyeOff, Lock, Heart, Sparkles, CheckCircle2, Shield, Plus, X } from 'lucide-react';

interface SecretCrushModalProps {
  currentUser: CurrentUser;
  profiles: StudentProfile[];
  onSubmitCrush: (targetHandle: string) => { isMatch: boolean; matchedProfile?: StudentProfile };
  onStartChat: (targetProfile: StudentProfile) => void;
}

export const SecretCrushModal: React.FC<SecretCrushModalProps> = ({
  currentUser,
  profiles,
  onSubmitCrush,
  onStartChat,
}) => {
  const [handleInput, setHandleInput] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [matchedCelebration, setMatchedCelebration] = useState<StudentProfile | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleInput.trim()) return;

    const result = onSubmitCrush(handleInput.trim());
    if (result.isMatch && result.matchedProfile) {
      setMatchedCelebration(result.matchedProfile);
      setFeedbackMessage(null);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#f43f5e', '#8b5cf6', '#10b981', '#f59e0b'],
        });
      } catch {
        // Fallback
      }
    } else {
      setFeedbackMessage(
        `Locked into your secret vault! If ${handleInput.trim()} submits you back, you will both be notified immediately.`
      );
    }

    setHandleInput('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5 text-purple-500" />
          <span>Zero-Knowledge Campus Lockbox</span>
        </div>
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
          Secret Campus Crush Matcher
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Have feelings for someone in your lecture hall, hostel, or campus library? Enter their handle
          or student alias. Nobody finds out unless they secretly crush on you too!
        </p>
      </div>

      {/* Confetti Match Celebration Card */}
      {matchedCelebration && (
        <div className="p-5 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-500 text-white shadow-xl space-y-3 animate-in zoom-in-95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
              <h3 className="text-lg font-bold">Mutual Match Confirmed! ❤️</h3>
            </div>
            <button
              onClick={() => setMatchedCelebration(null)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-white/90">
            {matchedCelebration.name} (@{matchedCelebration.alias}) from {matchedCelebration.university.toUpperCase()} submitted your handle too! You are both officially a mutual campus match.
          </p>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                onStartChat(matchedCelebration);
                setMatchedCelebration(null);
              }}
              className="px-4 py-2 rounded-xl bg-white text-purple-700 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
            >
              Open Direct Whisper Chat
            </button>
          </div>
        </div>
      )}

      {/* Secret Submission Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <EyeOff className="w-4 h-4 text-purple-500" />
          <span>Add a Secret Crush</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Student Handle, ZedWhisper Alias, or Full Campus Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder="e.g. @natasha_unza or Kondu_CBU"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Lock In</span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <Shield className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              <strong>100% Anonymous:</strong> Your entry is encrypted. The other person is never notified or alerted unless they independently submit your username into their vault.
            </span>
          </div>

          {feedbackMessage && (
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-xs text-purple-700 dark:text-purple-300">
              {feedbackMessage}
            </div>
          )}
        </form>

        {/* Existing Vault List */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            Your Active Secret Vault ({currentUser.secretCrushesSubmitted.length} submitted)
          </span>

          {currentUser.secretCrushesSubmitted.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No crushes locked in yet.</p>
          ) : (
            <div className="space-y-2">
              {currentUser.secretCrushesSubmitted.map((crush, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{crush}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Vault Encrypted</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
