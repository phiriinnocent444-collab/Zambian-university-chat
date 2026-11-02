import React, { useState } from 'react';
import { CampusEvent, UniversityId } from '../types';
import { CAMPUS_EVENTS, createGoogleCalendarUrl, downloadIcsFile } from '../data/campusLocationsAndEvents';
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Users,
  Plus,
  ExternalLink,
  Share2,
  Trophy,
  PartyPopper,
  GraduationCap,
  Landmark,
  Coins,
  Check,
  Search,
  Download,
  X,
  MessageCircle,
} from 'lucide-react';

interface CampusEventCalendarProps {
  selectedUniversity: UniversityId;
  onSelectUniversity: (uni: UniversityId) => void;
  onViewVenueOnMap?: (venueName: string, university: UniversityId) => void;
}

export const CampusEventCalendar: React.FC<CampusEventCalendarProps> = ({
  selectedUniversity,
  onSelectUniversity,
  onViewVenueOnMap,
}) => {
  const [events, setEvents] = useState<CampusEvent[]>(CAMPUS_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventUniversity, setNewEventUniversity] = useState<UniversityId>(
    selectedUniversity === 'all' ? 'unza' : selectedUniversity
  );
  const [newEventCategory, setNewEventCategory] = useState<'sports' | 'social' | 'academic' | 'financial' | 'guild'>('social');
  const [newEventVenue, setNewEventVenue] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('18:00 CAT');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventOrganizer, setNewEventOrganizer] = useState('');

  // Filtered Events
  const filteredEvents = events.filter((ev) => {
    const matchUni = selectedUniversity === 'all' || ev.university === selectedUniversity || ev.university === 'all';
    const matchCat = selectedCategory === 'all' || ev.category === selectedCategory;
    const matchSearch =
      searchQuery === '' ||
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchUni && matchCat && matchSearch;
  });

  const handleToggleRsvp = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const newRsvp = !ev.isUserRsvp;
        return {
          ...ev,
          isUserRsvp: newRsvp,
          attendeesCount: newRsvp ? ev.attendeesCount + 1 : Math.max(0, ev.attendeesCount - 1),
        };
      })
    );
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventVenue.trim() || !newEventDate.trim()) return;

    const newEv: CampusEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle.trim(),
      university: newEventUniversity,
      category: newEventCategory,
      venue: newEventVenue.trim(),
      date: newEventDate,
      time: newEventTime,
      description: newEventDesc.trim() || 'Student organized campus activity.',
      attendeesCount: 1,
      isUserRsvp: true,
      organizer: newEventOrganizer.trim() || 'Zambian Student Society',
    };

    setEvents([newEv, ...events]);
    setIsSubmitModalOpen(false);

    // Reset Form
    setNewEventTitle('');
    setNewEventVenue('');
    setNewEventDate('');
    setNewEventDesc('');
    setNewEventOrganizer('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sports':
        return <Trophy className="w-4 h-4 text-emerald-500" />;
      case 'social':
        return <PartyPopper className="w-4 h-4 text-pink-500" />;
      case 'academic':
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'financial':
        return <Coins className="w-4 h-4 text-amber-500" />;
      case 'guild':
        return <Landmark className="w-4 h-4 text-purple-500" />;
      default:
        return <CalendarIcon className="w-4 h-4 text-emerald-500" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'sports':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'social':
        return 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800';
      case 'academic':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'financial':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'guild':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 text-white flex items-center justify-center shadow-sm">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>Zambian Campus Event Calendar</span>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  Synced Live
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Varsity sports derbies, galas, union elections, moot courts, and HELSB allowance dates
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Campus Event</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event title, venue, or details..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Events' },
              { id: 'sports', label: 'Sports & Derbies' },
              { id: 'social', label: 'Galas & Social' },
              { id: 'academic', label: 'Law & Academic' },
              { id: 'financial', label: 'HELSB & Grants' },
              { id: 'guild', label: 'Union & Guild' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            No events found matching your university or category filter.
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const googleCalUrl = createGoogleCalendarUrl(ev);
            const whatsappEventShare = encodeURIComponent(
              `📅 *${ev.title}*\n` +
              `🏛️ Venue: ${ev.venue} (${ev.university.toUpperCase()})\n` +
              `⏰ When: ${ev.date} · ${ev.time}\n` +
              `ℹ️ ${ev.description}\n\n` +
              `Found via ZedWhisper Zambian Campus Network!`
            );

            return (
              <div
                key={ev.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="space-y-3">
                  {/* Event Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${getCategoryBadgeClass(
                        ev.category
                      )}`}
                    >
                      {getCategoryIcon(ev.category)}
                      <span className="capitalize">{ev.category}</span>
                    </span>

                    <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                      {ev.university === 'all' ? 'All Zambian Campuses' : ev.university.toUpperCase()}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white leading-snug">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {ev.description}
                    </p>
                  </div>

                  {/* Venue & Date Metadata */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="font-semibold">{ev.date}</span>
                      <span>·</span>
                      <span>{ev.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{ev.venue}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ev.attendeesCount} students attending · Organized by {ev.organizer}</span>
                    </div>
                  </div>
                </div>

                {/* Event Actions Toolbar */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleRsvp(ev.id)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      ev.isUserRsvp
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {ev.isUserRsvp ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{ev.isUserRsvp ? "Attending ✓" : "RSVP / Going"}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* View on Campus Google Map */}
                    {onViewVenueOnMap && (
                      <button
                        onClick={() => onViewVenueOnMap(ev.venue, ev.university)}
                        title="View Venue on Campus Google Map"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      </button>
                    )}

                    {/* Add to Google Calendar */}
                    <a
                      href={googleCalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Add to Google Calendar"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                      <span className="hidden sm:inline">Google Cal</span>
                    </a>

                    {/* Download .ics */}
                    <button
                      onClick={() => downloadIcsFile(ev)}
                      title="Download iCal (.ics) file"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Share on WhatsApp */}
                    <a
                      href={`https://wa.me/?text=${whatsappEventShare}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share event on WhatsApp"
                      className="p-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add New Event Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-emerald-600" />
                <span>Submit Campus Event</span>
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-5 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. UNZA Engineering Hackathon 2026"
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    University Campus
                  </label>
                  <select
                    value={newEventUniversity}
                    onChange={(e) => setNewEventUniversity(e.target.value as UniversityId)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                  >
                    <option value="unza">UNZA</option>
                    <option value="cbu">CBU</option>
                    <option value="nipa">NIPA</option>
                    <option value="mulungushi">Mulungushi</option>
                    <option value="cavendish">Cavendish</option>
                    <option value="lmmu">LMMU</option>
                    <option value="evelyn_hone">Evelyn Hone</option>
                    <option value="zcas">ZCAS</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 capitalize"
                  >
                    <option value="sports">Sports & Derbies</option>
                    <option value="social">Galas & Social</option>
                    <option value="academic">Academic & Moot</option>
                    <option value="financial">Financial & Grants</option>
                    <option value="guild">Union & Guild</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Venue / Location *
                </label>
                <input
                  type="text"
                  required
                  value={newEventVenue}
                  onChange={(e) => setNewEventVenue(e.target.value)}
                  placeholder="e.g. Great East Road Main Amphitheatre"
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Time
                  </label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    placeholder="e.g. 18:30 CAT"
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Brief Description
                </label>
                <textarea
                  rows={2}
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="What is this campus activity about?"
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
