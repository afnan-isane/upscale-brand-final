/* Upscale Brand — Shared Interactive Behaviors */
(function () {
  'use strict';

  /* ---------- FETCH GETTER SAFETY PATCH ---------- */
  try {
    if (typeof window !== 'undefined' && window.fetch) {
      let _currentFetch = window.fetch;
      Object.defineProperty(window, 'fetch', {
        configurable: true,
        enumerable: true,
        get: function () {
          return _currentFetch;
        },
        set: function (fn) {
          _currentFetch = fn;
        }
      });
    }
  } catch (_e) {
    // Property may be non-configurable, safely ignore
  }

  const root = document.documentElement;
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- SITE PRELOADER (FAST 3–5 SECOND LOAD) ---------- */
  function initPreloader() {
    const preloader = document.getElementById('sitePreloader');
    if (!preloader) return;

    // Show the full preloader only on the first page load of a browser session.
    if (sessionStorage.getItem('uyb-preloader-shown') === 'true') {
      preloader.remove();
      return;
    }

    const video = preloader.querySelector('.preloader-logo-video');
    const bar = preloader.querySelector('#preloaderBar');
    const counter = preloader.querySelector('#preloaderCounter');
    const track = preloader.querySelector('.preloader-progress-track');

    let pageLoaded = document.readyState === 'complete';
    let videoFinished = false;
    let finished = false;
    let progress = 0;
    const PLAYBACK_RATE = 2.5; // 10s source video finishes in about 4s.
    const MAX_PRELOADER_MS = 5000;

    const setProgress = (value) => {
      progress = Math.max(progress, Math.min(99, Math.round(value)));
      if (bar) bar.style.width = `${progress}%`;
      if (counter) counter.textContent = `${progress}%`;
      if (track) track.setAttribute('aria-valuenow', String(progress));
    };

    const finishPreloader = () => {
      if (finished || !pageLoaded || !videoFinished) return;
      finished = true;
      setProgress(100);
      if (track) track.setAttribute('aria-valuenow', '100');
      sessionStorage.setItem('uyb-preloader-shown', 'true');

      requestAnimationFrame(() => {
        setTimeout(() => {
          preloader.classList.add('is-loaded');
          setTimeout(() => preloader.remove(), 550);
        }, 100);
      });
    };

    const markPageLoaded = () => {
      pageLoaded = true;
      setProgress(96);
      finishPreloader();
    };

    const markVideoFinished = () => {
      if (videoFinished) return;
      videoFinished = true;
      setProgress(98);
      finishPreloader();
    };

    if (video) {
      // Speed up the supplied 10-second animation to a ~4-second playback.
      const setFastPlayback = () => {
        try {
          video.defaultPlaybackRate = PLAYBACK_RATE;
          video.playbackRate = PLAYBACK_RATE;
        } catch (_) {}
      };

      video.addEventListener('loadedmetadata', setFastPlayback, { once: true });
      video.addEventListener('durationchange', setFastPlayback, { once: true });
      video.addEventListener('loadeddata', () => setProgress(55), { once: true });
      video.addEventListener('canplay', () => {
        setProgress(65);
        setFastPlayback();
        video.play().catch(() => {});
      }, { once: true });
      video.addEventListener('timeupdate', () => {
        if (!video.duration || !isFinite(video.duration)) return;
        // The animation accounts for most of the loading progress.
        setProgress(Math.min(94, 65 + (video.currentTime / video.duration) * 29));
      });
      video.addEventListener('ended', markVideoFinished, { once: true });
      video.addEventListener('error', () => {
        // Only use the fallback when the media itself fails.
        setTimeout(markVideoFinished, 250);
      }, { once: true });

      // Start loading only on the first session, after the preloader has been retained.
      video.load();

      // Cached videos can already be ready when this script initializes.
      if (video.readyState >= 1) setFastPlayback();
      if (video.readyState >= 2) {
        setProgress(55);
        video.play().catch(() => {});
      }
      if (video.ended) markVideoFinished();

      // Never trap a visitor if the media cannot be played.
      setTimeout(() => {
        if (!videoFinished) markVideoFinished();
      }, MAX_PRELOADER_MS);
    } else {
      setTimeout(markVideoFinished, 250);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setProgress(35), { once: true });
    } else {
      setProgress(35);
    }

    if (pageLoaded) {
      markPageLoaded();
    } else {
      window.addEventListener('load', markPageLoaded, { once: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader, { once: true });
  } else {
    initPreloader();
  }

  /* ---------- DYNAMIC PORTFOLIO DATASET & WORKS SYSTEM ---------- */
  const PORTFOLIO_ITEMS = [
    {
      id: 'logik7',
      category: 'web',
      categoryLabel: 'Web Development',
      metric: '+240% Speed',
      title: 'Logik7',
      description: 'Modern high-performance web platform engineering and sleek responsive design.',
      image: 'assets/images/website-shots/screencapture-logik7-2026-08-04-19_48_27.webp',
      link: 'https://logik7.com',
      tags: ['React', 'Tailwind', 'Performance', 'Web App'],
      detail: {
        category: 'Web Development Case Study',
        title: 'Logik7 — High-Performance Web Engineering',
        metrics: [
          { val: '+240%', lbl: 'Performance Boost' },
          { val: '1.0s', lbl: 'Load Time' },
          { val: '+45%', lbl: 'User Engagement' }
        ],
        challenge: 'Outdated legacy framework causing sluggish interaction and high bounce rates.',
        approach: 'Engineered a lightning-fast responsive platform with clean component architecture and smooth interactions.',
        deliverables: 'Full-Stack Web App • Responsive UI • Performance Optimization'
      }
    },
    {
      id: 'opulent-event-designs',
      category: 'web',
      categoryLabel: 'Web Development',
      metric: '+310% Bookings',
      title: 'Opulent Event Designs',
      description: 'Luxury event planning and design portal with immersive visual portfolios and booking system.',
      image: 'assets/images/website-shots/screencapture-opulenteventdesigns-ca-2026-08-04-19_48_05.webp',
      link: 'https://opulenteventdesigns.com',
      tags: ['Shopify', 'UX Design', 'Event Portal', 'Responsive'],
      detail: {
        category: 'Web Development Case Study',
        title: 'Opulent Event Designs — Luxury Portal',
        metrics: [
          { val: '+310%', lbl: 'Client Bookings' },
          { val: '99.9%', lbl: 'Uptime' },
          { val: '+60%', lbl: 'Mobile Inquiries' }
        ],
        challenge: 'Needed an exquisite online presence reflecting luxury event staging and seamless event booking.',
        approach: 'Built an elegant, high-impact digital portfolio with immersive visual galleries and booking workflows.',
        deliverables: 'Immersive Portfolio Portal • Booking Engine • Visual Gallery'
      }
    },
    {
      id: 'your-living-legend',
      category: 'web',
      categoryLabel: 'Web Development',
      metric: '+190% Engagement',
      title: 'Your Living Legend',
      description: 'Interactive storytelling platform and lifestyle web application for community leaders.',
      image: 'assets/images/website-shots/screencapture-yourlivinglegend-2026-08-04-19_47_32.webp',
      link: 'https://yourlivinglegend.com',
      tags: ['Next.js', 'Storytelling', 'Community', 'Tailwind'],
      detail: {
        category: 'Web Development Case Study',
        title: 'Your Living Legend — Interactive Storytelling Platform',
        metrics: [
          { val: '+190%', lbl: 'User Engagement' },
          { val: '2.5x', lbl: 'Session Duration' },
          { val: '+85%', lbl: 'Community Signups' }
        ],
        challenge: 'Required an engaging storytelling platform to connect community leaders with audiences.',
        approach: 'Developed a dynamic Next.js application with interactive multimedia storytelling features.',
        deliverables: 'Interactive Web App • Community Dashboard • Storytelling CMS'
      }
    },
    {
      id: 'ignite-spark',
      category: 'web',
      categoryLabel: 'Web Development',
      metric: '+280% Conversions',
      title: 'Ignite Spark',
      description: 'High-velocity SaaS marketing website and conversion-optimized funnel architecture.',
      image: 'assets/images/website-shots/screencapture-ignite-spark-2026-08-04-19_46_48.webp',
      link: 'https://ignitespark.io',
      tags: ['SaaS', 'TypeScript', 'CRO', 'Next.js'],
      detail: {
        category: 'Web Development Case Study',
        title: 'Ignite Spark — SaaS Growth Platform',
        metrics: [
          { val: '+280%', lbl: 'Conversion Rate' },
          { val: '0.8s', lbl: 'Page Load' },
          { val: '3.2x', lbl: 'Lead Generation' }
        ],
        challenge: 'Low conversion rates on the main marketing funnel and slow page delivery.',
        approach: 'Crafted a conversion-focused Next.js architecture with lightning-fast asset loading and clear call-to-actions.',
        deliverables: 'SaaS Marketing Site • CRO Funnel • High-Speed Architecture'
      }
    },
    {
      id: 'streetwise-driving',
      category: 'web',
      categoryLabel: 'Web Development',
      metric: '+350% Bookings',
      title: 'Streetwise Driving',
      description: 'Streamlined online driving school booking portal with schedule management and student dashboard.',
      image: 'assets/images/website-shots/screencapture-streetwisedrivingschools-2026-08-04-19_44_57.webp',
      link: 'https://streetwisedriving.com',
      tags: ['Booking System', 'UX/UI', 'Scheduling', 'React'],
      detail: {
        category: 'Web Development Case Study',
        title: 'Streetwise Driving — Online Booking Portal',
        metrics: [
          { val: '+350%', lbl: 'Online Bookings' },
          { val: '-50%', lbl: 'Admin Workload' },
          { val: '98%', lbl: 'Student Satisfaction' }
        ],
        challenge: 'Manual phone scheduling and lack of student progress tracking.',
        approach: 'Designed and deployed an automated scheduling system and intuitive student portal.',
        deliverables: 'Booking Portal • Schedule Management • Student Dashboard'
      }
    },
    {
      id: 'ifa-fit',
      category: 'web',
      categoryLabel: 'Web Development',
      metric: '+210% Memberships',
      title: 'Ifa Fit',
      description: 'Dynamic fitness coaching and member portal with workout trackers and secure billing.',
      image: 'assets/images/website-shots/screencapture-ifafit-2026-08-04-19_42_12.webp',
      link: 'https://ifafit.com',
      tags: ['Fitness', 'Member Portal', 'Stripe', 'Tailwind'],
      detail: {
        category: 'Web Development Case Study',
        title: 'Ifa Fit — Fitness Coaching Portal',
        metrics: [
          { val: '+210%', lbl: 'New Memberships' },
          { val: '+75%', lbl: 'Retention Rate' },
          { val: '4.9★', lbl: 'App Rating' }
        ],
        challenge: 'Fragmented coaching tools and complex checkout processes.',
        approach: 'Built an integrated membership platform with seamless Stripe billing and workout tracking.',
        deliverables: 'Member Portal • Secure Billing • Workout Tracker'
      }
    },
    {
      id: 'mysafety-consultant',
      category: 'web',
      categoryLabel: 'Web Development',
      metric: '+175% Leads',
      title: 'Mysafety Consultant',
      description: 'Professional safety consulting web presence with resource library and consultation booking.',
      image: 'assets/images/website-shots/screencapture-mysafetyconsultant-io-2026-08-04-19_41_31.webp',
      link: 'https://mysafetyconsultant.com',
      tags: ['Corporate', 'SEO', 'Lead Gen', 'Security'],
      detail: {
        category: 'Web Development Case Study',
        title: 'Mysafety Consultant — Professional Web Presence',
        metrics: [
          { val: '+175%', lbl: 'Qualified Leads' },
          { val: '+140%', lbl: 'Organic Traffic' },
          { val: '1.1s', lbl: 'Load Speed' }
        ],
        challenge: 'Outdated professional site with poor mobile accessibility.',
        approach: 'Created a secure, highly responsive corporate website with resource libraries and booking.',
        deliverables: 'Corporate Web Presence • Resource Library • Booking Integration'
      }
    },
    {
      id: 'violin-panda',
      category: 'web',
      categoryLabel: 'Web Development',
      metric: '+400% Traffic',
      title: 'Violin Panda',
      description: 'Immersive music education web app and interactive lesson scheduling platform.',
      image: 'assets/images/website-shots/screencapture-violinpanda-2026-08-04-19_37_30.webp',
      link: 'https://violinpanda.com',
      tags: ['Audio Web', 'Interactive', 'Education', 'React'],
      detail: {
        category: 'Web Development Case Study',
        title: 'Violin Panda — Music Education Portal',
        metrics: [
          { val: '+400%', lbl: 'Web Traffic' },
          { val: '+250%', lbl: 'Lesson Bookings' },
          { val: '3.8x', lbl: 'Return Visitors' }
        ],
        challenge: 'Low visibility and cumbersome lesson booking workflows.',
        approach: 'Built an engaging, interactive music education platform with streamlined scheduling.',
        deliverables: 'Interactive Music Web App • Lesson Scheduler • Resource Hub'
      }
    },
    {
      id: 'insurance-by-byrne',
      category: 'web',
      categoryLabel: 'Web Development',
      metric: '+225% Quotes',
      title: 'Insurance By Byrne',
      description: 'Instant quote calculator and insurance brokerage client portal with secure document upload.',
      image: 'assets/images/website-shots/screencapture-insurancebybyrne-2026-08-04-19_36_46.webp',
      link: 'https://insurancebybyrne.com',
      tags: ['FinTech', 'Calculator', 'Portal', 'Secure'],
      detail: {
        category: 'Web Development Case Study',
        title: 'Insurance By Byrne — Brokerage Client Portal',
        metrics: [
          { val: '+225%', lbl: 'Quote Requests' },
          { val: '-60%', lbl: 'Time to Quote' },
          { val: '100%', lbl: 'Secure Encrypted Flow' }
        ],
        challenge: 'Slow manual quote generation causing potential clients to drop off.',
        approach: 'Implemented an interactive instant quote calculator and secure client document portal.',
        deliverables: 'Instant Quote Calculator • Client Portal • Secure Uploads'
      }
    },
    {
      id: 'piedmont-hemp',
      category: 'web',
      categoryLabel: 'Web Development',
      metric: '+290% Sales',
      title: 'Piedmont Hemp',
      description: 'High-conversion e-commerce storefront for organic botanical and hemp products.',
      image: 'assets/images/website-shots/screencapture-piedmonthempco-2026-08-04-19_32_25.webp',
      link: 'https://piedmonthemp.com',
      tags: ['Shopify Plus', 'E-Commerce', 'Botanical', 'Fast Checkout'],
      detail: {
        category: 'Web Development Case Study',
        title: 'Piedmont Hemp — E-Commerce Storefront',
        metrics: [
          { val: '+290%', lbl: 'Online Sales' },
          { val: '0.9s', lbl: 'Catalog Speed' },
          { val: '+48%', lbl: 'Cart Completion' }
        ],
        challenge: 'Sub-optimal e-commerce flow and slow product browsing.',
        approach: 'Developed a high-speed Shopify Plus store with intuitive navigation and frictionless checkout.',
        deliverables: 'Shopify Plus Store • Botanical Catalog • Fast Checkout'
      }
    },
    {
      id: 'profile-linc',
      category: 'web',
      categoryLabel: 'Web Development',
      metric: '+310% Connections',
      title: 'Profile Linc',
      description: 'Digital business card and professional networking web platform with instant NFC integration.',
      image: 'assets/images/website-shots/screencapture-profilelinc-2026-08-04-19_31_19.webp',
      link: 'https://profilelinc.com',
      tags: ['Networking', 'SaaS', 'NFC', 'Web App'],
      detail: {
        category: 'Web Development Case Study',
        title: 'Profile Linc — Digital Networking Platform',
        metrics: [
          { val: '+310%', lbl: 'Connections Made' },
          { val: '50k+', lbl: 'Active Profiles' },
          { val: '4.9★', lbl: 'User Rating' }
        ],
        challenge: 'Need for a seamless digital networking alternative to paper business cards.',
        approach: 'Engineered a robust web app with instant NFC card linking and profile sharing.',
        deliverables: 'Digital Networking Web App • NFC Integration • Profile Builder'
      }
    },
    {
      id: 'voz-d-victoria',
      category: 'web',
      categoryLabel: 'Web Development',
      metric: '+185% Readership',
      title: 'Voz D Victoria',
      description: 'Digital publishing magazine and podcast streaming portal with dynamic CMS architecture.',
      image: 'assets/images/website-shots/screencapture-vozdvictoria-2026-08-04-19_26_21.webp',
      link: 'https://vozdvictoria.com',
      tags: ['Publishing', 'CMS', 'Podcast', 'Media'],
      detail: {
        category: 'Web Development Case Study',
        title: 'Voz D Victoria — Digital Publishing & Media Portal',
        metrics: [
          { val: '+185%', lbl: 'Digital Readership' },
          { val: '+220%', lbl: 'Podcast Listens' },
          { val: '3.1x', lbl: 'Ad Revenue' }
        ],
        challenge: 'Legacy CMS holding back multimedia publishing and fast article delivery.',
        approach: 'Built a high-performance publishing portal integrating audio streaming and rich articles.',
        deliverables: 'Publishing CMS • Audio Podcast Player • Magazine Portal'
      }
    },
    {
      id: 'michael-jeanfavre',
      category: 'web',
      categoryLabel: 'Web Development',
      metric: '+250% Inquiries',
      title: 'Michael Jeanfavre',
      description: 'High-end creative professional portfolio and client showcase web experience.',
      image: 'assets/images/website-shots/screencapture-michaeljeanfavre-2026-08-04-19_24_02.webp',
      link: 'https://michaeljeanfavre.com',
      tags: ['Portfolio', 'Creative', 'Animation', 'Tailwind'],
      detail: {
        category: 'Web Development Case Study',
        title: 'Michael Jeanfavre — Creative Professional Portfolio',
        metrics: [
          { val: '+250%', lbl: 'Client Inquiries' },
          { val: '3.0s', lbl: 'Interaction Speed' },
          { val: '+90%', lbl: 'Portfolio Views' }
        ],
        challenge: 'Needed a standout digital portfolio highlighting high-end creative work.',
        approach: 'Designed an immersive web experience with fluid animations and striking visual presentation.',
        deliverables: 'Creative Portfolio • Smooth Animations • Showcase Gallery'
      }
    },
    {
      id: 'design-main-street',
      category: 'web',
      categoryLabel: 'Web Development',
      metric: '+330% Client Leads',
      title: 'Design Main Street',
      description: 'Creative agency portfolio and client project management portal with case study showcases.',
      image: 'assets/images/website-shots/screencapture-designmainstreet-2026-08-04-19_23_17.webp',
      link: 'https://designmainstreet.com',
      tags: ['Agency', 'Portfolio', 'Showcase', 'Web Design'],
      detail: {
        category: 'Web Development Case Study',
        title: 'Design Main Street — Agency Showcase Platform',
        metrics: [
          { val: '+330%', lbl: 'Client Leads' },
          { val: '+160%', lbl: 'Project Submissions' },
          { val: '1.0s', lbl: 'Core Web Vitals' }
        ],
        challenge: 'Agency website failed to reflect modern design capabilities.',
        approach: 'Created a stunning, high-performance agency showcase with integrated case studies and contact flows.',
        deliverables: 'Agency Showcase • Case Study Hub • Lead Gen Funnel'
      }
    },
    {
      id: 'livescan-express',
      category: 'web',
      categoryLabel: 'Web Development',
      metric: '+270% Appointments',
      title: 'LiveScan Express',
      description: 'Fingerprinting and background check appointment scheduling and location finder web portal.',
      image: 'assets/images/website-shots/screencapture-livescanexpress-2026-08-04-19_22_07.webp',
      link: 'https://livescanexpress.com',
      tags: ['Appointment', 'Scheduling', 'Local Service', 'Fast UX'],
      detail: {
        category: 'Web Development Case Study',
        title: 'LiveScan Express — Appointment Scheduling Portal',
        metrics: [
          { val: '+270%', lbl: 'Appointments Booked' },
          { val: '-45%', lbl: 'No-Show Rate' },
          { val: '99.5%', lbl: 'System Reliability' }
        ],
        challenge: 'Inefficient phone booking and complicated location lookup for clients.',
        approach: 'Developed an automated appointment scheduling wizard and interactive location finder.',
        deliverables: 'Appointment Booking Wizard • Location Finder • SMS Reminders'
      }
    },
    {
      id: 'unimont',
      category: 'seo',
      categoryLabel: 'Real Estate SEO',
      metric: '+117% Clicks',
      title: 'Unimont Realty',
      description: 'How We Doubled Unimont Realty\'s Organic Traffic Through Strategic SEO across Unimont Imperia, Khopoli & Unimont Aurum, Karjat.',
      image: 'assets/images/unimont.webp',
      tags: ['SEO', 'Real Estate', 'Technical SEO', 'Content Strategy'],
      detail: {
        category: 'Real Estate SEO Case Study',
        title: 'How We Doubled Unimont Realty\'s Organic Traffic Through Strategic SEO',
        metrics: [
          { val: '117%', lbl: 'Increase in organic clicks' },
          { val: '206%', lbl: 'Increase in Search impressions' },
          { val: '48%', lbl: 'Improvement in avg. ranking' }
        ],
        challenge: 'Despite having a well-established brand, Unimont\'s website struggled organically due to crawlability issues, poor Core Web Vitals, weak keyword visibility for Khopoli and Karjat properties, thin content, and low domain authority.',
        approach: 'Resolved crawlability issues, improved Core Web Vitals, executed keyword mapping and location-focused content for Khopoli & Karjat, and consistent backlink acquisition across relevant industry publications.',
        deliverables: 'Technical SEO Architecture • Location-Focused Content Strategy • Backlink Authority Building • Core Web Vitals Optimization'
      }
    },
    {
      id: 'tescon',
      category: 'seo',
      categoryLabel: 'Real Estate SEO',
      metric: '+152% Clicks',
      title: 'TesconGreen',
      description: 'How We Helped TesconGreen Reach More High-Intent Customers Organically across Navi Mumbai, Turbhe, and Nerul.',
      image: 'assets/images/tescon.webp',
      tags: ['SEO', 'Commercial Real Estate', 'Landing Pages', 'Authority Building'],
      detail: {
        category: 'Commercial Real Estate SEO Case Study',
        title: 'How We Helped TesconGreen Reach More High-Intent Customers Organically',
        metrics: [
          { val: '152%', lbl: 'Increase in Organic clicks' },
          { val: '291%', lbl: 'Increase in Search impressions' },
          { val: '15%', lbl: 'Improvement in avg. ranking' }
        ],
        challenge: 'High reliance on branded traffic, weak commercial search presence across Navi Mumbai, Turbhe, and Nerul, content gaps, and missed lead generation opportunities.',
        approach: 'Content-led SEO strategy around commercial real estate and investment trends, intent-based landing pages for high-intent searches, and domain authority building through local citations.',
        deliverables: 'Content-Led SEO Strategy • Intent-Based Landing Pages • Authority Building & Link Acquisition • Search Intent Mapping'
      }
    },
    {
      id: 'anant',
      category: 'seo',
      categoryLabel: 'SEO & Content',
      metric: '+378% Clicks',
      title: 'Anant Realty',
      description: 'Build Online Presence & Establish Trust and Authority From the Ground Up for Panvel Real Estate developments.',
      image: 'assets/images/anant.webp',
      tags: ['SEO', 'Content Marketing', 'Domain Authority', 'Panvel Realty'],
      detail: {
        category: 'Real Estate Branding & SEO Case Study',
        title: 'Anant Realty — Online Presence & Authority From the Ground Up',
        metrics: [
          { val: '378%', lbl: 'Increase in Organic Clicks' },
          { val: '1,385%', lbl: 'Growth in Search Impressions' },
          { val: '52%', lbl: 'Improvement in Avg. Ranking' }
        ],
        challenge: 'Anant Realty had real-world credibility but virtually no digital footprint. Crawlability issues, thin content, and unoptimised on-page elements made it invisible for high-intent Panvel property searches.',
        approach: 'Fixed crawlability, indexing, and critical on-page SEO issues while creating buyer-focused content targeting high-intent property searches and building quality backlinks.',
        deliverables: 'Technical SEO & Indexing • Buyer-Focused Content Hubs • Quality Backlink Acquisition • Top Keyword Rankings (Panvel Realty)'
      }
    },
    {
      id: 'ads1',
      category: 'ads',
      categoryLabel: 'Performance Ads',
      metric: '+47% Enquiries',
      title: 'Local Service Lead Generation',
      description: 'Turning Local Service Intent Into Qualified Opportunities through Google Ads search campaigns and landing page optimization.',
      image: 'assets/images/ads1.webp',
      tags: ['Google Ads', 'Search', 'CRO', 'Lead Generation'],
      detail: {
        category: 'Performance & Ads Case Study',
        title: 'Local Service Lead Generation — Turning Search Intent Into Opportunities',
        metrics: [
          { val: '+47%', lbl: 'Qualified enquiries' },
          { val: '-34%', lbl: 'Cost per qualified lead' },
          { val: '+39%', lbl: 'Landing-page conversion rate' }
        ],
        challenge: 'A growing home-service business was attracting a mixture of high-intent prospects and low-quality traffic from paid search without clear landing page value proposition.',
        approach: 'Restructured search campaigns around individual services, refined keyword targeting with negative keywords, introduced conversion-focused ad copy, and redesigned landing page around a single conversion goal.',
        deliverables: 'Google Ads Search Campaigns • Keyword & Negative Keyword Optimization • Landing Page Redesign • Conversion Tracking Setup'
      }
    },
    {
      id: 'ads2',
      category: 'ads',
      categoryLabel: 'Performance Ads',
      metric: '+71% Purchases',
      title: 'E-commerce Paid Social Growth',
      description: 'Building a Scalable Paid Social Acquisition System with creative testing, audience segmentation, and retargeting.',
      image: 'assets/images/ads2.webp',
      tags: ['Meta Ads', 'Creative Strategy', 'E-Commerce', 'Retargeting'],
      detail: {
        category: 'Performance & Ads Case Study',
        title: 'E-commerce Paid Social Growth — Scalable Acquisition System',
        metrics: [
          { val: '+71%', lbl: 'Purchase conversions' },
          { val: '-28%', lbl: 'Customer acquisition cost' },
          { val: '+54%', lbl: 'Return on ad spend (ROAS)' }
        ],
        challenge: 'Paid social performance was becoming inconsistent as audiences became familiar with ads and creative fatigue set in.',
        approach: 'Built a structured creative testing framework across product benefits, customer problems, lifestyle use cases, and social proof, combined with audience segmentation and retargeting.',
        deliverables: 'Meta Ads Strategy • Structured Creative Testing Framework • Audience Segmentation • Retargeting Flows'
      }
    },
    {
      id: 'ads3',
      category: 'ads',
      categoryLabel: 'Performance Ads',
      metric: '+63% Enquiries',
      title: 'B2B Lead Generation Campaign',
      description: 'Connecting Search Intent With a Conversion-Focused Funnel for professional services companies.',
      image: 'assets/images/ads3.webp',
      tags: ['Google Ads', 'B2B Strategy', 'Funnels', 'CRO'],
      detail: {
        category: 'Performance & Ads Case Study',
        title: 'B2B Lead Generation — Search Intent With Conversion Funnel',
        metrics: [
          { val: '+63%', lbl: 'Consultation enquiries' },
          { val: '-37%', lbl: 'Cost per qualified enquiry' },
          { val: '+46%', lbl: 'Landing-page conversion rate' }
        ],
        challenge: 'Digital advertising wasn\'t producing consistent consultation requests due to a disconnected journey from search result to enquiry.',
        approach: 'Designed acquisition journey around Search → Message → Trust → Action with intent-based campaign structures, dedicated landing pages, and friction reduction.',
        deliverables: 'Intent-Based Search Campaigns • Dedicated Service Landing Pages • Friction Reduction • Conversion Tracking'
      }
    },
    {
      id: 'brand1',
      category: 'brand',
      categoryLabel: 'Brand Strategy',
      metric: '+41% Engagement',
      title: 'Brand Positioning & Messaging',
      description: 'Making a Complex Business Easier to Understand through clear positioning frameworks and core pillars.',
      image: 'assets/images/brand1.webp',
      tags: ['Brand Strategy', 'Positioning', 'Messaging', 'Digital Clarity'],
      detail: {
        category: 'Brand Strategy Case Study',
        title: 'Brand Positioning & Messaging — Clarity & Foundation',
        metrics: [
          { val: '1', lbl: 'Unified positioning framework' },
          { val: '3', lbl: 'Core positioning pillars' },
          { val: '+41%', lbl: 'Website engagement' }
        ],
        challenge: 'The business offered several valuable services but struggled to communicate its proposition clearly, creating inconsistent experiences across web pages.',
        approach: 'Clarified primary customer groups, developed a clear positioning framework connecting capabilities with customer needs, simplified core value proposition, and created consistent messaging.',
        deliverables: 'Audience Definition & Research • Positioning Framework • Core Value Proposition • Messaging Playbook'
      }
    },
    {
      id: 'brand2',
      category: 'brand',
      categoryLabel: 'Brand Strategy',
      metric: '+57% Engagement',
      title: 'Visual Brand Identity',
      description: 'Creating a Consistent Identity Across Digital Channels with cohesive typography, color application, and design systems.',
      image: 'assets/images/brand2.webp',
      tags: ['Visual Identity', 'Design System', 'Digital Branding', 'Guidelines'],
      detail: {
        category: 'Brand Strategy Case Study',
        title: 'Visual Brand Identity — Consistency Across Channels',
        metrics: [
          { val: '1', lbl: 'Unified visual system' },
          { val: '+57%', lbl: 'Social engagement' },
          { val: '4', lbl: 'Core creative guidelines' }
        ],
        challenge: 'The brand lacked visual consistency across website, social media, and promotional materials, making it difficult to recognize.',
        approach: 'Established a cohesive visual direction across typography, color application, imagery, and layout, creating repeatable creative principles and comprehensive brand guidelines.',
        deliverables: 'Visual Brand Direction • Typography & Color System • Digital Touchpoint Guidelines • Brand Guidelines Playbook'
      }
    },
    {
      id: 'brand3',
      category: 'brand',
      categoryLabel: 'Brand Strategy',
      metric: '+48% Engagement',
      title: 'Brand Repositioning',
      description: 'Moving the Conversation Beyond Price in a crowded local market through differentiation and value-driven messaging.',
      image: 'assets/images/brand3.webp',
      tags: ['Repositioning', 'Differentiation', 'Messaging', 'Local Market'],
      detail: {
        category: 'Brand Strategy Case Study',
        title: 'Brand Repositioning — Moving Beyond Price',
        metrics: [
          { val: '1', lbl: 'Clear positioning statement' },
          { val: '5', lbl: 'Core messaging themes' },
          { val: '+48%', lbl: 'Website engagement' }
        ],
        challenge: 'Operating in a crowded local market where competitors made similar claims and marketing focused purely on price.',
        approach: 'Conducted customer research and competitive messaging review, repositioning the brand around value received rather than service sold, and incorporating new positioning across all touchpoints.',
        deliverables: 'Customer Research & Review • Differentiation Strategy • Messaging Structure • Digital Touchpoint Rollout'
      }
    }
  ];

  function renderPortfolioCardHtml(item) {
    const isWeb = item.category === 'web';
    return `
      <article class="work-card reveal in" data-category="${item.category}">
        <div class="work-card-media ${isWeb ? 'web-scroll-media' : ''}" ${item.image ? `style="background-image: url('${item.image}'); ${isWeb ? 'background-size: 100% auto; background-position: 0% 0%;' : 'background-size: cover; background-position: center;'}"` : ''}>
          <div class="work-card-badges">
            <span class="work-category-badge">${item.categoryLabel}</span>
            <span class="work-metric-badge">${item.metric}</span>
          </div>
          <div class="work-card-overlay"></div>
          ${isWeb && item.link ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="web-visit-link" aria-label="Visit live website" onclick="event.stopPropagation();">Visit Live Site ↗</a>` : ''}
        </div>
        <div class="work-card-body">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="work-tags-row">
            ${item.tags.map(t => `<span class="work-tag">${t}</span>`).join('')}
          </div>
          <a class="work-card-action" href="resources.html?case=${encodeURIComponent(item.id)}">
            <span>Read More</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
        </div>
      </article>
    `;
  }

  function initCaseStudyTabs() {
    const tabButtons = document.querySelectorAll('[data-cs-tab]');
    if (!tabButtons.length) return;

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabKey = btn.getAttribute('data-cs-tab');
        tabButtons.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        document.querySelectorAll('.case-study-tab-panel').forEach(panel => {
          panel.classList.remove('is-active');
        });

        const targetPanel = document.getElementById(`panel-${tabKey}`);
        if (targetPanel) {
          targetPanel.classList.add('is-active');
        }
      });
    });
  }

  function initWorksSystem() {
    const gridContainer = document.getElementById('worksGrid') || document.querySelector('.works-grid');
    if (!gridContainer) return;

    const isHomepage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '' || !window.location.pathname.includes('portfolio.html');

    function renderItems(filter = 'all') {
      let itemsToRender = PORTFOLIO_ITEMS;
      if (isHomepage) {
        if (filter === 'all') {
          // 1 case study of each category including web development (web, seo, ads, brand)
          const cats = ['web', 'seo', 'ads', 'brand'];
          itemsToRender = [];
          cats.forEach(c => {
            const catItems = PORTFOLIO_ITEMS.filter(p => p.category === c);
            if (catItems.length > 0) {
              itemsToRender.push(catItems[0]);
            }
          });
        } else {
          // 2 of their respective case studies for that category on homepage
          const catItems = PORTFOLIO_ITEMS.filter(p => p.category === filter);
          itemsToRender = catItems.slice(0, 2);
        }
      } else {
        // On Work / Portfolio page
        if (filter !== 'all') {
          itemsToRender = PORTFOLIO_ITEMS.filter(p => p.category === filter);
        } else {
          itemsToRender = PORTFOLIO_ITEMS;
        }
      }
      gridContainer.innerHTML = itemsToRender.map(renderPortfolioCardHtml).join('');
    }

    renderItems('all');

    initCaseStudyTabs();

    // Event delegation for filter buttons to ensure they work reliably everywhere
    if (!window._uybFilterListenerAttached) {
      window._uybFilterListenerAttached = true;
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-works-filter]');
        if (!btn) return;
        const filter = btn.getAttribute('data-works-filter');

        document.querySelectorAll('[data-works-filter]').forEach(b => {
          if (b.getAttribute('data-works-filter') === filter) {
            b.classList.add('is-active');
          } else {
            b.classList.remove('is-active');
          }
        });

        renderItems(filter);
      });
    }


  }

  function initResourcesCaseStudies() {
    const grid = document.getElementById('resourcesCaseStudyGrid');
    const detailHost = document.getElementById('resourcesCaseStudyDetail');
    if (!grid || !detailHost) return;
    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    const caseItems = PORTFOLIO_ITEMS.filter(item => item.detail && item.category !== 'web' && item.image);
    grid.innerHTML = caseItems.map(item => `<a class="blog-card reveal in" href="resources.html?case=${encodeURIComponent(item.id)}"><div class="blog-card-media resource-case-media"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)} case study" loading="lazy" decoding="async"><span class="resource-case-label">${escapeHtml(item.categoryLabel || 'Case Study')}</span></div><div class="blog-card-body"><div class="cat">Case Study</div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><div class="meta">Read More →</div></div></a>`).join('');
    const requested = new URLSearchParams(window.location.search).get('case');
    if (!requested) return;
    const item = caseItems.find(entry => entry.id === requested);
    if (!item) return;
    const data = item.detail;
    detailHost.hidden = false;
    document.querySelectorAll('.resources-index-section, .resources-index-hero').forEach(el => { el.hidden = true; });
    document.title = `${data.title} | Resources | Upscale Brand`;
    detailHost.innerHTML = `<div class="container"><a class="case-study-back" href="resources.html#case-studies">← All Resources</a><article class="case-study-detail-card"><figure class="resource-case-detail-media"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)} project" loading="eager" decoding="async"></figure><div class="eyebrow">${escapeHtml(data.category)}</div><h1>${escapeHtml(data.title)}</h1><p class="case-study-summary">${escapeHtml(item.description)}</p><div class="case-study-metrics">${data.metrics.map(metric => `<div class="case-study-metric"><strong>${escapeHtml(metric.val)}</strong><span>${escapeHtml(metric.lbl)}</span></div>`).join('')}</div><div class="case-study-detail-grid"><div><h2>The Challenge</h2><p>${escapeHtml(data.challenge)}</p></div><div><h2>Our Approach</h2><p>${escapeHtml(data.approach)}</p></div></div><div class="case-study-deliverables"><h2>Deliverables</h2><p>${escapeHtml(data.deliverables)}</p></div><a href="contact.html" class="btn btn-primary">Discuss a Similar Project</a></article></div>`;
    window.scrollTo(0, 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initWorksSystem(); initResourcesCaseStudies(); });
  } else {
    initWorksSystem();
    initResourcesCaseStudies();
  }
  /* ---------- SWIPE DOWN CURTAIN OVERLAY SYSTEM ---------- */
  function getSwipeCurtain() {
    let curtain = document.getElementById('swipeCurtain');
    if (!curtain) {
      curtain = document.createElement('div');
      curtain.id = 'swipeCurtain';
      curtain.className = 'swipe-curtain-overlay';
      document.body.appendChild(curtain);
    }
    return curtain;
  }

  // Swipe-down animation when switching dark/light theme
  function toggleThemeWithSwipeDown() {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    const curtain = getSwipeCurtain();

    // Match curtain background to the NEXT theme exactly
    curtain.classList.remove('is-dark', 'is-light');
    curtain.classList.add(next === 'dark' ? 'is-dark' : 'is-light');

    curtain.classList.add('is-active');
    curtain.style.transition = 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)';
    curtain.style.transform = 'translate3d(0, 0%, 0)';

    setTimeout(() => {
      // Toggle theme at full curtain cover
      applyTheme(next);

      // Continue sliding down off-screen
      curtain.style.transform = 'translate3d(0, 100%, 0)';

      setTimeout(() => {
        curtain.classList.remove('is-active', 'is-dark', 'is-light');
        curtain.style.transition = 'none';
        curtain.style.transform = 'translate3d(0, -100%, 0)';
      }, 400);
    }, 380);
  }

  /* ---------- THEME ---------- */
  const stored = localStorage.getItem('uyb-theme');
  const initial = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem('uyb-theme', t);
    document.querySelectorAll('[data-theme-icon]').forEach(el => {
      el.innerHTML = t === 'dark'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    });
  }
  applyTheme(initial);

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-theme-toggle]');
    if (t) {
      toggleThemeWithSwipeDown();
    }
  });

  /* ---------- MOBILE MENU ---------- */
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-controls', 'mobileMenu');
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-mobile-toggle]');
    const menu = document.getElementById('mobileMenu');
    if (btn && menu) {
      const isOpen = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen.toString());
      btn.classList.toggle('is-active', isOpen);
    } else if (menu && menu.classList.contains('open') && !e.target.closest('#mobileMenu')) {
      menu.classList.remove('open');
      const toggle = document.querySelector('[data-mobile-toggle]');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-active');
      }
    }
  });

  // Close mobile menu on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const menu = document.getElementById('mobileMenu');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        const toggle = document.querySelector('[data-mobile-toggle]');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
          toggle.classList.remove('is-active');
          toggle.focus();
        }
      }
    }
  });

  // Close mobile menu on window resize beyond mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 960) {
      const menu = document.getElementById('mobileMenu');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        const toggle = document.querySelector('[data-mobile-toggle]');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
          toggle.classList.remove('is-active');
        }
      }
    }
  }, { passive: true });

  /* ---------- NAV SCROLL STATE (SHRINK ANIMATION AT 100PX) ---------- */
  const nav = document.getElementById('nav');
  if (nav) {
    let navTicking = false;
    const updateNavScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
      nav.classList.toggle('scrolled', scrollPos > 100);
      navTicking = false;
    };
    const onNavScroll = () => {
      if (!navTicking) {
        window.requestAnimationFrame(updateNavScroll);
        navTicking = true;
      }
    };
    updateNavScroll();
    window.addEventListener('scroll', onNavScroll, { passive: true });
    window.addEventListener('resize', onNavScroll, { passive: true });
  }

  /* ---------- SCROLL REVEAL (SECTIONS & GRID CARDS) ---------- */
  function initScrollReveal() {
    const cardSelectors = 'section:not(.approach-section):not(#approach), .section:not(.approach-section):not(#approach), .section-sm, .card, .service-card, .portfolio-item, .blog-card, .plan, .quote-card, .team-card, .team-member-card, .stat, .testimonial, .value, .process-step, .grid-card, .feature-project, .faq-item';
    document.querySelectorAll(cardSelectors).forEach(el => {
      // Exclude approach section and its sticky stack children to prevent transform containing-block interference
      if (el.closest('.approach-section') || el.id === 'approach' || el.classList.contains('approach-card') || el.classList.contains('approach-stack') || el.classList.contains('approach-progress-indicator')) {
        return;
      }
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
    });

    if (prefersReduce || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
      return;
    }

    // Immediate visibility check for elements already in or near viewport on page load
    const checkImmediateInView = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll('.reveal:not(.in)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          el.classList.add('in');
        }
      });
    };

    // Stagger containers for services grid & testimonial sections
    const staggerContainers = document.querySelectorAll('.services-bento, .testimonials');
    const staggerItems = new Set();

    staggerContainers.forEach(container => {
      const items = Array.from(container.querySelectorAll('.service-card, .testimonial'));
      items.forEach((item, index) => {
        staggerItems.add(item);
        item.style.setProperty('--stagger-index', index);
      });
    });

    const triggerStaggerItem = (item, index) => {
      if (item.classList.contains('in')) return;
      const delay = (index % 6) * 90;
      item.style.transitionDelay = `${delay}ms`;
      setTimeout(() => {
        item.classList.add('in');
        // Clear transition delay once animated so hover effects respond immediately
        setTimeout(() => {
          item.style.transitionDelay = '';
        }, 600);
      }, 30);
    };

    // Responsive threshold adjustment:
    // On smaller screens (<= 768px): sensitive thresholds (0.01) with positive bottom margin ensure tall cards and sections trigger reliably without delay.
    // On desktop screens (> 768px): keep standard thresholds (0.08 / 0.15) with negative margins to maintain desktop layout stability and staggered choreography.
    const isSmallScreen = () => window.innerWidth <= 768;

    let containerObserver = null;
    let itemObserver = null;
    let generalObserver = null;

    const setupObservers = () => {
      if (containerObserver) containerObserver.disconnect();
      if (itemObserver) itemObserver.disconnect();
      if (generalObserver) generalObserver.disconnect();

      const small = isSmallScreen();

      const containerConfig = small
        ? { threshold: 0.01, rootMargin: '0px 0px 30px 0px' }
        : { threshold: 0.08, rootMargin: '0px 0px -30px 0px' };

      const itemConfig = small
        ? { threshold: 0.01, rootMargin: '0px 0px 20px 0px' }
        : { threshold: 0.15, rootMargin: '0px 0px -20px 0px' };

      const generalConfig = small
        ? { threshold: 0.01, rootMargin: '0px 0px 30px 0px' }
        : { threshold: 0.08, rootMargin: '0px 0px -40px 0px' };

      // 1. Container observer for staggered sections
      containerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const container = entry.target;
            const items = Array.from(container.querySelectorAll('.service-card, .testimonial'));
            items.forEach((item, idx) => {
              triggerStaggerItem(item, idx);
            });
            containerObserver.unobserve(container);
          }
        });
      }, containerConfig);

      staggerContainers.forEach(container => {
        const hasPending = container.querySelector('.service-card:not(.in), .testimonial:not(.in)');
        if (hasPending) {
          containerObserver.observe(container);
        }
      });

      // Individual item observer as backup (essential for deep mobile scroll)
      itemObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const item = entry.target;
            const idx = parseInt(item.style.getPropertyValue('--stagger-index') || '0', 10);
            triggerStaggerItem(item, idx);
            itemObserver.unobserve(item);
          }
        });
      }, itemConfig);

      staggerItems.forEach(item => {
        if (!item.classList.contains('in')) {
          itemObserver.observe(item);
        }
      });

      // 2. General observer for all other sections & cards
      generalObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const delay = small ? (i % 3) * 30 : (i % 4) * 60;
            setTimeout(() => {
              entry.target.classList.add('in');
            }, delay);
            generalObserver.unobserve(entry.target);
          }
        });
      }, generalConfig);

      document.querySelectorAll('.reveal:not(.in)').forEach(el => {
        if (!staggerItems.has(el)) {
          generalObserver.observe(el);
        }
      });
    };

    checkImmediateInView();
    setupObservers();

    // Re-evaluate observer thresholds if user resizes or rotates screen across breakpoint
    let resizeTimer = null;
    let lastWasSmall = isSmallScreen();
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const currentSmall = isSmallScreen();
        if (currentSmall !== lastWasSmall) {
          lastWasSmall = currentSmall;
          setupObservers();
        }
        checkImmediateInView();
      }, 150);
    }, { passive: true });
  }

  /* ---------- SCROLL PROGRESS INDICATOR ---------- */
  function initScrollProgress() {
    let bar = document.getElementById('scrollProgressBar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'scrollProgressBar';
      bar.className = 'scroll-progress-bar';
      bar.setAttribute('aria-hidden', 'true');
      document.body.prepend(bar);
    }

    const updateBar = () => {
      const docEl = document.documentElement;
      const scrollTop = window.scrollY || docEl.scrollTop || 0;
      const scrollHeight = (docEl.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    };

    window.addEventListener('scroll', updateBar, { passive: true });
    window.addEventListener('resize', updateBar, { passive: true });
    updateBar();
  }

  /* ---------- CIRCULAR BACK TO TOP BUTTON ---------- */
  function initBackToTop() {
    let btn = document.getElementById('backToTop');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'back-to-top';
      btn.id = 'backToTop';
      btn.setAttribute('aria-label', 'Back to top');
      btn.setAttribute('title', 'Back to top');
      btn.setAttribute('aria-hidden', 'true');
      btn.setAttribute('tabindex', '-1');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      `;
      document.body.appendChild(btn);
    }

    let ticking = false;
    const updateBackToTop = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
      const isPast600 = scrollPos > 600;
      btn.classList.toggle('is-visible', isPast600);
      btn.setAttribute('aria-hidden', (!isPast600).toString());
      btn.setAttribute('tabindex', isPast600 ? '0' : '-1');
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateBackToTop);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateBackToTop);
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: prefersReduce ? 'auto' : 'smooth'
      });
      btn.blur();
    });

    updateBackToTop();
  }

  /* ---------- OUR APPROACH ROADMAP & STACKING ON SCROLL ---------- */
  function initApproachStack() {
    const stack = document.getElementById('approachStack');
    if (!stack) return;

    const cards = Array.from(stack.querySelectorAll('.approach-card'));
    if (!cards.length) return;

    // Check or create delivery roadmap navigator at the top of the approach-card container
    let progressIndicator = stack.querySelector('.approach-roadmap-nav') || stack.querySelector('.approach-progress-indicator') || stack.querySelector('#approachProgress');
    if (!progressIndicator) {
      progressIndicator = document.createElement('div');
      progressIndicator.className = 'approach-progress-indicator approach-roadmap-nav';
      progressIndicator.id = 'approachProgress';
      progressIndicator.setAttribute('role', 'region');
      progressIndicator.setAttribute('aria-label', 'Growth Delivery Roadmap Navigator');
      progressIndicator.innerHTML = `
        <div class="approach-roadmap-header">
          <div class="approach-roadmap-badge">
            <span class="approach-roadmap-pulse" aria-hidden="true"></span>
            <span class="approach-roadmap-title">Growth Delivery Roadmap</span>
          </div>
          <div class="approach-roadmap-status">
            <span class="approach-roadmap-step-text" id="approachProgressStepText">Phase <strong>1</strong> of 4 &bull; Discovery &amp; Audit</span>
            <span class="approach-roadmap-pill" id="approachStepStatusBadge">Phase 1 Active</span>
          </div>
        </div>
        <div class="approach-roadmap-stepper" role="tablist" aria-label="Roadmap delivery phases">
          <button type="button" class="roadmap-step-btn is-active" data-step="0" role="tab" aria-selected="true" aria-label="Phase 1: Discovery &amp; Audit">
            <span class="step-badge"><span class="step-num">01</span><svg class="step-check" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></span>
            <span class="step-info"><span class="step-name">Discovery</span><span class="step-sub">Audit &amp; Goals</span></span>
          </button>
          <div class="roadmap-step-connector" aria-hidden="true"><div class="connector-fill"></div></div>
          <button type="button" class="roadmap-step-btn" data-step="1" role="tab" aria-selected="false" aria-label="Phase 2: Strategy &amp; Positioning">
            <span class="step-badge"><span class="step-num">02</span><svg class="step-check" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></span>
            <span class="step-info"><span class="step-name">Strategy</span><span class="step-sub">Roadmap &amp; Plan</span></span>
          </button>
          <div class="roadmap-step-connector" aria-hidden="true"><div class="connector-fill"></div></div>
          <button type="button" class="roadmap-step-btn" data-step="2" role="tab" aria-selected="false" aria-label="Phase 3: Creative &amp; Technical Build">
            <span class="step-badge"><span class="step-num">03</span><svg class="step-check" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></span>
            <span class="step-info"><span class="step-name">Build</span><span class="step-sub">Creative &amp; Funnels</span></span>
          </button>
          <div class="roadmap-step-connector" aria-hidden="true"><div class="connector-fill"></div></div>
          <button type="button" class="roadmap-step-btn" data-step="3" role="tab" aria-selected="false" aria-label="Phase 4: Launch &amp; Optimization">
            <span class="step-badge"><span class="step-num">04</span><svg class="step-check" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></span>
            <span class="step-info"><span class="step-name">Launch</span><span class="step-sub">Scale &amp; Testing</span></span>
          </button>
        </div>
      `;
      stack.prepend(progressIndicator);
    }

    const progressStepText = document.getElementById('approachProgressStepText') || progressIndicator.querySelector('.approach-roadmap-step-text, .approach-progress-step-text');
    const stepStatusBadge = document.getElementById('approachStepStatusBadge') || progressIndicator.querySelector('.approach-roadmap-pill');
    const stepButtons = Array.from(progressIndicator.querySelectorAll('.roadmap-step-btn, .progress-dot'));
    const connectors = Array.from(progressIndicator.querySelectorAll('.roadmap-step-connector'));
    const progressFill = progressIndicator.querySelector('.approach-progress-fill, #approachProgressFill');
    const progressPercent = progressIndicator.querySelector('.approach-progress-percent, #approachProgressPercent');

    const phaseNames = [
      'Discovery & Audit',
      'Strategy & Positioning',
      'Creative & Technical Build',
      'Launch & Optimization'
    ];

    cards.forEach((card, index) => {
      card.style.setProperty('--step-index', index);
    });

    // Bitdown layout metrics: ensures navigator and stacked cards have comfortable space below shrunk navbar
    const getLayoutMetrics = () => {
      const isMobile = window.innerWidth <= 768;
      const headerH = isMobile ? 60 : 72;
      const progressTop = isMobile ? 68 : 88;
      const topNavH = isMobile ? 188 : 236;
      return { isMobile, headerH, progressTop, topNavH };
    };

    const scrollToStep = (stepIdx) => {
      if (cards[stepIdx]) {
        const { headerH, topNavH } = getLayoutMetrics();
        const cardTopDoc = cards[stepIdx].getBoundingClientRect().top + window.scrollY;
        const targetStickyTop = topNavH + (stepIdx * headerH);
        window.scrollTo({
          top: Math.max(0, cardTopDoc - targetStickyTop + 10),
          behavior: prefersReduce ? 'auto' : 'smooth'
        });
      }
    };

    // Clicking roadmap phase buttons smoothly navigates to that card
    stepButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const stepIdx = parseInt(btn.getAttribute('data-step') || '0', 10);
        scrollToStep(stepIdx);
      });
    });

    // Clicking card headers smoothly scrolls to that step so it is brought to focus
    cards.forEach((card, cardIdx) => {
      const header = card.querySelector('.approach-card-header');
      if (header) {
        header.addEventListener('click', () => {
          scrollToStep(cardIdx);
        });
      }
    });

    let ticking = false;

    const updateStack = () => {
      const { headerH, progressTop, topNavH } = getLayoutMetrics();
      const stackRect = stack.getBoundingClientRect();
      const n = cards.length;

      // Indicator stuck styling
      if (progressIndicator) {
        const isStuck = stackRect.top <= progressTop + 6 && stackRect.bottom > (topNavH + (n * headerH));
        progressIndicator.classList.toggle('is-stuck', isStuck);
      }

      // Check card sticky positions and determine active card index
      let activeIndex = 0;
      let stackedCount = 0;

      cards.forEach((card, i) => {
        const expectedStickyTop = topNavH + (i * headerH);
        const cardRect = card.getBoundingClientRect();
        // A card has reached its stacked sticky offset
        const isStacked = cardRect.top <= expectedStickyTop + 6;
        if (isStacked) {
          stackedCount++;
          activeIndex = i;
        }
        card.classList.toggle('is-stacked', isStacked);
      });

      const allStacked = (stackedCount === n) || (stackRect.bottom <= topNavH + (n * headerH) + 40);

      // Before stack enters sticky area
      if (stackRect.top > topNavH + 40) {
        activeIndex = 0;
      }

      cards.forEach((card, i) => {
        card.classList.toggle('is-active', i === activeIndex);
      });

      const currentStep = allStacked ? n - 1 : activeIndex;

      // Update roadmap status text
      if (progressStepText) {
        if (allStacked) {
          progressStepText.innerHTML = `<strong>All ${n} Phases Completed</strong> &bull; Framework Stacked`;
        } else {
          const stepName = phaseNames[currentStep] || `Phase ${currentStep + 1}`;
          progressStepText.innerHTML = `Phase <strong>${currentStep + 1}</strong> of ${n} &bull; ${stepName}`;
        }
      }

      // Update status pill badge
      if (stepStatusBadge) {
        if (allStacked) {
          stepStatusBadge.textContent = 'All Phases Delivered';
          stepStatusBadge.classList.add('is-completed');
        } else {
          stepStatusBadge.textContent = `Phase ${currentStep + 1} Active`;
          stepStatusBadge.classList.remove('is-completed');
        }
      }

      // Update step buttons and connectors
      stepButtons.forEach((btn) => {
        const btnStep = parseInt(btn.getAttribute('data-step') || '0', 10);
        const isActive = (btnStep === currentStep && !allStacked);
        const isPassed = (btnStep < currentStep || allStacked);
        btn.classList.toggle('is-active', isActive);
        btn.classList.toggle('is-passed', isPassed);
        btn.setAttribute('aria-selected', isActive.toString());
      });

      connectors.forEach((conn, connIdx) => {
        conn.classList.toggle('is-filled', connIdx < currentStep || allStacked);
      });

      // Legacy fallback progress bar support if present
      if (progressFill || progressPercent) {
        let progress = 0;
        if (allStacked) {
          progress = 100;
        } else {
          const baseProgressPerStep = 100 / n;
          const currentStepProgress = activeIndex * baseProgressPerStep;
          let stepFraction = 0;
          if (activeIndex < n - 1) {
            const nextCard = cards[activeIndex + 1];
            const nextExpectedTop = topNavH + ((activeIndex + 1) * headerH);
            const nextCardRect = nextCard.getBoundingClientRect();
            const distanceRemaining = nextCardRect.top - nextExpectedTop;
            const stepTravel = Math.max(120, nextCard.offsetHeight * 0.7);
            stepFraction = distanceRemaining > 0 ? Math.max(0, Math.min(1, 1 - (distanceRemaining / stepTravel))) : 1;
          }
          progress = Math.min(99, Math.max(0, currentStepProgress + (stepFraction * baseProgressPerStep)));
        }
        if (stackRect.top > topNavH + 40) progress = 0;
        const roundedProgress = Math.round(progress);
        if (progressFill) progressFill.style.width = `${roundedProgress}%`;
        if (progressPercent) progressPercent.textContent = `${roundedProgress}%`;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateStack);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    updateStack();
  }

  function initApp() {
    initScrollProgress();
    initBackToTop();
    initScrollReveal();
    initApproachStack();
    initFormValidation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  /* ---------- ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && !prefersReduce) {
    const counterThreshold = window.innerWidth <= 768 ? 0.15 : 0.4;
    const cIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = (el.dataset.count.split('.')[1] || '').length;
        const duration = 1800;
        const start = performance.now();
        const startVal = 0;
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = startVal + (target - startVal) * eased;
          el.textContent = decimals ? val.toFixed(decimals) : Math.floor(val).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString();
        }
        requestAnimationFrame(tick);
        cIO.unobserve(el);
      });
    }, { threshold: counterThreshold });
    counters.forEach(c => cIO.observe(c));
  } else {
    counters.forEach(c => {
      const t = parseFloat(c.dataset.count);
      const d = (c.dataset.count.split('.')[1] || '').length;
      c.textContent = d ? t.toFixed(d) : t.toLocaleString();
    });
  }

  /* ---------- HERO CANVAS (particle mesh) ---------- */
  const canvas = document.getElementById('hero-canvas');
  if (canvas && !prefersReduce) {
    const ctx = canvas.getContext('2d');
    let W, H, dots;
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.width = canvas.offsetWidth * dpr;
      H = canvas.height = canvas.offsetHeight * dpr;
      canvas.style.width = canvas.offsetWidth + 'px';
      canvas.style.height = canvas.offsetHeight + 'px';
      const count = Math.min(80, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 15000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3 * dpr, vy: (Math.random() - 0.5) * 0.3 * dpr,
        r: (1 + Math.random() * 1.5) * dpr
      }));
    }
    resize();
    window.addEventListener('resize', resize);
    function frame() {
      ctx.clearRect(0, 0, W, H);
      const isDark = root.getAttribute('data-theme') === 'dark';
      const line = isDark ? 'rgba(255,90,31,0.15)' : 'rgba(255,90,31,0.22)';
      const dotC = isDark ? 'rgba(255,90,31,0.7)' : 'rgba(255,90,31,0.65)';
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140 * (window.devicePixelRatio || 1)) {
            ctx.strokeStyle = line;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.fillStyle = dotC;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    frame();
  }



  /* ---------- CURRENT YEAR ---------- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- CLIENT-SIDE FORM VALIDATION ---------- */
  function initFormValidation() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setFieldError(input, errorMsg) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      let errEl = input.nextElementSibling;
      if (!errEl || !errEl.classList.contains('form-error')) {
        errEl = document.createElement('div');
        errEl.className = 'form-error';
        input.parentNode.insertBefore(errEl, input.nextSibling);
      }
      errEl.textContent = errorMsg;
      input.setAttribute('aria-invalid', 'true');
    }

    function clearFieldError(input) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      const errEl = input.nextElementSibling;
      if (errEl && errEl.classList.contains('form-error')) {
        errEl.remove();
      }
      input.removeAttribute('aria-invalid');
    }

    function validateField(input) {
      const val = input.value.trim();
      const isRequired = input.hasAttribute('required') || input.required;

      if (isRequired && !val) {
        const labelEl = document.querySelector(`label[for="${input.id}"]`);
        const fieldName = labelEl ? labelEl.textContent.trim() : (input.getAttribute('placeholder') || 'This field');
        setFieldError(input, `${fieldName} cannot be empty.`);
        return false;
      }

      if (input.type === 'email' && val) {
        if (!emailRegex.test(val)) {
          setFieldError(input, 'Please enter a valid email address (e.g., alex@company.com).');
          return false;
        }
      }

      if (input.id === 'message' && isRequired && val.length < 10) {
        setFieldError(input, 'Please provide a bit more detail (at least 10 characters).');
        return false;
      }

      clearFieldError(input);
      return true;
    }

    // Attach real-time validation to contact forms
    document.querySelectorAll('form.form').forEach(form => {
      form.setAttribute('novalidate', '');
      const inputs = form.querySelectorAll('input, textarea');

      inputs.forEach(input => {
        // Real-time feedback on input and blur
        input.addEventListener('input', () => {
          if (input.classList.contains('is-invalid') || input.value.trim().length > 0) {
            validateField(input);
          }
        });

        input.addEventListener('blur', () => {
          validateField(input);
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        let firstInvalid = null;

        inputs.forEach(input => {
          if (!validateField(input)) {
            isValid = false;
            if (!firstInvalid) firstInvalid = input;
          }
        });

        if (!isValid) {
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        if (form.dataset.emailEndpoint === 'true') {
          HTMLFormElement.prototype.submit.call(form);
          return;
        }

        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Sending Message…';
        }

        setTimeout(() => {
          form.innerHTML = `
            <div style="text-align:center;padding:48px 24px;background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm)">
              <div style="width:56px;height:56px;margin:0 auto 16px;border-radius:50%;background:rgba(255,90,31,0.1);display:flex;align-items:center;justify-content:center;color:var(--accent);font-size:1.8rem">✓</div>
              <h3 style="margin-bottom:8px;font-size:1.4rem">Message Sent Successfully</h3>
              <p style="color:var(--text-secondary);max-width:440px;margin:0 auto">Thank you for reaching out to Upscale Brand. A member of our strategy team will review your project and get back to you within one business day.</p>
            </div>
          `;
        }, 800);
      });
    });

    // Attach real-time validation to newsletter forms
    document.querySelectorAll('form.newsletter').forEach(form => {
      form.setAttribute('novalidate', '');
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput) return;

      const setNewsletterError = (msg) => {
        emailInput.classList.remove('is-valid');
        emailInput.classList.add('is-invalid');
        let err = form.querySelector('.newsletter-error');
        if (!err) {
          err = document.createElement('div');
          err.className = 'newsletter-error';
          form.appendChild(err);
        }
        err.textContent = msg;
        emailInput.setAttribute('aria-invalid', 'true');
      };

      const clearNewsletterError = () => {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
        const err = form.querySelector('.newsletter-error');
        if (err) err.remove();
        emailInput.removeAttribute('aria-invalid');
      };

      const validateNewsletter = () => {
        const val = emailInput.value.trim();
        if (!val) {
          setNewsletterError('Please enter an email address.');
          return false;
        }
        if (!emailRegex.test(val)) {
          setNewsletterError('Please enter a valid email format.');
          return false;
        }
        clearNewsletterError();
        return true;
      };

      emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('is-invalid')) {
          validateNewsletter();
        }
      });

      emailInput.addEventListener('blur', () => {
        if (emailInput.value.trim().length > 0) {
          validateNewsletter();
        }
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateNewsletter()) {
          emailInput.focus();
          return;
        }

        const btn = form.querySelector('button');
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Subscribing…';
        }

        setTimeout(() => {
          form.innerHTML = `
            <div style="padding:14px 18px;background:rgba(255,90,31,0.1);border:1px solid rgba(255,90,31,0.25);border-radius:12px;color:var(--text-primary);font-size:0.92rem;display:flex;align-items:center;gap:10px">
              <span style="color:var(--accent);font-weight:700">✓</span>
              <span>You're subscribed to agency updates!</span>
            </div>
          `;
        }, 700);
      });
    });
  }
})();
