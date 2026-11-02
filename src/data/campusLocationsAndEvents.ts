import { CampusLocation, CampusEvent, UniversityId } from '../types';

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  // --- UNZA (Great East Road Campus, Lusaka) ---
  {
    id: 'loc-unza-monk-sq',
    name: 'Monk Square Courtyard',
    university: 'unza',
    campusBranch: 'Great East Road Campus',
    category: 'hotspot',
    lat: -15.3932,
    lng: 28.3305,
    description: 'The legendary epicenter of UNZA student banter, evening discussions, and hostel gossip between male and female halls.',
    popularWhisper: 'Heated debate ongoing regarding HELSB batch allowances vs textbook costs.',
    wiFiStatus: 'Eduroam High-Speed (85 Mbps)',
  },
  {
    id: 'loc-unza-lib',
    name: 'UNZA Main Library (Quiet Wing)',
    university: 'unza',
    campusBranch: 'Great East Road Campus',
    category: 'library',
    lat: -15.3925,
    lng: 28.3298,
    description: 'Multi-storey academic sanctuary. 2nd floor quiet wing is a prime study and secret crush sighting hub.',
    popularWhisper: 'Someone left an HP charger and engineering notes on table 14.',
    wiFiStatus: 'Eduroam Stable (60 Mbps)',
  },
  {
    id: 'loc-unza-goma',
    name: 'Goma Fields & Cafeteria',
    university: 'unza',
    campusBranch: 'Great East Road Campus',
    category: 'food',
    lat: -15.3941,
    lng: 28.3288,
    description: 'Popular student hangout for nshima, snacks, fresh fruit, and open-air campus socialising.',
    popularWhisper: 'Fresh T-bone and village chicken lunch rush at Goma cafeteria.',
    wiFiStatus: 'Outdoor Hotspot (35 Mbps)',
  },
  {
    id: 'loc-unza-soweto',
    name: 'Soweto Hall of Residence',
    university: 'unza',
    campusBranch: 'Great East Road Campus',
    category: 'hostel',
    lat: -15.3918,
    lng: 28.3312,
    description: 'Historical male student hostel. Known for its vocal student political commentators and weekend vibes.',
    popularWhisper: 'Soweto vs Africa Hall inter-block FIFA tournament kickoff at 20:00.',
    wiFiStatus: 'Hostel Mesh Wi-Fi (45 Mbps)',
  },
  {
    id: 'loc-unza-africa-hall',
    name: 'Africa Hall of Residence',
    university: 'unza',
    campusBranch: 'Great East Road Campus',
    category: 'hostel',
    lat: -15.3922,
    lng: 28.3320,
    description: 'Prominent student accommodation with vibrant common room debates.',
    popularWhisper: 'Study group for Organic Chemistry meets in Block 3 common room.',
    wiFiStatus: 'Hostel Mesh Wi-Fi (40 Mbps)',
  },
  {
    id: 'loc-unza-sports',
    name: 'UNZA Sports Complex & Courts',
    university: 'unza',
    campusBranch: 'Great East Road Campus',
    category: 'sports',
    lat: -15.3950,
    lng: 28.3310,
    description: 'Basketball, netball, and volleyball courts hosting ZUSA varsity fixtures.',
    popularWhisper: 'UNZA Pacers basketball practice drawing crowd before CBU clash.',
    wiFiStatus: 'Courtside Wi-Fi (25 Mbps)',
  },

  // --- CBU (Riverside Campus, Kitwe) ---
  {
    id: 'loc-cbu-council-bench',
    name: 'The Council Bench',
    university: 'cbu',
    campusBranch: 'Riverside Campus',
    category: 'hotspot',
    lat: -12.8021,
    lng: 28.2328,
    description: 'The political heartbeat of CBU. Where engineering, mining, and business students gather to unpack union decisions.',
    popularWhisper: 'Guild President address scheduled after afternoon labs.',
    wiFiStatus: 'Riverside Campus Wi-Fi (70 Mbps)',
  },
  {
    id: 'loc-cbu-hostels-jk',
    name: 'Riverside Hostels (Blocks J & K)',
    university: 'cbu',
    campusBranch: 'Riverside Campus',
    category: 'hostel',
    lat: -12.8035,
    lng: 28.2315,
    description: 'Riverside residential blocks overlooking the river grounds.',
    popularWhisper: 'Water pressure fully restored to Block K after maintenance crew visit.',
    wiFiStatus: 'Hostel Wi-Fi (50 Mbps)',
  },
  {
    id: 'loc-cbu-comp-centre',
    name: 'CBU Computer Centre & Labs',
    university: 'cbu',
    campusBranch: 'Riverside Campus',
    category: 'library',
    lat: -12.8018,
    lng: 28.2330,
    description: 'High-speed programming workstations and engineering simulation terminals.',
    popularWhisper: 'All CAD workstations occupied ahead of final year capstone submissions.',
    wiFiStatus: 'Gigabit Fiber Backbone (120 Mbps)',
  },
  {
    id: 'loc-cbu-stadium',
    name: 'Dag Hammarskjöld Stadium & Pavilion',
    university: 'cbu',
    campusBranch: 'Riverside Campus',
    category: 'sports',
    lat: -12.8040,
    lng: 28.2345,
    description: 'Home of the CBU Copperbelt varsity derbies and athletic championships.',
    popularWhisper: 'Varsity soccer tryouts starting tomorrow at 15:00 hrs.',
    wiFiStatus: 'Pavilion Wi-Fi (30 Mbps)',
  },

  // --- NIPA (Lusaka) ---
  {
    id: 'loc-nipa-dushanbe',
    name: 'Dushanbe Debate Amphitheatre',
    university: 'nipa',
    campusBranch: 'Main Campus',
    category: 'hotspot',
    lat: -15.4243,
    lng: 28.3015,
    description: 'Open-air amphitheatre where future Zambian civil servants and diplomats stage mock parliament sessions.',
    popularWhisper: 'Public administration symposium drawing delegates from across Lusaka.',
    wiFiStatus: 'NIPA Campus Wi-Fi (60 Mbps)',
  },
  {
    id: 'loc-nipa-library',
    name: 'NIPA Main Library & Foyer',
    university: 'nipa',
    campusBranch: 'Main Campus',
    category: 'library',
    lat: -15.4248,
    lng: 28.3008,
    description: 'Comprehensive public governance, law, and business literature repository.',
    popularWhisper: 'Tickets for Annual Acoustic Gala being distributed at the entrance.',
    wiFiStatus: 'NIPA Campus Wi-Fi (55 Mbps)',
  },

  // --- Mulungushi University (Kabwe) ---
  {
    id: 'loc-mu-academic-sq',
    name: 'Great North Road Academic Square',
    university: 'mulungushi',
    campusBranch: 'Great North Road Campus',
    category: 'hotspot',
    lat: -14.4422,
    lng: 28.4505,
    description: 'Central gathering quad in Kabwe surrounded by lecture theatres and senate chambers.',
    popularWhisper: 'Bana Chimbwi union elections debate scheduled for this Thursday.',
    wiFiStatus: 'Mulungushi Smart Campus (65 Mbps)',
  },
  {
    id: 'loc-mu-hall',
    name: 'Mulungushi Multi-Purpose Sports Arena',
    university: 'mulungushi',
    campusBranch: 'Great North Road Campus',
    category: 'sports',
    lat: -14.4430,
    lng: 28.4498,
    description: 'Indoor volleyball, badminton, and graduation ceremony pavilion.',
    popularWhisper: 'Inter-faculty badminton matches happening this weekend.',
    wiFiStatus: 'Arena Wi-Fi (40 Mbps)',
  },

  // --- Cavendish University (Lusaka) ---
  {
    id: 'loc-cuz-law-wing',
    name: 'Cavendish Longacres Law Wing & Moot Court',
    university: 'cavendish',
    campusBranch: 'Longacres Campus',
    category: 'hotspot',
    lat: -15.4188,
    lng: 28.3122,
    description: 'Modern moot court facility training Zambian barristers, advocates, and international relations scholars.',
    popularWhisper: 'National constitutional law moot competition rehearsals underway.',
    wiFiStatus: 'CUZ UltraNet (80 Mbps)',
  },

  // --- Levy Mwanawasa Medical University (Lusaka) ---
  {
    id: 'loc-lmmu-foyer',
    name: 'LMMU Main Teaching Hospital Quad',
    university: 'lmmu',
    campusBranch: 'Chainama Campus',
    category: 'hotspot',
    lat: -15.3848,
    lng: 28.3585,
    description: 'Meeting point for clinical students, interns, and future doctors between ward rounds.',
    popularWhisper: 'Paediatric rotation briefing starting early at 07:30.',
    wiFiStatus: 'LMMU Clinical Network (75 Mbps)',
  },

  // --- Evelyn Hone College (Lusaka) ---
  {
    id: 'loc-evelyn-media-quad',
    name: 'Evelyn Hone Media Studies & Creative Quad',
    university: 'evelyn_hone',
    campusBranch: 'Church Road Campus',
    category: 'hotspot',
    lat: -15.4212,
    lng: 28.2915,
    description: 'Bustling creative center known for student radio broadcasts, graphic arts exhibitions, and music jams.',
    popularWhisper: 'Live acoustic session happening behind the journalism lab today.',
    wiFiStatus: 'Hone Wi-Fi (50 Mbps)',
  },

  // --- ZCAS University (Lusaka) ---
  {
    id: 'loc-zcas-hub',
    name: 'ZCAS Innovation & Financial Lab',
    university: 'zcas',
    campusBranch: 'Dedan Kimathi Road Campus',
    category: 'library',
    lat: -15.4152,
    lng: 28.2888,
    description: 'Advanced financial analytics and business innovation suite near Lusaka CBD.',
    popularWhisper: 'ACCA and CIMA preparation workshop kicking off at 14:00.',
    wiFiStatus: 'ZCAS FastNet (90 Mbps)',
  },
];

export const CAMPUS_EVENTS: CampusEvent[] = [
  {
    id: 'ev-1',
    title: 'UNZA vs CBU ZUSA Basketball Finals 🏀🏆',
    university: 'unza',
    category: 'sports',
    venue: 'OYDC Arena, Great North Rd, Lusaka',
    locationCoords: { lat: -15.3950, lng: 28.3310 },
    date: '2026-11-06',
    time: '18:30 CAT',
    description: 'The ultimate grudge match! University of Zambia Pacers take on Copperbelt University Miners in the 2026 ZUSA National Basketball Final. Wear your varsity colors.',
    attendeesCount: 542,
    isUserRsvp: true,
    organizer: 'Zambian Universities Sports Association (ZUSA)',
  },
  {
    id: 'ev-2',
    title: 'NIPA Annual Acoustic Gala & Public Admin Night 🎶✨',
    university: 'nipa',
    category: 'social',
    venue: 'NIPA Main Amphitheatre & Gardens, Lusaka',
    locationCoords: { lat: -15.4243, lng: 28.3015 },
    date: '2026-11-08',
    time: '19:00 CAT',
    description: 'An elegant evening of live acoustic performances by Lusaka student vocalists, cultural dances, poetry, and a networking dinner with alumni diplomats.',
    attendeesCount: 298,
    isUserRsvp: false,
    organizer: 'NIPA Student Guild Social Directorate',
  },
  {
    id: 'ev-3',
    title: 'HELSB Batch 2 Student Allowance Disbursement 💳🇿🇲',
    university: 'all',
    category: 'financial',
    venue: 'Nationwide Student Portals & Bank Branches',
    date: '2026-11-10',
    time: '09:00 CAT',
    description: 'Higher Education Loans and Scholarships Board scheduled release for Batch 2 meal allowances and accommodation stipends across all public universities.',
    attendeesCount: 1420,
    isUserRsvp: true,
    organizer: 'HELSB Zambia Student Liaison',
  },
  {
    id: 'ev-4',
    title: 'Cavendish National Constitutional Law Moot Court ⚖️🏛️',
    university: 'cavendish',
    category: 'academic',
    venue: 'Longacres Law Wing Moot Courtroom, Lusaka',
    locationCoords: { lat: -15.4188, lng: 28.3122 },
    date: '2026-11-12',
    time: '10:00 CAT',
    description: 'Inter-university legal debate on human rights and digital privacy laws in Africa, judged by Supreme Court and High Court advocates.',
    attendeesCount: 185,
    isUserRsvp: false,
    organizer: 'Cavendish Law Association (CLA)',
  },
  {
    id: 'ev-5',
    title: 'CBU Riverside Cultural Night & Street Jam 🥁🔥',
    university: 'cbu',
    category: 'social',
    venue: 'Dag Hammarskjöld Pavilion Grounds, Kitwe',
    locationCoords: { lat: -12.8040, lng: 28.2345 },
    date: '2026-11-14',
    time: '20:00 CAT',
    description: 'The Copperbelt student community celebrates Zambian heritage with live Kalindula beats, Afrobeats DJs, traditional food stalls, and fashion showcase.',
    attendeesCount: 680,
    isUserRsvp: false,
    organizer: 'COBUSU Cultural Committee',
  },
  {
    id: 'ev-6',
    title: 'UNZA Soweto vs Africa Hall Inter-Block Derby ⚽',
    university: 'unza',
    category: 'sports',
    venue: 'Goma Fields, Great East Road Campus',
    locationCoords: { lat: -15.3941, lng: 28.3288 },
    date: '2026-11-15',
    time: '16:00 CAT',
    description: 'The biggest hostel rivalry on campus! Bragging rights on the line with commentary from the Monk Square loudspeaker crew.',
    attendeesCount: 410,
    isUserRsvp: true,
    organizer: 'UNZA Hostels League Council',
  },
  {
    id: 'ev-7',
    title: 'ZCAS Fintech & Student Start-Up Pitch Day 💡🚀',
    university: 'zcas',
    category: 'academic',
    venue: 'ZCAS Innovation Hub, Dedan Kimathi Rd',
    locationCoords: { lat: -15.4152, lng: 28.2888 },
    date: '2026-11-18',
    time: '13:00 CAT',
    description: 'Student founders pitch digital payment solutions and mobile apps to Lusaka venture mentors and angel investors with seed prizes.',
    attendeesCount: 220,
    isUserRsvp: false,
    organizer: 'ZCAS Entrepreneurship Society',
  },
  {
    id: 'ev-8',
    title: 'Mulungushi Annual Bana Chimbwi Guild Debate 🎙️',
    university: 'mulungushi',
    category: 'guild',
    venue: 'Academic Square Main Amphitheatre, Kabwe',
    locationCoords: { lat: -14.4422, lng: 28.4505 },
    date: '2026-11-20',
    time: '15:30 CAT',
    description: 'Presidential and Guild candidates outline their manifestos on hostel conditions, shuttle transport, and campus Wi-Fi infrastructure.',
    attendeesCount: 350,
    isUserRsvp: false,
    organizer: 'Mulungushi Electoral Commission',
  },
];

/**
 * Generate a Google Calendar link for a campus event
 */
export function createGoogleCalendarUrl(event: CampusEvent): string {
  const startIso = event.date.replace(/-/g, '') + 'T' + event.time.split(' ')[0].replace(':', '') + '00Z';
  const endIso = event.date.replace(/-/g, '') + 'T' + (parseInt(event.time.split(':')[0]) + 2).toString().padStart(2, '0') + '0000Z';
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startIso}/${endIso}`,
    details: `${event.description}\n\nOrganized by: ${event.organizer}\nVia ZedWhisper Zambia Campus Network`,
    location: event.venue,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Download standard .ics calendar invite for mobile calendar apps
 */
export function downloadIcsFile(event: CampusEvent) {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ZedWhisper//Zambian Universities Event Calendar//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.venue}
DTSTART:${event.date.replace(/-/g, '')}T090000Z
DTEND:${event.date.replace(/-/g, '')}T120000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
