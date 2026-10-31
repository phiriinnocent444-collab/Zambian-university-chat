import React, { useState } from 'react';
import { CampusPoll, CurrentUser } from '../types';
import { BarChart3, CheckCircle2, Vote, Sparkles, Clock, Plus, X } from 'lucide-react';

interface CampusPollsProps {
  polls: CampusPoll[];
  currentUser: CurrentUser;
  onVotePoll: (pollId: string, optionId: string) => void;
  onCreatePoll: (question: string, options: string[], category: string) => void;
}

export const CampusPolls: React.FC<CampusPollsProps> = ({
  polls,
  currentUser,
  onVotePoll,
  onCreatePoll,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [pollCategory, setPollCategory] = useState('Campus Life');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !opt1.trim() || !opt2.trim()) return;

    const options = [opt1.trim(), opt2.trim()];
    if (opt3.trim()) options.push(opt3.trim());

    onCreatePoll(newQuestion.trim(), options, pollCategory);
    setNewQuestion('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setIsCreating(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 text-xs font-semibold mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
            <span>Campus Pulse & Hot Takes</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
            Live Zambian Student Polls
          </h2>
          <p className="text-xs text-slate-500">
            Real student sentiment on HELSB bursaries, exam survivals, and hostel life.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Campus Poll</span>
        </button>
      </div>

      {/* New Poll Creator Form Drawer */}
      {isCreating && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-md space-y-3 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create a Campus Poll</h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Poll Question
            </label>
            <input
              type="text"
              required
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="e.g. Which campus has the strictest security at the gates?"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Option 1
              </label>
              <input
                type="text"
                required
                value={opt1}
                onChange={(e) => setOpt1(e.target.value)}
                placeholder="e.g. UNZA Great East Road"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Option 2
              </label>
              <input
                type="text"
                required
                value={opt2}
                onChange={(e) => setOpt2(e.target.value)}
                placeholder="e.g. CBU Riverside Gate"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Option 3 (Optional)
            </label>
            <input
              type="text"
              value={opt3}
              onChange={(e) => setOpt3(e.target.value)}
              placeholder="e.g. Mulungushi Chimbwi Gate"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 text-xs text-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 rounded-lg"
            >
              Publish Poll
            </button>
          </div>
        </form>
      )}

      {/* Polls List */}
      <div className="space-y-4">
        {polls.map((poll) => {
          const hasVoted = Boolean(poll.userVotedOptionId);

          return (
            <div
              key={poll.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              {/* Poll Metadata */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {poll.category}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{poll.closingDate}</span>
                  </span>
                </div>
                <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
                  {poll.totalVotes} votes cast
                </span>
              </div>

              {/* Question */}
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {poll.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {poll.options.map((option) => {
                  const percentage =
                    poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                  const isSelected = poll.userVotedOptionId === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => onVotePoll(poll.id, option.id)}
                      className={`w-full text-left p-3 rounded-xl border relative overflow-hidden transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 font-semibold'
                          : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/60'
                      }`}
                    >
                      {/* Animated Progress Bar fill */}
                      {hasVoted && (
                        <div
                          className="absolute inset-y-0 left-0 bg-amber-500/15 dark:bg-amber-500/25 transition-all duration-500 pointer-events-none"
                          style={{ width: `${percentage}%` }}
                        />
                      )}

                      <div className="relative flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-amber-600 bg-amber-600 text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span className="text-slate-800 dark:text-slate-200 font-medium">
                            {option.text}
                          </span>
                        </div>

                        {hasVoted && (
                          <div className="flex items-center gap-2 tabular-nums shrink-0">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {percentage}%
                            </span>
                            <span className="text-[11px] text-slate-400">
                              ({option.votes})
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {!hasVoted && (
                <p className="text-[11px] text-slate-400 italic">
                  Tap an option to cast your anonymous vote and reveal live campus percentages.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
