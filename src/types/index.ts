export type UniversityId = 
  | 'all'
  | 'unza'
  | 'cbu'
  | 'mulungushi'
  | 'nipa'
  | 'evelyn_hone'
  | 'lmmu'
  | 'cavendish'
  | 'zcas'
  | 'apex'
  | 'mukuba'
  | 'nkrumah'
  | 'eden';

export interface UniversityInfo {
  id: UniversityId;
  name: string;
  shortName: string;
  campuses: string[];
  city: string;
  motto: string;
  studentSlang: string;
  themeColor: string;
}

export type PostCategory = 
  | 'all'
  | 'news'
  | 'sports'
  | 'events'
  | 'exams'
  | 'hostel'
  | 'lost_found'
  | 'gossip'
  | 'crushes'
  | 'marketplace';

export interface PostComment {
  id: string;
  postId: string;
  authorAlias: string;
  authorUniversity: UniversityId;
  isAuthorGhost: boolean;
  content: string;
  upvotes: number;
  userVoted?: 'up' | 'down';
  timestamp: string;
}

export interface GossipPost {
  id: string;
  title: string;
  content: string;
  university: UniversityId;
  campusBranch?: string;
  category: PostCategory;
  authorAlias: string;
  isAnonymous: boolean;
  authorBadge?: string;
  isSpoilerTea?: boolean;
  isVerifiedNews?: boolean;
  eventDate?: string;
  eventVenue?: string;
  isActivityLive?: boolean;
  upvotes: number;
  downvotes: number;
  userVoted?: 'up' | 'down';
  commentsCount: number;
  comments: PostComment[];
  timestamp: string;
  tags: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  alias: string;
  age: number;
  gender: 'female' | 'male' | 'other';
  university: UniversityId;
  campus: string;
  program: string;
  yearOfStudy: number;
  bio: string;
  interests: string[];
  hangoutSpot: string;
  campusPromptQuestion: string;
  campusPromptAnswer: string;
  avatarSeed: string;
  avatarBgColor: string;
  isVerifiedStudent: boolean;
  giftsReceived: CampusGiftItem[];
  reputationScore: number;
  isCrushMatch?: boolean;
}

export interface CampusGiftItem {
  id: string;
  name: string;
  iconName: string;
  description: string;
  senderAlias?: string;
  dateSent?: string;
}

export interface CampusPoll {
  id: string;
  question: string;
  university: UniversityId;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
  userVotedOptionId?: string;
  closingDate: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderAlias: string;
  isSenderGhost: boolean;
  text: string;
  timestamp: string;
  giftAttached?: CampusGiftItem;
}

export interface ChatConversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAlias: string;
  partnerUniversity: UniversityId;
  partnerAvatarSeed: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  isIncognito: boolean;
  messages: ChatMessage[];
}

export interface CurrentUser {
  id: string;
  realName: string;
  alias: string;
  university: UniversityId;
  campus: string;
  program: string;
  year: number;
  isGhostMode: boolean;
  treatsSentCount: number;
  secretCrushesSubmitted: string[];
  bookmarkedPostIds: string[];
  whatsAppRelay?: WhatsAppRelayConfig;
}

export interface CampusLocation {
  id: string;
  name: string;
  university: UniversityId;
  campusBranch: string;
  category: 'hotspot' | 'hostel' | 'library' | 'sports' | 'food' | 'admin';
  lat: number;
  lng: number;
  description: string;
  popularWhisper?: string;
  wiFiStatus?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  university: UniversityId;
  category: 'sports' | 'social' | 'academic' | 'financial' | 'guild';
  venue: string;
  locationCoords?: { lat: number; lng: number };
  date: string;
  time: string;
  description: string;
  attendeesCount: number;
  isUserRsvp?: boolean;
  organizer: string;
}

export interface WhatsAppRelayConfig {
  enabled: boolean;
  carrier: 'Airtel Zambia' | 'MTN Zambia' | 'Zamtel' | 'Other';
  privacyProtection: boolean;
  relayToken: string;
  customGreeting?: string;
}

