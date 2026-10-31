import React, { useState, useEffect } from 'react';
import {
  CampusGiftItem,
  CampusPoll,
  ChatConversation,
  CurrentUser,
  GossipPost,
  PostCategory,
  StudentProfile,
  UniversityId,
} from './types';
import {
  CAMPUS_POLLS,
  CURRENT_USER,
  INITIAL_CONVERSATIONS,
  INITIAL_POSTS,
  STUDENT_PROFILES,
  UNIVERSITIES,
} from './data/mockData';
import { filterPosts, isSecretCrushMutual } from './utils/rules';
import { Navbar } from './components/Navbar';
import { UniversityFilterBar } from './components/UniversityFilterBar';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { GossipFeed } from './components/GossipFeed';
import { PostComposerModal } from './components/PostComposerModal';
import { PostDetailModal } from './components/PostDetailModal';
import { CampusCrushEncounter } from './components/CampusCrushEncounter';
import { SecretCrushModal } from './components/SecretCrushModal';
import { GiftsModal } from './components/GiftsModal';
import { CampusPolls } from './components/CampusPolls';
import { DirectMessages } from './components/DirectMessages';
import { StudentProfileModal } from './components/StudentProfileModal';
import { SafetyGuidelinesModal } from './components/SafetyGuidelinesModal';
import { Flame, ShieldCheck, Heart, Sparkles, Check, Bell } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'feed' | 'dating' | 'secret_crush' | 'polls' | 'messages'>('feed');

  // University & Category Filter States
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityId>('all');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'latest' | 'discussed'>('trending');

  // Application Data States
  const [posts, setPosts] = useState<GossipPost[]>(() => {
    const saved = localStorage.getItem('zedwhisper_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [profiles, setProfiles] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('zedwhisper_profiles');
    return saved ? JSON.parse(saved) : STUDENT_PROFILES;
  });

  const [polls, setPolls] = useState<CampusPoll[]>(() => {
    const saved = localStorage.getItem('zedwhisper_polls');
    return saved ? JSON.parse(saved) : CAMPUS_POLLS;
  });

  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    const saved = localStorage.getItem('zedwhisper_convs');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const saved = localStorage.getItem('zedwhisper_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  // Modals & Panels State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<GossipPost | null>(null);
  const [isGiftsModalOpen, setIsGiftsModalOpen] = useState(false);
  const [targetProfileForGift, setTargetProfileForGift] = useState<StudentProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('zedwhisper_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('zedwhisper_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('zedwhisper_polls', JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem('zedwhisper_convs', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('zedwhisper_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Sorting and Filtering logic
  const filteredPosts = filterPosts(posts, selectedUniversity, selectedCategory, searchQuery);
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'latest') return 0; // maintain raw sequence or timestamp
    if (sortBy === 'discussed') return b.commentsCount - a.commentsCount;
    // default trending
    return b.upvotes - a.upvotes;
  });

  // Total unread messages count
  const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Handlers for Posts & Voting
  const handleVotePost = (postId: string, direction: 'up' | 'down') => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        if (post.userVoted === direction) {
          // toggle off
          return {
            ...post,
            userVoted: undefined,
            upvotes: direction === 'up' ? post.upvotes - 1 : post.upvotes,
            downvotes: direction === 'down' ? post.downvotes - 1 : post.downvotes,
          };
        }
        const prevVote = post.userVoted;
        return {
          ...post,
          userVoted: direction,
          upvotes:
            direction === 'up'
              ? post.upvotes + 1
              : prevVote === 'up'
              ? post.upvotes - 1
              : post.upvotes,
          downvotes:
            direction === 'down'
              ? post.downvotes + 1
              : prevVote === 'down'
              ? post.downvotes - 1
              : post.downvotes,
        };
      })
    );

    // Also update modal view if open
    if (selectedPostForDetail && selectedPostForDetail.id === postId) {
      setSelectedPostForDetail((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          userVoted: prev.userVoted === direction ? undefined : direction,
          upvotes:
            direction === 'up'
              ? prev.userVoted === 'up'
                ? prev.upvotes - 1
                : prev.upvotes + 1
              : prev.userVoted === 'up'
              ? prev.upvotes - 1
              : prev.upvotes,
        };
      });
    }
  };

  const handleBookmark = (postId: string) => {
    const isBookmarked = currentUser.bookmarkedPostIds.includes(postId);
    const updated = isBookmarked
      ? currentUser.bookmarkedPostIds.filter((id) => id !== postId)
      : [...currentUser.bookmarkedPostIds, postId];

    setCurrentUser((prev) => ({ ...prev, bookmarkedPostIds: updated }));
    showToast(isBookmarked ? 'Removed from bookmarks' : 'Whisper saved to bookmarks');
  };

  const handleReport = (postId: string) => {
    showToast('Report submitted for moderation review. Thank you for keeping campus safe.');
  };

  const handleCreatePost = (newPostData: {
    title: string;
    content: string;
    university: UniversityId;
    campusBranch: string;
    category: PostCategory;
    isAnonymous: boolean;
    isSpoilerTea: boolean;
    tags: string[];
    eventDate?: string;
    eventVenue?: string;
    isActivityLive?: boolean;
  }) => {
    const authorAlias = newPostData.isAnonymous
      ? `Anonymous Scholar #${Math.floor(100 + Math.random() * 900)}`
      : currentUser.alias;

    const newPost: GossipPost = {
      id: `post-${Date.now()}`,
      title: newPostData.title,
      content: newPostData.content,
      university: newPostData.university,
      campusBranch: newPostData.campusBranch || 'Main Campus',
      category: newPostData.category,
      authorAlias,
      isAnonymous: newPostData.isAnonymous,
      isSpoilerTea: newPostData.isSpoilerTea,
      eventDate: newPostData.eventDate,
      eventVenue: newPostData.eventVenue,
      isActivityLive: newPostData.isActivityLive,
      upvotes: 1,
      downvotes: 0,
      userVoted: 'up',
      commentsCount: 0,
      comments: [],
      timestamp: 'Just now',
      tags: newPostData.tags,
    };

    setPosts([newPost, ...posts]);
    showToast('Campus activity update published! 📢');
  };

  const handleAddComment = (postId: string, commentText: string, isAnonymous: boolean) => {
    const authorAlias = isAnonymous
      ? `Anonymous Scholar #${Math.floor(100 + Math.random() * 900)}`
      : currentUser.alias;

    const newComment = {
      id: `c-${Date.now()}`,
      postId,
      authorAlias,
      authorUniversity: currentUser.university,
      isAuthorGhost: isAnonymous,
      content: commentText,
      upvotes: 0,
      timestamp: 'Just now',
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComment],
        };
      })
    );

    if (selectedPostForDetail && selectedPostForDetail.id === postId) {
      setSelectedPostForDetail((prev) =>
        prev
          ? {
              ...prev,
              commentsCount: prev.commentsCount + 1,
              comments: [...prev.comments, newComment],
            }
          : null
      );
    }
  };

  const handleVoteComment = (postId: string, commentId: string, direction: 'up' | 'down') => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((c) => {
            if (c.id !== commentId) return c;
            const alreadyVoted = c.userVoted === direction;
            return {
              ...c,
              userVoted: alreadyVoted ? undefined : direction,
              upvotes: alreadyVoted ? c.upvotes - 1 : c.upvotes + 1,
            };
          }),
        };
      })
    );

    if (selectedPostForDetail && selectedPostForDetail.id === postId) {
      setSelectedPostForDetail((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.map((c) =>
                c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c
              ),
            }
          : null
      );
    }
  };

  // Handlers for Campus Encounters & Gifts
  const handleOpenGiftModal = (profile: StudentProfile) => {
    setTargetProfileForGift(profile);
    setIsGiftsModalOpen(true);
  };

  const handleSendGift = (
    targetProfileId: string,
    gift: CampusGiftItem,
    isAnonymous: boolean,
    note: string
  ) => {
    // Increment user treats sent count
    setCurrentUser((prev) => ({
      ...prev,
      treatsSentCount: (prev.treatsSentCount || 0) + 1,
    }));

    // Update target profile's gifts received shelf
    const giftRecord: CampusGiftItem = {
      ...gift,
      senderAlias: isAnonymous ? 'Secret Admirer' : currentUser.alias,
      dateSent: 'Just now',
    };

    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== targetProfileId) return p;
        return {
          ...p,
          giftsReceived: [giftRecord, ...p.giftsReceived],
          reputationScore: p.reputationScore + 20,
        };
      })
    );

    showToast(`Sent ${gift.name} successfully! 🎁`);
  };

  const handleStartChatWithProfile = (targetProfile: StudentProfile) => {
    // Check if conversation already exists
    let existingConv = conversations.find((c) => c.partnerId === targetProfile.id);
    if (!existingConv) {
      existingConv = {
        id: `conv-${Date.now()}`,
        partnerId: targetProfile.id,
        partnerName: targetProfile.name,
        partnerAlias: targetProfile.alias,
        partnerUniversity: targetProfile.university,
        partnerAvatarSeed: targetProfile.name,
        lastMessage: 'Conversation opened via Campus Encounters',
        lastTimestamp: 'Just now',
        unreadCount: 0,
        isIncognito: currentUser.isGhostMode,
        messages: [
          {
            id: `m-${Date.now()}`,
            conversationId: `conv-${Date.now()}`,
            senderId: currentUser.id,
            senderAlias: currentUser.isGhostMode ? 'Anonymous Whisper' : currentUser.alias,
            isSenderGhost: currentUser.isGhostMode,
            text: `Hey ${targetProfile.name}! Saw you on ZedWhisper campus encounters.`,
            timestamp: 'Just now',
          },
        ],
      };
      setConversations([existingConv, ...conversations]);
    }

    setActiveConversationId(existingConv.id);
    setActiveTab('messages');
  };

  // Secret Crush Submission
  const handleSubmitSecretCrush = (targetHandle: string) => {
    const handleClean = targetHandle.trim();
    // Add to current user vault
    if (!currentUser.secretCrushesSubmitted.includes(handleClean)) {
      setCurrentUser((prev) => ({
        ...prev,
        secretCrushesSubmitted: [...prev.secretCrushesSubmitted, handleClean],
      }));
    }

    // Check if matches anyone in profiles (e.g. Natasha Mwamba or Kondwani Zulu)
    const matchingProfile = profiles.find(
      (p) =>
        p.alias.toLowerCase().includes(handleClean.toLowerCase().replace('@', '')) ||
        p.name.toLowerCase().includes(handleClean.toLowerCase())
    );

    // If matching profile is found, mark as match!
    if (matchingProfile) {
      return { isMatch: true, matchedProfile: matchingProfile };
    }

    return { isMatch: false };
  };

  // Polls Voting & Creating
  const handleVotePoll = (pollId: string, optionId: string) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        if (poll.userVotedOptionId === optionId) return poll; // already voted this option

        const prevOptionId = poll.userVotedOptionId;
        return {
          ...poll,
          userVotedOptionId: optionId,
          totalVotes: prevOptionId ? poll.totalVotes : poll.totalVotes + 1,
          options: poll.options.map((opt) => {
            if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
            if (opt.id === prevOptionId) return { ...opt, votes: Math.max(0, opt.votes - 1) };
            return opt;
          }),
        };
      })
    );
    showToast('Anonymous campus vote recorded!');
  };

  const handleCreatePoll = (question: string, optionsTexts: string[], category: string) => {
    const newPoll: CampusPoll = {
      id: `poll-${Date.now()}`,
      question,
      university: selectedUniversity,
      category,
      totalVotes: 0,
      closingDate: 'Closes in 5 days',
      options: optionsTexts.map((txt, idx) => ({
        id: `opt-${Date.now()}-${idx}`,
        text: txt,
        votes: 0,
      })),
    };
    setPolls([newPoll, ...polls]);
    showToast('Campus poll published!');
  };

  // Direct Message Sending (Real user-driven communication, no bot simulations)
  const handleSendMessage = (conversationId: string, text: string, isGhost: boolean) => {
    const newMessage = {
      id: `m-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderAlias: isGhost ? 'Ghost Monk' : currentUser.alias,
      isSenderGhost: isGhost,
      text,
      timestamp: 'Just now',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          lastMessage: text,
          lastTimestamp: 'Just now',
          messages: [...c.messages, newMessage],
        };
      })
    );
  };

  const handleToggleGhostMode = () => {
    const newMode = !currentUser.isGhostMode;
    setCurrentUser((prev) => ({ ...prev, isGhostMode: newMode }));
    showToast(newMode ? 'Ghost Mode Activated (Total Anonymity)' : 'Verified Student Persona Active');
  };

  const handleClearSession = () => {
    localStorage.clear();
    setPosts(INITIAL_POSTS);
    setProfiles(STUDENT_PROFILES);
    setPolls(CAMPUS_POLLS);
    setConversations(INITIAL_CONVERSATIONS);
    setCurrentUser(CURRENT_USER);
    setIsProfileModalOpen(false);
    showToast('Session wiped and reset for security.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 bg-slate-900 text-white dark:bg-emerald-600 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Bell className="w-4 h-4 text-emerald-400 dark:text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Strict 3-zone Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenComposer={() => setIsComposerOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenSafety={() => setIsSafetyModalOpen(true)}
        onToggleGhostMode={handleToggleGhostMode}
        unreadCount={unreadCount}
      />

      {/* University Campus Hub Selector (Always available in Buzz and Encounters) */}
      {(activeTab === 'feed' || activeTab === 'dating') && (
        <UniversityFilterBar
          selectedUniversity={selectedUniversity}
          onSelectUniversity={setSelectedUniversity}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab 1: Campus Buzz & Anonymous Gossip */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 8 columns: Post Categories & Feed */}
            <div className="lg:col-span-8">
              <CategoryFilterBar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              <GossipFeed
                posts={sortedPosts}
                onVote={handleVotePost}
                onOpenPostDetail={(post) => setSelectedPostForDetail(post)}
                onBookmark={handleBookmark}
                bookmarkedIds={currentUser.bookmarkedPostIds}
                onReport={handleReport}
                onOpenComposer={() => setIsComposerOpen(true)}
              />
            </div>

            {/* Right 4 columns: Campus Spotlight, Trending Hot Topics & Quick Actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* Zambian Student Verification Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Student Safety & Anonymity</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Post freely without fear. Your real identity is protected by zero-knowledge tripcodes and automated anti-doxxing shields.
                </p>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Current persona:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    {currentUser.isGhostMode ? '👻 Incognito Monk' : `🎓 ${currentUser.alias}`}
                  </span>
                </div>
              </div>

              {/* Trending Campus Topics */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>Trending on Zambian Campuses</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <button
                    onClick={() => {
                      setSearchQuery('helsb');
                      setSelectedCategory('all');
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      #HELSB_Batch2_Allowance
                    </span>
                    <span className="text-[11px] text-slate-400">142 whispers</span>
                  </button>

                  <button
                    onClick={() => {
                      setSearchQuery('soweto');
                      setSelectedCategory('all');
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      #UNZA_Soweto_Hall
                    </span>
                    <span className="text-[11px] text-slate-400">89 whispers</span>
                  </button>

                  <button
                    onClick={() => {
                      setSearchQuery('cbu');
                      setSelectedCategory('all');
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      #CBU_Council_Bench
                    </span>
                    <span className="text-[11px] text-slate-400">114 whispers</span>
                  </button>

                  <button
                    onClick={() => {
                      setSearchQuery('cavendish');
                      setSelectedCategory('all');
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      #Cavendish_Law_Moot
                    </span>
                    <span className="text-[11px] text-slate-400">97 whispers</span>
                  </button>

                  <button
                    onClick={() => {
                      setSearchQuery('nipa');
                      setSelectedCategory('all');
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      #NIPA_Dushanbe_Debate
                    </span>
                    <span className="text-[11px] text-slate-400">112 whispers</span>
                  </button>
                </div>
              </div>

              {/* Quick Campus Encounters Teaser */}
              <div className="p-5 rounded-2xl bg-gradient-to-tr from-pink-500/10 via-rose-500/5 to-amber-500/10 border border-pink-200 dark:border-pink-900/40 space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                  <span className="text-xs font-bold text-pink-700 dark:text-pink-300">
                    ZedMatch Encounters
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Swipe through verified student profiles across UNZA, CBU, Mulungushi, and Cavendish.
                </p>
                <button
                  onClick={() => setActiveTab('dating')}
                  className="w-full py-2 text-xs font-bold text-pink-700 dark:text-pink-300 bg-white dark:bg-slate-800 rounded-xl border border-pink-200 dark:border-pink-800/60 hover:bg-pink-50 transition-colors shadow-xs"
                >
                  Explore Campus Crushes →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Campus Crush & Dating Encounters (Reverse engineered from Youdate!) */}
        {activeTab === 'dating' && (
          <CampusCrushEncounter
            profiles={profiles}
            currentUser={currentUser}
            onSendGiftClick={handleOpenGiftModal}
            onStartChat={handleStartChatWithProfile}
            onMatchCreated={(matchedProfile) => {
              showToast(`You and ${matchedProfile.name} matched! 🎉`);
            }}
          />
        )}

        {/* Tab 3: Secret Crush Lockbox */}
        {activeTab === 'secret_crush' && (
          <SecretCrushModal
            currentUser={currentUser}
            profiles={profiles}
            onSubmitCrush={handleSubmitSecretCrush}
            onStartChat={handleStartChatWithProfile}
          />
        )}

        {/* Tab 4: Campus Polls & Hot Takes */}
        {activeTab === 'polls' && (
          <CampusPolls
            polls={polls}
            currentUser={currentUser}
            onVotePoll={handleVotePoll}
            onCreatePoll={handleCreatePoll}
          />
        )}

        {/* Tab 5: Whisper Direct Messages */}
        {activeTab === 'messages' && (
          <DirectMessages
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 bg-white dark:bg-slate-900 text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-900 dark:text-white">
              ZedWhisper
            </span>
            <span>·</span>
            <span>For all Higher Learning Institutions in Zambia</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsSafetyModalOpen(true)}
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Cyber Safety Rules
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              My Campus ID
            </button>
            <span>© 2026 ZedWhisper Zambia</span>
          </div>
        </div>
      </footer>

      {/* Modal Dialogs */}
      <PostComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        currentUser={currentUser}
        onSubmitPost={handleCreatePost}
      />

      <PostDetailModal
        post={selectedPostForDetail}
        isOpen={Boolean(selectedPostForDetail)}
        onClose={() => setSelectedPostForDetail(null)}
        currentUser={currentUser}
        onVotePost={handleVotePost}
        onAddComment={handleAddComment}
        onVoteComment={handleVoteComment}
        onReport={handleReport}
      />

      <GiftsModal
        isOpen={isGiftsModalOpen}
        onClose={() => {
          setIsGiftsModalOpen(false);
          setTargetProfileForGift(null);
        }}
        targetProfile={targetProfileForGift}
        currentUser={currentUser}
        onSendGift={handleSendGift}
      />

      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onToggleGhostMode={handleToggleGhostMode}
        onClearSession={handleClearSession}
      />

      <SafetyGuidelinesModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />
    </div>
  );
}
