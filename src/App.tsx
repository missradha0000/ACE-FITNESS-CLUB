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
type ActivePage = 'home' | 'plans' | 'zones' | 'members' | 'director' | 'location';

const UPLOADED_LOGO_URL = '/assets/aistudio/WhatsApp_Image_2026-11-16_at_8.43.29_PM_c4cc8470.jpg';

export interface MembershipPlan {
  id: string;
  badgeEn: string;
  badgeHi: string;
  nameEn: string;
  nameHi: string;
  durationEn: string;
  durationHi: string;
  amountNumber: number;
  amountFormatted: string;
  perMonthEn: string;
  perMonthHi: string;
  savingsEn?: string;
  savingsHi?: string;
  popular?: boolean;
  featuresEn: string[];
  featuresHi: string[];
}

const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'plan-trial',
    badgeEn: 'STARTER PASS',
    badgeHi: 'ट्रायल पास',
    nameEn: '1-Day Trial Pass',
    nameHi: '1 दिन का ट्रायल पास',
    durationEn: '1 Day Full Floor Access',
    durationHi: '1 दिन (फुल जिम एक्सेस)',
    amountNumber: 199,
    amountFormatted: '₹199',
    perMonthEn: '100% redeemable on joining',
    perMonthHi: 'मेंबरशिप लेने पर यह राशि एडजस्ट होगी',
    featuresEn: [
      'Full access to Strength, Cardio & Abs Floor',
      'Initial Posture & Fitness Consultation',
      'Supervised floor workout session',
    ],
    featuresHi: [
      'स्ट्रेंथ, कार्डियो और एब्स ज़ोन का पूरा एक्सेस',
      'बॉडी पोस्चर और फिटनेस कंसल्टेशन',
      'कोच की देखरेख में ट्रायल वर्कआउट सेशन',
    ],
  },
  {
    id: 'plan-monthly',
    badgeEn: 'FLEXIBLE MONTHLY',
    badgeHi: 'मासिक प्लान',
    nameEn: '1 Month Club Membership',
    nameHi: '1 महीना फिटनेस प्लान',
    durationEn: '30 Days Access',
    durationHi: '1 महीना (30 दिन)',
    amountNumber: 2000,
    amountFormatted: '₹2,000',
    perMonthEn: '₹2,000 / month',
    perMonthHi: '₹2,000 प्रति माह',
    featuresEn: [
      'Complete Strength & Biomechanics Floor',
      'Commercial Cardio & Spin Studio Access',
      'Core & Functional Training Area',
      'General Floor Trainer Guidance',
    ],
    featuresHi: [
      'कम्प्लीट स्ट्रेंथ और बायोमैकेनिक्स फ्लोर',
      'कमर्शियल कार्डियो और स्पिनिंग ज़ोन',
      'एब्स और फंक्शनल ट्रेनिंग एरिया',
      'जनरल फ्लोर ट्रेनर गाइडेंस',
    ],
  },
  {
    id: 'plan-quarterly',
    badgeEn: 'MOST POPULAR',
    badgeHi: 'सबसे लोकप्रिय (Popular)',
    nameEn: '3 Months Pro Membership',
    nameHi: '3 महीने का प्रो प्लान',
    durationEn: '90 Days Access',
    durationHi: '3 महीने (90 दिन)',
    amountNumber: 5000,
    amountFormatted: '₹5,000',
    perMonthEn: 'Effective ₹1,666 / month',
    perMonthHi: 'केवल ₹1,666 प्रति माह पड़ेगा',
    savingsEn: 'Save ₹1,000',
    savingsHi: '₹1,000 की सीधी बचत',
    popular: true,
    featuresEn: [
      'All Strength, Cardio, Abs & Functional Zones',
      'Group Yoga, Aerobics & Dance Fitness Sessions',
      'Customized Nutritional & Diet Assistance Chart',
      'Monthly Progress & BMI Tracking',
    ],
    featuresHi: [
      'सभी स्ट्रेंथ, कार्डियो, एब्स और फंक्शनल ज़ोन',
      'ग्रुप योगा, एरोबिक्स और डांस फिटनेस क्लासेस',
      'पर्सनल डाइट और न्यूट्रिशन चार्ट गाइडेंस',
      'हर महीने फिटनेस और प्रोग्रेस ट्रैकिंग',
    ],
  },
  {
    id: 'plan-halfyearly',
    badgeEn: 'BEST TRANSFORMATION',
    badgeHi: 'बेस्ट ट्रांसफॉर्मेशन',
    nameEn: '6 Months Transformation Plan',
    nameHi: '6 महीने का ट्रांसफॉर्मेशन प्लान',
    durationEn: '180 Days Access',
    durationHi: '6 महीने (180 दिन)',
    amountNumber: 8500,
    amountFormatted: '₹8,500',
    perMonthEn: 'Effective ₹1,416 / month',
    perMonthHi: 'केवल ₹1,416 प्रति माह पड़ेगा',
    savingsEn: 'Save ₹3,500',
    savingsHi: '₹3,500 की बड़ी बचत',
    featuresEn: [
      'Unlimited access to all Gym & Studio Zones',
      'Includes Quadiexer, Core Conditioning & Outdoor Bootcamps',
      'Personalized Fat-Loss / Muscle-Gain Nutrition Plan',
      'Direct Goal Review with Senior Coaching Team',
    ],
    featuresHi: [
      'सभी जिम और स्टूडियो ज़ोन का अनलिमिटेड एक्सेस',
      'क्वाडिएक्सर, कोर कंडीशनिंग और आउटडोर सेशन शामिल',
      'फैट-लॉस / मसल-गेन स्पेशल डाइट प्लान',
      'सीनियर कोचिंग टीम के साथ प्रोग्रेस रिव्यु',
    ],
  },
  {
    id: 'plan-annual',
    badgeEn: 'ULTIMATE VALUE · VIP',
    badgeHi: 'साल भर का सुपर सेवर प्लान',
    nameEn: '1 Year Complete Club Membership',
    nameHi: '1 साल (12 महीने) का कम्प्लीट प्लान',
    durationEn: '365 Days Full Club Access',
    durationHi: 'पूरे 12 महीने (365 दिन)',
    amountNumber: 14000,
    amountFormatted: '₹14,000',
    perMonthEn: 'Just ₹1,166 / month',
    perMonthHi: 'सिर्फ ₹1,166 प्रति माह!',
    savingsEn: 'Save ₹10,000',
    savingsHi: '₹10,000 की भारी बचत',
    popular: true,
    featuresEn: [
      'All 10+ Fitness Solutions Under One Roof for 1 Full Year',
      'Priority Biomechanics & Program Design by Director Abhishek K. Gaur',
      'Complete Seasonal Diet & Clinical Nutrition Updates',
      'Complimentary Guest Trial Passes for Family',
    ],
    featuresHi: [
      'पूरे 1 साल के लिए सभी 10+ फिटनेस प्रोग्राम्स का एक्सेस',
      'डायरेक्टर अभिषेक के. गौर (PEPT ऑस्ट्रेलिया एवं ACE) द्वारा प्रोग्राम गाइडेंस',
      'पूरे साल मौसम और गोल के अनुसार डाइट प्लान अपडेट्स',
      'परिवार के सदस्यों के लिए कॉम्प्लीमेंट्री ट्रायल पास',
    ],
  },
  {
    id: 'plan-pilates-pt',
    badgeEn: 'SPECIALIZED 1-ON-1 STUDIO',
    badgeHi: 'रिफॉर्मर पिलाटेस / पर्सनल ट्रेनिंग',
    nameEn: 'Reformer Pilates / Personal Training',
    nameHi: 'रिफॉर्मर पिलाटेस / 1-on-1 पर्सनल ट्रेनिंग',
    durationEn: '1 Month Dedicated Coaching',
    durationHi: '1 महीना डेडिकेटेड कोचिंग',
    amountNumber: 4500,
    amountFormatted: '₹4,500',
    perMonthEn: 'Dedicated Personal Coach',
    perMonthHi: 'स्पेशल पर्सनल कोच के साथ',
    featuresEn: [
      'Dedicated Reformer Pilates Studio or 1-on-1 Personal Trainer',
      'Posture Alignment, Rehab & Core Flexibility Focus',
      'ACE IFT® Model Individualized Workout Programming',
      'Daily Nutrition & Lifestyle Monitoring',
    ],
    featuresHi: [
      'रिफॉर्मर पिलाटेस मशीन या 1-on-1 पर्सनल ट्रेनर सेशन',
      'पोस्चर सुधार, कोर मजबूती और फ्लेक्सिबिलिटी पर विशेष ध्यान',
      'ACE IFT® मॉडल के अनुसार व्यक्तिगत वर्कआउट प्लान',
      'डेली डाइट और न्यूट्रिशन मॉनिटरिंग',
    ],
  },
];

interface HangingRopeLogoProps {
  onClickHome: () => void;
  lang: Language;
}

interface RopeNode {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
}

/**
 * Ultra-Flexible, Stretchable & Bendable Multi-Node Verlet Rope Logo.
 * - Uses 14 physics nodes so the rope bends in smooth curves (S-waves, loops) and stretches all the way down the screen when pulled!
 * - Continuously sways in a gentle breeze when untouched.
 * - Grab with finger or mouse to pull down, stretch, bend, or whip around anywhere on the page.
 * - Release to watch it slingshot, bounce, and oscillate back smoothly.
 */
function HangingRopeLogo({ onClickHome, lang }: HangingRopeLogoProps) {
  const anchorMeasureRef = useRef<HTMLDivElement | null>(null);
  const shadowPathRef = useRef<SVGPathElement | null>(null);
  const borderPathRef = useRef<SVGPathElement | null>(null);
  const corePathRef = useRef<SVGPathElement | null>(null);
  const twistPathRef = useRef<SVGPathElement | null>(null);
  const ceilingMountRef = useRef<SVGEllipseElement | null>(null);
  const knotGroupRef = useRef<SVGGElement | null>(null);
  const badgeRef = useRef<HTMLButtonElement | null>(null);

  const NUM_NODES = 14;

  const stateRef = useRef({
    nodes: Array.from({ length: NUM_NODES }, (_, i) => ({
      x: 84,
      y: i * 5,
      oldX: 84,
      oldY: i * 5,
    })) as RopeNode[],
    anchorX: 84,
    restRopeLen: 64,
    currentRopeLen: 64,
    isDragging: false,
    pointerX: 84,
    pointerY: 110,
    dragStartX: 0,
    dragStartY: 0,
    maxDragDist: 0,
    badgeScale: 1,
    badgeScaleVel: 0,
    badgeAngle: 0,
    badgeAngularVel: 0,
    initialized: false,
  });

  useEffect(() => {
    const updateAnchorPosition = () => {
      if (!anchorMeasureRef.current) return;
      const rect = anchorMeasureRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      const newAnchorX = rect.left + rect.width / 2;
      const newRestLen = isMobile ? 28 : 68;
      const st = stateRef.current;
      st.anchorX = newAnchorX;
      st.restRopeLen = newRestLen;

      if (!st.initialized) {
        st.initialized = true;
        st.currentRopeLen = newRestLen;
        const seg = newRestLen / (NUM_NODES - 1);
        for (let i = 0; i < NUM_NODES; i++) {
          st.nodes[i].x = newAnchorX + Math.sin(i * 0.2) * 3;
          st.nodes[i].y = i * seg;
          st.nodes[i].oldX = st.nodes[i].x;
          st.nodes[i].oldY = st.nodes[i].y;
        }
      }
    };

    updateAnchorPosition();
    window.addEventListener('resize', updateAnchorPosition);

    let rafId: number;
    const startTime = performance.now();

    // Build a smooth quadratic spline SVG path through the 14 rope nodes
    const buildSmoothRopePath = (nodes: RopeNode[], offsetX = 0, offsetY = 0) => {
      if (nodes.length < 2) return '';
      let d = `M ${(nodes[0].x + offsetX).toFixed(1)} ${(nodes[0].y + offsetY).toFixed(1)}`;
      for (let i = 1; i < nodes.length - 1; i++) {
        const xc = (nodes[i].x + nodes[i + 1].x) / 2 + offsetX;
        const yc = (nodes[i].y + nodes[i + 1].y) / 2 + offsetY;
        d += ` Q ${(nodes[i].x + offsetX).toFixed(1)} ${(nodes[i].y + offsetY).toFixed(1)}, ${xc.toFixed(1)} ${yc.toFixed(1)}`;
      }
      const last = nodes[nodes.length - 1];
      d += ` L ${(last.x + offsetX).toFixed(1)} ${(last.y + offsetY).toFixed(1)}`;
      return d;
    };

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const st = stateRef.current;
      const nodes = st.nodes;
      const lastIdx = NUM_NODES - 1;

      const isMobile = window.innerWidth < 640;
      const badgeRadius = isMobile ? 33 : window.innerWidth < 768 ? 56 : 66;

      // Ambient gentle breeze force so it continuously sways even when untouched
      const breezeForce =
        Math.sin(elapsed * 2.15) * 0.14 + Math.cos(elapsed * 0.9) * 0.06;

      if (st.isDragging) {
        // Target knot position is just above the center of the dragged medallion
        const targetKnotX = st.pointerX;
        const targetKnotY = Math.max(24, st.pointerY - badgeRadius * 0.72);

        // Calculate stretch distance from ceiling anchor to finger
        const distFromCeiling = Math.hypot(
          targetKnotX - st.anchorX,
          targetKnotY
        );
        // Allow the rope to stretch flexibly up to the full screen height (with extra slack so it can bend & curve!)
        const desiredLen = Math.max(st.restRopeLen, distFromCeiling * 1.12);
        st.currentRopeLen += (desiredLen - st.currentRopeLen) * 0.35;
      } else {
        // Elastic retraction back to resting rope length when released
        st.currentRopeLen += (st.restRopeLen - st.currentRopeLen) * 0.085;
      }

      // 1. Verlet Integration step for intermediate & end nodes
      for (let i = 1; i < NUM_NODES; i++) {
        const n = nodes[i];
        const vx = (n.x - n.oldX) * 0.962;
        const vy = (n.y - n.oldY) * 0.962;
        n.oldX = n.x;
        n.oldY = n.y;

        // End node (medallion) has heavier mass & stronger breeze response
        const weightFactor = i === lastIdx ? 1.35 : 0.85;
        n.x += vx + breezeForce * (i / lastIdx);
        n.y += vy + 0.52 * weightFactor;
      }

      // If user is actively dragging, pull the end knot smoothly toward pointer
      if (st.isDragging) {
        const targetKnotX = st.pointerX;
        const targetKnotY = Math.max(24, st.pointerY - badgeRadius * 0.72);
        const endNode = nodes[lastIdx];
        endNode.x += (targetKnotX - endNode.x) * 0.55;
        endNode.y += (targetKnotY - endNode.y) * 0.55;
      } else {
        // Gentle elastic spring pulling the medallion back up if stretched very far down
        const endNode = nodes[lastIdx];
        const stretchExcess = endNode.y - st.restRopeLen;
        if (stretchExcess > 18) {
          endNode.y -= stretchExcess * 0.045;
        }
      }

      // 2. Multi-iteration Distance Constraint Relaxation (makes the rope bend, wave, and curve realistically!)
      const segLen = st.currentRopeLen / (NUM_NODES - 1);
      const iterations = 12;

      for (let iter = 0; iter < iterations; iter++) {
        // Pin Node 0 at the ceiling mount
        nodes[0].x = st.anchorX;
        nodes[0].y = 0;

        for (let i = 0; i < NUM_NODES - 1; i++) {
          const n1 = nodes[i];
          const n2 = nodes[i + 1];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const diff = (segLen - dist) / dist;

          if (i === 0) {
            // Node 0 is fixed at the ceiling
            n2.x += dx * diff;
            n2.y += dy * diff;
          } else if (i === NUM_NODES - 2 && st.isDragging) {
            // While dragging, the end node is guided strongly by the user's finger
            n1.x -= dx * diff * 0.85;
            n1.y -= dy * diff * 0.85;
            n2.x += dx * diff * 0.15;
            n2.y += dy * diff * 0.15;
          } else {
            // Intermediate nodes share tension equally (creating realistic curves and waves)
            const w1 = i === NUM_NODES - 2 ? 0.65 : 0.5;
            const w2 = 1 - w1;
            n1.x -= dx * diff * w1;
            n1.y -= dy * diff * w1;
            n2.x += dx * diff * w2;
            n2.y += dy * diff * w2;
          }
        }
      }

      // Compute the rope end tangent angle so the knot and medallion tilt naturally with the bent rope
      const endNode = nodes[lastIdx];
      const prevNode = nodes[lastIdx - 2] || nodes[lastIdx - 1];
      const targetTilt =
        -Math.atan2(endNode.x - prevNode.x, Math.max(12, endNode.y - prevNode.y)) *
        (180 / Math.PI);
      const clampedTilt = Math.max(-55, Math.min(55, targetTilt));

      const angleForce = (clampedTilt - st.badgeAngle) * 0.18;
      st.badgeAngularVel = (st.badgeAngularVel + angleForce) * 0.78;
      st.badgeAngle += st.badgeAngularVel;

      // Scale spring for click/release bounce
      const scaleForce = (1 - st.badgeScale) * 0.2;
      st.badgeScaleVel = (st.badgeScaleVel + scaleForce) * 0.8;
      st.badgeScale += st.badgeScaleVel;

      // 3. Update DOM elements directly at 60fps
      const pathStr = buildSmoothRopePath(nodes, 0, 0);
      const shadowStr = buildSmoothRopePath(nodes, 3, 5);

      if (shadowPathRef.current) shadowPathRef.current.setAttribute('d', shadowStr);
      if (borderPathRef.current) borderPathRef.current.setAttribute('d', pathStr);
      if (corePathRef.current) corePathRef.current.setAttribute('d', pathStr);
      if (twistPathRef.current) twistPathRef.current.setAttribute('d', pathStr);

      if (ceilingMountRef.current) {
        ceilingMountRef.current.setAttribute('cx', st.anchorX.toFixed(1));
      }

      if (knotGroupRef.current) {
        knotGroupRef.current.setAttribute(
          'transform',
          `translate(${endNode.x.toFixed(1)}, ${endNode.y.toFixed(1)}) rotate(${st.badgeAngle.toFixed(1)})`
        );
      }

      if (badgeRef.current) {
        // Position the circular medallion centered right below the rope knot
        const badgeCenterX = endNode.x;
        const badgeCenterY = endNode.y + badgeRadius * 0.86;
        badgeRef.current.style.transform = `translate3d(${(badgeCenterX - badgeRadius).toFixed(1)}px, ${(badgeCenterY - badgeRadius).toFixed(1)}px, 0) rotate(${(st.badgeAngle * 0.65).toFixed(1)}deg) scale(${st.badgeScale.toFixed(3)})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateAnchorPosition);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const st = stateRef.current;
    st.isDragging = true;
    st.dragStartX = e.clientX;
    st.dragStartY = e.clientY;
    st.pointerX = e.clientX;
    st.pointerY = e.clientY;
    st.maxDragDist = 0;
    st.badgeScale = 0.93;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const st = stateRef.current;
    if (!st.isDragging) return;
    const dist = Math.hypot(e.clientX - st.dragStartX, e.clientY - st.dragStartY);
    if (dist > st.maxDragDist) st.maxDragDist = dist;

    // Allow dragging anywhere across the screen (clamped slightly inside viewport edges)
    st.pointerX = Math.max(40, Math.min(window.innerWidth - 40, e.clientX));
    st.pointerY = Math.max(40, Math.min(window.innerHeight - 40, e.clientY));
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    const st = stateRef.current;
    if (!st.isDragging) return;
    st.isDragging = false;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }

    const nodes = st.nodes;
    const lastIdx = NUM_NODES - 1;

    if (st.maxDragDist < 10) {
      // User tapped/clicked without dragging: inject a fun wave & swing impulse along the rope!
      const dir = Math.random() > 0.5 ? 1 : -1;
      nodes[lastIdx].oldX -= dir * 26;
      nodes[lastIdx].oldY += 14;
      for (let i = 3; i < lastIdx; i++) {
        nodes[i].oldX += Math.sin(i * 0.6) * 10 * dir;
      }
      st.badgeScaleVel = 0.11;
      onClickHome();
    } else {
      // User dragged & released: add an elastic slingshot wave & bounce!
      st.badgeScaleVel = 0.09;
      for (let i = 2; i < lastIdx; i++) {
        nodes[i].oldX += (Math.random() - 0.5) * 6;
      }
    }
  };

  const handleMouseEnter = () => {
    const st = stateRef.current;
    if (!st.isDragging) {
      const endNode = st.nodes[NUM_NODES - 1];
      endNode.oldX -= 7;
      st.badgeScaleVel = 0.04;
    }
  };

  return (
    <>
      {/* Hidden measurement box at the top-left of the navbar to anchor the ceiling mount */}
      <div
        ref={anchorMeasureRef}
        className="fixed top-0 left-2 sm:left-6 lg:left-10 w-[74px] sm:w-[124px] md:w-[144px] h-1 pointer-events-none z-50"
        aria-hidden="true"
      />

      {/* Full-Viewport Non-Blocking SVG Canvas for the Stretchable, Bendable Braided Rope */}
      <svg
        className="fixed inset-0 w-screen h-screen pointer-events-none z-50 overflow-visible"
        aria-hidden="true"
      >
        {/* 1. Soft 3D Rope Drop Shadow */}
        <path
          ref={shadowPathRef}
          fill="none"
          stroke="rgba(0,0,0,0.38)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2. Dark Hemp Rope Outer Edge */}
        <path
          ref={borderPathRef}
          fill="none"
          stroke="#3E3020"
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. Main Braided Rope Fiber Body */}
        <path
          ref={corePathRef}
          fill="none"
          stroke="#B99C73"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 4. Twisted Rope Diagonal Highlight Strands (stretches & bends dynamically along the curve!) */}
        <path
          ref={twistPathRef}
          fill="none"
          stroke="#F1E4C8"
          strokeWidth="4.2"
          strokeDasharray="4 7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 5. Top Ceiling Eyelet at y=2 */}
        <ellipse
          ref={ceilingMountRef}
          cx="84"
          cy="2"
          rx="7"
          ry="3"
          fill="#0B0F14"
          stroke="#FACC15"
          strokeWidth="1.2"
        />

        {/* 6. Braided Rope Knot & Golden Eyelet Loop Attached to the Medallion */}
        <g ref={knotGroupRef} transform="translate(84, 64)">
          <ellipse
            cx="0"
            cy="-2"
            rx="6.8"
            ry="4.2"
            fill="#B99C73"
            stroke="#3E3020"
            strokeWidth="1.5"
          />
          <path
            d="M-5 -2 C-2 1, 2 1, 5 -2"
            stroke="#F1E4C8"
            strokeWidth="1.2"
            fill="none"
          />
          <circle
            cx="0"
            cy="5"
            r="4.5"
            fill="none"
            stroke="#FACC15"
            strokeWidth="2.4"
          />
        </g>
      </svg>

      {/* Interactive Draggable & Swingable Medallion Button */}
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
            ? 'Pull down anywhere on screen to stretch & bend the rope, or tap to bounce!'
            : 'लोगो को पकड़कर नीचे तक खींचें, रस्सी मोड़ें और इसके साथ खेलें!'
        }
        aria-label="Ace Fitness Club Interactive Rope Logo — Pull & Play"
        style={{ transform: 'translate3d(20px, 50px, 0)' }}
        className="fixed top-0 left-0 z-50 w-[66px] h-[66px] sm:w-[112px] sm:h-[112px] md:w-[132px] md:h-[132px] rounded-full p-[3px] sm:p-[4.5px] bg-gradient-to-b from-[#FDE047] via-[#FACC15] to-[#EAB308] shadow-[0_18px_34px_rgba(0,0,0,0.48),0_4px_12px_rgba(0,0,0,0.32)] cursor-grab active:cursor-grabbing pointer-events-auto touch-none select-none will-change-transform focus:outline-none"
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-black relative flex items-center justify-center ring-1 ring-black/40">
          <img
            src={UPLOADED_LOGO_URL}
            alt="Ace Fitness Club Official Emblem"
            draggable={false}
            className="w-full h-full object-cover scale-[1.32] select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none rounded-full" />
        </div>
      </button>
    </>
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

  // WhatsApp & Complete Booking State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-quarterly');
  const [selectedProgram, setSelectedProgram] = useState('STRENGTH TRAINING');
  const [preferredBatch, setPreferredBatch] = useState('Morning (6:00 AM – 11:00 AM)');
  const [formError, setFormError] = useState('');
  const [bookingPrepared, setBookingPrepared] = useState(false);
  const [bookingRefId, setBookingRefId] = useState('AFC-BKN-4921');
  const [bookingTimeStr, setBookingTimeStr] = useState('');
  const [copiedWaText, setCopiedWaText] = useState(false);

  const t = (enText: string, hiText: string) => (lang === 'en' ? enText : hiText);

  const selectedPlanObj =
    MEMBERSHIP_PLANS.find((p) => p.id === selectedPlanId) || MEMBERSHIP_PLANS[2];

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

  // Select a specific plan & jump straight to the booking desk
  const handleSelectPlanForBooking = (planId: string) => {
    setSelectedPlanId(planId);
    setBookingPrepared(false);
    navigateInstant('location');
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const buildWhatsAppMessage = (customRefId?: string) => {
    const cleanName = fullName.trim() || (lang === 'en' ? 'Member' : 'मेंबर');
    const cleanPhone = phoneNumber.trim() || (lang === 'en' ? 'Not provided' : 'उपलब्ध नहीं');
    const refCode = customRefId || bookingRefId;

    if (lang === 'hi') {
      return [
        '✅ *नई कन्फर्म जिम बुकिंग — एस फिटनेस क्लब, बीकानेर*',
        `*बुकिंग आईडी:* ${refCode}`,
        '',
        `*सदस्य का नाम:* ${cleanName}`,
        `*मोबाइल नंबर:* ${cleanPhone}`,
        `*चयनित प्लान:* ${selectedPlanObj.nameHi} (${selectedPlanObj.durationHi})`,
        `*प्लान राशि (Amount):* ${selectedPlanObj.amountFormatted}`,
        `*ट्रेनिंग ज़ोन:* ${selectedProgram}`,
        `*पसंदीदा समय:* ${preferredBatch}`,
        '',
        '*पता:* Above Puma Showroom, Panchsati Circle, Sadul Ganj, Bikaner',
      ].join('\n');
    }

    return [
      '✅ *NEW CONFIRMED BOOKING — ACE FITNESS CLUB, BIKANER*',
      `*Booking ID:* ${refCode}`,
      '',
      `*Member Name:* ${cleanName}`,
      `*Mobile Number:* ${cleanPhone}`,
      `*Selected Plan:* ${selectedPlanObj.nameEn} (${selectedPlanObj.durationEn})`,
      `*Plan Amount:* ${selectedPlanObj.amountFormatted}`,
      `*Training Zone:* ${selectedProgram}`,
      `*Preferred Batch:* ${preferredBatch}`,
      '',
      '*Location:* Above Puma Showroom, Panchsati Circle, Sadul Ganj, Bikaner',
    ].join('\n');
  };

  const whatsappUrl = `https://wa.me/919116642929?text=${encodeURIComponent(buildWhatsAppMessage())}`;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (!fullName.trim()) {
      setFormError(t('Please enter your full name.', 'कृपया अपना पूरा नाम दर्ज करें।'));
      return;
    }
    if (digitsOnly.length < 10) {
      setFormError(t('Please enter a valid 10-digit mobile number.', 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।'));
      return;
    }
    setFormError('');
    const newRef = `AFC-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRefId(newRef);
    setBookingTimeStr(
      new Date().toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    );
    setBookingPrepared(true);

    // Immediately trigger direct WhatsApp dispatch with the newly generated Booking ID & Plan Amount
    const directUrl = `https://wa.me/919116642929?text=${encodeURIComponent(buildWhatsAppMessage(newRef))}`;
    const anchor = document.getElementById('direct-wa-trigger') as HTMLAnchorElement | null;
    if (anchor) {
      anchor.href = directUrl;
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
      {/* ==================== INTERACTIVE STRETCHABLE & BENDABLE ROPE LOGO ==================== */}
      <HangingRopeLogo onClickHome={() => navigateInstant('home')} lang={lang} />

      {/* ==================== STYLISH PERMANENTLY FIXED TOP HEADER ==================== */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-[#111820] via-[#17232E] to-[#111820] text-white border-b-2 border-[#FACC15]/80 shadow-md">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3 sm:gap-6 pl-[88px] sm:pl-[148px] md:pl-[172px] pr-3.5 sm:pr-6 h-[60px] md:h-[68px]">
          {/* Mobile Compact Brand Title */}
          <button
            type="button"
            onClick={() => navigateInstant('home')}
            className="flex md:hidden items-center gap-1.5 font-display-athletic text-base sm:text-lg font-bold tracking-wider whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="text-[#FACC15] italic">ACE</span>
            <span className="bg-[#FACC15] text-[#111820] px-1.5 py-0.5 rounded-xs italic text-xs sm:text-sm">
              FITNESS
            </span>
          </button>

          {/* Zone 2: Desktop Single-Line Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center justify-center flex-1 gap-5 lg:gap-7 text-sm font-semibold text-slate-200"
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
              onClick={() => navigateInstant('plans')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 ${
                activePage === 'plans'
                  ? 'text-[#FACC15] border-[#FACC15]'
                  : 'border-transparent hover:text-[#FACC15]'
              }`}
            >
              {t('Plans & Pricing', 'प्लान और फीस (₹)')}
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
              className="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-[#111820] bg-[#FACC15] hover:bg-[#FDE047] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              {t('Book Plan / Trial', 'प्लान / ट्रायल बुक करें')}
            </button>
          </div>
        </div>

        {/* Mobile Clean Tab Row */}
        <nav
          aria-label="Mobile Navigation"
          className="flex md:hidden items-center justify-between gap-4 overflow-x-auto no-scrollbar pl-[88px] sm:pl-[148px] pr-3.5 h-[36px] bg-[#0D1318] border-t border-white/10 text-xs font-semibold"
        >
          {(
            [
              { id: 'home', en: 'Home', hi: 'होम' },
              { id: 'plans', en: 'Plans & Fees (₹)', hi: 'प्लान और फीस (₹)' },
              { id: 'zones', en: 'Training Zones', hi: 'ट्रेनिंग ज़ोन' },
              { id: 'members', en: 'Doctors & Reviews', hi: 'डॉक्टर रिव्यु' },
              { id: 'director', en: 'Director & Certificates', hi: 'डायरेक्टर/सर्टिफिकेट' },
              { id: 'location', en: 'Book & Map', hi: 'बुकिंग और मैप' },
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
          <div className="bg-[#F2F2F2] border-b border-slate-200 mb-6 sm:mb-10">
            <div className="max-w-[1280px] mx-auto pl-4 sm:pl-[152px] md:pl-[180px] pr-4 sm:pr-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
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
            {/* Full-Width Automatic Image Carousel (Flex Column on Mobile so Top Bar & Bottom Text NEVER overlap) */}
            <div className="relative w-full min-h-[430px] sm:h-[580px] lg:h-[650px] flex flex-col justify-between">
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
                  {/* Multi-Stop Editorial Scrim: Lighter at top on mobile so the photo is clearly visible */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-slate-950/20" />
                </div>
              ))}

              {/* Top Utility Row Inside Hero: Slide Counter + Clean Bilingual Switcher */}
              <div className="relative z-20 w-full max-w-[1280px] mx-auto pl-4 sm:pl-[152px] md:pl-[180px] pr-4 sm:pr-6 pt-3 sm:pt-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono-tabular text-white/90 bg-slate-950/45 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-md backdrop-blur-xs sm:backdrop-blur-none">
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
                  className="flex items-center gap-1 p-0.5 sm:p-1 bg-slate-900/85 backdrop-blur-md border border-white/15 rounded-md text-[11px] sm:text-xs font-semibold shrink-0"
                  role="group"
                  aria-label="Language Switcher"
                >
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`px-2 sm:px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                      lang === 'en' ? 'bg-[#FACC15] text-slate-950 font-bold' : 'text-white/85 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('hi')}
                    className={`px-2 sm:px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                      lang === 'hi' ? 'bg-[#FACC15] text-slate-950 font-bold' : 'text-white/85 hover:text-white'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              {/* Dedicated Open Photo Window on Mobile so background image breathes and text never touches top bar */}
              <div className="relative z-10 h-[95px] sm:h-0 pointer-events-none shrink-0" />

              {/* Left / Right Slider Arrow Controls (Desktop) */}
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
              <div className="relative z-20 w-full max-w-[1280px] mx-auto px-4 sm:px-6 pb-5 sm:pb-12">
                <div className="max-w-3xl space-y-2 sm:space-y-4">
                  {/* Kicker Line */}
                  <div className="flex items-center gap-2 text-[11px] sm:text-sm font-semibold tracking-wide text-[#FACC15] truncate">
                    <span className="truncate">
                      {lang === 'en' ? activeSlideObj.kickerEn : activeSlideObj.kickerHi}
                    </span>
                  </div>

                  {/* High-Contrast Balanced Display Headline */}
                  <h1
                    className="font-display-athletic text-2xl sm:text-5xl lg:text-[3.6rem] font-bold text-white leading-[1.15] sm:leading-[1.1] tracking-tight drop-shadow-sm"
                    style={{ textWrap: 'balance' }}
                  >
                    {lang === 'en' ? activeSlideObj.titleEn : activeSlideObj.titleHi}
                  </h1>

                  {/* Refined Readable Description (2 clean lines on mobile, full text on desktop) */}
                  <p className="text-xs sm:text-base lg:text-lg text-slate-100/95 max-w-2xl leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                    {lang === 'en' ? activeSlideObj.subEn : activeSlideObj.subHi}
                  </p>

                  {/* Primary & Secondary Action Buttons (Side-by-side compact on mobile, full size on desktop) */}
                  <div className="pt-1.5 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => navigateInstant('plans')}
                      className="px-3.5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-950 bg-[#FACC15] hover:bg-[#FDE047] rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                    >
                      <span className="sm:hidden">{t('Plans & Fees (₹)', 'प्लान और फीस (₹)')}</span>
                      <span className="hidden sm:inline">
                        {t('View Membership Plans & Fees (₹)', 'सभी मेंबरशिप प्लान और फीस देखें (₹)')}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateInstant('location')}
                      className="px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white bg-white/15 hover:bg-white/25 backdrop-blur-xs border border-white/25 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <span className="sm:hidden">{t('Book Now', 'अभी बुक करें')}</span>
                      <span className="hidden sm:inline">
                        {t('Book Trial / Membership Now', 'अभी ऑनलाइन बुकिंग करें')}
                      </span>
                    </button>
                    <a
                      href="tel:+919116642929"
                      className="hidden sm:inline-block px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:text-[#FACC15] transition-colors whitespace-nowrap font-mono-tabular"
                    >
                      +91 91166 42929
                    </a>
                  </div>
                </div>

                {/* Interactive Numbered Slide Selector Bar */}
                <div className="mt-4 sm:mt-7 pt-3 sm:pt-4 border-t border-white/15 flex items-center justify-between gap-4">
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
                            idx === currentSlide ? 'w-6 sm:w-10 bg-[#FACC15]' : 'w-2 bg-white/35'
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

        {/* ==================== MEMBERSHIP PLANS & PRICING PAGE / SECTION ==================== */}
        {showSection('plans') && (
          <section className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-slate-200">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
                <div className="space-y-1">
                  <div className="text-xs font-bold tracking-widest uppercase text-[#1E6C93]">
                    {t(
                      'TRANSPARENT CLUB MEMBERSHIP FEES · BIKANER',
                      'एस फिटनेस क्लब के सभी प्लान और फीस (₹) की पूरी जानकारी'
                    )}
                  </div>
                  <h2 className="font-display-athletic text-3xl sm:text-4xl font-bold text-[#212121] uppercase">
                    {t(
                      'MEMBERSHIP PLANS & PRICING (₹)',
                      'मेंबरशिप प्लान और फीस चार्ट (MEMBERSHIP PLANS)'
                    )}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                    {t(
                      'Choose the membership package that fits your fitness goals. Click any plan below to pre-select its exact amount and complete your instant booking.',
                      'अपने फिटनेस लक्ष्य के अनुसार अपना पसंदीदा प्लान चुनें। किसी भी प्लान पर क्लिक करते ही उसकी राशि (Amount) सेलेक्ट हो जाएगी और आपकी बुकिंग तुरंत पूरी हो जाएगी।'
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3.5 py-2 rounded-md border border-slate-200 shrink-0">
                  <span>{t('Selected Plan:', 'चयनित प्लान:')}</span>
                  <span className="font-bold text-[#1E6C93]">
                    {lang === 'en' ? selectedPlanObj.nameEn : selectedPlanObj.nameHi} (
                    {selectedPlanObj.amountFormatted})
                  </span>
                </div>
              </div>

              {/* 6 Membership Plan Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MEMBERSHIP_PLANS.map((plan) => {
                  const isSelected = plan.id === selectedPlanId;
                  const features = lang === 'en' ? plan.featuresEn : plan.featuresHi;

                  return (
                    <article
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`rounded-xl p-6 flex flex-col justify-between transition-all cursor-pointer border-2 ${
                        isSelected
                          ? 'bg-white border-[#1E6C93] shadow-lg ring-2 ring-[#1E6C93]/20'
                          : plan.popular
                          ? 'bg-white border-[#FACC15] shadow-sm hover:border-[#1E6C93]'
                          : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Top Row: Badge + Savings */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                              plan.popular
                                ? 'bg-[#111820] text-[#FACC15]'
                                : 'bg-slate-100 text-[#1E6C93]'
                            }`}
                          >
                            {lang === 'en' ? plan.badgeEn : plan.badgeHi}
                          </span>
                          {(plan.savingsEn || plan.savingsHi) && (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {lang === 'en' ? plan.savingsEn : plan.savingsHi}
                            </span>
                          )}
                        </div>

                        {/* Plan Title & Duration */}
                        <div>
                          <h3 className="font-display-athletic text-xl sm:text-2xl font-bold text-[#212121] uppercase">
                            {lang === 'en' ? plan.nameEn : plan.nameHi}
                          </h3>
                          <div className="text-xs font-medium text-slate-500 mt-0.5">
                            {lang === 'en' ? plan.durationEn : plan.durationHi}
                          </div>
                        </div>

                        {/* Big Clear Price in ₹ INR */}
                        <div className="pt-2 pb-3 border-y border-slate-100 flex items-baseline justify-between gap-2">
                          <div>
                            <span className="font-mono-tabular text-3xl sm:text-4xl font-extrabold text-[#111820]">
                              {plan.amountFormatted}
                            </span>
                            <div className="text-xs font-semibold text-[#1E6C93] mt-0.5">
                              {lang === 'en' ? plan.perMonthEn : plan.perMonthHi}
                            </div>
                          </div>
                          {isSelected && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                              <Check className="w-3.5 h-3.5" />
                              {t('Selected', 'चयनित')}
                            </span>
                          )}
                        </div>

                        {/* Included Features List */}
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                          {features.map((feat) => (
                            <li key={feat} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-[#1E6C93] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Direct Book Plan Action Button */}
                      <div className="pt-6 mt-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPlanForBooking(plan.id);
                          }}
                          className={`w-full py-2.5 px-4 rounded-md font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                            isSelected || plan.popular
                              ? 'bg-[#1E6C93] hover:bg-[#165373] text-white'
                              : 'bg-[#111820] hover:bg-slate-800 text-[#FACC15]'
                          }`}
                        >
                          {t(
                            `Select & Book for ${plan.amountFormatted} →`,
                            `${plan.amountFormatted} में यह प्लान बुक करें →`
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
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
                {/* Left: Complete Plan & Trial Booking Desk with Amount (₹) & Instant Confirmation Pass */}
                <div className="lg:col-span-6 rounded-lg bg-white p-5 sm:p-8 shadow-xs space-y-5 border border-slate-200">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="text-xs font-bold tracking-wider uppercase text-[#1E6C93]">
                        {t('INSTANT ONLINE BOOKING DESK', 'ऑनलाइन प्लान और ट्रायल बुकिंग डेस्क')}
                      </div>
                      <h3 className="font-display-athletic text-2xl sm:text-3xl font-bold text-[#212121] uppercase">
                        {t('Complete Your Club Booking', 'अपना प्लान चुनें और बुकिंग पूरी करें')}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600">
                        {t(
                          'Select your membership plan & amount below. On clicking Confirm, your booking is completed immediately and sent straight to the club.',
                          'नीचे अपना प्लान और राशि (₹) चुनें। कन्फर्म बटन दबाते ही आपकी बुकिंग तुरंत पूरी हो जाएगी और सीधा क्लब के WhatsApp पर मैसेज चला जाएगा।'
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateInstant('plans')}
                      className="text-xs font-bold text-[#1E6C93] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {t('Compare All Plans →', 'सभी प्लान देखें →')}
                    </button>
                  </div>

                  {/* Quick Plan & Amount (₹) Selector Pills */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      {t('1. Select Membership Plan & Amount (₹) *', '1. अपना मेंबरशिप प्लान और राशि (₹) चुनें *')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {MEMBERSHIP_PLANS.map((plan) => {
                        const active = plan.id === selectedPlanId;
                        return (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => {
                              setSelectedPlanId(plan.id);
                              setBookingPrepared(false);
                            }}
                            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              active
                                ? 'bg-[#111820] text-white border-[#111820] ring-2 ring-[#FACC15]'
                                : 'bg-slate-50 text-[#212121] border-slate-200 hover:border-[#1E6C93]'
                            }`}
                          >
                            <div className="text-[11px] font-semibold opacity-85 truncate">
                              {lang === 'en' ? plan.nameEn : plan.nameHi}
                            </div>
                            <div className="mt-1 flex items-baseline justify-between gap-1">
                              <span
                                className={`font-mono-tabular text-base sm:text-lg font-extrabold ${
                                  active ? 'text-[#FACC15]' : 'text-[#1E6C93]'
                                }`}
                              >
                                {plan.amountFormatted}
                              </span>
                              {active && <Check className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Plan & Payable Amount Highlight Box */}
                  <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#1E6C93]">
                        {t('SELECTED PLAN & DURATION', 'चयनित प्लान और अवधि')}
                      </div>
                      <div className="text-sm sm:text-base font-bold text-[#212121]">
                        {lang === 'en' ? selectedPlanObj.nameEn : selectedPlanObj.nameHi}
                      </div>
                      <div className="text-xs text-slate-500">
                        {lang === 'en' ? selectedPlanObj.durationEn : selectedPlanObj.durationHi} ·{' '}
                        {lang === 'en' ? selectedPlanObj.perMonthEn : selectedPlanObj.perMonthHi}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-semibold text-slate-500">
                        {t('Plan Amount', 'कुल राशि')}
                      </div>
                      <div className="font-mono-tabular text-2xl sm:text-3xl font-extrabold text-[#111820]">
                        {selectedPlanObj.amountFormatted}
                      </div>
                    </div>
                  </div>

                  {/* Hidden Direct WhatsApp Anchor Trigger */}
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

                  {!bookingPrepared ? (
                    <form onSubmit={handleBookingSubmit} className="space-y-4" noValidate>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="wa-name" className="block text-xs font-semibold text-slate-700 mb-1">
                            {t('Full Name *', 'आपका पूरा नाम *')}
                          </label>
                          <input
                            id="wa-name"
                            type="text"
                            value={fullName}
                            onChange={(e) => {
                              setFullName(e.target.value);
                              if (formError) setFormError('');
                            }}
                            placeholder={t('Enter your full name', 'अपना नाम लिखें')}
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

                      <div className="flex flex-col sm:flex-row gap-3 pt-1">
                        <button
                          type="submit"
                          className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-md bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
                        >
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>
                            {t(
                              `Confirm Booking (${selectedPlanObj.amountFormatted}) & Send Message`,
                              `बुकिंग कन्फर्म करें (${selectedPlanObj.amountFormatted}) और सीधा मैसेज भेजें`
                            )}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={handleCopyWhatsAppText}
                          className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                        >
                          {copiedWaText ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {copiedWaText ? t('Copied', 'कॉपी हो गया') : t('Copy Details', 'डिटेल कॉपी करें')}
                          </span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* INSTANT COMPLETED BOOKING PASS & RECEIPT SCREEN */
                    <div className="rounded-xl bg-emerald-50/90 border-2 border-emerald-500 p-5 sm:p-6 space-y-4">
                      <div className="flex items-start justify-between gap-3 border-b border-emerald-200 pb-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-6 h-6 stroke-[2.5]" />
                          </div>
                          <div>
                            <div className="text-[11px] font-mono-tabular font-bold uppercase tracking-wider text-emerald-800">
                              {t('BOOKING CONFIRMED · ID:', 'बुकिंग कन्फर्म हो गई है · आईडी:')} {bookingRefId}
                            </div>
                            <h4 className="font-display-athletic text-xl sm:text-2xl font-bold text-emerald-950 uppercase">
                              {t(
                                'Your Booking Is Complete & Message Sent!',
                                'आपकी बुकिंग पूरी हो गई है और मैसेज भेज दिया गया है!'
                              )}
                            </h4>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold bg-emerald-600 text-white px-2.5 py-1 rounded uppercase shrink-0">
                          {t('Confirmed', 'कन्फर्म')}
                        </span>
                      </div>

                      {/* Official Booking Summary Pass */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-4 rounded-lg border border-emerald-200 text-xs">
                        <div>
                          <div className="text-slate-500">{t('Member Name', 'सदस्य का नाम')}</div>
                          <div className="font-bold text-[#212121] text-sm mt-0.5">{fullName}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">{t('Mobile Number', 'मोबाइल नंबर')}</div>
                          <div className="font-mono-tabular font-bold text-[#212121] text-sm mt-0.5">
                            {phoneNumber}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">{t('Plan Amount', 'प्लान की राशि')}</div>
                          <div className="font-mono-tabular font-extrabold text-emerald-700 text-base mt-0.5">
                            {selectedPlanObj.amountFormatted}
                          </div>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <div className="text-slate-500">{t('Selected Plan', 'चयनित प्लान')}</div>
                          <div className="font-bold text-[#1E6C93] mt-0.5">
                            {lang === 'en' ? selectedPlanObj.nameEn : selectedPlanObj.nameHi}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">{t('Training Zone', 'ट्रेनिंग ज़ोन')}</div>
                          <div className="font-semibold text-[#212121] mt-0.5">{selectedProgram}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">{t('Batch Time', 'बैच का समय')}</div>
                          <div className="font-semibold text-[#212121] mt-0.5">{preferredBatch}</div>
                        </div>
                      </div>

                      <div className="text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-2">
                        <span>
                          {t(
                            `Booked on ${bookingTimeStr} · Above Puma Showroom, Panchsati Circle, Bikaner`,
                            `समय: ${bookingTimeStr} · प्यूमा शोरूम के ऊपर, पंचशती सर्किल, बीकानेर`
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>
                            {t(
                              'View / Send Booking Pass on WhatsApp →',
                              'WhatsApp पर बुकिंग पास देखें / भेजें →'
                            )}
                          </span>
                        </a>
                        <button
                          type="button"
                          onClick={() => setBookingPrepared(false)}
                          className="py-2.5 px-4 rounded-md bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 font-semibold text-xs cursor-pointer"
                        >
                          {t('Edit / New Booking', 'बदलाव करें / नई बुकिंग')}
                        </button>
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
                  onClick={() => navigateInstant('plans')}
                  className="text-center sm:text-left hover:text-[#FACC15] transition-colors cursor-pointer"
                >
                  {t('Plans & Pricing (₹)', 'प्लान और फीस (₹)')}
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
