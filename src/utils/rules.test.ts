import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateContentSafety,
  generateAnonymousAlias,
  calculateTrendingScore,
  isSecretCrushMutual,
  formatCampusGiftDispatch,
  filterPosts,
} from './rules';
import { GossipPost } from '../types';

test('validateContentSafety rejects empty messages', () => {
  const result = validateContentSafety('   ');
  assert.equal(result.isValid, false);
  assert.ok(result.warning?.includes('empty'));
});

test('validateContentSafety blocks leaked Zambian phone numbers', () => {
  const airtelResult = validateContentSafety('Call this lecturer on 0977123456 right now');
  assert.equal(airtelResult.isValid, false);
  assert.ok(airtelResult.warning?.includes('phone numbers'));

  const mtnResult = validateContentSafety('His WhatsApp is +260966454545 please text him');
  assert.equal(mtnResult.isValid, false);

  const cleanResult = validateContentSafety('Library closes at 22:00 tonight at UNZA Great East Road');
  assert.equal(cleanResult.isValid, true);
});

test('generateAnonymousAlias creates university-specific aliases including NIPA', () => {
  const unzaAlias = generateAnonymousAlias('unza');
  assert.ok(unzaAlias.includes('#'));
  assert.ok(typeof unzaAlias === 'string');

  const nipaAlias = generateAnonymousAlias('nipa');
  assert.ok(nipaAlias.includes('#'));
  assert.ok(typeof nipaAlias === 'string');
});

test('calculateTrendingScore weights upvotes and comments correctly', () => {
  const score = calculateTrendingScore({
    upvotes: 20,
    downvotes: 2,
    commentsCount: 5,
    timestamp: '2026-10-30',
  });
  assert.equal(score, 53);
});

test('isSecretCrushMutual identifies confirmed mutual matches', () => {
  const userList = ['@natasha_unza', 'mutale_cbu'];
  assert.equal(isSecretCrushMutual(userList, '@natasha_unza', true), true);
  assert.equal(isSecretCrushMutual(userList, '@natasha_unza', false), false);
  assert.equal(isSecretCrushMutual(userList, '@chipo_lmmu', true), false);
});

test('formatCampusGiftDispatch prepares free campus treat dispatch with zero payment', () => {
  const result = formatCampusGiftDispatch('ZedScholar_Lusaka', 'Hungry Lion 2-Piece & Krush');
  assert.equal(result.success, true);
  assert.ok(result.message.includes('Hungry Lion 2-Piece & Krush'));
});

test('filterPosts correctly filters by university including NIPA', () => {
  const samplePosts: GossipPost[] = [
    {
      id: '1',
      title: 'HELSB allowance is out',
      content: 'Ministry released funds today for UNZA and CBU',
      university: 'unza',
      category: 'news',
      authorAlias: 'Monk #101',
      isAnonymous: false,
      upvotes: 10,
      downvotes: 0,
      commentsCount: 2,
      comments: [],
      timestamp: '1h ago',
      tags: ['#helsb', '#unza'],
    },
    {
      id: '2',
      title: 'NIPA Main Campus Dushanbe Road Moot Court',
      content: 'Public administration symposium starts at 10:00 hrs',
      university: 'nipa',
      category: 'news',
      authorAlias: 'Dushanbe Diplomat',
      isAnonymous: true,
      upvotes: 15,
      downvotes: 0,
      commentsCount: 3,
      comments: [],
      timestamp: '2h ago',
      tags: ['#nipa', '#governance'],
    },
  ];

  // Filter by NIPA
  const nipaOnly = filterPosts(samplePosts, 'nipa', 'all', '');
  assert.equal(nipaOnly.length, 1);
  assert.equal(nipaOnly[0].id, '2');
  assert.equal(nipaOnly[0].university, 'nipa');
});
