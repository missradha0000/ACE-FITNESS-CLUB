export const SINGLE_FILE_HTML_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ace Fitness Club Bikaner | For A Stronger Nation</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Oswald:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    html, body {
      font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif;
      background-color: #FFFFFF;
      color: #212121;
      scroll-behavior: auto !important;
    }
    .font-display-athletic {
      font-family: 'Oswald', 'Noto Sans Devanagari', sans-serif;
    }
    .font-mono-tabular {
      font-family: 'JetBrains Mono', monospace;
      font-variant-numeric: tabular-nums;
    }
  </style>
</head>
<body class="bg-white text-[#212121] antialiased">
  <!-- Top Bar (3-Zone Contract, Instant View Switcher — No Scrolling Animation) -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
    <div class="max-w-[1280px] mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
      <button type="button" onclick="openView('all')" class="font-display-athletic text-2xl font-bold tracking-wide text-[#1E6C93] whitespace-nowrap shrink-0 cursor-pointer">
        ACE FITNESS CLUB
      </button>
      <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
        <button type="button" onclick="openView('all')" class="hover:text-[#1E6C93] transition-colors whitespace-nowrap shrink-0 cursor-pointer">Home</button>
        <button type="button" onclick="openView('zones')" class="hover:text-[#1E6C93] transition-colors whitespace-nowrap shrink-0 cursor-pointer">Training Zones</button>
        <button type="button" onclick="openView('members')" class="hover:text-[#1E6C93] transition-colors whitespace-nowrap shrink-0 cursor-pointer">Members Say</button>
        <button type="button" onclick="openView('director')" class="hover:text-[#1E6C93] transition-colors whitespace-nowrap shrink-0 cursor-pointer">Director & Certificates</button>
        <button type="button" onclick="openView('location')" class="hover:text-[#1E6C93] transition-colors whitespace-nowrap shrink-0 cursor-pointer">Location & Map</button>
      </nav>
      <div class="flex items-center shrink-0">
        <button type="button" onclick="openView('location')" class="px-5 py-2 text-xs font-semibold text-white bg-[#1E6C93] hover:bg-[#165270] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer">
          Book Trial / Directions
        </button>
      </div>
    </div>
  </header>

  <div class="bg-[#1E6C93] text-white text-center py-2 px-4 text-xs sm:text-sm font-semibold tracking-wide">
    REFORMER PILATES NOW AVAILABLE · ABOVE PUMA SHOWROOM, PANCHSATI CIRCLE, SADUL GANJ, BIKANER
  </div>

  <main class="max-w-[1280px] mx-auto px-6 py-8">
    <p class="text-center text-sm text-slate-600 mb-6">
      Note: Use the live application preview to view and download all 39 local original images bundled in <code>/src/assets/images/original/</code>.
    </p>
  </main>

  <script>
    function openView(view) {
      window.scrollTo(0, 0);
    }
  </script>
</body>
</html>`;
