# Implementation Plan: App Size Reduction & Real-User Campus Activity Updates

## 1. Objective
1. **Reduce Application Footprint for Seamless Portability**: Permanently remove the 94MB `Youdate-dating-platform-script_4f415acf.zip` archive and unnecessary build/test artifacts to make the repository lightweight, easily exportable, and importable.
2. **Remove Simulated Bot Responses**: Remove all automated `setTimeout` simulated chat responses to ensure 100% authentic, real student-to-student conversations, direct messages, and discussions.
3. **Comprehensive Real-User Campus Activity Updates**: Enable students across all Zambian universities (UNZA, CBU, NIPA, Mulungushi, LMMU, Cavendish, Evelyn Hone, ZCAS, etc.) to publish and follow live updates on **all campus activities**:
   - **Sports & Tournaments**: ZUSA championships, inter-hall soccer, UNZA vs CBU derbies, basketball tournaments.
   - **Socials, Events & Galas**: Fresher's welcoming bashes, acoustic nights, guild dinner dances, church conferences.
   - **Academic & Senate Intel**: HELSB meal allowance tracking, exam timetables, continuous assessments, NS/engineering revisions.
   - **Hostel & Living Conditions**: Power load-shedding schedules, water borehole reports, room allocation swaps, Kalundu/Handsworth boarding vacancies.
   - **Lost & Found Tracker**: Real-time reports for lost Student ID cards, NRCs, laptops, calculators, and hostel keys.
   - **Campus Hustle & Marketplace**: Student enterprises, past papers, graphic design, tutoring.
   - **Campus Tea & Anonymous Buzz**: Student confessions and campus gossip without bot intervention.

---

## 2. Architecture & File Changes

### A. Asset Cleanup & Optimization
- **File**: `public/assets/aistudio/Youdate-dating-platform-script_4f415acf.zip`
- **Action**: Completely removed (freed 94MB).
- **Result**: Drastically reduced project size to ensure rapid imports, cloning, and instant builds.

### B. Type System Enhancements (`src/types/index.ts`)
- Update `PostCategory` to encompass comprehensive campus activities:
  - `'news'`, `'sports'`, `'events'`, `'exams'`, `'hostel'`, `'lost_found'`, `'gossip'`, `'crushes'`, `'marketplace'`
- Add optional activity metadata fields to `GossipPost`:
  - `eventDate?: string;` (e.g., "Saturday 14:00 hrs")
  - `eventVenue?: string;` (e.g., "UNZA Sports Complex", "CBU Jambo Drive", "NIPA Hall 3")
  - `isActivityLive?: boolean;` (flag for ongoing live campus tournaments or meetings)

### C. Pure Rules & Helper Logic (`src/utils/rules.ts` & `src/utils/rules.test.ts`)
- Update category filtering to support all activity filters (`sports`, `events`, `lost_found`, etc.).
- Add activity status helpers (e.g., live match updates, venue formatting).
- Update unit tests with `node:test` to guarantee 100% passing logic tests.

### D. Activity Data & Real User Seed Updates (`src/data/mockData.ts`)
- Add authentic Zambian university activity updates:
  - **Sports**: UNZA vs CBU ZUSA Basketball Championship Finals at Olympic Youth Development Centre (OYDC).
  - **Events**: NIPA Annual Public Governance Gala & Dinner at Dushanbe grounds.
  - **Lost & Found**: Student ID card found near UNZA Great East Road Library.
  - **Hostel & Power**: CBU Riverside generator schedule during ZESCO load shedding.
- Ensure all content reflects real Zambian student campus life.

### E. App State & Messaging Engine (`src/App.tsx`)
- **Remove Fake Bot Chat Replies**: Delete the `setTimeout` automatic reply generator in `handleSendMessage`. Messages now represent genuine real-time student communications.
- **Support Activity Details in Post Composer**: Allow students to optionally tag an activity date/time and campus venue when posting an update.
- **Activity Filter Bar**: Add quick filter buttons for Sports, Events, Lost & Found, and Academics.

---

## 3. Verification & Quality Gates
1. Run pure logic unit tests (`npx --yes tsx --test src/utils/rules.test.ts`).
2. Run clean TypeScript build (`compile_applet`) and linting (`lint_applet`).
3. Verify dev server restart (`restart_dev_server`).
4. Validate UI in browser via `playwright-cli` on desktop (1440px) and mobile (390px).
