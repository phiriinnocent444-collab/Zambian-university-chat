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
import { SupabaseModal } from './components/SupabaseModal';
import { StudentQrModal } from './components/StudentQrModal';
import { CampusGoogleMap } from './components/CampusGoogleMap';
import { CampusEventCalendar } from './components/CampusEventCalendar';
import {
  supabase,
  checkSupabaseHealth,
  fetchSupabasePosts,
  fetchSupabaseComments,
  createSupabasePost,
  voteSupabasePost,
  addSupabaseComment,
  sendSupabaseDirectMessage,
  submitSupabaseReport,
  getLiveBroadcastChannel,
  broadcastNewPost,
  broadcastPostVote,
  broadcastNewComment,
  broadcastDirectMessage,
  SupabaseHealth,
} from './lib/supabase';
import { Flame, ShieldCheck, Heart, Sparkles, Check, Bell, Database } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<
    'feed' | 'dating' | 'secret_crush' | 'polls' | 'messages' | 'map' | 'calendar'
  >('feed');

  // University & Category Filter States
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityId>('all');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'latest' | 'discussed'>('trending');

  // Application Data States
  const [posts, setPosts] = useState<GossipPost[]>(() => {
    const saved = localStorage.getItem('zedwhisper_posts');
    if (saved) {
      try {
        const parsed: GossipPost[] = JSON.parse(saved);
        // Only keep genuine posts submitted during this or previous live sessions,
        // purging any legacy mock demo IDs so the postings board starts completely blank
        return parsed.filter(
          (p) =>
            !p.id.startsWith('post-seed-') &&
            !p.id.startsWith('post-sports-') &&
            !p.id.startsWith('post-event-') &&
            !p.id.startsWith('post-lost-') &&
            !p.id.startsWith('post-nipa-') &&
            !['post-1', 'post-2', 'post-3', 'post-4', 'post-5', 'post-6', 'post-7', 'post-8'].includes(p.id)
        );
      } catch {
        return [];
      }
    }
    return INITIAL_POSTS;
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
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isGmpQuotaExceeded, setIsGmpQuotaExceeded] = useState(false);
  const [presetVenue, setPresetVenue] = useState<{ name: string; university: UniversityId } | null>(null);

  const [supabaseHealth, setSupabaseHealth] = useState<SupabaseHealth>({
    connected: true,
    tableReady: false,
    url: 'https://rflxrnpmmnkwnfgwldma.supabase.co',
    projectRef: 'rflxrnpmmnkwnfgwldma',
  });

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check Supabase connectivity and initial load
  const refreshSupabase = async () => {
    const health = await checkSupabaseHealth();
    setSupabaseHealth(health);
    if (health.tableReady) {
      const remotePosts = await fetchSupabasePosts();
      if (remotePosts && remotePosts.length > 0) {
        setPosts(remotePosts);
      }
    }
  };

  useEffect(() => {
    refreshSupabase();

    // Check for discreet admin trigger in URL: ?admin=true or ?db=true or #admin
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || params.get('db') === 'true' || window.location.hash === '#admin') {
        setIsSupabaseModalOpen(true);
      }
    }

    // 1. Supabase Realtime Broadcast Channel: Instant sub-50ms peer-to-peer sync across all phones
    const broadcastChannel = getLiveBroadcastChannel();

    broadcastChannel
      .on('broadcast', { event: 'new_post' }, ({ payload }: { payload: GossipPost }) => {
        if (!payload || !payload.id) return;
        setPosts((prev) => {
          if (prev.some((p) => p.id === payload.id)) return prev;
          showToast(`🔥 New whisper dropped from ${payload.university.toUpperCase()}!`);
          return [payload, ...prev];
        });
      })
      .on('broadcast', { event: 'post_voted' }, ({ payload }: { payload: { postId: string; upvotes: number; downvotes: number } }) => {
        if (!payload || !payload.postId) return;
        setPosts((prev) =>
          prev.map((p) =>
            p.id === payload.postId
              ? { ...p, upvotes: payload.upvotes, downvotes: payload.downvotes }
              : p
          )
        );
      })
      .on('broadcast', { event: 'new_comment' }, ({ payload }: { payload: { postId: string; comment: any } }) => {
        if (!payload || !payload.postId || !payload.comment) return;
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id !== payload.postId) return p;
            if (p.comments.some((c) => c.id === payload.comment.id)) return p;
            return {
              ...p,
              commentsCount: p.commentsCount + 1,
              comments: [...p.comments, payload.comment],
            };
          })
        );
        setSelectedPostForDetail((prev) => {
          if (!prev || prev.id !== payload.postId) return prev;
          if (prev.comments.some((c) => c.id === payload.comment.id)) return prev;
          return {
            ...prev,
            commentsCount: prev.commentsCount + 1,
            comments: [...prev.comments, payload.comment],
          };
        });
      })
      .on('broadcast', { event: 'new_message' }, ({ payload }: { payload: { message: any; recipientId: string } }) => {
        if (!payload || !payload.message) return;
        const msg = payload.message;
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === msg.conversationId || c.partnerId === msg.senderId) {
              if (c.messages.some((m) => m.id === msg.id)) return c;
              return {
                ...c,
                lastMessage: msg.text,
                lastTimestamp: 'Just now',
                messages: [...c.messages, msg],
              };
            }
            return c;
          })
        );
      });

    // 2. Supabase Realtime Postgres Changes: Database row level sync
    const postsChannel = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload: any) => {
          const row = payload.new;
          if (!row) return;
          const mappedPost: GossipPost = {
            id: row.id,
            title: row.title,
            content: row.content,
            university: row.university as UniversityId,
            campusBranch: row.campus_branch || 'Main Campus',
            category: row.category as PostCategory,
            authorAlias: row.author_alias,
            isAnonymous: row.is_anonymous ?? true,
            isSpoilerTea: row.is_spoiler_tea ?? false,
            eventVenue: row.event_venue,
            eventDate: row.event_date,
            isActivityLive: row.is_activity_live ?? false,
            upvotes: row.upvotes ?? 0,
            downvotes: row.downvotes ?? 0,
            commentsCount: row.comments_count ?? 0,
            comments: [],
            timestamp: 'Just now',
            tags: row.tags || [],
          };
          setPosts((prev) => {
            if (prev.some((p) => p.id === mappedPost.id)) return prev;
            return [mappedPost, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'posts' },
        (payload: any) => {
          const row = payload.new;
          if (!row) return;
          setPosts((prev) =>
            prev.map((p) =>
              p.id === row.id
                ? {
                    ...p,
                    upvotes: row.upvotes ?? p.upvotes,
                    downvotes: row.downvotes ?? p.downvotes,
                    commentsCount: row.comments_count ?? p.commentsCount,
                  }
                : p
            )
          );
        }
      )
      .subscribe();

    // Direct whispers sync
    const messagesChannel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload: any) => {
          const row = payload.new;
          if (!row) return;
          const newMsg = {
            id: row.id,
            conversationId: row.conversation_id,
            senderId: row.sender_id,
            senderAlias: row.sender_alias,
            isSenderGhost: row.is_sender_ghost ?? false,
            text: row.text,
            timestamp: 'Just now',
          };
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === row.conversation_id || c.partnerId === row.sender_id) {
                if (c.messages.some((m) => m.id === newMsg.id)) return c;
                return {
                  ...c,
                  lastMessage: newMsg.text,
                  lastTimestamp: 'Just now',
                  messages: [...c.messages, newMsg],
                };
              }
              return c;
            })
          );
        }
      )
      .subscribe();

    // Refresh when user returns to phone tab
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        refreshSupabase();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Google Maps Demo Key Quota Defense listener
    const handleGmpQuota = () => {
      setIsGmpQuotaExceeded(true);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('gmp-quota-exceeded', handleGmpQuota);
    }

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(messagesChannel);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (typeof window !== 'undefined') {
        window.removeEventListener('gmp-quota-exceeded', handleGmpQuota);
      }
    };
  }, []);

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

  // Dynamic trending hashtags computed entirely from real student posts
  const trendingTags = React.useMemo(() => {
    const tagCountMap: Record<string, number> = {};
    posts.forEach((p) => {
      p.tags?.forEach((tag) => {
        const normalized = tag.startsWith('#') ? tag : `#${tag}`;
        tagCountMap[normalized] = (tagCountMap[normalized] || 0) + 1;
      });
    });
    return Object.entries(tagCountMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [posts]);

  // Total unread messages count
  const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);


  // Handlers for Posts & Voting
  const handleVotePost = (postId: string, direction: 'up' | 'down') => {
    let finalUp = 0;
    let finalDown = 0;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        if (post.userVoted === direction) {
          // toggle off
          const u = direction === 'up' ? post.upvotes - 1 : post.upvotes;
          const d = direction === 'down' ? post.downvotes - 1 : post.downvotes;
          finalUp = Math.max(0, u);
          finalDown = Math.max(0, d);
          return {
            ...post,
            userVoted: undefined,
            upvotes: finalUp,
            downvotes: finalDown,
          };
        }
        const prevVote = post.userVoted;
        const u = direction === 'up'
          ? post.upvotes + 1
          : prevVote === 'up'
          ? post.upvotes - 1
          : post.upvotes;
        const d = direction === 'down'
          ? post.downvotes + 1
          : prevVote === 'down'
          ? post.downvotes - 1
          : post.downvotes;
        finalUp = Math.max(0, u);
        finalDown = Math.max(0, d);
        return {
          ...post,
          userVoted: direction,
          upvotes: finalUp,
          downvotes: finalDown,
        };
      })
    );

    // Broadcast live vote to all connected phones across Zambia
    broadcastPostVote(postId, finalUp, finalDown);

    // Sync vote to Supabase
    voteSupabasePost(postId, finalUp, finalDown);

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

  // Open post detail and fetch latest remote comments
  const handleOpenPostDetail = async (post: GossipPost) => {
    setSelectedPostForDetail(post);
    try {
      const remoteComments = await fetchSupabaseComments(post.id);
      if (remoteComments && remoteComments.length > 0) {
        setSelectedPostForDetail((prev) =>
          prev && prev.id === post.id
            ? { ...prev, comments: remoteComments, commentsCount: Math.max(prev.commentsCount, remoteComments.length) }
            : prev
        );
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? { ...p, comments: remoteComments, commentsCount: Math.max(p.commentsCount, remoteComments.length) }
              : p
          )
        );
      }
    } catch {
      // Graceful local state retention
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
    submitSupabaseReport(currentUser.id, postId, 'post', 'Policy safety review');
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
    // Instant peer broadcast to all online phones across Zambia
    broadcastNewPost(newPost);
    // Save to central Supabase cloud database
    createSupabasePost(newPost);
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

    const targetPost = posts.find((p) => p.id === postId);
    addSupabaseComment(newComment, targetPost ? targetPost.commentsCount : 0);
    // Instant broadcast of new comment to all devices
    broadcastNewComment(postId, newComment);

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

    const activeConv = conversations.find((c) => c.id === conversationId);
    if (activeConv) {
      sendSupabaseDirectMessage(newMessage, activeConv.partnerId);
      broadcastDirectMessage(newMessage, activeConv.partnerId);
    }

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

  const handleOpenComposerWithVenue = (venueName: string, university: UniversityId) => {
    setSelectedUniversity(university);
    setPresetVenue({ name: venueName, university });
    setIsComposerOpen(true);
  };

  const handleViewVenueOnMap = (venueName: string, university: UniversityId) => {
    if (university !== 'all') {
      setSelectedUniversity(university);
    }
    setActiveTab('map');
    showToast(`Viewing ${venueName} on Campus Google Map 📍`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Google Maps Demo Key Quota Defense Banner */}
      {isGmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

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
        onOpenComposer={() => {
          setPresetVenue(null);
          setIsComposerOpen(true);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenSafety={() => setIsSafetyModalOpen(true)}
        onToggleGhostMode={handleToggleGhostMode}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        unreadCount={unreadCount}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        isSupabaseReady={supabaseHealth.tableReady}
      />

      {/* University Campus Hub Selector (Available in Buzz, Encounters, Map & Calendar) */}
      {(activeTab === 'feed' || activeTab === 'dating' || activeTab === 'map' || activeTab === 'calendar') && (
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
                onOpenPostDetail={handleOpenPostDetail}
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

                {trendingTags.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      No trending topics yet. As students post whispers with hashtags (#unza, #cbu, #exams), real trending topics will appear here live!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    {trendingTags.map((item) => (
                      <button
                        key={item.tag}
                        onClick={() => {
                          setSearchQuery(item.tag.replace('#', ''));
                          setSelectedCategory('all');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.tag}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {item.count} {item.count === 1 ? 'whisper' : 'whispers'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
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

        {/* Tab 6: Zambian Campus Google Map */}
        {activeTab === 'map' && (
          <CampusGoogleMap
            selectedUniversity={selectedUniversity}
            onSelectUniversity={setSelectedUniversity}
            onOpenComposerWithVenue={handleOpenComposerWithVenue}
            onViewEventsForVenue={(venue) => {
              setActiveTab('calendar');
              showToast(`Showing events for ${venue}`);
            }}
          />
        )}

        {/* Tab 7: Campus Event Calendar */}
        {activeTab === 'calendar' && (
          <CampusEventCalendar
            selectedUniversity={selectedUniversity}
            onSelectUniversity={setSelectedUniversity}
            onViewVenueOnMap={handleViewVenueOnMap}
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

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
            <button
              onClick={() => setIsSafetyModalOpen(true)}
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Cyber Safety Rules
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              My Campus ID
            </button>
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-slate-400 cursor-pointer"
              title="Campus Social QR Code & WhatsApp Gateway"
            >
              <span>Social QR Code</span>
            </button>
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-slate-400 cursor-pointer"
              title="Campus Cloud Database & Schema Setup"
            >
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              <span>Cloud & SQL Settings</span>
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
        initialVenue={presetVenue?.name}
        initialUniversity={presetVenue?.university}
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
        onOpenQrModal={() => setIsQrModalOpen(true)}
      />

      <StudentQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        currentUser={currentUser}
        profiles={profiles}
        onStartChatWithProfile={handleStartChatWithProfile}
        onOpenGiftModal={handleOpenGiftModal}
        onDropCrush={handleSubmitSecretCrush}
      />

      <SafetyGuidelinesModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        health={supabaseHealth}
        onRefreshHealth={refreshSupabase}
      />
    </div>
  );
}
