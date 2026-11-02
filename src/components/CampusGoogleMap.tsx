import React, { useState, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import { CampusLocation, UniversityId } from '../types';
import { CAMPUS_LOCATIONS } from '../data/campusLocationsAndEvents';
import {
  MapPin,
  Navigation,
  Compass,
  Wifi,
  Flame,
  Search,
  Building,
  BookOpen,
  Trophy,
  Coffee,
  Plus,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface CampusGoogleMapProps {
  selectedUniversity: UniversityId;
  onSelectUniversity: (uni: UniversityId) => void;
  onOpenComposerWithVenue?: (venueName: string, university: UniversityId) => void;
  onViewEventsForVenue?: (venueName: string) => void;
}

// Center coordinates for Zambian Universities
const UNIVERSITY_COORDINATES: Record<UniversityId, { lat: number; lng: number; zoom: number; label: string }> = {
  all: { lat: -14.4500, lng: 28.3200, zoom: 7, label: 'All Zambian Campuses' },
  unza: { lat: -15.3932, lng: 28.3305, zoom: 16, label: 'UNZA Great East Road' },
  cbu: { lat: -12.8021, lng: 28.2328, zoom: 16, label: 'CBU Riverside Kitwe' },
  nipa: { lat: -15.4245, lng: 28.3012, zoom: 17, label: 'NIPA Main Campus Lusaka' },
  mulungushi: { lat: -14.4422, lng: 28.4505, zoom: 15, label: 'Mulungushi Great North Road' },
  cavendish: { lat: -15.4188, lng: 28.3122, zoom: 17, label: 'Cavendish Longacres' },
  lmmu: { lat: -15.3848, lng: 28.3585, zoom: 17, label: 'LMMU Chainama Campus' },
  evelyn_hone: { lat: -15.4212, lng: 28.2915, zoom: 17, label: 'Evelyn Hone Church Road' },
  zcas: { lat: -15.4152, lng: 28.2888, zoom: 17, label: 'ZCAS University Lusaka' },
  apex: { lat: -15.4300, lng: 28.3200, zoom: 16, label: 'Apex Medical University' },
  mukuba: { lat: -12.8100, lng: 28.2100, zoom: 15, label: 'Mukuba University Kitwe' },
  nkrumah: { lat: -14.4300, lng: 28.4600, zoom: 15, label: 'Kwame Nkrumah University' },
  eden: { lat: -15.3600, lng: 28.2500, zoom: 15, label: 'Eden University Barlastone' },
};

export const CampusGoogleMap: React.FC<CampusGoogleMapProps> = ({
  selectedUniversity,
  onSelectUniversity,
  onOpenComposerWithVenue,
  onViewEventsForVenue,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBXZOIL2J_UckXJsUmXxQ0NHxRydEIw2Xs';

  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  // Active target center
  const targetCoordinates = UNIVERSITY_COORDINATES[selectedUniversity] || UNIVERSITY_COORDINATES.unza;

  // Filtered locations
  const filteredLocations = useMemo(() => {
    return CAMPUS_LOCATIONS.filter((loc) => {
      const matchUni = selectedUniversity === 'all' || loc.university === selectedUniversity;
      const matchCat = selectedCategory === 'all' || loc.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (loc.popularWhisper && loc.popularWhisper.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchUni && matchCat && matchSearch;
    });
  }, [selectedUniversity, selectedCategory, searchQuery]);

  // Marker Pin Color by Category
  const getMarkerPinColors = (category: CampusLocation['category']) => {
    switch (category) {
      case 'hotspot':
        return { background: '#f59e0b', glyphColor: '#ffffff', borderColor: '#b45309' }; // Amber
      case 'hostel':
        return { background: '#8b5cf6', glyphColor: '#ffffff', borderColor: '#6d28d9' }; // Purple
      case 'library':
        return { background: '#0284c7', glyphColor: '#ffffff', borderColor: '#0369a1' }; // Blue
      case 'sports':
        return { background: '#10b981', glyphColor: '#ffffff', borderColor: '#047857' }; // Emerald
      case 'food':
        return { background: '#f43f5e', glyphColor: '#ffffff', borderColor: '#be123c' }; // Rose
      default:
        return { background: '#059669', glyphColor: '#ffffff', borderColor: '#064e3b' };
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'hotspot':
        return <Flame className="w-3.5 h-3.5" />;
      case 'hostel':
        return <Building className="w-3.5 h-3.5" />;
      case 'library':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'sports':
        return <Trophy className="w-3.5 h-3.5" />;
      case 'food':
        return <Coffee className="w-3.5 h-3.5" />;
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Campus Map Header & Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>Zambian Campus Google Map</span>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Live Landmarks
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore student hotspots, hostels, libraries, and live whispers across Zambian universities
              </p>
            </div>
          </div>

          {/* Map Type Switcher */}
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setMapType('roadmap')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mapType === 'roadmap'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Roadmap
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mapType === 'satellite'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType('hybrid')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mapType === 'hybrid'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Hybrid
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campus spot, hostel, library, cafe..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Spots' },
              { id: 'hotspot', label: 'Banter Hotspots' },
              { id: 'hostel', label: 'Hostels & Halls' },
              { id: 'library', label: 'Libraries & Labs' },
              { id: 'sports', label: 'Sports & Courts' },
              { id: 'food', label: 'Food & Chill' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map + Side Landmark Tray Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Google Map Viewport */}
        <div className="lg:col-span-8 bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative h-[540px] sm:h-[620px]">
          <APIProvider apiKey={apiKey} language="en" region="ZM">
            <Map
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              center={{ lat: targetCoordinates.lat, lng: targetCoordinates.lng }}
              zoom={targetCoordinates.zoom}
              mapTypeId={mapType}
              gestureHandling="greedy"
              disableDefaultUI={false}
              fullscreenControl={true}
              zoomControl={true}
              style={{ width: '100%', height: '100%' }}
            >
              {filteredLocations.map((location) => {
                const pinColors = getMarkerPinColors(location.category);
                return (
                  <AdvancedMarker
                    key={location.id}
                    position={{ lat: location.lat, lng: location.lng }}
                    onClick={() => setSelectedLocation(location)}
                    title={location.name}
                  >
                    <Pin
                      background={pinColors.background}
                      glyphColor={pinColors.glyphColor}
                      borderColor={pinColors.borderColor}
                      scale={1.1}
                    />
                  </AdvancedMarker>
                );
              })}

              {/* InfoWindow for Selected Landmark */}
              {selectedLocation && (
                <InfoWindow
                  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  onCloseClick={() => setSelectedLocation(null)}
                  maxWidth={320}
                >
                  <div className="p-1 space-y-2.5 text-slate-900 font-sans">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        <span>{selectedLocation.university.toUpperCase()}</span>
                        <span>·</span>
                        <span>{selectedLocation.campusBranch}</span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">
                        {selectedLocation.name}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedLocation.description}
                    </p>

                    {selectedLocation.wiFiStatus && (
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                        <Wifi className="w-3.5 h-3.5 shrink-0" />
                        <span>{selectedLocation.wiFiStatus}</span>
                      </div>
                    )}

                    {selectedLocation.popularWhisper && (
                      <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-[11px] italic">"{selectedLocation.popularWhisper}"</span>
                      </div>
                    )}

                    {/* Action buttons inside InfoWindow */}
                    <div className="pt-1 flex flex-col gap-1.5">
                      {onOpenComposerWithVenue && (
                        <button
                          onClick={() => {
                            onOpenComposerWithVenue(selectedLocation.name, selectedLocation.university);
                            setSelectedLocation(null);
                          }}
                          className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Spill Tea at this Spot</span>
                        </button>
                      )}

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors text-center"
                      >
                        <Navigation className="w-3.5 h-3.5 text-slate-600" />
                        <span>Google Maps Directions</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>

          {/* Floating Campus Quick Jump Overlay */}
          <div className="absolute top-3 left-3 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{targetCoordinates.label}</span>
          </div>
        </div>

        {/* Side Landmark Tray */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[540px] sm:h-[620px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Campus Hotspots ({filteredLocations.length})</span>
              </h3>
              <p className="text-[11px] text-slate-500">Tap to fly map and inspect whispers</p>
            </div>
          </div>

          {/* Scrollable Location List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
            {filteredLocations.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No campus locations match your filter or search.
              </div>
            ) : (
              filteredLocations.map((loc) => {
                const isSelected = selectedLocation?.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-700 shadow-sm'
                        : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs'
                          }`}
                        >
                          {getCategoryIcon(loc.category)}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                            {loc.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 uppercase">
                            {loc.university} · {loc.campusBranch}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {loc.description}
                    </p>

                    {loc.popularWhisper && (
                      <div className="mt-2 text-[10px] font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1 bg-amber-50/80 dark:bg-amber-950/40 p-1.5 rounded-lg border border-amber-200/60 dark:border-amber-900/40">
                        <Flame className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">{loc.popularWhisper}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
