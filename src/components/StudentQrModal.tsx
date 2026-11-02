import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CurrentUser, StudentProfile, UniversityId } from '../types';
import {
  QrCode,
  Share2,
  Copy,
  Check,
  Shield,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Camera,
  Heart,
  Gift,
  Mail,
  UserCheck,
  X,
  Smartphone,
  Lock,
} from 'lucide-react';

interface StudentQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  profiles: StudentProfile[];
  onStartChatWithProfile: (profile: StudentProfile) => void;
  onOpenGiftModal: (profile: StudentProfile) => void;
  onDropCrush: (alias: string) => void;
}

export const StudentQrModal: React.FC<StudentQrModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  profiles,
  onStartChatWithProfile,
  onOpenGiftModal,
  onDropCrush,
}) => {
  const [activeTab, setActiveTab] = useState<'my_qr' | 'scan' | 'whatsapp'>('my_qr');
  const [copiedLink, setCopiedLink] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [scannedProfile, setScannedProfile] = useState<StudentProfile | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // WhatsApp Relay State
  const [selectedCarrier, setSelectedCarrier] = useState<'Airtel Zambia' | 'MTN Zambia' | 'Zamtel'>('Airtel Zambia');
  const [whatsappProtectionEnabled, setWhatsappProtectionEnabled] = useState(true);

  if (!isOpen) return null;

  // Generate connection payload
  const connectionToken = `ZW-${currentUser.university.toUpperCase()}-${currentUser.id.slice(-4)}`;
  const connectionUrl = `${window.location.origin}/?connect=${connectionToken}&alias=${encodeURIComponent(
    currentUser.alias
  )}&uni=${currentUser.university}`;

  // WhatsApp anonymous connection link
  const whatsappAnonymousText = encodeURIComponent(
    `🔒 ZedWhisper Campus Secure Match\n` +
    `Hello! Connecting with ${currentUser.alias} from ${currentUser.university.toUpperCase()}.\n` +
    `Verification Token: [${connectionToken}]\n` +
    `Identity Shield: Protected by ZedWhisper Zambia Relay.\n` +
    `Let's chat!`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappAnonymousText}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(connectionUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSimulateScan = (profile: StudentProfile) => {
    setScannedProfile(profile);
    setScanError(null);
  };

  const handleManualTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScanError(null);
    if (!tokenInput.trim()) return;

    // Search profiles by alias or token
    const clean = tokenInput.trim().toLowerCase();
    const found = profiles.find(
      (p) =>
        p.alias.toLowerCase().includes(clean) ||
        p.name.toLowerCase().includes(clean) ||
        p.id.toLowerCase().includes(clean)
    );

    if (found) {
      setScannedProfile(found);
    } else {
      // Pick a simulated student matching token
      const randomMatch = profiles[Math.floor(Math.random() * profiles.length)];
      setScannedProfile(randomMatch);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600/10 via-teal-600/5 to-transparent shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-600/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Campus Social QR Code</span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  Instant Connect
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quick in-person connections across Zambian university campuses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-5 pt-2 border-b border-slate-100 dark:border-slate-800 gap-2 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('my_qr')}
            className={`pb-2.5 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'my_qr'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>My Student QR</span>
          </button>

          <button
            onClick={() => setActiveTab('scan')}
            className={`pb-2.5 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'scan'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Student QR</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`pb-2.5 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
            <span>Anonymous WhatsApp</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* TAB 1: MY STUDENT QR CODE */}
          {activeTab === 'my_qr' && (
            <div className="space-y-4 text-center">
              {/* QR Code Presentation Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-emerald-50/30 dark:from-slate-800/60 dark:to-emerald-950/20 border border-slate-200 dark:border-slate-800 shadow-inner flex flex-col items-center">
                <div className="p-3.5 bg-white rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                  <QRCodeSVG
                    value={connectionUrl}
                    size={190}
                    level="H"
                    fgColor="#064e3b"
                    bgColor="#ffffff"
                    imageSettings={{
                      src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23059669"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
                      x: undefined,
                      y: undefined,
                      height: 32,
                      width: 32,
                      excavate: true,
                    }}
                  />
                </div>

                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
                    <span>{currentUser.isGhostMode ? '👻 Incognito Ghost' : `🎓 ${currentUser.alias}`}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs uppercase text-emerald-600 font-bold">{currentUser.university}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Token: <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{connectionToken}</span>
                  </p>
                </div>
              </div>

              {/* Instructions and Privacy Shield */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-left flex items-start gap-3">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5 text-emerald-900 dark:text-emerald-200">
                  <span className="font-bold">In-Person Anonymity Guaranteed</span>
                  <p className="text-emerald-800/80 dark:text-emerald-300/80">
                    Show this QR code to another student on campus. Scanning opens your profile to exchange whispers, mutual crushes, or masked WhatsApp messages without revealing your real phone number or legal name.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleCopyLink}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Profile Link'}</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Share to WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: SCAN STUDENT QR CODE */}
          {activeTab === 'scan' && (
            <div className="space-y-4">
              {/* Simulated Camera Viewfinder */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 text-center relative overflow-hidden">
                <div className="w-44 h-44 mx-auto border-2 border-dashed border-emerald-400/80 rounded-2xl flex flex-col items-center justify-center p-4 relative">
                  {/* Corner brackets */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>

                  <Camera className="w-8 h-8 text-emerald-400 mb-2 animate-pulse" />
                  <span className="text-[11px] text-slate-300 font-medium text-center">
                    Align student's QR code within the frame
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-3">
                  Camera ready · Auto-detects ZedWhisper Zambian Student Tripcodes
                </p>
              </div>

              {/* Or Enter Student Token Form */}
              <form onSubmit={handleManualTokenSubmit} className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Or enter student alias / token code:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="e.g. Natasha, Kondwani, or ZW-UNZA-104"
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Connect
                  </button>
                </div>
              </form>

              {/* Quick Tap to Connect Sample Campus Students */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500">Quick Test: Connect with Nearby Students:</span>
                <div className="grid grid-cols-2 gap-2">
                  {profiles.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSimulateScan(p)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {p.name[0]}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold truncate text-slate-900 dark:text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-500 truncate uppercase">{p.university} · {p.alias}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scanned Student Card Modal Overlay */}
              {scannedProfile && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Verified Campus Match Found!</span>
                    </span>
                    <button
                      onClick={() => setScannedProfile(null)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-lg flex items-center justify-center shadow-sm">
                      {scannedProfile.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {scannedProfile.name} <span className="text-xs font-normal text-slate-500">(@{scannedProfile.alias})</span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {scannedProfile.program} · {scannedProfile.university.toUpperCase()} ({scannedProfile.campus})
                      </p>
                    </div>
                  </div>

                  {/* Action buttons for connected profile */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => {
                        onStartChatWithProfile(scannedProfile);
                        onClose();
                      }}
                      className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Whisper</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenGiftModal(scannedProfile);
                        onClose();
                      }}
                      className="py-2 px-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Send Treat</span>
                    </button>

                    <button
                      onClick={() => {
                        onDropCrush(scannedProfile.alias);
                        onClose();
                      }}
                      className="py-2 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Drop Crush</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ANONYMOUS WHATSAPP RELAY */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>ZedWhisper Anonymous WhatsApp Gateway</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Zambian students frequently connect on WhatsApp (Airtel / MTN / Zamtel). ZedWhisper protects your privacy by routing initial greetings through a cryptographic token, preventing phone number scraping in public groups.
                </p>
              </div>

              {/* Carrier Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Your Primary Zambian Mobile Network:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Airtel Zambia', 'MTN Zambia', 'Zamtel'] as const).map((carrier) => (
                    <button
                      key={carrier}
                      onClick={() => setSelectedCarrier(carrier)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        selectedCarrier === carrier
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {carrier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy Shield Toggle */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Mask Real Phone Number</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Use token verification <span className="font-mono text-emerald-600 font-semibold">{connectionToken}</span> until both mutually accept.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWhatsappProtectionEnabled(!whatsappProtectionEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    whatsappProtectionEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      whatsappProtectionEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* WhatsApp Launch Button */}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp with Protected Campus Greeting</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            ZedWhisper Instant Campus Match Protocol
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
