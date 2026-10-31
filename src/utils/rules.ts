import { GossipPost, PostCategory, UniversityId } from '../types';

/**
 * Checks whether content contains leaked phone numbers (Zambian networks: Airtel 097/077, MTN 096/076, Zamtel 095/075)
 * or explicit illegal doxxing formats to protect student anonymity and comply with campus safety standards.
 */
export function validateContentSafety(text: string): { isValid: boolean; warning?: string } {
  if (!text || text.trim().length === 0) {
    return { isValid: false, warning: 'Post cannot be empty.' };
  }

  // Check for Zambian mobile phone numbers (e.g., 097xxxxxxx, 096xxxxxxx, 095xxxxxxx, 077xxxxxxx, 076xxxxxxx, +260...)
  const phonePattern = /(?:\+?260\s?|0)(?:9[567]|7[567])(?:\s?\d){7}/g;
  if (phonePattern.test(text)) {
    return {
      isValid: false,
      warning: 'Safety Alert: Leaking private mobile phone numbers violates ZedWhisper anti-doxxing policy.',
    };
  }

  // Check for severe defamatory keywords / doxxing phrases
  const blockedPatterns = [
    /\b(kill yourself|commit suicide)\b/i,
    /\b(send nudes|leak nudes)\b/i,
    /\b(bank account pin|atm pin)\b/i,
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        warning: 'This message contains prohibited content violating student safety rules.',
      };
    }
  }

  return { isValid: true };
}

/**
 * Generates an authentic anonymous student persona based on campus slang
 */
export function generateAnonymousAlias(university: UniversityId): string {
  const unzaAliases = [
    'Ruined Monk',
    'Goma Lakes Philosopher',
    'Soweto Hall Ghost',
    'NS1 Backbencher',
    'October Park Dreamer',
    'Kavulamunzi Whisperer',
    'Vet Hill Wanderer',
  ];

  const cbuAliases = [
    'Jambo Drive Engineer',
    'Council Bench Debater',
    'Riverside Alchemist',
    'Mopani Shadow',
    'Kitwe Copper Scholar',
    'COBUSU Observer',
  ];

  const mulungushiAliases = [
    'Chimbwi Rock Insider',
    'Great North Road Pilgrim',
    'Town Campus Nomad',
    'Kabwe Horizon',
  ];

  const nipaAliases = [
    'Dushanbe Road Diplomat',
    'Burma Road Administrator',
    'Governance Strategist',
    'NIPA Moot Orator',
    'Public Policy Sage',
    'Chartered Secretary',
  ];

  const genericAliases = [
    'Anonymous Scholar',
    'Midnight Tea Brewer',
    'HELSB Survivor',
    'Library Phantom',
    'Final Year Veteran',
    'Silent Fresher',
  ];

  let pool = genericAliases;
  if (university === 'unza') pool = [...unzaAliases, ...genericAliases];
  else if (university === 'cbu') pool = [...cbuAliases, ...genericAliases];
  else if (university === 'mulungushi') pool = [...mulungushiAliases, ...genericAliases];
  else if (university === 'nipa') pool = [...nipaAliases, ...genericAliases];

  const randomIndex = Math.floor(Math.random() * pool.length);
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `${pool[randomIndex]} #${randomSuffix}`;
}

/**
 * Calculates trending score for gossip / campus news feed
 */
export function calculateTrendingScore(post: {
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  timestamp: string;
}): number {
  const baseScore = post.upvotes * 2 - post.downvotes + post.commentsCount * 3;
  return Math.max(0, baseScore);
}

/**
 * Verifies if a secret crush matches mutually
 */
export function isSecretCrushMutual(
  currentUserSubmissions: string[],
  targetHandleOrId: string,
  targetAlsoCrushesOnUser: boolean
): boolean {
  if (!targetHandleOrId) return false;
  const normalizedTarget = targetHandleOrId.trim().toLowerCase();
  const hasUserSubmitted = currentUserSubmissions.some(
    (h) => h.trim().toLowerCase() === normalizedTarget
  );
  return hasUserSubmitted && targetAlsoCrushesOnUser;
}

/**
 * Formats free campus treat dispatch (zero payment or fees required)
 */
export function formatCampusGiftDispatch(
  senderAlias: string,
  giftName: string
): { success: boolean; message: string } {
  return {
    success: true,
    message: `${senderAlias} sent ${giftName} with warm campus compliments!`,
  };
}

/**
 * Filters posts based on active university tab, category, and search text
 */
export function filterPosts(
  posts: GossipPost[],
  university: UniversityId,
  category: PostCategory,
  searchQuery: string
): GossipPost[] {
  return posts.filter((post) => {
    // University filter
    if (university !== 'all' && post.university !== university) {
      return false;
    }

    // Category filter
    if (category !== 'all' && post.category !== category) {
      return false;
    }

    // Search query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = post.title.toLowerCase().includes(q);
      const matchesContent = post.content.toLowerCase().includes(q);
      const matchesAlias = post.authorAlias.toLowerCase().includes(q);
      const matchesTags = post.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!matchesTitle && !matchesContent && !matchesAlias && !matchesTags) {
        return false;
      }
    }

    return true;
  });
}
