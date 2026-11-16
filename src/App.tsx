/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  MapPin,
  MessageSquare,
  ArrowLeft,
  Check,
  Copy,
  ZoomIn,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type Language = 'en' | 'hi';
type ActivePage = 'home' | 'zones' | 'members' | 'director' | 'location';

const UPLOADED_LOGO_URL = '/assets/aistudio/WhatsApp_Image_2026-11-16_at_8.43.29_PM_c4cc8470.jpg';

interface HangingRopeLogoProps {
  onClickHome: () => void;
  lang: Language;
}

/**
 * Interactive Pendulum Logo suspended by a braided rope from the top header ceiling.
 * - Continuously sways gently on its own (ambient breeze).
 * - Can be grabbed/pulled with a finger or mouse (touch/pointer drag physics).
 * - Clicking/tapping triggers an energetic swing + bounce animation.
 * - Uses pointer-events-none on the outer wrapper so it never blocks surrounding UI.
 */
function HangingRopeLogo({ onClickHome, lang }: HangingRopeLogoProps) {
  const pivotRef = useRef<HTMLDivElement | null>(null);
  const pendulumRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLButtonElement | null>(null);

  // Physics state stored in refs for smooth 60fps animation without React re-render lag
  const physRef = useRef({
    angle: 6, // current angle in degrees
    velocity: 0, // angular velocity
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    maxDragDist: 0,
    lastPointerAngle: 0,
    lastMoveTime: 0,
    swingDir: 1,
    pulseScale: 1,
    pulseVelocity: 0,
  });

  useEffect(() => {
    let rafId: number;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const p = physRef.current;

      // Continuous natural breeze target angle (±4.8 deg) so it always gently sways
      const breezeTarget =
        Math.sin(elapsed * 2.1) * 4.2 + Math.cos(elapsed * 0.95) * 1.4;

      if (!p.isDragging) {
        // Restoring pendulum gravity torque toward the breeze target
        const restoringForce = -0.018 * (p.angle - breezeTarget);
        p.velocity += restoringForce;
        p.velocity *= 0.972; // realistic air damping
        p.angle += p.velocity;

        // Soft clamp within ±55 deg
        if (p.angle > 55) {
          p.angle = 55;
          p.velocity *= -0.5;
        } else if (p.angle < -55) {
          p.angle = -55;
          p.velocity *= -0.5;
        }
      }

      // Spring-back scale animation for click/tap bounce
      const scaleForce = -0.18 * (p.pulseScale - 1);
      p.pulseVelocity = (p.pulseVelocity + scaleForce) * 0.82;
      p.pulseScale += p.pulseVelocity;

      if (pendulumRef.current) {
        pendulumRef.current.style.transform = `rotate(${p.angle.toFixed(2)}deg)`;
      }
      if (badgeRef.current) {
        badgeRef.current.style.transform = `scale(${p.pulseScale.toFixed(3)})`;
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const computePointerAngle = (clientX: number, clientY: number) => {
    if (!pivotRef.current) return 0;
    const rect = pivotRef.current.getBoundingClientRect();
    const pivotX = rect.left + rect.width / 2;
    const pivotY = rect.top;
    const dx = clientX - pivotX;
    const dy = Math.max(30, clientY - pivotY);
    // Positive angle rotates clockwise (to the right), negative rotates counter-clockwise (to the left)
    const rawDeg = -Math.atan2(dx, dy) * (180 / Math.PI);
    return Math.max(-48, Math.min(48, rawDeg));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const p = physRef.current;
    p.isDragging = true;
    p.dragStartX = e.clientX;
    p.dragStartY = e.clientY;
    p.maxDragDist = 0;
    const newAngle = computePointerAngle(e.clientX, e.clientY);
    p.lastPointerAngle = newAngle;
    p.lastMoveTime = performance.now();
    p.pulseScale = 0.94;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore if pointer capture unsupported
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const p = physRef.current;
    if (!p.isDragging) return;

    const dist = Math.hypot(e.clientX - p.dragStartX, e.clientY - p.dragStartY);
    if (dist > p.maxDragDist) {
      p.maxDragDist = dist;
    }

    const now = performance.now();
    const dt = Math.max(1, now - p.lastMoveTime);
    const newAngle = computePointerAngle(e.clientX, e.clientY);

    // Track finger flick velocity
    p.velocity = ((newAngle - p.lastPointerAngle) / dt) * 14;
    p.angle = newAngle;
    p.lastPointerAngle = newAngle;
    p.lastMoveTime = now;
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    const p = physRef.current;
    if (!p.isDragging) return;
    p.isDragging = false;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }

    // If it was a tap/click (minimal drag distance), trigger an energetic swing + bounce!
    if (p.maxDragDist < 8) {
      p.swingDir *= -1;
      p.velocity = p.swingDir * 3.8;
      p.pulseVelocity = 0.085;
      onClickHome();
    } else {
      // Released after dragging with finger/mouse: boost release velocity slightly for a fun swing
      p.velocity = Math.max(-5.5, Math.min(5.5, p.velocity * 1.25));
      p.pulseVelocity = 0.05;
    }
  };

  const handleMouseEnter = () => {
    const p = physRef.current;
    if (!p.isDragging && Math.abs(p.velocity) < 1.2) {
      p.swingDir *= -1;
      p.velocity += p.swingDir * 1.45;
    }
  };

  return (
    <div
      ref={pivotRef}
      className="fixed top-0 left-2 sm:left-6 lg:left-10 z-50 pointer-events-none select-none"
      style={{ width: '148px' }}
    >
      {/* Swinging Pendulum Arm anchored at the very top ceiling (50% 0%) */}
      <div
        ref={pendulumRef}
        className=" flex flex-col items-center origin-top will-change-transform"
        style={{ transformOrigin: '50% 0%' }}
      >
        {/* Realistic Twisted Rope SVG + Top Ceiling Mount + Braided Knot */}
        <svg
          viewBox="0 0 40 76"
          className="w-7 sm:w-8 h-[48px] sm:h-[62px] md:h-[72px] shrink-0 drop-shadow-[0_4px_6px_rgba(0,0,0,0.65)] overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ropeFiberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5C4B37" />
              <stop offset="30%" stopColor="#D7C3A3" />
              <stop offset="55%" stopColor="#B39874" />
              <stop offset="85%" stopColor="#6E5A42" />
              <stop offset="100%" stopColor="#3E3223" />
            </linearGradient>
            <linearGradient id="goldRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>

          {/* Ceiling Shadow / Eyelet at top=0 */}
          <ellipse cx="20" cy="2" rx="6" ry="2.5" fill="#0B0F14" />

          {/* Main Braided Rope Core */}
          <rect x="16.5" y="0" width="7" height="58" rx="3" fill="url(#ropeFiberGrad)" />

          {/* Twisted Rope Diagonal Strands for Realistic Texture */}
          {[4, 11, 18, 25, 32, 39, 46, 52].map((yPos) => (
            <g key={yPos}>
              <path
                d={`M16 ${yPos} C18 ${yPos + 2.5}, 22 ${yPos + 2.5}, 24 ${yPos + 5}`}
                stroke="#433524"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={`M16.8 ${yPos + 1.5} C19 ${yPos + 3.5}, 21.5 ${yPos + 3.5}, 23.2 ${yPos + 5.5}`}
                stroke="#EFE2C8"
                strokeWidth="0.9"
                strokeOpacity="0.7"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          ))}

          {/* Realistic Rope Knot / Loop right above the Medallion */}
          <ellipse
            cx="20"
            cy="60"
            rx="6.5"
            ry="4.2"
            fill="url(#ropeFiberGrad)"
            stroke="#3E3223"
            strokeWidth="1.2"
          />
          <path
            d="M14.5 59.5 C17 62, 23 62, 25.5 59.5"
            stroke="#EFE2C8"
            strokeWidth="1"
            strokeOpacity="0.65"
            fill="none"
          />
          {/* Rope Anchor Loop Hugging the Top of the Medallion Ring */}
          <path
            d="M15 63 C14 70, 26 70, 25 63"
            stroke="url(#ropeFiberGrad)"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx="20"
            cy="68"
            r="4.5"
            fill="none"
            stroke="url(#goldRingGrad)"
            strokeWidth="2.2"
          />
        </svg>

        {/* Interactive Circular Medallion Badge */}
        <button
          ref={badgeRef}
          type="button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrCancel}
          onPointerCancel={handlePointerUpOrCancel}
          onMouseEnter={handleMouseEnter}
          title={
            lang === 'en'
              ? 'Drag with finger/mouse to swing or click for animation!'
              : 'अंगुली या माउस से हिलाएं या क्लिक करें!'
          }
          aria-label="Ace Fitness Club Hanging Logo — Drag or Click to Swing"
          className="-mt-2.5 w-[86px] h-[86px] sm:w-[112px] sm:h-[112px] md:w-[132px] md:h-[132px] rounded-full p-[3.5px] sm:p-[4.5px] bg-gradient-to-b from-[#FDE047] via-[#FACC15] to-[#EAB308] shadow-[0_16px_30px_rgba(0,0,0,0.45),0_4px_10px_rgba(0,0,0,0.3)] cursor-grab active:cursor-grabbing pointer-events-auto touch-none relative group focus:outline-none"
        >
          {/* Inner Black Circle Medallion */}
          <div className="w-full h-full rounded-full overflow-hidden bg-black relative flex items-center justify-center ring-1 ring-black/40">
            <img
              src={UPLOADED_LOGO_URL}
              alt="Ace Fitness Club Official Emblem"
              draggable={false}
              className="w-full h-full object-cover scale-[1.32] select-none pointer-events-none"
            />
            {/* Subtle Gloss Highlight across the top arc */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none rounded-full" />
          </div>
        </button>
      </div>
    </div>
  );
}

interface HeroSlide {
  id: string;
  index: string;
  src: string;
  kickerEn: string;
  kickerHi: string;
  titleEn: string;
  titleHi: string;
  subEn: string;
  subHi: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    index: '01',
    src: '/src/assets/images/original/orig_03.jpg',
    kickerEn: 'Reformer Pilates Now Available · Panchsati Circle, Bikaner',
    kickerHi: 'रिफॉर्मर पिलाटेस अब उपलब्ध · पंचशती सर्किल, सादुल गंज, बीकानेर',
    titleEn: 'For A Stronger, Fitter Nation',
    titleHi: 'एक सशक्त और स्वस्थ राष्ट्र के लिए — एस फिटनेस क्लब',
    subEn: 'Bikaner’s flagship fitness destination above Puma Showroom, Sadul Ganj. Personally guided on the floor by PEPT Australia & ACE certified Director Abhishek K. Gaur.',
    subHi: 'प्यूमा शोरूम के ऊपर, पंचशती सर्किल स्थित बीकानेर का सबसे भरोसेमंद फिटनेस क्लब। डायरेक्टर अभिषेक के. गौर (PEPT ऑस्ट्रेलिया एवं ACE सर्टिफाइड) के प्रत्यक्ष मार्गदर्शन में।',
  },
  {
    id: 'slide-2',
    index: '02',
    src: '/src/assets/images/original/orig_05.jpg',
    kickerEn: 'Biomechanics & Resistance Floor · Joint-Safe Hypertrophy',
    kickerHi: 'एडवांस्ड स्ट्रेंथ और बायोमैकेनिक्स ट्रेनिंग ज़ोन',
    titleEn: 'Precision Strength & Free Weights Sanctuary',
    titleHi: 'आधुनिक आइसोलेशन मशीन्स और हैवी स्ट्रेंथ फ्लोर',
    subEn: 'Train with commercial biomechanical isolation machines, dual cable crossovers, and heavy dumbbell setups engineered for posture-safe strength progression.',
    subHi: 'सही पोस्चर और सुरक्षित मसल ग्रोथ के लिए वर्ल्ड-क्लास बायोमैकेनिकल मशीन्स, केबल क्रॉसओवर और हैवी फ्री-वेट्स का पूरा सेटअप।',
  },
  {
    id: 'slide-3',
    index: '03',
    src: '/src/assets/images/original/orig_10.jpg',
    kickerEn: 'Cardiovascular Endurance · Cardiologist Endorsed',
    kickerHi: 'हृदय स्वास्थ्य, स्टैमिना और फैट लॉस स्टूडियो',
    titleEn: 'Commercial Cardio & Metabolic Conditioning',
    titleHi: 'कमर्शियल ट्रेडमिल्स, क्रॉस-ट्रेनर्स और स्पिनिंग स्टूडियो',
    subEn: 'Shock-absorbent commercial treadmills, smooth elliptical trainers, and indoor spin cycles designed for heart health, stamina, and sustainable fat loss.',
    subHi: 'हृदय रोग विशेषज्ञों द्वारा सराहा गया आधुनिक कार्डियो ज़ोन—जहाँ सुरक्षित रूप से स्टैमिना और फिटनेस को नई ऊँचाई मिलती है।',
  },
  {
    id: 'slide-4',
    index: '04',
    src: '/src/assets/images/original/orig_23.jpg',
    kickerEn: '10+ Training Formats Under One Roof · Mind & Body Studio',
    kickerHi: 'एक ही छत के नीचे 10+ आधुनिक फिटनेस प्रोग्राम',
    titleEn: 'Reformer Pilates, Yoga, Aerobics & Core',
    titleHi: 'रिफॉर्मर पिलाटेस, योगा, एरोबिक्स और कोर कंडीशनिंग',
    subEn: 'From Reformer Pilates, Aerial Yoga, and Quadiexer to Dance Fitness, Functional Training, and Clinical Nutrition Assistance—everything under one roof.',
    subHi: 'स्ट्रेंथ, कार्डियो, फंक्शनल ट्रेनिंग, रिफॉर्मर पिलाटेस, योगा, डांस फिटनेस, क्वाडिएक्सर और पर्सनल डाइट गाइडेंस—सब कुछ एक ही स्थान पर।',
  },
  {
    id: 'slide-5',
    index: '05',
    src: '/src/assets/images/original/orig_26.jpg',
    kickerEn: 'Community Athletics · Outdoor Bootcamp Speciality',
    kickerHi: 'आउटडोर ग्रुप फिटनेस और एथलेटिक ट्रेनिंग',
    titleEn: 'When Weather Supports, Outdoor Training Is Our Speciality',
    titleHi: 'जब मौसम सुहावना हो, तो आउटडोर ट्रेनिंग हमारी पहचान है',
    subEn: 'High-energy outdoor group workouts and athletic conditioning sessions led by Director Abhishek K. Gaur and the committed AFC Bikaner coaching team.',
    subHi: 'डायरेक्टर अभिषेक के. गौर और उनकी समर्पित टीम के नेतृत्व में ऊर्जावान आउटडोर फिटनेस सेशन और ग्रुप वर्कआउट्स।',
  },
];

const STRENGTH_PHOTOS = [
  { src: '/src/assets/images/original/orig_05.jpg', caption: 'Strength Zone — Cable Crossover & Free Weights' },
  { src: '/src/assets/images/original/orig_06.jpg', caption: 'Strength Zone — Isolation Machines & Turf' },
  { src: '/src/assets/images/original/orig_07.jpg', caption: 'Strength Zone — Heavy Dumbbell & Bench Area' },
  { src: '/src/assets/images/original/orig_08.jpg', caption: 'Strength Zone — Full Floor View' },
  { src: '/src/assets/images/original/orig_09.jpg', caption: 'Strength Zone — Plate-Loaded & Leg Machines' },
];

const CARDIO_PHOTOS = [
  { src: '/src/assets/images/original/orig_10.jpg', caption: 'Cardio Training — Commercial Treadmills & Ellipticals' },
  { src: '/src/assets/images/original/orig_11.jpg', caption: 'Cardio Training — Endurance Row' },
  { src: '/src/assets/images/original/orig_12.jpg', caption: 'Cardio Training — Cross Trainers & Spin Bikes' },
  { src: '/src/assets/images/original/orig_13.jpg', caption: 'Cardio Training — Cardio Deck View' },
  { src: '/src/assets/images/original/orig_14.jpg', caption: 'Cardio Training — Treadmill Lineup' },
  { src: '/src/assets/images/original/orig_15.jpg', caption: 'Cardio Training — Metabolic Conditioning Zone' },
];

const ABS_PHOTOS = [
  { src: '/src/assets/images/original/orig_16.jpg', caption: 'Abs Zone — Core Conditioning Floor' },
  { src: '/src/assets/images/original/orig_17.jpg', caption: 'Abs Zone — Abdominal & Functional Setup' },
  { src: '/src/assets/images/original/orig_18.jpg', caption: 'Abs Zone — Mat & Core Stability Area' },
  { src: '/src/assets/images/original/orig_19.jpg', caption: 'Abs Zone — Functional & Core Equipment' },
  { src: '/src/assets/images/original/orig_20.jpg', caption: 'Abs Zone — Suspension & Core Training' },
];

const YOGA_PILATES_PHOTOS = [
  { src: '/src/assets/images/original/orig_21.jpg', caption: 'Yoga & Pilates — Group Mind-Body Session' },
  { src: '/src/assets/images/original/orig_22.jpg', caption: 'Yoga & Pilates — Flexibility & Posture Alignment' },
  { src: '/src/assets/images/original/orig_23.jpg', caption: 'Yoga & Pilates — Studio Practice' },
  { src: '/src/assets/images/original/orig_24.jpg', caption: 'Yoga & Pilates — Guided Stretching & Mobility' },
  { src: '/src/assets/images/original/orig_25.jpg', caption: 'Yoga & Pilates — Reformer Pilates & Core' },
];

const CERTIFICATES = [
  {
    src: '/src/assets/images/original/orig_32.jpg',
    titleEn: 'ACE Specialist — Fitness Nutrition Specialist Program',
    titleHi: 'ACE स्पेशलिस्ट — फिटनेस न्यूट्रिशन स्पेशलिस्ट प्रोग्राम',
    issuer: 'American Council on Exercise (ACE)',
  },
  {
    src: '/src/assets/images/original/orig_33.jpg',
    titleEn: 'ACE Certified Personal Trainer (NCCA Accredited)',
    titleHi: 'ACE सर्टिफाइड पर्सनल ट्रेनर (NCCA मान्यता प्राप्त)',
    issuer: 'American Council on Exercise (ACE)',
  },
  {
    src: '/src/assets/images/original/orig_34.jpg',
    titleEn: 'The 3D Approach to Finding Nutritional Balance',
    titleHi: 'न्यूट्रिशनल बैलेंस (3D अप्रोच) सर्टिफिकेट',
    issuer: 'ACE Approved Continuing Education',
  },
  {
    src: '/src/assets/images/original/orig_35.jpg',
    titleEn: 'ACE IFT® Model: Personal Training Program Design',
    titleHi: 'ACE IFT® मॉडल: पर्सनल ट्रेनिंग प्रोग्राम डिज़ाइन',
    issuer: 'ACE Approved Continuing Education',
  },
  {
    src: '/src/assets/images/original/orig_36.jpg',
    titleEn: 'Fitness Math — Exercise Science & Calculation',
    titleHi: 'फिटनेस मैथ — एक्सरसाइज साइंस सर्टिफिकेट',
    issuer: 'ACE Approved Continuing Education',
  },
  {
    src: '/src/assets/images/original/orig_37.jpg',
    titleEn: 'Basic Life Support (CPR and AED) Provider',
    titleHi: 'बेसिक लाइफ सपोर्ट (CPR और AED) प्रोवाइडर',
    issuer: 'American Heart Association',
  },
];

const FITNESS_SOLUTIONS = [
  { en: 'STRENGTH TRAINING', hi: 'स्ट्रेंथ ट्रेनिंग' },
  { en: 'CARDIO TRAINING', hi: 'कार्डियो ट्रेनिंग' },
  { en: 'FUNCTIONAL TRAINING', hi: 'फंक्शनल ट्रेनिंग' },
  { en: 'PERSONAL TRAINING', hi: 'पर्सनल ट्रेनिंग' },
  { en: 'AEROBICS', hi: 'एरोबिक्स' },
  { en: 'DANCE FITNESS', hi: 'डांस फिटनेस' },
  { en: 'CORE STRENGTHENING & CONDITIONING', hi: 'कोर स्ट्रेंथनिंग और कंडीशनिंग' },
  { en: 'QUADIEXER', hi: 'क्वाडिएक्सर (QUADIEXER)' },
  { en: 'NUTRITIONAL ASSISTANCE', hi: 'न्यूट्रिशनल असिस्टेंस (डाइट गाइडेंस)' },
];

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; caption: string } | null>(null);

  // WhatsApp Booking Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('STRENGTH TRAINING');
  const [preferredBatch, setPreferredBatch] = useState('Morning (6:00 AM – 11:00 AM)');
  const [formError, setFormError] = useState('');
  const [bookingPrepared, setBookingPrepared] = useState(false);
  const [copiedWaText, setCopiedWaText] = useState(false);

  const t = (enText: string, hiText: string) => (lang === 'en' ? enText : hiText);

  // Automatic Hero Slider Timer (Every 4 seconds)
  useEffect(() => {
    if (activePage !== 'home') return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activePage]);

  // Instant navigation without any scrolling animation
  const navigateInstant = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const buildWhatsAppMessage = () => {
    const cleanName = fullName.trim() || (lang === 'en' ? 'Member' : 'मेंबर');
    const cleanPhone = phoneNumber.trim() || (lang === 'en' ? 'Not provided' : 'उपलब्ध नहीं');

    if (lang === 'hi') {
      return [
        'नमस्ते एस फिटनेस क्लब (Ace Fitness Club, Bikaner)!',
        'मैं आपके जिम में ट्रायल / मेंबरशिप की जानकारी चाहता/चाहती हूँ।',
        '',
        `*नाम:* ${cleanName}`,
        `*मोबाइल नंबर:* ${cleanPhone}`,
        `*पसंदीदा ट्रेनिंग:* ${selectedProgram}`,
        `*समय:* ${preferredBatch}`,
        '*पता:* Above Puma Showroom, Panchsati Circle, Sadul Ganj, Bikaner',
      ].join('\n');
    }

    return [
      'Hello Ace Fitness Club Bikaner!',
      'I would like to book a Trial Session / inquire about membership.',
      '',
      `*Name:* ${cleanName}`,
      `*Mobile:* ${cleanPhone}`,
      `*Program:* ${selectedProgram}`,
      `*Preferred Time:* ${preferredBatch}`,
      '*Location:* Above Puma Showroom, Panchsati Circle, Sadul Ganj, Bikaner',
    ].join('\n');
  };

  const whatsappUrl = `https://wa.me/919116642929?text=${encodeURIComponent(buildWhatsAppMessage())}`;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (!fullName.trim()) {
      setFormError(t('Please enter your name.', 'कृपया अपना नाम दर्ज करें।'));
      return;
    }
    if (digitsOnly.length < 10) {
      setFormError(t('Please enter a valid 10-digit mobile number.', 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।'));
      return;
    }
    setFormError('');
    setBookingPrepared(true);
    const anchor = document.getElementById('direct-wa-trigger') as HTMLAnchorElement | null;
    if (anchor) {
      anchor.click();
    }
  };

  const handleCopyWhatsAppText = async () => {
    try {
      await navigator.clipboard.writeText(buildWhatsAppMessage());
      setCopiedWaText(true);
      setTimeout(() => setCopiedWaText(false), 2500);
    } catch {
      setCopiedWaText(false);
    }
  };

  const showSection = (section: Exclude<ActivePage, 'home'>) =>
    activePage === 'home' || activePage === section;

  const activeSlideObj = HERO_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-white text-[#212121] flex flex-col pt-[96px] md:pt-[68px]">
      {/* ==================== INTERACTIVE SWINGING ROPE LOGO (CONTINUOUS SWAY + FINGER DRAG + CLICK BOOST) ==================== */}
      <HangingRopeLogo onClickHome={() => navigateInstant('home')} lang={lang} />

      {/* ==================== STYLISH PERMANENTLY FIXED TOP HEADER ==================== */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-[#111820] via-[#17232E] to-[#111820] text-white border-b-2 border-[#FACC15]/80 shadow-md">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4 sm:gap-8 pl-[108px] sm:pl-[148px] md:pl-[172px] pr-4 sm:pr-6 h-[60px] md:h-[68px]">
          {/* Mobile Compact Brand Title (to the right of the hanging rope on small screens) */}
          <button
            type="button"
            onClick={() => navigateInstant('home')}
            className="flex md:hidden items-center gap-1.5 font-display-athletic text-lg font-bold tracking-wider whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="text-[#FACC15] italic">ACE</span>
            <span className="bg-[#FACC15] text-[#111820] px-1.5 py-0.5 rounded-xs italic text-sm">
              FITNESS
            </span>
          </button>

          {/* Zone 2: Desktop Single-Line Navigation Links (Centered like reference design) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center justify-center flex-1 gap-7 lg:gap-8 text-sm font-semibold text-slate-200"
          >
            <button
              type="button"
              onClick={() => navigateInstant('home')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 ${
                activePage === 'home'
                  ? 'text-[#FACC15] border-[#FACC15]'
                  : 'border-transparent hover:text-[#FACC15]'
              }`}
            >
              {t('Home', 'होम')}
            </button>
            <button
              type="button"
              onClick={() => navigateInstant('zones')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 ${
                activePage === 'zones'
                  ? 'text-[#FACC15] border-[#FACC15]'
                  : 'border-transparent hover:text-[#FACC15]'
              }`}
            >
              {t('Training Zones', 'ट्रेनिंग ज़ोन')}
            </button>
            <button
              type="button"
              onClick={() => navigateInstant('members')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 ${
                activePage === 'members'
                  ? 'text-[#FACC15] border-[#FACC15]'
                  : 'border-transparent hover:text-[#FACC15]'
              }`}
            >
              {t('Members Say', 'डॉक्टर्स और मेंबर्स')}
            </button>
            <button
              type="button"
              onClick={() => navigateInstant('director')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 ${
                activePage === 'director'
                  ? 'text-[#FACC15] border-[#FACC15]'
                  : 'border-transparent hover:text-[#FACC15]'
              }`}
            >
              {t('Director & Certificates', 'डायरेक्टर और सर्टिफिकेट्स')}
            </button>
            <button
              type="button"
              onClick={() => navigateInstant('location')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 ${
                activePage === 'location'
                  ? 'text-[#FACC15] border-[#FACC15]'
                  : 'border-transparent hover:text-[#FACC15]'
              }`}
            >
              {t('Directions & Map', 'डायरेक्शन और मैप')}
            </button>
          </nav>

          {/* Zone 3: 1 Primary CTA Button */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => navigateInstant('location')}
              className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-[#111820] bg-[#FACC15] hover:bg-[#FDE047] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              {t('Book Trial / Map', 'ट्रायल / मैप')}
            </button>
          </div>
        </div>

        {/* Mobile Clean Tab Row (Indented on left so the hanging medallion never blocks the Home tab) */}
        <nav
          aria-label="Mobile Navigation"
          className="flex md:hidden items-center justify-between gap-5 overflow-x-auto no-scrollbar pl-[108px] sm:pl-[148px] pr-4 h-[36px] bg-[#0D1318] border-t border-white/10 text-xs font-semibold"
        >
          {(
            [
              { id: 'home', en: 'Home', hi: 'होम' },
              { id: 'zones', en: 'Training Zones', hi: 'ट्रेनिंग ज़ोन' },
              { id: 'members', en: 'Doctors & Reviews', hi: 'डॉक्टर रिव्यु' },
              { id: 'director', en: 'Director & Certificates', hi: 'डायरेक्टर/सर्टिफिकेट' },
              { id: 'location', en: 'Directions & Map', hi: 'मैप और लोकेशन' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateInstant(item.id)}
              className={`h-full flex items-center whitespace-nowrap shrink-0 cursor-pointer border-b-2 transition-colors ${
                activePage === item.id
                  ? 'text-[#FACC15] border-[#FACC15] font-bold'
                  : 'text-slate-300 border-transparent hover:text-white'
              }`}
            >
              {lang === 'en' ? item.en : item.hi}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        {/* Sub-page Instant Return Bar + Language Toggle when viewing a specific section */}
        {activePage !== 'home' && (
          <div className="bg-[#F2F2F2] border-b border-slate-200 mb-8 sm:mb-10">
            <div className="max-w-[1280px] mx-auto pl-[112px] sm:pl-[152px] md:pl-[180px] pr-4 sm:pr-6 py-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigateInstant('home')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1E6C93] hover:underline cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('Back to Home Page', 'वापस होम पेज पर जाएं')}</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    lang === 'en' ? 'bg-[#1E6C93] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
                <span className="text-slate-300">/</span>
                <button
                  type="button"
                  onClick={() => setLang('hi')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    lang === 'hi' ? 'bg-[#1E6C93] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== FULL-WIDTH AUTO-SLIDING HERO WITH REFINED EDITORIAL TYPOGRAPHY ==================== */}
        {activePage === 'home' && (
          <section className="relative w-full bg-slate-950 overflow-hidden">
            {/* Full-Width Automatic Image Carousel */}
            <div className="relative w-full h-[500px] sm:h-[580px] lg:h-[650px]">
              {HERO_SLIDES.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.src}
                    alt={slide.titleEn}
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Multi-Stop Editorial Scrim for Crystal-Clear Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/25" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-slate-950/40" />
                </div>
              ))}

              {/* Top Utility Row Inside Hero: Slide Counter + Clean Bilingual Switcher (Indented past hanging logo) */}
              <div className="absolute top-0 left-0 right-0 z-20 max-w-[1280px] mx-auto pl-[112px] sm:pl-[152px] md:pl-[180px] pr-4 sm:pr-6 pt-4 sm:pt-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono-tabular text-white/85">
                  <span className="text-[#FACC15] font-bold">{activeSlideObj.index}</span>
                  <span className="text-white/40">/</span>
                  <span>0{HERO_SLIDES.length}</span>
                  <span className="hidden sm:inline text-white/40">·</span>
                  <span className="hidden sm:inline text-white/85 font-sans">
                    {t('Ace Fitness Club, Sadul Ganj, Bikaner', 'एस फिटनेस क्लब, सादुल गंज, बीकानेर')}
                  </span>
                </div>

                {/* Clean Segmented Language Switch */}
                <div
                  className="flex items-center gap-1 p-1 bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-md text-xs font-semibold shrink-0"
                  role="group"
                  aria-label="Language Switcher"
                >
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                      lang === 'en' ? 'bg-[#FACC15] text-slate-950 font-bold' : 'text-white/85 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('hi')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                      lang === 'hi' ? 'bg-[#FACC15] text-slate-950 font-bold' : 'text-white/85 hover:text-white'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              {/* Left / Right Slider Arrow Controls */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="hidden sm:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/55 hover:bg-slate-950/85 border border-white/20 text-white items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="hidden sm:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/55 hover:bg-slate-950/85 border border-white/20 text-white items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Main Editorial Hero Copy Container */}
              <div className="absolute inset-x-0 bottom-0 z-20 max-w-[1280px] mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
                <div className="max-w-3xl space-y-3 sm:space-y-4">
                  {/* Kicker Line */}
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold tracking-wide text-[#FACC15]">
                    <span>
                      {lang === 'en' ? activeSlideObj.kickerEn : activeSlideObj.kickerHi}
                    </span>
                  </div>

                  {/* High-Contrast Balanced Display Headline */}
                  <h1
                    className="font-display-athletic text-3xl sm:text-5xl lg:text-[3.6rem] font-bold text-white leading-[1.1] tracking-tight drop-shadow-sm"
                    style={{ textWrap: 'balance' }}
                  >
                    {lang === 'en' ? activeSlideObj.titleEn : activeSlideObj.titleHi}
                  </h1>

                  {/* Refined Readable Description */}
                  <p className="text-sm sm:text-base lg:text-lg text-slate-100/95 max-w-2xl leading-relaxed font-normal">
                    {lang === 'en' ? activeSlideObj.subEn : activeSlideObj.subHi}
                  </p>

                  {/* Primary & Secondary Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => navigateInstant('location')}
                      className="px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-[#FACC15] hover:bg-[#FDE047] rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                    >
                      {t('Book Free Trial on WhatsApp', 'WhatsApp पर फ्री ट्रायल बुक करें')}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateInstant('zones')}
                      className="px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-white/15 hover:bg-white/25 backdrop-blur-xs border border-white/25 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {t('Explore Training Zones', 'सभी ट्रेनिंग ज़ोन देखें')}
                    </button>
                    <a
                      href="tel:+919116642929"
                      className="px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:text-[#FACC15] transition-colors whitespace-nowrap font-mono-tabular"
                    >
                      +91 91166 42929
                    </a>
                  </div>
                </div>

                {/* Interactive Numbered Slide Selector Bar */}
                <div className="mt-7 pt-4 border-t border-white/15 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {HERO_SLIDES.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Slide ${idx + 1}`}
                        className={`group flex items-center gap-1.5 py-1 cursor-pointer transition-all ${
                          idx === currentSlide ? 'text-[#FACC15]' : 'text-white/50 hover:text-white/80'
                        }`}
                      >
                        <span className="font-mono-tabular text-xs font-bold">{s.index}</span>
                        <span
                          className={`h-1 rounded-full transition-all ${
                            idx === currentSlide ? 'w-7 sm:w-10 bg-[#FACC15]' : 'w-2 bg-white/35'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Mobile Prev/Next Touch Controls */}
                  <div className="flex sm:hidden items-center gap-2">
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Previous slide"
                      className="p-1.5 rounded bg-white/15 text-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Next slide"
                      className="p-1.5 rounded bg-white/15 text-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Below Hero Slider: Original "FOR A STRONGER NATION" Video Showcase */}
            <div className="bg-[#5F6368] text-white py-10 sm:py-14">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/20 pb-4">
                  <div>
                    <div className="text-xs font-semibold tracking-wider text-[#FACC15] uppercase">
                      {t('OFFICIAL CLUB VIDEOS · AFC BIKANER', 'क्लब के आधिकारिक वीडियो · AFC बीकानेर')}
                    </div>
                    <h2 className="font-display-athletic text-2xl sm:text-4xl font-bold tracking-wide uppercase text-white mt-0.5">
                      {t('FOR A STRONGER NATION', 'FOR A STRONGER NATION — एक सशक्त राष्ट्र के लिए')}
                    </h2>
                  </div>
                  <div className="text-xs text-slate-200">
                    {t(
                      'Above Puma Showroom, Panchsati Circle, Sadul Ganj, Bikaner',
                      'प्यूमा शोरूम के ऊपर, पंचशती सर्किल, सादुल गंज, बीकानेर'
                    )}
                  </div>
                </div>

                {/* Original 2 YouTube Videos Side-by-Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="rounded-lg overflow-hidden bg-black aspect-video shadow-md">
                    <iframe
                      title="Ace Fitness Club Video 1"
                      src="https://www.youtube.com/embed/M-vhNsFS9gk"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden bg-black aspect-video shadow-md">
                    <iframe
                      title="Ace Fitness Club Video 2"
                      src="https://www.youtube.com/embed/Y1Kq8dDW3k0"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================== TRAINING ZONES (Original Photos in Exact Order) ==================== */}
        {showSection('zones') && (
          <section className="py-12 sm:py-16 bg-white space-y-14 sm:space-y-16">
            {/* 1. STRENGTH ZONE (orig_05 to orig_09) */}
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-4 pb-3 border-b border-slate-200">
                <div>
                  <h2 className="font-display-athletic text-2xl sm:text-3xl font-bold text-[#1E6C93] tracking-wide uppercase">
                    {t('STRENGTH ZONE', 'स्ट्रेंथ ज़ोन (STRENGTH ZONE)')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    {t(
                      'Biomechanical isolation machines, cable crossovers & heavy free weights',
                      'बायोमैकेनिकल आइसोलेशन मशीन्स, केबल क्रॉसओवर और हैवी फ्री-वेट्स'
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProgram('STRENGTH TRAINING');
                    navigateInstant('location');
                  }}
                  className="text-xs sm:text-sm font-bold text-[#1E6C93] hover:underline cursor-pointer whitespace-nowrap"
                >
                  {t('Book Strength Trial →', 'स्ट्रेंथ ट्रायल बुक करें →')}
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {STRENGTH_PHOTOS.map((photo, index) => (
                  <div
                    key={photo.src}
                    onClick={() => setLightboxImage(photo)}
                    className={`group relative rounded-lg overflow-hidden bg-slate-100 cursor-pointer ${
                      index === 0 ? 'col-span-2 lg:col-span-2' : ''
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-48 sm:h-64 lg:h-72 object-cover group-hover:scale-[1.02] transition-transform duration-200"
                    />
                    <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white p-1.5 rounded">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. CARDIO TRAINING (orig_10 to orig_15) */}
            <div className="bg-[#F2F2F2] py-12 sm:py-14">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-5">
                <div className="flex flex-wrap items-end justify-between gap-4 pb-3 border-b border-slate-300">
                  <div>
                    <h2 className="font-display-athletic text-2xl sm:text-3xl font-bold text-[#1E6C93] tracking-wide uppercase">
                      {t('CARDIO TRAINING', 'कार्डियो ट्रेनिंग (CARDIO TRAINING)')}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      {t(
                        'Commercial treadmills, cross-trainers, spin bikes & metabolic conditioning',
                        'कमर्शियल ट्रेडमिल्स, क्रॉस-ट्रेनर्स और स्पिन बाइक्स का आधुनिक कार्डियो सेक्शन'
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProgram('CARDIO TRAINING');
                      navigateInstant('location');
                    }}
                    className="text-xs sm:text-sm font-bold text-[#1E6C93] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    {t('Book Cardio Trial →', 'कार्डियो ट्रायल बुक करें →')}
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                  {CARDIO_PHOTOS.map((photo) => (
                    <div
                      key={photo.src}
                      onClick={() => setLightboxImage(photo)}
                      className="group relative rounded-lg overflow-hidden bg-white cursor-pointer"
                    >
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        className="w-full h-44 sm:h-60 object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      />
                      <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white p-1.5 rounded">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. ABS ZONE (orig_16 to orig_20) */}
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-4 pb-3 border-b border-slate-200">
                <div>
                  <h2 className="font-display-athletic text-2xl sm:text-3xl font-bold text-[#1E6C93] tracking-wide uppercase">
                    {t('ABS ZONE', 'एब्स और कोर ज़ोन (ABS ZONE)')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    {t(
                      'Dedicated core strengthening, functional turf & abdominal conditioning',
                      'कोर स्ट्रेंथनिंग, एब्स वर्कआउट और फंक्शनल फिटनेस के लिए समर्पित ज़ोन'
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProgram('CORE STRENGTHENING & CONDITIONING');
                    navigateInstant('location');
                  }}
                  className="text-xs sm:text-sm font-bold text-[#1E6C93] hover:underline cursor-pointer whitespace-nowrap"
                >
                  {t('Book Abs Zone Trial →', 'एब्स ज़ोन ट्रायल बुक करें →')}
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {ABS_PHOTOS.map((photo, index) => (
                  <div
                    key={photo.src}
                    onClick={() => setLightboxImage(photo)}
                    className={`group relative rounded-lg overflow-hidden bg-slate-100 cursor-pointer ${
                      index === 0 ? 'col-span-2 lg:col-span-2' : ''
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-48 sm:h-64 lg:h-72 object-cover group-hover:scale-[1.02] transition-transform duration-200"
                    />
                    <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white p-1.5 rounded">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. YOGA & PILATES (orig_21 to orig_25) */}
            <div className="bg-[#F2F2F2] py-12 sm:py-14">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-5">
                <div className="flex flex-wrap items-end justify-between gap-4 pb-3 border-b border-slate-300">
                  <div>
                    <h2 className="font-display-athletic text-2xl sm:text-3xl font-bold text-[#1E6C93] tracking-wide uppercase">
                      {t('YOGA & PILATES', 'योगा और पिलाटेस (YOGA & PILATES)')}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      {t(
                        'Reformer Pilates, Aerial Yoga, TRX suspension & guided flexibility studio',
                        'रिफॉर्मर पिलाटेस, योगा, स्ट्रेचिंग और लचीलेपन के लिए विशेष स्टूडियो'
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProgram('REFORMER PILATES & YOGA');
                      navigateInstant('location');
                    }}
                    className="text-xs sm:text-sm font-bold text-[#1E6C93] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    {t('Book Yoga & Pilates Trial →', 'योगा / पिलाटेस ट्रायल बुक करें →')}
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                  {YOGA_PILATES_PHOTOS.map((photo, index) => (
                    <div
                      key={photo.src}
                      onClick={() => setLightboxImage(photo)}
                      className={`group relative rounded-lg overflow-hidden bg-white cursor-pointer ${
                        index === 2 ? 'col-span-2 lg:col-span-2' : ''
                      }`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        className="w-full h-48 sm:h-64 lg:h-72 object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      />
                      <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white p-1.5 rounded">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. OUTDOOR TRAINING SPECIALTY (orig_26.jpg) */}
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                <div className="lg:col-span-7">
                  <div
                    onClick={() =>
                      setLightboxImage({
                        src: '/src/assets/images/original/orig_26.jpg',
                        caption: 'When The Weather Supports, Outdoor Training Is Our Speciality',
                      })
                    }
                    className="rounded-lg overflow-hidden shadow-xs cursor-pointer bg-slate-100"
                  >
                    <img
                      src="/src/assets/images/original/orig_26.jpg"
                      alt="Ace Fitness Club Outdoor Training Session"
                      className="w-full h-auto max-h-[420px] object-cover"
                    />
                  </div>
                </div>
                <div className="lg:col-span-5 space-y-3">
                  <div className="text-xs font-bold tracking-wider uppercase text-[#1E6C93]">
                    {t('OUTDOOR ATHLETIC CONDITIONING', 'आउटडोर ग्रुप फिटनेस और ट्रेनिंग')}
                  </div>
                  <h3 className="font-display-athletic text-2xl sm:text-4xl font-bold text-[#212121] leading-tight uppercase">
                    {t(
                      'WHEN THE WEATHER SUPPORTS, OUTDOOR TRAINING IS OUR SPECIALITY.',
                      'WHEN THE WEATHER SUPPORTS, OUTDOOR TRAINING IS OUR SPECIALITY.'
                    )}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {t(
                      'High-energy outdoor bootcamps, team endurance drills, and community workouts organized across Bikaner by Director Abhishek K. Gaur and the AFC coaching team.',
                      'डायरेक्टर अभिषेक के. गौर और AFC टीम द्वारा बीकानेर के मेंबर्स के लिए विशेष आउटडोर फिटनेस कैंप और ग्रुप वर्कआउट सेशन।'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================== MEMBERS SAY (Original Photos of Doctors & ADM) ==================== */}
        {showSection('members') && (
          <section className="py-14 sm:py-16 bg-[#F2F2F2] border-t border-slate-200">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
              <div className="text-center space-y-1.5">
                <div className="text-xs font-bold tracking-widest uppercase text-[#1E6C93]">
                  {t('MEDICAL & ADMINISTRATIVE ENDORSEMENTS', 'बीकानेर के वरिष्ठ डॉक्टर्स और प्रशासनिक अधिकारियों के विचार')}
                </div>
                <h2 className="font-display-athletic text-3xl sm:text-4xl font-bold text-[#212121] uppercase">
                  {t('MEMBERS SAY', 'MEMBERS SAY (मेंबर्स और डॉक्टर्स की राय)')}
                </h2>
              </div>

              {/* 3 Original Endorsement Cards with Their Real Portraits (orig_27, orig_28, orig_29) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {/* 1. DR. ACHYUT TRIVEDI (orig_27.jpg) */}
                <article className="rounded-lg bg-white overflow-hidden shadow-xs flex flex-col justify-between">
                  <div>
                    <div
                      onClick={() =>
                        setLightboxImage({
                          src: '/src/assets/images/original/orig_27.jpg',
                          caption: 'Dr. Achyut Trivedi — Neuro-Psychiatrist',
                        })
                      }
                      className="h-64 sm:h-72 bg-slate-100 overflow-hidden cursor-pointer"
                    >
                      <img
                        src="/src/assets/images/original/orig_27.jpg"
                        alt="Dr. Achyut Trivedi Neuro-Psychiatrist"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="p-5 sm:p-6 space-y-2.5">
                      <div>
                        <h3 className="font-display-athletic text-2xl font-bold text-[#1E6C93] uppercase">
                          DR. ACHYUT TRIVEDI
                        </h3>
                        <div className="text-xs font-semibold text-slate-500 uppercase mt-0.5">
                          {t('NEURO-PSYCHIATRIST', 'NEURO-PSYCHIATRIST (वरिष्ठ मनोचिकित्सक)')}
                        </div>
                      </div>
                      <blockquote className="text-sm text-slate-700 leading-relaxed italic">
                        {t(
                          '“ACE MEANS ANYONE CAN BE ENERGIZED WITH GOOD EFFORTS AND BALANCED MEAL INTAKE. YOUR FITNESS IS 100% MENTAL. YOUR BODY WONT GO WHERE MIND DOESN’T PUSH.”',
                          '“ACE MEANS ANYONE CAN BE ENERGIZED WITH GOOD EFFORTS AND BALANCED MEAL INTAKE. YOUR FITNESS IS 100% MENTAL. YOUR BODY WONT GO WHERE MIND DOESN’T PUSH.”'
                        )}
                      </blockquote>
                    </div>
                  </div>
                </article>

                {/* 2. DR. GAURAV MATHUR (orig_28.jpg) */}
                <article className="rounded-lg bg-white overflow-hidden shadow-xs flex flex-col justify-between">
                  <div>
                    <div
                      onClick={() =>
                        setLightboxImage({
                          src: '/src/assets/images/original/orig_28.jpg',
                          caption: 'Dr. Gaurav Mathur — Cardiologist',
                        })
                      }
                      className="h-64 sm:h-72 bg-slate-100 overflow-hidden cursor-pointer"
                    >
                      <img
                        src="/src/assets/images/original/orig_28.jpg"
                        alt="Dr. Gaurav Mathur Cardiologist"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="p-5 sm:p-6 space-y-2.5">
                      <div>
                        <h3 className="font-display-athletic text-2xl font-bold text-[#1E6C93] uppercase">
                          DR. GAURAV MATHUR
                        </h3>
                        <div className="text-xs font-semibold text-slate-500 uppercase mt-0.5">
                          {t('CARDIOLOGIST', 'CARDIOLOGIST (वरिष्ठ हृदय रोग विशेषज्ञ)')}
                        </div>
                      </div>
                      <blockquote className="text-sm text-slate-700 leading-relaxed italic">
                        {t(
                          '“A HEALTHY HEART RESIDES IN A HEALTHY BODY, MAKE SURE YOU ARE TAKING CARE OF BOTH.”',
                          '“A HEALTHY HEART RESIDES IN A HEALTHY BODY, MAKE SURE YOU ARE TAKING CARE OF BOTH.”'
                        )}
                      </blockquote>
                    </div>
                  </div>
                </article>

                {/* 3. O P MEHRA ADM (BIKANER) Former IAS (orig_29.jpg) */}
                <article className="rounded-lg bg-white overflow-hidden shadow-xs flex flex-col justify-between">
                  <div>
                    <div
                      onClick={() =>
                        setLightboxImage({
                          src: '/src/assets/images/original/orig_29.jpg',
                          caption: 'O P Mehra — ADM (Bikaner) Former IAS',
                        })
                      }
                      className="h-64 sm:h-72 bg-slate-100 overflow-hidden cursor-pointer"
                    >
                      <img
                        src="/src/assets/images/original/orig_29.jpg"
                        alt="O P Mehra ADM Bikaner Former IAS"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="p-5 sm:p-6 space-y-2.5">
                      <div>
                        <h3 className="font-display-athletic text-2xl font-bold text-[#1E6C93] uppercase">
                          O P MEHRA
                        </h3>
                        <div className="text-xs font-semibold text-slate-500 uppercase mt-0.5">
                          {t('ADM (BIKANER) · Former IAS', 'ADM (BIKANER) · Former IAS (पूर्व आईएएस अधिकारी)')}
                        </div>
                      </div>
                      <blockquote className="text-sm text-slate-700 leading-relaxed italic">
                        {t(
                          '“FITNESS AND WORKOUT ARE ONE OF THE MOST ESSENTIAL PART IN PERSONS LIFE. AFC BIKANER IS ONE OF THE BEST GYMS WE EVER JOINED, SPECIALLY DIRECTOR MR ABHISHEK GAUR AND HIS HIGHLY COMMITTED TEAM AFC IS REALLY OUTSTANDING. GREETING AND ALL THE BEST FOR A GLISTENING FUTURE AHEAD.”',
                          '“FITNESS AND WORKOUT ARE ONE OF THE MOST ESSENTIAL PART IN PERSONS LIFE. AFC BIKANER IS ONE OF THE BEST GYMS WE EVER JOINED, SPECIALLY DIRECTOR MR ABHISHEK GAUR AND HIS HIGHLY COMMITTED TEAM AFC IS REALLY OUTSTANDING. GREETING AND ALL THE BEST FOR A GLISTENING FUTURE AHEAD.”'
                        )}
                      </blockquote>
                    </div>
                  </div>
                </article>
              </div>

              {/* ALL FITNESS SOLUTIONS UNDER ONE ROOF */}
              <div className="rounded-lg bg-[#1E6C93] text-white p-6 sm:p-10 space-y-6">
                <div className="space-y-1">
                  <div className="text-xs font-semibold tracking-widest text-[#FACC15] uppercase">
                    {t('COMPLETE TRAINING DIRECTORY', 'एक ही छत के नीचे उपलब्ध सभी सुविधाएँ')}
                  </div>
                  <h3 className="font-display-athletic text-2xl sm:text-4xl font-bold tracking-wide uppercase">
                    {t('ALL FITNESS SOLUTIONS UNDER ONE ROOF', 'ALL FITNESS SOLUTIONS UNDER ONE ROOF')}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 pt-2 border-t border-white/20">
                  {FITNESS_SOLUTIONS.map((item, idx) => (
                    <div
                      key={item.en}
                      className="py-2 border-b border-white/15 flex items-baseline gap-3"
                    >
                      <span className="font-mono-tabular text-xs font-bold text-[#FACC15] shrink-0">
                        0{idx + 1}.
                      </span>
                      <span className="text-sm sm:text-base font-semibold tracking-wide text-white">
                        {lang === 'en' ? item.en : item.hi}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================== DIRECTOR ABHISHEK K GAUR & ALL 6 ORIGINAL CERTIFICATES ==================== */}
        {showSection('director') && (
          <section className="py-14 sm:py-16 bg-white border-t border-slate-200">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-12 sm:space-y-14">
              {/* Director Profile Split: Original Photo (orig_30.jpg) + ACE Badge (orig_31.jpg) + Exact Bio */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
                {/* Left Column: Original Photo of Director Abhishek K. Gaur at His Desk (orig_30.jpg) */}
                <div className="lg:col-span-5 space-y-5">
                  <div
                    onClick={() =>
                      setLightboxImage({
                        src: '/src/assets/images/original/orig_30.jpg',
                        caption: 'Director Abhishek K. Gaur at Ace Fitness Club, Bikaner',
                      })
                    }
                    className="rounded-lg overflow-hidden shadow-xs bg-slate-100 cursor-pointer"
                  >
                    <img
                      src="/src/assets/images/original/orig_30.jpg"
                      alt="Director Abhishek K. Gaur at his office desk in Ace Fitness Club Bikaner"
                      className="w-full h-auto object-cover"
                    />
                  </div>

                  {/* Official ACE CERTIFIED Logo from Original Site (orig_31.jpg) */}
                  <div className="py-4 px-6 rounded-lg bg-[#F2F2F2] flex items-center justify-center">
                    <img
                      src="/src/assets/images/original/orig_31.jpg"
                      alt="ACE Certified Official Emblem"
                      className="h-20 sm:h-24 w-auto object-contain"
                    />
                  </div>
                </div>

                {/* Right Column: Exact Original Credentials & Biography */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="space-y-1 pb-3 border-b-2 border-[#1E6C93]">
                    <div className="text-xs font-bold tracking-widest uppercase text-[#1E6C93]">
                      {t('DIRECTOR', 'DIRECTOR (फाउंडर और डायरेक्टर)')}
                    </div>
                    <h2 className="font-display-athletic text-3xl sm:text-5xl font-bold text-[#212121] uppercase">
                      {t('ABHISHEK K GAUR', 'ABHISHEK K GAUR (अभिषेक के. गौर)')}
                    </h2>
                  </div>

                  {/* Clean Unboxed Credentials List with Typographic Separators */}
                  <div className="text-xs sm:text-sm font-semibold text-[#1E6C93] leading-relaxed">
                    <span>CERTIFIED BY PEPT ACADEMY AUSTRALIA</span>
                    <span className="mx-2 text-slate-400">·</span>
                    <span>CERTIFIED BY AMERICAN COUNCIL ON EXERCISE (ACE)</span>
                    <span className="mx-2 text-slate-400">·</span>
                    <span>FITNESS NUTRITION SPECIALIST</span>
                    <span className="mx-2 text-slate-400">·</span>
                    <span>PRE NATAL & POST PARTUM FITNESS</span>
                    <span className="mx-2 text-slate-400">·</span>
                    <span>ACE IFT MODEL</span>
                    <span className="mx-2 text-slate-400">·</span>
                    <span>CLIENT CONSULTANCY</span>
                    <span className="mx-2 text-slate-400">·</span>
                    <span>FITNESS MATH</span>
                  </div>

                  {/* Original 3-Paragraph Vision Statement */}
                  <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed pt-2">
                    <p>
                      {t(
                        '“PASSIONATE ABOUT FITNESS AND VISIONARY FOR A STRONGER NATION. ABHISHEK GAUR, A MANAGEMENT GRADUATE AND A FORMER BANKER FOCUSED ON REALISING HIS VISION OF A FIT INDIA. AFTER RESEARCHING THE FITNESS INDUSTRY, HE DISCOVERED THAT ALTHOUGH ABUNDANT IN POTENTIAL IT LACKED QUALIFIED PROFESSIONALS WHO MIGHT HELP BUILD A STRONGER NATION BY OFFERING APPROPRIATE AND WELL INFORMED SUPPORT TO THE ONES SEEKING GOOD HEALTH STANDARDS.”',
                        '“फिटनेस के प्रति समर्पित और एक सशक्त राष्ट्र के स्वप्नदृष्टा—अभिषेक के. गौर (एक मैनेजमेंट ग्रेजुएट और पूर्व बैंकर) ने फिट इंडिया के अपने सपने को साकार करने के लिए बैंकिंग क्षेत्र छोड़कर फिटनेस इंडस्ट्री में कदम रखा। उन्होंने पाया कि सही वैज्ञानिक ज्ञान और अंतरराष्ट्रीय स्तर पर प्रमाणित प्रोफेशनल्स के मार्गदर्शन से ही लोगों को सर्वोत्तम स्वास्थ्य मिल सकता है।”'
                      )}
                    </p>
                    <p>
                      {t(
                        '“A COURSE WITH PEPT AUSTRALIA BROUGHT HIM INTO A NEW WORLD WHERE LEARNING POSSIBILITIES WERE ENDLESS, AND FROM THERE THE JOURNEY TO DEPTHS OF FITNESS INDUSTRY BEGAN.”',
                        '“PEPT एकेडमी (ऑस्ट्रेलिया) के साथ उनके कोर्स ने उन्हें आधुनिक व्यायाम विज्ञान की एक नई दुनिया से जोड़ा, जहाँ से फिटनेस इंडस्ट्री की गहराइयों का सफर शुरू हुआ।”'
                      )}
                    </p>
                    <p className="font-semibold text-[#212121]">
                      {t(
                        '“NOW THAT HE HAS TRAINED ABOUT 2000 CLIENTS IN DIFFERENT AREAS OF LIFE AND HAS MORE THAN 10 YEARS OF EXPERIENCE IN THE SPORTS AND FITNESS INDUSTRY, HIS DREAM OF A STRONGER NATION SEEMS ATTAINABLE.”',
                        '“अब जब उन्होंने जीवन के विभिन्न क्षेत्रों के लगभग 2,000+ क्लाइंट्स को प्रशिक्षित किया है और स्पोर्ट्स व फिटनेस इंडस्ट्री में 10+ वर्षों से अधिक का अनुभव प्राप्त कर लिया है, तो एक सशक्त राष्ट्र का उनका सपना साकार होता दिख रहा है।”'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* All 6 Original Certificates in Their Exact Order (orig_32 to orig_37) */}
              <div className="space-y-6 pt-6 border-t border-slate-200">
                <div>
                  <div className="text-xs font-bold tracking-widest uppercase text-[#1E6C93]">
                    {t('OFFICIAL INTERNATIONAL ACCREDITATIONS', 'डायरेक्टर अभिषेक के. गौर के सभी असली सर्टिफिकेट्स')}
                  </div>
                  <h3 className="font-display-athletic text-2xl sm:text-3xl font-bold text-[#212121] uppercase mt-1">
                    {t(
                      'ORIGINAL CERTIFICATES (TAP ANY CERTIFICATE TO VIEW FULLSCREEN)',
                      'ओरिजिनल सर्टिफिकेट्स (बड़ा देखने के लिए किसी भी सर्टिफिकेट पर टैप करें)'
                    )}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CERTIFICATES.map((cert) => (
                    <article
                      key={cert.src}
                      onClick={() =>
                        setLightboxImage({
                          src: cert.src,
                          caption: lang === 'en' ? cert.titleEn : cert.titleHi,
                        })
                      }
                      className="group rounded-lg bg-[#F2F2F2] overflow-hidden shadow-xs cursor-pointer flex flex-col justify-between"
                    >
                      <div className="p-3 bg-white relative">
                        <img
                          src={cert.src}
                          alt={cert.titleEn}
                          className="w-full h-52 sm:h-56 object-contain mx-auto group-hover:scale-[1.02] transition-transform duration-200"
                        />
                        <div className="absolute bottom-3 right-3 bg-[#1E6C93] text-white p-1.5 rounded">
                          <ZoomIn className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="p-4 space-y-0.5">
                        <div className="text-xs font-semibold text-[#1E6C93]">{cert.issuer}</div>
                        <h4 className="text-sm font-bold text-[#212121]">
                          {lang === 'en' ? cert.titleEn : cert.titleHi}
                        </h4>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================== LOCATION, DIRECTIONS, MAP, INSTAGRAM QR & WHATSAPP BOOKING ==================== */}
        {showSection('location') && (
          <section className="py-14 sm:py-16 bg-[#F2F2F2] border-t border-slate-200">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
              {/* Original Footer Banner (orig_38.jpg) */}
              <div className="rounded-lg overflow-hidden bg-[#212121]">
                <img
                  src="/src/assets/images/original/orig_38.jpg"
                  alt="ACE FITNESS Banner"
                  className="w-full h-auto object-contain mx-auto"
                />
              </div>

              {/* Official Address & Phone Header */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-300">
                <div className="space-y-1.5">
                  <div className="text-xs font-bold tracking-widest uppercase text-[#1E6C93]">
                    ACE FITNESS CLUB · BIKANER
                  </div>
                  <h2 className="font-display-athletic text-2xl sm:text-3xl font-bold text-[#212121] uppercase">
                    ABOVE PUMA SHOWROOM, PANCHSATI CIRCLE, SADUL GANJ, BIKANER 334003
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-mono-tabular font-bold text-[#1E6C93]">
                    <span>MOB:</span>
                    <a href="tel:+919116642929" className="hover:underline">
                      +91 91166 42929
                    </a>
                    <span>,</span>
                    <a href="tel:+919929105004" className="hover:underline">
                      +91 99291 05004
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Ace+Fitness+Club+Panchsati+Circle+Sadul+Ganj+Bikaner+Rajasthan+334003"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#1E6C93] hover:bg-[#165373] rounded transition-colors whitespace-nowrap"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{t('Get Google Maps Directions', 'Google Map पर रास्ता देखें')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="tel:+919116642929"
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#212121] bg-white hover:bg-slate-100 rounded transition-colors whitespace-nowrap font-mono-tabular shadow-2xs"
                  >
                    <Phone className="w-4 h-4 text-[#1E6C93]" />
                    <span>+91 91166 42929</span>
                  </a>
                </div>
              </div>

              {/* 2-Column Split: Direct WhatsApp Booking Form + Google Map & Original Instagram QR */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Direct WhatsApp Trial Pass Form */}
                <div className="lg:col-span-6 rounded-lg bg-white p-5 sm:p-8 shadow-xs space-y-5">
                  <div className="space-y-1">
                    <div className="text-xs font-bold tracking-wider uppercase text-[#1E6C93]">
                      {t('DIRECT WHATSAPP TRIAL DESK', 'डायरेक्ट WhatsApp ट्रायल बुकिंग')}
                    </div>
                    <h3 className="font-display-athletic text-2xl sm:text-3xl font-bold text-[#212121] uppercase">
                      {t('Book Your Trial Session on WhatsApp', 'WhatsApp पर अपना ट्रायल बुक करें')}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      {t(
                        'Enter your details below to send an instant trial pass booking message directly to +91 91166 42929.',
                        'अपनी जानकारी भरें और क्लिक करते ही सीधा जिम के WhatsApp (+91 91166 42929) पर ट्रायल मैसेज भेजें।'
                      )}
                    </p>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-4" noValidate>
                    <div>
                      <label htmlFor="wa-name" className="block text-xs font-semibold text-slate-700 mb-1">
                        {t('Full Name *', 'आपका नाम *')}
                      </label>
                      <input
                        id="wa-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (formError) setFormError('');
                        }}
                        placeholder={t('Enter your full name', 'अपना पूरा नाम लिखें')}
                        className="w-full px-3.5 py-2.5 rounded bg-slate-50 border border-slate-300 text-sm text-[#212121] focus:outline-none focus:border-[#1E6C93]"
                      />
                    </div>

                    <div>
                      <label htmlFor="wa-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                        {t('Mobile / WhatsApp Number *', 'मोबाइल नंबर *')}
                      </label>
                      <input
                        id="wa-phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          if (formError) setFormError('');
                        }}
                        placeholder="+91 98XXX XXXXX"
                        className="w-full px-3.5 py-2.5 rounded bg-slate-50 border border-slate-300 text-sm text-[#212121] font-mono-tabular focus:outline-none focus:border-[#1E6C93]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="wa-prog" className="block text-xs font-semibold text-slate-700 mb-1">
                          {t('Select Training Zone', 'ट्रेनिंग ज़ोन चुनें')}
                        </label>
                        <select
                          id="wa-prog"
                          value={selectedProgram}
                          onChange={(e) => setSelectedProgram(e.target.value)}
                          className="w-full px-3 py-2.5 rounded bg-slate-50 border border-slate-300 text-sm text-[#212121] focus:outline-none focus:border-[#1E6C93]"
                        >
                          {FITNESS_SOLUTIONS.map((s) => (
                            <option key={s.en} value={s.en}>
                              {lang === 'en' ? s.en : s.hi}
                            </option>
                          ))}
                          <option value="REFORMER PILATES & YOGA">
                            {t('REFORMER PILATES & YOGA', 'रिफॉर्मर पिलाटेस और योगा')}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="wa-batch" className="block text-xs font-semibold text-slate-700 mb-1">
                          {t('Preferred Time', 'पसंदीदा समय')}
                        </label>
                        <select
                          id="wa-batch"
                          value={preferredBatch}
                          onChange={(e) => setPreferredBatch(e.target.value)}
                          className="w-full px-3 py-2.5 rounded bg-slate-50 border border-slate-300 text-sm text-[#212121] focus:outline-none focus:border-[#1E6C93]"
                        >
                          <option value="Morning (6:00 AM – 11:00 AM)">
                            {t('Morning (6:00 AM – 11:00 AM)', 'सुबह (6:00 AM – 11:00 AM)')}
                          </option>
                          <option value="Evening (4:00 PM – 9:30 PM)">
                            {t('Evening (4:00 PM – 9:30 PM)', 'शाम (4:00 PM – 9:30 PM)')}
                          </option>
                        </select>
                      </div>
                    </div>

                    {formError && (
                      <div
                        role="alert"
                        className="p-3 rounded bg-red-50 border border-red-200 text-xs font-medium text-red-700"
                      >
                        {formError}
                      </div>
                    )}

                    <a
                      id="direct-wa-trigger"
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden"
                      aria-hidden="true"
                    >
                      Open WhatsApp
                    </a>

                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                      <button
                        type="submit"
                        className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded bg-[#1E6C93] hover:bg-[#165373] text-white font-semibold text-sm transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>
                          {t(
                            'Send Trial Request on WhatsApp',
                            'WhatsApp पर ट्रायल बुक करें (+91 91166 42929)'
                          )}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyWhatsAppText}
                        className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        {copiedWaText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedWaText ? t('Copied', 'कॉपी हो गया') : t('Copy Message', 'मैसेज कॉपी करें')}</span>
                      </button>
                    </div>
                  </form>

                  {bookingPrepared && (
                    <div className="p-4 rounded bg-emerald-50 border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800">
                          {t('WhatsApp Booking Message Ready!', 'आपका WhatsApp बुकिंग मैसेज तैयार है!')}
                        </span>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-white bg-emerald-700 px-3 py-1 rounded hover:bg-emerald-800"
                        >
                          {t('Open WhatsApp →', 'WhatsApp खोलें →')}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Google Map + Original Instagram QR Code (orig_39.jpg) */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="rounded-lg overflow-hidden bg-white h-[300px] sm:h-[320px] shadow-xs">
                    <iframe
                      title="Ace Fitness Club Panchsati Circle Sadul Ganj Bikaner Google Map"
                      src="https://www.google.com/maps?q=Ace+Fitness+Club+Panchsati+Circle+Sadul+Ganj+Bikaner+Rajasthan+334003&output=embed"
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  {/* Original Instagram QR Code Card (orig_39.jpg) */}
                  <div className="rounded-lg bg-white p-5 flex flex-col sm:flex-row items-center gap-5 shadow-xs">
                    <img
                      src="/src/assets/images/original/orig_39.jpg"
                      alt="ACEFITNESSC Official Instagram QR Code"
                      onClick={() =>
                        setLightboxImage({
                          src: '/src/assets/images/original/orig_39.jpg',
                          caption: 'Follow @ACEFITNESSC on Instagram',
                        })
                      }
                      className="w-32 h-24 object-contain rounded cursor-pointer shrink-0"
                    />
                    <div className="space-y-1.5 text-center sm:text-left">
                      <div className="text-xs font-bold tracking-wider uppercase text-[#1E6C93]">
                        OFFICIAL INSTAGRAM · @ACEFITNESSC
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {t(
                          'Scan the original QR code or visit @acefitnessc on Instagram for daily workout reels and updates.',
                          'डेली वर्कआउट अपडेट्स देखने के लिए हमारा ओरिजिनल इंस्टाग्राम QR कोड स्कैन करें।'
                        )}
                      </p>
                      <a
                        href="https://www.instagram.com/acefitnessc/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#1E6C93] hover:underline"
                      >
                        <span>instagram.com/acefitnessc</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ==================== BOTTOM WEBSITE FOOTER WITH ORIGINAL-COLOR SOCIAL MEDIA ICONS ==================== */}
      <footer className="bg-[#111820] text-white border-t-2 border-[#FACC15]/70 pt-12 pb-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Col 1: Large High-Visibility Circular Logo + Brand Lockup */}
            <div className="md:col-span-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div
                onClick={() =>
                  setLightboxImage({
                    src: UPLOADED_LOGO_URL,
                    caption: 'Ace Fitness Club — Official Emblem',
                  })
                }
                title="Click to view full size"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-3 ring-[#FACC15] bg-black flex items-center justify-center shrink-0 shadow-xl cursor-pointer hover:scale-105 transition-transform"
              >
                <img
                  src={UPLOADED_LOGO_URL}
                  alt="Ace Fitness Club Logo"
                  className="w-full h-full object-cover scale-[1.32]"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <div className="font-display-athletic text-2xl sm:text-3xl font-bold tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
                    <span className="text-[#FACC15] italic">ACE</span>
                    <span className="bg-[#FACC15] text-[#111820] px-2.5 py-0.5 rounded-xs italic">
                      FITNESS
                    </span>
                    <span className="text-white ml-1">CLUB</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                    {t('For A Stronger Nation · Bikaner', 'एक सशक्त और स्वस्थ राष्ट्र के लिए · बीकानेर')}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                  {t(
                    'Above Puma Showroom, Panchsati Circle, Sadul Ganj, Bikaner, Rajasthan 334003. Supervised by PEPT Australia & ACE Certified Director Abhishek K. Gaur.',
                    'प्यूमा शोरूम के ऊपर, पंचशती सर्किल, सादुल गंज, बीकानेर 334003। डायरेक्टर अभिषेक के. गौर (PEPT ऑस्ट्रेलिया एवं ACE सर्टिफाइड) के निर्देशन में।'
                  )}
                </p>
                <div className="text-xs sm:text-sm font-mono-tabular font-semibold text-[#FACC15]">
                  MOB: +91 91166 42929 · +91 99291 05004
                </div>
              </div>
            </div>

            {/* Col 2: Quick Navigation Links */}
            <div className="md:col-span-3 space-y-3 text-center sm:text-left">
              <div className="text-xs font-bold tracking-wider uppercase text-[#FACC15]">
                {t('Quick Navigation', 'क्विक लिंक्स')}
              </div>
              <div className="flex flex-col gap-2 text-xs sm:text-sm text-slate-300">
                <button
                  type="button"
                  onClick={() => navigateInstant('home')}
                  className="text-center sm:text-left hover:text-[#FACC15] transition-colors cursor-pointer"
                >
                  {t('Home', 'होम पेज')}
                </button>
                <button
                  type="button"
                  onClick={() => navigateInstant('zones')}
                  className="text-center sm:text-left hover:text-[#FACC15] transition-colors cursor-pointer"
                >
                  {t('Training Zones', 'ट्रेनिंग ज़ोन')}
                </button>
                <button
                  type="button"
                  onClick={() => navigateInstant('members')}
                  className="text-center sm:text-left hover:text-[#FACC15] transition-colors cursor-pointer"
                >
                  {t('Members Say', 'डॉक्टर्स और मेंबर्स')}
                </button>
                <button
                  type="button"
                  onClick={() => navigateInstant('director')}
                  className="text-center sm:text-left hover:text-[#FACC15] transition-colors cursor-pointer"
                >
                  {t('Director & Certificates', 'डायरेक्टर/सर्टिफिकेट')}
                </button>
                <button
                  type="button"
                  onClick={() => navigateInstant('location')}
                  className="text-center sm:text-left hover:text-[#FACC15] transition-colors cursor-pointer"
                >
                  {t('Directions & Map', 'मैप और लोकेशन')}
                </button>
              </div>
            </div>

            {/* Col 3: Permanent Original-Color Social Media Buttons (YouTube, Instagram, Facebook, WhatsApp) */}
            <div className="md:col-span-3 space-y-3.5 text-center sm:text-left">
              <div className="text-xs font-bold tracking-wider uppercase text-[#FACC15]">
                {t('Connect On Social Media', 'सोशल मीडिया पर जुड़ें')}
              </div>
              <p className="text-xs text-slate-300">
                {t(
                  'Tap any official social channel below:',
                  'हमारे आधिकारिक सोशल मीडिया चैनल्स से सीधे जुड़ें:'
                )}
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                {/* 1. YouTube — Permanent Original YouTube Red (#FF0000) */}
                <a
                  href="https://www.youtube.com/watch?v=M-vhNsFS9gk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  title="YouTube"
                  className="w-11 h-11 rounded-full bg-[#FF0000] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-md transition-transform"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* 2. Instagram — Permanent Original Instagram Gradient */}
                <a
                  href="https://www.instagram.com/acefitnessc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Instagram (@acefitnessc)"
                  className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-md transition-transform"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* 3. Facebook — Permanent Original Facebook Blue (#1877F2) */}
                <a
                  href="https://www.facebook.com/search/top?q=Ace%20Fitness%20Club%20Bikaner"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Facebook"
                  className="w-11 h-11 rounded-full bg-[#1877F2] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-md transition-transform"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* 4. WhatsApp — Permanent Official WhatsApp Green (#25D366) + Crisp Official WhatsApp Speech-Bubble Phone SVG */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  title="WhatsApp (+91 91166 42929)"
                  className="w-11 h-11 rounded-full bg-[#25D366] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-md transition-transform"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 32 32">
                    <path d="M16.004 3.2c-7.072 0-12.8 5.728-12.8 12.8 0 2.256.592 4.464 1.712 6.416L3.2 28.8l6.56-1.712c1.888 1.024 4.032 1.568 6.244 1.568 7.072 0 12.8-5.728 12.8-12.8s-5.728-12.656-12.8-12.656zm0 23.296c-1.92 0-3.808-.512-5.456-1.488l-.384-.224-4.064 1.056 1.088-3.968-.256-.4c-1.072-1.712-1.648-3.68-1.648-5.712 0-5.92 4.816-10.736 10.72-10.736 5.92 0 10.736 4.816 10.736 10.736 0 5.904-4.816 10.736-10.736 10.736zm5.888-8.032c-.32-.16-1.904-.944-2.192-1.04-.288-.112-.512-.16-.72.16-.208.32-.832 1.04-1.024 1.248-.192.208-.368.24-.688.08-.32-.16-1.36-.496-2.592-1.6-.96-.848-1.6-1.904-1.792-2.224-.192-.32-.016-.496.144-.656.144-.144.32-.368.48-.56.16-.192.208-.32.32-.528.112-.208.048-.4-.032-.56-.08-.16-.72-1.744-.992-2.384-.256-.624-.528-.544-.72-.544h-.608c-.208 0-.56.08-.848.4-.288.32-1.12 1.088-1.12 2.656s1.152 3.088 1.312 3.296c.16.208 2.256 3.44 5.472 4.832.768.336 1.36.528 1.824.672.768.24 1.472.208 2.032.128.624-.096 1.904-.784 2.176-1.536.272-.752.272-1.392.192-1.536-.08-.144-.288-.224-.608-.384z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              © {new Date().getFullYear()} Ace Fitness Club, Bikaner · Director Abhishek K. Gaur
            </div>
            <div>
              Above Puma Showroom, Panchsati Circle, Sadul Ganj, Bikaner 334003
            </div>
          </div>
        </div>
      </footer>

      {/* Click-to-Zoom Lightbox Modal for Photos & Certificates */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-[#212121]">{lightboxImage.caption}</span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-200 cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-slate-900 flex items-center justify-center max-h-[80vh] overflow-auto">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.caption}
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
