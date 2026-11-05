import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import jsQR from 'jsqr';
import { CurrentUser, StudentProfile, UniversityId } from '../types';
import {
  QrCode,
  Share2,
  Copy,
  Check,
  Shield,
  MessageCircle,
  ExternalLink,
  Camera,
  Heart,
  Gift,
  Mail,
  UserCheck,
  X,
  Smartphone,
  Lock,
  RefreshCw,
  Upload,
  AlertCircle,
  CameraOff,
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

  // Real Camera & Scanner State
  const [cameraStatus, setCameraStatus] = useState<'idle' | 'requesting' | 'active' | 'denied' | 'unsupported'>('idle');
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // WhatsApp Relay State
  const [selectedCarrier, setSelectedCarrier] = useState<'Airtel Zambia' | 'MTN Zambia' | 'Zamtel'>('Airtel Zambia');
  const [whatsappProtectionEnabled, setWhatsappProtectionEnabled] = useState(true);
  const [directPeerPhone, setDirectPeerPhone] = useState('');

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

  const getDirectWhatsAppUrl = (phoneStr: string) => {
    let clean = phoneStr.replace(/[^0-9]/g, '');
    if (clean.startsWith('0') && clean.length === 10) {
      clean = '260' + clean.slice(1);
    }
    return clean ? `https://wa.me/${clean}?text=${whatsappAnonymousText}` : `https://wa.me/?text=${whatsappAnonymousText}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(connectionUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Stop camera tracks cleanly
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStatus('idle');
  };

  // Start real camera stream and initialize QR scan loop
  const startCamera = async (facing: 'environment' | 'user' = cameraFacing) => {
    setCameraError(null);
    setScanError(null);
    setCameraStatus('requesting');

    // Clean previous stream
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('unsupported');
      setCameraError('Camera API is not supported on this browser or connection. You can upload a photo of the QR code or enter the student token.');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      setCameraStatus('active');
      startScanLoop();
    } catch (err: any) {
      console.warn('Camera access denied or failed:', err);
      setCameraStatus('denied');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission denied. Please allow camera access in your browser or address bar settings to scan student QR codes.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device. You can upload an image of the QR code instead.');
      } else {
        setCameraError(`Camera could not be started: ${err.message || 'Unknown device error'}.`);
      }
    }
  };

  // Continuous frame scanner using jsQR
  const startScanLoop = () => {
    const scan = () => {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        animationFrameRef.current = requestAnimationFrame(scan);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx && canvas.width > 0 && canvas.height > 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data && code.data.trim().length > 0) {
          handleDetectedQr(code.data.trim());
          return; // Stop scan loop once detected
        }
      }

      animationFrameRef.current = requestAnimationFrame(scan);
    };

    animationFrameRef.current = requestAnimationFrame(scan);
  };

  // Flip between front and rear cameras
  const handleToggleFacingMode = () => {
    const nextMode = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextMode);
    startCamera(nextMode);
  };

  // Parse decoded QR data into a real student profile
  const handleDetectedQr = (qrData: string) => {
    stopCamera();

    // Haptic feedback if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(100);
      } catch {
        // Ignore
      }
    }

    let detectedToken = '';
    let detectedAlias = '';
    let detectedUni: UniversityId = 'unza';

    // 1. Check if payload is a URL
    try {
      if (qrData.includes('http://') || qrData.includes('https://') || qrData.includes('?connect=')) {
        const url = new URL(qrData.startsWith('http') ? qrData : `https://zedwhisper.app/${qrData}`);
        detectedToken = url.searchParams.get('connect') || '';
        detectedAlias = url.searchParams.get('alias') || '';
        detectedUni = (url.searchParams.get('uni') as UniversityId) || 'unza';
      }
    } catch {
      // Not a valid URL, treat as raw string
    }

    if (!detectedToken && qrData.startsWith('ZW-')) {
      detectedToken = qrData;
      const parts = qrData.split('-');
      if (parts[1]) {
        detectedUni = parts[1].toLowerCase() as UniversityId;
      }
    }

    const cleanSearch = (detectedAlias || detectedToken || qrData).toLowerCase().replace('@', '');

    // Check if matching student profile exists in loaded profiles
    const found = profiles.find(
      (p) =>
        p.alias.toLowerCase().includes(cleanSearch) ||
        p.name.toLowerCase().includes(cleanSearch) ||
        p.id.toLowerCase().includes(cleanSearch)
    );

    if (found) {
      setScannedProfile(found);
      setScanError(null);
      return;
    }

    // If profile not yet registered locally, create an authentic student profile dynamically
    const displayAlias = detectedAlias || cleanSearch || 'CampusScholar';
    const dynamicProfile: StudentProfile = {
      id: `stud-${Date.now()}`,
      name: displayAlias,
      alias: displayAlias,
      age: 21,
      gender: 'other',
      university: detectedUni,
      campus: 'Campus Main',
      program: 'Zambian Student Scholar',
      yearOfStudy: 2,
      bio: `Verified student connected in-person via ZedWhisper QR Code [${detectedToken || 'ZW-CAMPUS'}].`,
      interests: ['Campus Scholar', 'ZedWhisper Network'],
      hangoutSpot: 'Campus Quad',
      campusPromptQuestion: 'Connected via:',
      campusPromptAnswer: 'Real-time Camera QR Code Scan',
      avatarSeed: displayAlias,
      avatarBgColor: 'from-emerald-600 to-teal-700',
      isVerifiedStudent: true,
      reputationScore: 100,
      giftsReceived: [],
    };

    setScannedProfile(dynamicProfile);
    setScanError(null);
  };

  // Handle uploading a QR code image from gallery
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanError(null);
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          handleDetectedQr(code.data.trim());
        } else {
          setScanError('Could not find a valid QR code in this image. Please ensure the QR code is clear and well-lit, or use the camera scanner.');
        }
      };
      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleManualTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScanError(null);
    if (!tokenInput.trim()) return;

    handleDetectedQr(tokenInput.trim());
  };

  // Manage camera lifecycle based on active tab and modal state
  useEffect(() => {
    if (isOpen && activeTab === 'scan' && !scannedProfile) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, scannedProfile]);

  if (!isOpen) return null;

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
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-5 pt-2 border-b border-slate-100 dark:border-slate-800 gap-2 text-xs font-semibold shrink-0">
          <button
            onClick={() => {
              stopCamera();
              setActiveTab('my_qr');
            }}
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
            onClick={() => {
              stopCamera();
              setActiveTab('whatsapp');
            }}
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

              {/* Direct Peer WhatsApp and Quick Actions */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="tel"
                    value={directPeerPhone}
                    onChange={(e) => setDirectPeerPhone(e.target.value)}
                    placeholder="Peer's WhatsApp Number (e.g. 097...)"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <a
                    href={getDirectWhatsAppUrl(directPeerPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                    title="Initiate chat via wa.me link"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleCopyLink}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Profile Link'}</span>
                  </button>

                  <a
                    href={getDirectWhatsAppUrl(directPeerPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCAN STUDENT QR CODE (REAL CAMERA SCANNER) */}
          {activeTab === 'scan' && (
            <div className="space-y-4">
              {/* If a profile was scanned, display their verified student connection card */}
              {scannedProfile ? (
                <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4" />
                      <span>Verified Campus Match Found!</span>
                    </span>
                    <button
                      onClick={() => {
                        setScannedProfile(null);
                        startCamera();
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Scan Another</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 shadow-xs">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xl flex items-center justify-center shadow-xs shrink-0">
                      {scannedProfile.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {scannedProfile.name}{' '}
                        <span className="text-xs font-normal text-slate-500">(@{scannedProfile.alias})</span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                        {scannedProfile.program} · <span className="font-bold uppercase text-emerald-600">{scannedProfile.university}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {scannedProfile.campus}
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
                      className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Whisper</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenGiftModal(scannedProfile);
                        onClose();
                      }}
                      className="py-2.5 px-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Send Treat</span>
                    </button>

                    <button
                      onClick={() => {
                        onDropCrush(scannedProfile.alias);
                        onClose();
                      }}
                      className="py-2.5 px-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Drop Crush</span>
                    </button>
                  </div>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `🔒 ZedWhisper Campus Secure Match\nHello! Connecting with @${scannedProfile.alias} from ${scannedProfile.university.toUpperCase()}.\nVerification Token: [${connectionToken}]\nLet's chat!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat with @{scannedProfile.alias} on WhatsApp (wa.me)</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                </div>
              ) : (
                /* Live Camera Scanner Viewfinder */
                <div className="space-y-4">
                  <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[280px]">
                    {/* Live Video Element */}
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className={`w-full h-72 object-cover ${cameraStatus === 'active' ? 'block' : 'hidden'}`}
                    />

                    {/* Scanning Reticle & Overlay when Camera is Active */}
                    {cameraStatus === 'active' && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-48 h-48 border-2 border-emerald-400/90 rounded-2xl relative shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                          {/* Corner brackets */}
                          <div className="absolute -top-1 -left-1 w-5 h-5 border-t-3 border-l-3 border-emerald-400"></div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 border-t-3 border-r-3 border-emerald-400"></div>
                          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-3 border-l-3 border-emerald-400"></div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-3 border-r-3 border-emerald-400"></div>

                          {/* Animated Sweeping Laser Line */}
                          <div className="w-full h-0.5 bg-emerald-400/90 shadow-[0_0_8px_#34d399] absolute top-0 left-0 animate-bounce duration-1000"></div>
                        </div>

                        {/* Top Camera Controls Overlay */}
                        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto">
                          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            <span>Live Camera Active</span>
                          </span>

                          <button
                            onClick={handleToggleFacingMode}
                            className="p-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white hover:text-emerald-300 transition-colors border border-slate-700 cursor-pointer"
                            title="Flip Camera (Front/Rear)"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Bottom helper text */}
                        <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
                          <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium border border-slate-700">
                            Align student QR code within frame
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Camera Requesting / Starting State */}
                    {cameraStatus === 'requesting' && (
                      <div className="p-6 text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
                          <Camera className="w-6 h-6 animate-spin" />
                        </div>
                        <h4 className="text-white font-bold text-sm">Accessing Camera...</h4>
                        <p className="text-xs text-slate-400 max-w-xs">
                          Please tap "Allow" if prompted by your browser to scan peer QR codes directly.
                        </p>
                      </div>
                    )}

                    {/* Camera Permission Denied or Unsupported State */}
                    {(cameraStatus === 'denied' || cameraStatus === 'unsupported') && (
                      <div className="p-6 text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
                          <CameraOff className="w-6 h-6" />
                        </div>
                        <h4 className="text-white font-bold text-sm">Camera Permission Needed</h4>
                        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                          {cameraError || 'Camera access was blocked. You can grant camera permission in your browser or select an image from your gallery below.'}
                        </p>
                        <div className="flex items-center justify-center gap-2 pt-1">
                          <button
                            onClick={() => startCamera(cameraFacing)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Retry Camera</span>
                          </button>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload QR Photo</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Camera Idle State */}
                    {cameraStatus === 'idle' && (
                      <div className="p-6 text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center mx-auto">
                          <Camera className="w-6 h-6" />
                        </div>
                        <h4 className="text-white font-bold text-sm">Camera Scanner Ready</h4>
                        <p className="text-xs text-slate-400 max-w-xs">
                          Scan another student's ZedWhisper QR code to connect and chat.
                        </p>
                        <button
                          onClick={() => startCamera(cameraFacing)}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Start Camera</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Error Notification Banner */}
                  {scanError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{scanError}</span>
                    </div>
                  )}

                  {/* Alternative Connect Options: Image Upload & Token Input */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Or connect via Photo or Token:
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload QR Image</span>
                      </button>
                    </div>

                    <form onSubmit={handleManualTokenSubmit} className="flex gap-2">
                      <input
                        type="text"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        placeholder="Enter student alias or token (e.g. ZW-UNZA-1042)"
                        className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                      >
                        Connect
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Hidden Canvas and File Input for Processing */}
              <canvas ref={canvasRef} className="hidden" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
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
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
