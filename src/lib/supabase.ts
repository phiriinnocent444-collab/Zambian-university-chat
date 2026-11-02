import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { GossipPost, PostComment, ChatMessage, PostCategory, UniversityId } from '../types';

const DEFAULT_SUPABASE_URL = 'https://rflxrnpmmnkwnfgwldma.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_yPHTFGSZev1yGACMZQsEgQ_zBLDIJRE';

/**
 * Validates whether an arbitrary input string is a valid HTTP or HTTPS URL
 */
export function isValidHttpUrl(candidate: unknown): boolean {
  if (typeof candidate !== 'string') return false;
  const trimmed = candidate.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates whether an arbitrary input string is a plausible Supabase key
 */
export function isValidSupabaseKey(candidate: unknown): boolean {
  if (typeof candidate !== 'string') return false;
  const trimmed = candidate.trim();
  return trimmed.length > 20 && !trimmed.includes(' ') && !trimmed.includes('\n');
}

/**
 * Resolves the Supabase URL safely from localStorage, environment, or default fallback
 */
export function resolveSupabaseUrl(): string {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const customUrl = window.localStorage.getItem('zed_custom_supabase_url');
      if (isValidHttpUrl(customUrl)) {
        return (customUrl as string).trim();
      }
    }
  } catch {
    // localStorage may be restricted in sandboxes
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  if (isValidHttpUrl(envUrl)) {
    return (envUrl as string).trim();
  }

  return DEFAULT_SUPABASE_URL;
}

/**
 * Resolves the Supabase Anon Key safely from localStorage, environment, or default fallback
 */
export function resolveSupabaseAnonKey(): string {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const customKey = window.localStorage.getItem('zed_custom_supabase_anon_key');
      if (isValidSupabaseKey(customKey)) {
        return (customKey as string).trim();
      }
    }
  } catch {
    // localStorage may be restricted in sandboxes
  }

  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (isValidSupabaseKey(envKey)) {
    return (envKey as string).trim();
  }

  return DEFAULT_SUPABASE_ANON_KEY;
}

export const SUPABASE_URL = resolveSupabaseUrl();
export const SUPABASE_ANON_KEY = resolveSupabaseAnonKey();

function createResilientSupabaseClient() {
  const url = resolveSupabaseUrl();
  const key = resolveSupabaseAnonKey();

  try {
    return createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Supabase with custom config, falling back to default:', err);
    return createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
  }
}

export const supabase = createResilientSupabaseClient();

// Singleton Realtime Broadcast Channel for instant sub-50ms sync across all mobile devices
let liveBroadcastChannel: RealtimeChannel | null = null;

export function getLiveBroadcastChannel(): RealtimeChannel {
  if (!liveBroadcastChannel) {
    liveBroadcastChannel = supabase.channel('campus-live-sync', {
      config: {
        broadcast: { ack: false, self: false },
      },
    });
    liveBroadcastChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Connected to ZedWhisper Live Multi-Device Campus Sync');
      }
    });
  }
  return liveBroadcastChannel;
}

/**
 * Broadcasts a freshly published post to all connected phones in real time
 */
export function broadcastNewPost(post: GossipPost): void {
  try {
    const channel = getLiveBroadcastChannel();
    channel.send({
      type: 'broadcast',
      event: 'new_post',
      payload: post,
    });
  } catch (err) {
    console.warn('Live broadcast new_post warning:', err);
  }
}

/**
 * Broadcasts an upvote/downvote change to all connected phones in real time
 */
export function broadcastPostVote(postId: string, upvotes: number, downvotes: number): void {
  try {
    const channel = getLiveBroadcastChannel();
    channel.send({
      type: 'broadcast',
      event: 'post_voted',
      payload: { postId, upvotes, downvotes },
    });
  } catch (err) {
    console.warn('Live broadcast post_voted warning:', err);
  }
}

/**
 * Broadcasts a new comment to all connected phones in real time
 */
export function broadcastNewComment(postId: string, comment: PostComment): void {
  try {
    const channel = getLiveBroadcastChannel();
    channel.send({
      type: 'broadcast',
      event: 'new_comment',
      payload: { postId, comment },
    });
  } catch (err) {
    console.warn('Live broadcast new_comment warning:', err);
  }
}

/**
 * Broadcasts a direct whisper message to the recipient's phone in real time
 */
export function broadcastDirectMessage(message: ChatMessage, recipientId: string): void {
  try {
    const channel = getLiveBroadcastChannel();
    channel.send({
      type: 'broadcast',
      event: 'new_message',
      payload: { message, recipientId },
    });
  } catch (err) {
    console.warn('Live broadcast new_message warning:', err);
  }
}

export interface SupabaseHealth {
  connected: boolean;
  tableReady: boolean;
  url: string;
  projectRef: string;
  errorMessage?: string;
}

/**
 * Checks connectivity to the Supabase backend
 */
export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];
  try {
    const { data, error } = await supabase.from('posts').select('id').limit(1);
    if (error) {
      // If table doesn't exist yet (PGRST205)
      const isMissingTable = error.code === 'PGRST205' || error.message.includes('Could not find the table');
      return {
        connected: true,
        tableReady: !isMissingTable,
        url: SUPABASE_URL,
        projectRef,
        errorMessage: isMissingTable 
          ? "Table 'posts' not created yet. Run supabase-schema.sql in Supabase SQL editor to activate."
          : error.message,
      };
    }
    return {
      connected: true,
      tableReady: true,
      url: SUPABASE_URL,
      projectRef,
    };
  } catch (err: any) {
    return {
      connected: false,
      tableReady: false,
      url: SUPABASE_URL,
      projectRef,
      errorMessage: err?.message || 'Network unreachable',
    };
  }
}

/**
 * Fetch all posts from Supabase database
 */
export async function fetchSupabasePosts(): Promise<GossipPost[] | null> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return null;
    }

    // Map database snake_case columns to GossipPost
    return data.map((row: any) => ({
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
      timestamp: formatRelativeTime(row.created_at),
      tags: row.tags || [],
    }));
  } catch {
    return null;
  }
}

/**
 * Insert a new post into Supabase
 */
export async function createSupabasePost(post: GossipPost): Promise<boolean> {
  try {
    const { error } = await supabase.from('posts').insert({
      id: post.id,
      title: post.title,
      content: post.content,
      university: post.university,
      campus_branch: post.campusBranch || 'Main Campus',
      category: post.category,
      author_alias: post.authorAlias,
      is_anonymous: post.isAnonymous,
      is_spoiler_tea: post.isSpoilerTea ?? false,
      event_venue: post.eventVenue,
      event_date: post.eventDate,
      is_activity_live: post.isActivityLive ?? false,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      comments_count: 0,
      tags: post.tags,
      status: 'published',
    });

    return !error;
  } catch {
    return false;
  }
}

/**
 * Upvote or Downvote a post in Supabase
 */
export async function voteSupabasePost(
  postId: string, 
  newUpvotes: number, 
  newDownvotes: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('posts')
      .update({ upvotes: newUpvotes, downvotes: newDownvotes })
      .eq('id', postId);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Fetch comments for a specific post
 */
export async function fetchSupabaseComments(postId: string): Promise<PostComment[] | null> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('status', 'published')
      .order('created_at', { ascending: true });

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      postId: row.post_id,
      authorAlias: row.author_alias,
      authorUniversity: row.author_university as UniversityId,
      isAuthorGhost: row.is_author_ghost ?? false,
      content: row.content,
      upvotes: row.upvotes ?? 0,
      timestamp: formatRelativeTime(row.created_at),
    }));
  } catch {
    return null;
  }
}

/**
 * Add a comment to Supabase
 */
export async function addSupabaseComment(
  comment: PostComment, 
  currentCommentsCount: number
): Promise<boolean> {
  try {
    const { error: commentError } = await supabase.from('comments').insert({
      id: comment.id,
      post_id: comment.postId,
      author_alias: comment.authorAlias,
      author_university: comment.authorUniversity,
      is_author_ghost: comment.isAuthorGhost,
      content: comment.content,
      upvotes: 0,
      status: 'published',
    });

    if (commentError) return false;

    // Increment comments_count on post
    await supabase
      .from('posts')
      .update({ comments_count: currentCommentsCount + 1 })
      .eq('id', comment.postId);

    return true;
  } catch {
    return false;
  }
}

/**
 * Send a direct message to Supabase
 */
export async function sendSupabaseDirectMessage(
  msg: ChatMessage,
  recipientId: string
): Promise<boolean> {
  try {
    const { error } = await supabase.from('messages').insert({
      id: msg.id,
      conversation_id: msg.conversationId,
      sender_id: msg.senderId,
      recipient_id: recipientId,
      sender_alias: msg.senderAlias,
      is_sender_ghost: msg.isSenderGhost,
      text: msg.text,
    });

    return !error;
  } catch {
    return false;
  }
}

/**
 * Submit safety report to Supabase
 */
export async function submitSupabaseReport(
  reporterId: string,
  contentId: string,
  contentType: 'post' | 'comment' | 'message',
  reason: string
): Promise<boolean> {
  try {
    const { error } = await supabase.from('reports').insert({
      id: `rep-${Date.now()}`,
      reporter_id: reporterId,
      content_id: contentId,
      content_type: contentType,
      reason,
      status: 'open',
    });

    return !error;
  } catch {
    return false;
  }
}

/**
 * Format timestamp into human-readable relative time
 */
function formatRelativeTime(dateString: string): string {
  if (!dateString) return 'Just now';
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}
