import React, { useState } from 'react';
import { CampusGiftItem, CurrentUser, StudentProfile, UniversityId } from '../types';
import { UNIVERSITIES } from '../data/mockData';
import confetti from 'canvas-confetti';
import {
  Heart,
  X,
  Gift,
  MapPin,
  GraduationCap,
  Sparkles,
  MessageCircle,
  Award,
  CheckCircle2,
  Coffee,
  Flame,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface CampusCrushEncounterProps {
  profiles: StudentProfile[];
  currentUser: CurrentUser;
  onSendGiftClick: (targetProfile: StudentProfile) => void;
  onStartChat: (targetProfile: StudentProfile) => void;
  onMatchCreated?: (targetProfile: StudentProfile) => void;
}

export const CampusCrushEncounter: React.FC<CampusCrushEncounterProps> = ({
  profiles,
  currentUser,
  onSendGiftClick,
  onStartChat,
  onMatchCreated,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedUniFilter, setSelectedUniFilter] = useState<UniversityId>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'female' | 'male'>('all');
  const [matchedProfile, setMatchedProfile] = useState<StudentProfile | null>(null);

  // Filter profiles
  const filteredProfiles = profiles.filter((p) => {
    if (selectedUniFilter !== 'all' && p.university !== selectedUniFilter) return false;
    if (selectedGender !== 'all' && p.gender !== selectedGender) return false;
    return true;
  });

  const activeProfile = filteredProfiles[currentIndex % Math.max(1, filteredProfiles.length)];

  const handleNext = () => {
    if (filteredProfiles.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredProfiles.length);
    }
  };

  const handlePrevious = () => {
    if (filteredProfiles.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + filteredProfiles.length) % filteredProfiles.length);
    }
  };

  const handleCrushLike = () => {
    if (!activeProfile) return;

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f43f5e', '#f59e0b', '#8b5cf6'],
      });
    } catch {
      // Fallback
    }

    // Set matched banner
    setMatchedProfile(activeProfile);
    if (onMatchCreated) {
      onMatchCreated(activeProfile);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Reverse Engineered Youdate Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-900/50 text-xs font-semibold mb-1.5">
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
          <span>ZedMatch: Zambian Campus Encounters</span>
        </div>
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
          Meet Verified Scholars & Campus Crushes
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Discover verified students from UNZA, CBU, Mulungushi, Cavendish & more. Send gifts or confess!
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          <span className="text-slate-400 font-medium mr-1 text-[11px]">Campus:</span>
          {['all', 'unza', 'cbu', 'nipa', 'mulungushi', 'cavendish', 'lmmu'].map((uni) => (
            <button
              key={uni}
              onClick={() => {
                setSelectedUniFilter(uni as UniversityId);
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                selectedUniFilter === uni
                  ? 'bg-slate-900 text-white dark:bg-emerald-600'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {uni === 'all' ? 'All' : uni.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedGender('all');
              setCurrentIndex(0);
            }}
            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
              selectedGender === 'all'
                ? 'bg-emerald-100 text-emerald-800 font-semibold'
                : 'text-slate-500'
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setSelectedGender('female');
              setCurrentIndex(0);
            }}
            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
              selectedGender === 'female'
                ? 'bg-pink-100 text-pink-800 font-semibold'
                : 'text-slate-500'
            }`}
          >
            Female
          </button>
          <button
            onClick={() => {
              setSelectedGender('male');
              setCurrentIndex(0);
            }}
            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
              selectedGender === 'male'
                ? 'bg-blue-100 text-blue-800 font-semibold'
                : 'text-slate-500'
            }`}
          >
            Male
          </button>
        </div>
      </div>

      {/* Mutual Match Modal Banner */}
      {matchedProfile && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-lg space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <h4 className="font-bold text-sm">It’s a Campus Match! 🎉</h4>
            </div>
            <button
              onClick={() => setMatchedProfile(null)}
              className="text-white/80 hover:text-white text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs text-white/90">
            You and {matchedProfile.name} ({matchedProfile.university.toUpperCase()}) are crushing on each other!
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                onStartChat(matchedProfile);
                setMatchedProfile(null);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-white text-rose-600 font-bold text-xs hover:bg-rose-50 transition-colors shadow-xs"
            >
              Start Whisper Chat
            </button>
            <button
              onClick={() => onSendGiftClick(matchedProfile)}
              className="px-3.5 py-1.5 rounded-lg bg-rose-700/60 text-white font-medium text-xs hover:bg-rose-700 transition-colors"
            >
              Send Hungry Lion 2-Piece
            </button>
          </div>
        </div>
      )}

      {/* Main Student Profile Card */}
      {!activeProfile ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No profiles match your filter.
          </p>
          <button
            onClick={() => {
              setSelectedUniFilter('all');
              setSelectedGender('all');
            }}
            className="mt-3 text-xs text-emerald-600 font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
          {/* Visual Header / Avatar Banner */}
          <div
            className={`h-48 sm:h-56 bg-gradient-to-tr ${activeProfile.avatarBgColor} relative flex items-center justify-center p-6 text-white`}
          >
            {/* University Tag Badge */}
            <div className="absolute top-4 left-4 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeProfile.university.toUpperCase()} Scholar</span>
            </div>

            {/* Reputation badge */}
            <div className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 text-amber-300">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span className="tabular-nums font-bold">{activeProfile.reputationScore}</span>
            </div>

            {/* Illustrated Student Character Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/60 flex items-center justify-center shadow-xl">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                {activeProfile.name.charAt(0)}
              </span>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={handlePrevious}
              aria-label="Previous profile"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next profile"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Details Content */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Identity line */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {activeProfile.name}, {activeProfile.age}
                  </h3>
                  {activeProfile.isVerifiedStudent && (
                    <div
                      className="text-emerald-500"
                      title="Verified Zambian Student ID"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  @{activeProfile.alias}
                </p>
              </div>

              {/* Campus Location */}
              <div className="text-right text-xs text-slate-500">
                <div className="flex items-center gap-1 justify-end font-medium text-slate-700 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeProfile.campus}</span>
                </div>
                <span className="text-[11px]">Year {activeProfile.yearOfStudy}</span>
              </div>
            </div>

            {/* Academic Program */}
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                {activeProfile.program}
              </span>
              <span className="text-[11px] text-slate-500">
                Hangout: {activeProfile.hangoutSpot}
              </span>
            </div>

            {/* Bio */}
            <div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeProfile.bio}
              </p>
            </div>

            {/* Campus Prompt (YouDate / Hinge styled prompt card) */}
            <div className="p-3.5 bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/40 rounded-xl space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
                {activeProfile.campusPromptQuestion}
              </span>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 italic">
                “{activeProfile.campusPromptAnswer}”
              </p>
            </div>

            {/* Interests */}
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1.5">
                Campus Vibe & Interests
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeProfile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-2.5 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Virtual Campus Gifts Shelf (From YouDate reverse engineering!) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold uppercase text-slate-400">
                  Gifts Received ({activeProfile.giftsReceived.length})
                </span>
                <button
                  onClick={() => onSendGiftClick(activeProfile)}
                  className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Send Gift</span>
                </button>
              </div>

              {activeProfile.giftsReceived.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No gifts received yet. Be the first!</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {activeProfile.giftsReceived.map((gift, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 flex items-center gap-2 text-xs"
                    >
                      <Gift className="w-4 h-4 text-amber-500 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                          {gift.name}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block">
                          From: {gift.senderAlias || 'Anonymous'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Bar (Pass, Gift, Chat, Crush Like) */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              {/* Pass Button */}
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                title="Pass"
                aria-label="Pass to next profile"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Send Gift Button */}
              <button
                onClick={() => onSendGiftClick(activeProfile)}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all cursor-pointer shadow-xs"
              >
                <Gift className="w-4 h-4 text-amber-500" />
                <span>Send Campus Treat</span>
              </button>

              {/* Direct Chat Button */}
              <button
                onClick={() => onStartChat(activeProfile)}
                className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                title="Message"
                aria-label="Start conversation"
              >
                <MessageCircle className="w-5 h-5" />
              </button>

              {/* Crush / Like Button */}
              <button
                onClick={handleCrushLike}
                className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-pink-500/20 cursor-pointer"
                title="Crush"
                aria-label="Send Crush Like"
              >
                <Heart className="w-6 h-6 fill-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
