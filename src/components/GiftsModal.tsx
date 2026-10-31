import React, { useState } from 'react';
import { CampusGiftItem, CurrentUser, StudentProfile } from '../types';
import { CAMPUS_GIFTS } from '../data/mockData';
import { X, Gift, Ghost, CheckCircle2, Sparkles, Heart } from 'lucide-react';

interface GiftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfile: StudentProfile | null;
  currentUser: CurrentUser;
  onSendGift: (targetProfileId: string, gift: CampusGiftItem, isAnonymous: boolean, note: string) => void;
}

export const GiftsModal: React.FC<GiftsModalProps> = ({
  isOpen,
  onClose,
  targetProfile,
  currentUser,
  onSendGift,
}) => {
  const [selectedGiftId, setSelectedGiftId] = useState<string>(CAMPUS_GIFTS[0].id);
  const [isAnonymousGift, setIsAnonymousGift] = useState(currentUser.isGhostMode);
  const [personalNote, setPersonalNote] = useState('');

  if (!isOpen || !targetProfile) return null;

  const selectedGift = CAMPUS_GIFTS.find((g) => g.id === selectedGiftId) || CAMPUS_GIFTS[0];

  const handleSend = () => {
    onSendGift(targetProfile.id, selectedGift, isAnonymousGift, personalNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-950/50 flex items-center justify-center text-pink-600">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Send Campus Treat to {targetProfile.name}
              </h2>
              <p className="text-[11px] text-slate-500">
                {targetProfile.university.toUpperCase()} · {targetProfile.campus}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Campus Token Notice */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-pink-50/70 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/60 text-xs text-pink-900 dark:text-pink-200">
          <Heart className="w-4 h-4 text-pink-500 shrink-0" />
          <span>
            Campus treats are 100% free peer appreciations! Show support, break the ice, or send exam wishes.
          </span>
        </div>

        {/* Gift Selection Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Choose a Campus Treat
          </label>
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {CAMPUS_GIFTS.map((gift) => {
              const isSelected = selectedGiftId === gift.id;
              return (
                <button
                  key={gift.id}
                  type="button"
                  onClick={() => setSelectedGiftId(gift.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-pink-50/80 dark:bg-pink-950/40 border-pink-500 ring-2 ring-pink-500/20'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {gift.name}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider shrink-0 ml-1">
                      Free
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                    {gift.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sender Identity Choice */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Sender Anonymity
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsAnonymousGift(true)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                isAnonymousGift
                  ? 'bg-purple-900 text-purple-100 border-purple-700'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Ghost className="w-3.5 h-3.5 text-purple-300" />
              <span>Secret Admirer (Ghost)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAnonymousGift(false)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                !isAnonymousGift
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
              <span>Show My Alias ({currentUser.alias})</span>
            </button>
          </div>
        </div>

        {/* Optional Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Personal Message / Note (Optional)
          </label>
          <input
            type="text"
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
            placeholder="e.g. Good luck with your exam this Friday!"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Send Free Treat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
