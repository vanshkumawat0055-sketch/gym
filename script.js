/**
 * TITAN FORGE FITNESS & ATHLETICS - CORE JAVASCRIPT ENGINE
 * Handles: Preloader, Beast Audio Synthesizer (Web Audio API),
 * Canvas Furnace Embers, Workout Routine Generator, Rest Timer,
 * Dual Fitness Calculators (BMI/TDEE & 1RM), Weekly Schedule Booker,
 * Before-After Comparison Slider, Holographic VIP Pass Generator, FAQ Accordions.
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. PRELOADER
  // ==========================================================================
  const loader = document.getElementById('page-loader');
  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add('fade-out');
    setTimeout(() => { loader.style.display = 'none'; }, 600);
  };
  window.addEventListener('load', () => setTimeout(hideLoader, 400));
  setTimeout(hideLoader, 2000); // Fallback

  // ==========================================================================
  // 2. THEME SWITCHER (Dark / Light)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootHtml = document.documentElement;
  const savedTheme = localStorage.getItem('titan_theme') || 'dark';
  rootHtml.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = rootHtml.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      rootHtml.setAttribute('data-theme', nextTheme);
      localStorage.setItem('titan_theme', nextTheme);
    });
  }

  // ==========================================================================
  // 3. STICKY NAVBAR & SCROLL-SPY
  // ==========================================================================
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  const onScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (header) {
      if (scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }

    if (backToTopBtn) {
      if (scrollY > 400) backToTopBtn.classList.add('visible');
      else backToTopBtn.classList.remove('visible');
    }

    let currentSection = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 4. MOBILE HAMBURGER DRAWER
  // ==========================================================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');

  const toggleMobileMenu = (forceClose = false) => {
    if (!navMenu || !hamburgerBtn) return;
    const isOpen = forceClose ? false : !navMenu.classList.contains('open');
    hamburgerBtn.classList.toggle('open', isOpen);
    navMenu.classList.toggle('open', isOpen);
    if (navOverlay) navOverlay.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => toggleMobileMenu());
  if (navOverlay) navOverlay.addEventListener('click', () => toggleMobileMenu(true));
  navLinks.forEach((l) => l.addEventListener('click', () => {
    if (window.innerWidth <= 991) toggleMobileMenu(true);
  }));

  // ==========================================================================
  // 5. BEAST AUDIO PUMP (SYNTHESIZED WEB AUDIO API - 100% OFFLINE BEATS)
  // ==========================================================================
  const beastAudioBtn = document.getElementById('beast-audio-btn');
  let audioCtx = null;
  let isPlayingAudio = false;
  let audioInterval = null;
  let step = 0;

  const playSynthesizedBeat = () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const playKick = (time) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(140, time);
      osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);
      gain.gain.setValueAtTime(0.7, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
      osc.start(time);
      osc.stop(time + 0.25);
    };

    const playHiHat = (time) => {
      const bufferSize = audioCtx.sampleRate * 0.04;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 7500;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.04);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(time);
    };

    const playBassSynth = (time, freq) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, time);
      filter.frequency.exponentialRampToValueAtTime(120, time + 0.2);
      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(time);
      osc.stop(time + 0.22);
    };

    const notes = [55, 55, 65.41, 55, 73.42, 65.41, 55, 82.41]; // Beast rhythm notes
    const tempo = 128; // BPM
    const stepDuration = 60 / tempo / 2; // Eighth note

    audioInterval = setInterval(() => {
      const now = audioCtx.currentTime;
      // Kick on 1 and 3
      if (step % 4 === 0) playKick(now);
      // Hi-hat on offbeats
      if (step % 2 === 1) playHiHat(now);
      // Bassline
      const freq = notes[step % notes.length];
      playBassSynth(now, freq);
      step++;
    }, stepDuration * 1000);
  };

  const stopSynthesizedBeat = () => {
    if (audioInterval) {
      clearInterval(audioInterval);
      audioInterval = null;
    }
  };

  if (beastAudioBtn) {
    beastAudioBtn.addEventListener('click', () => {
      isPlayingAudio = !isPlayingAudio;
      beastAudioBtn.classList.toggle('playing', isPlayingAudio);
      const label = beastAudioBtn.querySelector('.audio-label');
      if (isPlayingAudio) {
        if (label) label.textContent = 'Audio: ON';
        playSynthesizedBeat();
      } else {
        if (label) label.textContent = 'Beast Audio';
        stopSynthesizedBeat();
      }
    });
  }

  // Play a short chime when rest timer finishes
  const playTimerChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // AudioContext not allowed without interaction
    }
  };

  // ==========================================================================
  // 6. HERO CANVAS FURNACE EMBERS (PARTICLE SYSTEM)
  // ==========================================================================
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    window.addEventListener('resize', () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    class Ember {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 40;
        this.size = Math.random() * 2.8 + 1;
        this.speedY = Math.random() * 1.8 + 0.6;
        this.speedX = (Math.random() - 0.5) * 1.2;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.life = Math.random() * 100 + 60;
        this.age = 0;
        // Orange/Ember HSL
        this.hue = Math.random() * 25 + 15; // 15 to 40 (Red-Orange to Gold)
      }
      update() {
        this.x += this.speedX + Math.sin(this.age * 0.05) * 0.5;
        this.y -= this.speedY;
        this.age++;
        if (this.age >= this.life || this.y < -20) {
          this.reset();
        }
      }
      draw() {
        const currentOpacity = this.opacity * (1 - this.age / this.life);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 55%, ${currentOpacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const embers = Array.from({ length: 45 }, () => new Ember());
    const animateEmbers = () => {
      ctx.clearRect(0, 0, width, height);
      embers.forEach((e) => {
        e.update();
        e.draw();
      });
      requestAnimationFrame(animateEmbers);
    };
    animateEmbers();
  }

  // ==========================================================================
  // 7. ANIMATED STATS COUNTERS
  // ==========================================================================
  const counters = document.querySelectorAll('.counter');
  let countersDone = false;

  const runCounters = () => {
    if (countersDone) return;
    countersDone = true;
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;
      const easeOut = (t) => t * (2 - t);

      const timer = setInterval(() => {
        frame++;
        const prog = easeOut(frame / totalFrames);
        const current = Math.round(target * prog);
        counter.textContent = current.toLocaleString('en-IN');
        if (frame >= totalFrames) {
          counter.textContent = target.toLocaleString('en-IN');
          clearInterval(timer);
        }
      }, frameDuration);
    });
  };

  const statsSec = document.getElementById('stats');
  if (statsSec && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runCounters();
        obs.unobserve(statsSec);
      }
    }, { threshold: 0.25 });
    obs.observe(statsSec);
  } else {
    runCounters();
  }

  // ==========================================================================
  // 8. SCROLL REVEAL ANIMATIONS
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach((el) => revealObs.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // ==========================================================================
  // 9. BEAST WORKOUT ROUTINE GENERATOR & REST TIMER
  // ==========================================================================
  const routineGoal = document.getElementById('routine-goal');
  const routineDays = document.getElementById('routine-days');
  const routineLevel = document.getElementById('routine-level');
  const routineDaysGrid = document.getElementById('routine-days-grid');
  const routineTitle = document.getElementById('routine-title');
  const routineDesc = document.getElementById('routine-desc');

  const routinesDatabase = {
    hypertrophy: {
      name: 'Titan Hypertrophy Protocol',
      desc: 'Engineered for maximal muscle volume, myofibrillar hypertrophy, and mechanical tension.',
      days: {
        3: [
          {
            day: 'Day 1: Full Body Power A', exercises: [
              { name: 'Barbell Incline Press', target: 'Upper Chest & Front Delts', scheme: '4 x 8-10' },
              { name: 'Romanian Deadlift (RDL)', target: 'Hamstrings & Posterior Chain', scheme: '4 x 8-10' },
              { name: 'Chest-Supported T-Bar Row', target: 'Lats & Rhomboids', scheme: '4 x 10-12' },
              { name: 'Walking Barbell Lunges', target: 'Quads & Glutes', scheme: '3 x 12 reps/leg' },
              { name: 'Cable Bicep Curls + Skullcrushers', target: 'Arms Superset', scheme: '3 x 12-15' }
            ]
          },
          {
            day: 'Day 2: Full Body Power B', exercises: [
              { name: 'Safety Bar Squat', target: 'Quads & Core Bracing', scheme: '4 x 6-8' },
              { name: 'Flat Dumbbell Press', target: 'Pectorals', scheme: '4 x 8-10' },
              { name: 'Wide Grip Lat Pulldown', target: 'Lats & V-Taper', scheme: '4 x 10-12' },
              { name: 'Dumbbell Lateral Raises', target: 'Side Delts (3D Shoulders)', scheme: '4 x 15-20' },
              { name: 'Standing Calf Raises', target: 'Gastrocnemius', scheme: '4 x 15-20' }
            ]
          },
          {
            day: 'Day 3: Hypertrophy Pump Finish', exercises: [
              { name: 'Barbell Hip Thrust', target: 'Glute Hypertrophy', scheme: '4 x 10-12' },
              { name: 'Standing Overhead Barbell Press', target: 'Shoulders & Triceps', scheme: '4 x 8-10' },
              { name: 'Seated Cable Row', target: 'Mid-Back Thickness', scheme: '4 x 10-12' },
              { name: 'Incline Dumbbell Curl', target: 'Biceps Long Head', scheme: '3 x 12-15' },
              { name: 'Hanging Leg Raises', target: 'Lower Abs & Core', scheme: '3 x 15' }
            ]
          }
        ],
        4: [
          {
            day: 'Day 1: Upper Beast Alpha', exercises: [
              { name: 'Incline Barbell Bench Press', target: 'Clavicular Head', scheme: '4 x 6-8' },
              { name: 'Weighted Pull-Ups', target: 'Lats & Upper Back', scheme: '4 x 6-8' },
              { name: 'Standing DB Shoulder Press', target: 'Deltoids', scheme: '3 x 8-10' },
              { name: 'Chest-Supported Dumbbell Row', target: 'Upper Lats', scheme: '4 x 10-12' },
              { name: 'Overhead Cable Triceps Extension', target: 'Triceps Long Head', scheme: '3 x 12-15' }
            ]
          },
          {
            day: 'Day 2: Lower Quad Focus', exercises: [
              { name: 'High Bar Olympic Back Squats', target: 'Quads', scheme: '4 x 6-8' },
              { name: '45-Degree Leg Press (Deep)', target: 'Quads & Glutes', scheme: '4 x 10-12' },
              { name: 'Lying Leg Curls', target: 'Hamstrings', scheme: '4 x 12-15' },
              { name: 'Bulgarian Split Squats', target: 'Glute-Quad Tie-In', scheme: '3 x 10/leg' },
              { name: 'Seated Calf Raises', target: 'Soleus', scheme: '4 x 15' }
            ]
          },
          {
            day: 'Day 3: Upper Beast Beta', exercises: [
              { name: 'Flat Barbell Bench Press', target: 'Sternal Pectorals', scheme: '4 x 8-10' },
              { name: 'Barbell Bent Over Row', target: 'Back Thickness', scheme: '4 x 8-10' },
              { name: 'Cable Lateral Raises (Behind Back)', target: 'Side Delts', scheme: '4 x 12-15' },
              { name: 'Pec Deck Flyes (Pause at Peak)', target: 'Inner Chest', scheme: '3 x 15' },
              { name: 'Incline Dumbbell Hammer Curls', target: 'Brachialis & Forearms', scheme: '3 x 12' }
            ]
          },
          {
            day: 'Day 4: Lower Posterior Chain', exercises: [
              { name: 'Conventional Deadlift / Trap Bar', target: 'Whole Posterior', scheme: '4 x 5' },
              { name: 'Barbell Romanian Deadlift', target: 'Hamstrings & Glutes', scheme: '4 x 8-10' },
              { name: 'Leg Extensions (3s Negatives)', target: 'Quad Teardrop', scheme: '4 x 12-15' },
              { name: 'Glute Ham Developer (GHD)', target: 'Lower Back & Glutes', scheme: '3 x 10' },
              { name: 'Cable Woodchoppers', target: 'Obliques & Core', scheme: '3 x 15/side' }
            ]
          }
        ],
        5: [
          {
            day: 'Day 1: Chest & Triceps (Heavy Push)', exercises: [
              { name: 'Barbell Flat Bench Press', target: 'Chest Core', scheme: '4 x 6-8' },
              { name: 'Incline Dumbbell Press', target: 'Upper Chest', scheme: '4 x 8-10' },
              { name: 'Cable Low-to-High Flyes', target: 'Upper Chest Fibers', scheme: '3 x 12-15' },
              { name: 'Weighted Dips', target: 'Lower Chest & Triceps', scheme: '3 x 8-10' },
              { name: 'Rope Triceps Pushdowns', target: 'Triceps Lateral Head', scheme: '4 x 12-15' }
            ]
          },
          {
            day: 'Day 2: Back & Biceps (Heavy Pull)', exercises: [
              { name: 'Barbell Deadlifts (From Floor)', target: 'Complete Posterior', scheme: '4 x 5' },
              { name: 'Chest Supported T-Bar Row', target: 'Rhomboids & Mid-Back', scheme: '4 x 8-10' },
              { name: 'Neutral Grip Lat Pulldown', target: 'Lats & Biceps', scheme: '4 x 10-12' },
              { name: 'Barbell Spider Curls', target: 'Biceps Peak', scheme: '3 x 10-12' },
              { name: 'Face Pulls with External Rotation', target: 'Rear Delts & Rotator', scheme: '4 x 15' }
            ]
          },
          {
            day: 'Day 3: Quads & Calves (Leg Destruction)', exercises: [
              { name: 'Barbell Back Squats', target: 'Quads & Glutes', scheme: '5 x 6-8' },
              { name: 'Hack Squats (Narrow Stance)', target: 'Outer Quad Sweep', scheme: '4 x 10-12' },
              { name: 'Leg Extensions (Drop set on final)', target: 'Vastus Medialis', scheme: '4 x 12-15' },
              { name: 'Standing Calf Raises', target: 'Calves', scheme: '5 x 15-20' },
              { name: 'Hanging Toes-To-Bar', target: 'Core Abs', scheme: '4 x 12-15' }
            ]
          },
          {
            day: 'Day 4: Boulder Shoulders & Traps', exercises: [
              { name: 'Seated Dumbbell Shoulder Press', target: 'Anterior & Lateral Delts', scheme: '4 x 8-10' },
              { name: 'Leaning Cable Lateral Raise', target: 'Lateral Deltoids', scheme: '5 x 12-15' },
              { name: 'Reverse Pec Deck Flyes', target: 'Rear Deltoids', scheme: '4 x 15' },
              { name: 'Barbell Shrugs (2s Pause Top)', target: 'Upper Trapezius', scheme: '4 x 10-12' },
              { name: 'Farmer Walk with Heavy DBs', target: 'Grip & Traps', scheme: '3 x 50 meters' }
            ]
          },
          {
            day: 'Day 5: Hamstrings & Arm Specialization', exercises: [
              { name: 'Barbell Romanian Deadlift (RDL)', target: 'Hamstrings & Glutes', scheme: '4 x 8-10' },
              { name: 'Seated Leg Curls', target: 'Hamstrings Peak', scheme: '4 x 10-12' },
              { name: 'EZ-Bar Preacher Curls', target: 'Biceps Short Head', scheme: '4 x 10-12' },
              { name: 'Close Grip Bench Press', target: 'Triceps Horseshoe', scheme: '4 x 8-10' },
              { name: 'Cable Rope Hammer Curls', target: 'Brachioradialis', scheme: '3 x 15' }
            ]
          }
        ],
        6: [
          {
            day: 'Day 1: Push A (Chest Dominant)', exercises: [
              { name: 'Barbell Flat Bench', target: 'Chest', scheme: '4 x 6-8' },
              { name: 'Incline DB Press', target: 'Upper Chest', scheme: '4 x 8-10' },
              { name: 'Standing Military Press', target: 'Shoulders', scheme: '3 x 8-10' },
              { name: 'Cable Lateral Raises', target: 'Side Delts', scheme: '4 x 15' },
              { name: 'Skull Crushers', target: 'Triceps', scheme: '3 x 10-12' }
            ]
          },
          {
            day: 'Day 2: Pull A (Lat Width)', exercises: [
              { name: 'Weighted Pull-Ups', target: 'Lats', scheme: '4 x 6-8' },
              { name: 'Barbell Bent Over Row', target: 'Mid-Back', scheme: '4 x 8-10' },
              { name: 'Seated Cable Row', target: 'Lower Lats', scheme: '3 x 10-12' },
              { name: 'Face Pulls', target: 'Rear Delts', scheme: '4 x 15' },
              { name: 'Incline DB Curls', target: 'Biceps', scheme: '3 x 12' }
            ]
          },
          {
            day: 'Day 3: Legs A (Quad Focus)', exercises: [
              { name: 'Barbell Back Squat', target: 'Quads', scheme: '4 x 6-8' },
              { name: 'Leg Press (Heavy)', target: 'Quads & Glutes', scheme: '4 x 10-12' },
              { name: 'Lying Leg Curls', target: 'Hamstrings', scheme: '4 x 12' },
              { name: 'Standing Calf Raise', target: 'Calves', scheme: '4 x 15' }
            ]
          },
          {
            day: 'Day 4: Push B (Shoulder Dominant)', exercises: [
              { name: 'Seated Dumbbell OHP', target: 'Delts', scheme: '4 x 8-10' },
              { name: 'Incline Barbell Bench', target: 'Upper Chest', scheme: '4 x 8-10' },
              { name: 'Dips (Weighted)', target: 'Chest & Triceps', scheme: '3 x 8-10' },
              { name: 'Cable Lateral Raise', target: 'Side Delts', scheme: '4 x 15' },
              { name: 'Cable Overhead Triceps Ext', target: 'Triceps', scheme: '4 x 12' }
            ]
          },
          {
            day: 'Day 5: Pull B (Back Thickness)', exercises: [
              { name: 'Rack Pulls / Deadlift', target: 'Whole Back', scheme: '4 x 5' },
              { name: 'T-Bar Row', target: 'Rhomboids', scheme: '4 x 8-10' },
              { name: 'Single Arm DB Row', target: 'Lats', scheme: '3 x 10-12' },
              { name: 'Reverse Flyes', target: 'Rear Delts', scheme: '4 x 15' },
              { name: 'Hammer Curls', target: 'Brachialis', scheme: '4 x 10-12' }
            ]
          },
          {
            day: 'Day 6: Legs B (Posterior Chain)', exercises: [
              { name: 'Romanian Deadlift (RDL)', target: 'Hamstrings', scheme: '4 x 8-10' },
              { name: 'Bulgarian Split Squats', target: 'Glutes & Quads', scheme: '3 x 10/leg' },
              { name: 'Leg Extensions', target: 'Quad Finish', scheme: '4 x 15' },
              { name: 'Seated Calf Raises', target: 'Calves', scheme: '4 x 20' }
            ]
          }
        ]
      }
    },
    shred: {
      name: 'Titan Metabolic Shred & Cut',
      desc: 'High-density resistance training with timed rest intervals to torch stubborn body fat and preserve lean muscle.',
      days: {
        3: [
          {
            day: 'Day 1: Upper Torso Shred', exercises: [
              { name: 'Incline DB Press (SuperSet with Pushups)', target: 'Chest Endurance', scheme: '4 x 12-15' },
              { name: 'Seated Cable Row (30s rest)', target: 'Back Thickness', scheme: '4 x 12-15' },
              { name: 'Kettlebell Clean & Press', target: 'Total Upper Power', scheme: '3 x 12' },
              { name: 'Battle Ropes (Tabata 20s on / 10s off)', target: 'Metabolic Spike', scheme: '8 Rounds' }
            ]
          },
          {
            day: 'Day 2: Lower Torso Shred', exercises: [
              { name: 'Barbell Goblet Squats (Tempo 3-0-1)', target: 'Quads', scheme: '4 x 12-15' },
              { name: 'Dumbbell Walking Lunges', target: 'Glutes & Heart Rate', scheme: '4 x 16 steps' },
              { name: 'Kettlebell Swings (Heavy)', target: 'Posterior & Cardio', scheme: '4 x 20' },
              { name: 'Sled Push (Turf Track)', target: 'Full Body Conditioning', scheme: '4 x 30m' }
            ]
          },
          {
            day: 'Day 3: Full Body Complex Burner', exercises: [
              { name: 'Trap Bar Deadlift', target: 'Posterior & Grip', scheme: '4 x 10-12' },
              { name: 'Dumbbell Renegade Rows', target: 'Core & Upper Back', scheme: '3 x 12' },
              { name: 'Burpee Box Jump Overs', target: 'Plyometric Burn', scheme: '4 x 12' },
              { name: 'Hanging Knee Raises to Twist', target: 'Six Pack Abs', scheme: '4 x 15' }
            ]
          }
        ],
        4: [
          {
            day: 'Day 1: Upper Density Push/Pull', exercises: [
              { name: 'Barbell Bench Press', target: 'Chest', scheme: '4 x 10-12' },
              { name: 'Pull-Ups (Tempo)', target: 'Lats', scheme: '4 x 10' },
              { name: 'Dumbbell Arnold Press', target: 'Shoulders', scheme: '3 x 12-15' },
              { name: 'Assault Bike Interval Sprints', target: 'VO2 Max', scheme: '10 x 20s sprint / 40s rest' }
            ]
          },
          {
            day: 'Day 2: Lower Leg Density', exercises: [
              { name: 'Front Squats', target: 'Quads & Core', scheme: '4 x 8-10' },
              { name: 'Dumbbell RDL', target: 'Hamstrings', scheme: '4 x 12-15' },
              { name: 'Box Jumps', target: 'Explosive Power', scheme: '4 x 10' },
              { name: 'Rowing Machine 500m Intervals', target: 'Calorie Torch', scheme: '4 x 500m' }
            ]
          },
          {
            day: 'Day 3: Upper Hyper-Density', exercises: [
              { name: 'Incline Dumbbell Press', target: 'Upper Chest', scheme: '4 x 12' },
              { name: 'T-Bar Row (Drop Set)', target: 'Lats & Rhomboids', scheme: '4 x 12-15' },
              { name: 'Lateral Raise Giant Set', target: 'Delts Burn', scheme: '3 x 15-15-15' },
              { name: 'SkiErg Machine', target: 'Core & Upper Conditioning', scheme: '5 x 250m' }
            ]
          },
          {
            day: 'Day 4: Savage Functional Leg Day', exercises: [
              { name: 'Barbell Deadlifts', target: 'Posterior Chain', scheme: '4 x 8' },
              { name: 'Bulgarian Split Squats', target: 'Quads/Glutes', scheme: '3 x 12/leg' },
              { name: 'Kettlebell Russian Swings', target: 'Hips & Core', scheme: '4 x 25' },
              { name: 'Prowler Sled Push/Pull', target: 'Anaerobic Threshold', scheme: '5 x 40m' }
            ]
          }
        ],
        5: [
          {
            day: 'Day 1: Push & HIIT', exercises: [
              { name: 'Flat DB Bench Press', target: 'Chest', scheme: '4 x 12' },
              { name: 'Overhead DB Press', target: 'Deltoids', scheme: '4 x 12' },
              { name: 'Dips & Pushups Superset', target: 'Upper Body Finish', scheme: '3 x Max' },
              { name: 'Assault Bike Sprint', target: 'HIIT Spike', scheme: '8 x 30s' }
            ]
          },
          {
            day: 'Day 2: Pull & Core', exercises: [
              { name: 'Deadlifts', target: 'Posterior', scheme: '4 x 8' },
              { name: 'Cable Lat Pulldown', target: 'Lats', scheme: '4 x 12' },
              { name: 'Face Pulls', target: 'Rear Delts', scheme: '4 x 15' },
              { name: 'Ab Wheel Rollouts', target: 'Abs', scheme: '4 x 12' }
            ]
          },
          {
            day: 'Day 3: Quads & Plyometrics', exercises: [
              { name: 'Back Squat', target: 'Quads', scheme: '4 x 10' },
              { name: 'Leg Press', target: 'Legs', scheme: '4 x 15' },
              { name: 'Jump Squats', target: 'Cardio Plyo', scheme: '4 x 15' },
              { name: 'Rowing Machine', target: 'Cardio', scheme: '2000m timed' }
            ]
          },
          {
            day: 'Day 4: Shoulders & Arms Metabolic', exercises: [
              { name: 'Standing Barbell Press', target: 'Shoulders', scheme: '4 x 10' },
              { name: 'Lateral Raises', target: 'Side Delts', scheme: '4 x 20' },
              { name: 'Hammer Curls + Triceps Pushdowns', target: 'Arms', scheme: '4 x 15' },
              { name: 'Battle Rope Waves', target: 'Metabolic', scheme: '5 x 45s' }
            ]
          },
          {
            day: 'Day 5: Posterior & Sled Blast', exercises: [
              { name: 'RDL with Dumbbells', target: 'Hamstrings', scheme: '4 x 12' },
              { name: 'Walking Lunges', target: 'Glutes', scheme: '4 x 20 steps' },
              { name: 'Kettlebell Swings', target: 'Metabolic', scheme: '4 x 25' },
              { name: 'Heavy Sled Sprints', target: 'Leg Endurance', scheme: '6 x 30m' }
            ]
          }
        ],
        6: [
          {
            day: 'Day 1: Push Burn', exercises: [
              { name: 'Incline Bench Press', target: 'Chest', scheme: '4 x 12' },
              { name: 'Overhead Press', target: 'Delts', scheme: '4 x 12' },
              { name: 'Cable Crossover', target: 'Chest Isolation', scheme: '3 x 15' },
              { name: 'Sprint Intervals', target: 'HIIT', scheme: '10 x 100m' }
            ]
          },
          {
            day: 'Day 2: Pull Burn', exercises: [
              { name: 'Pull-Ups', target: 'Lats', scheme: '4 x 10' },
              { name: 'Cable Rows', target: 'Back', scheme: '4 x 12' },
              { name: 'Barbell Curls', target: 'Biceps', scheme: '4 x 12' },
              { name: 'Rowing Machine Sprints', target: 'Conditioning', scheme: '5 x 300m' }
            ]
          },
          {
            day: 'Day 3: Legs Burn', exercises: [
              { name: 'Front Squats', target: 'Quads', scheme: '4 x 10' },
              { name: 'Leg Press', target: 'Quads', scheme: '4 x 15' },
              { name: 'Lying Leg Curl', target: 'Hamstrings', scheme: '4 x 15' },
              { name: 'Box Jumps', target: 'Plyo', scheme: '4 x 12' }
            ]
          },
          {
            day: 'Day 4: Push Density', exercises: [
              { name: 'Dumbbell Flat Press', target: 'Chest', scheme: '4 x 12' },
              { name: 'Lateral Raises', target: 'Side Delts', scheme: '4 x 18' },
              { name: 'Rope Pushdown', target: 'Triceps', scheme: '4 x 15' },
              { name: 'Battle Ropes', target: 'Conditioning', scheme: '6 x 30s' }
            ]
          },
          {
            day: 'Day 5: Pull Density', exercises: [
              { name: 'T-Bar Rows', target: 'Back', scheme: '4 x 12' },
              { name: 'Lat Pulldowns', target: 'Lats', scheme: '4 x 12' },
              { name: 'Incline Curls', target: 'Biceps', scheme: '4 x 15' },
              { name: 'SkiErg Intervals', target: 'Cardio', scheme: '6 x 200m' }
            ]
          },
          {
            day: 'Day 6: Legs & Core Savage', exercises: [
              { name: 'Romanian Deadlift', target: 'Hamstrings', scheme: '4 x 12' },
              { name: 'Walking Lunges', target: 'Legs', scheme: '4 x 20' },
              { name: 'Hanging Leg Raises', target: 'Abs', scheme: '4 x 15' },
              { name: 'Sled Pushes', target: 'Full Body', scheme: '6 x 40m' }
            ]
          }
        ]
      }
    },
    strength: {
      name: 'Titan Powerlifting & Absolute Strength',
      desc: 'Focused on the Big Three (Squat, Bench, Deadlift) with RPE progression and neuro-muscular force production.',
      days: {
        3: [
          {
            day: 'Day 1: Heavy Squat & Bench Foundation', exercises: [
              { name: 'Low Bar Competition Squat', target: 'Pure Quad & Hip Drive', scheme: '5 x 3 @ 85% 1RM' },
              { name: 'Pause Bench Press (1s Pause)', target: 'Pectoral Drive & Stability', scheme: '5 x 3 @ 85% 1RM' },
              { name: 'Barbell Pendlay Rows', target: 'Upper Back Force', scheme: '4 x 6' },
              { name: 'Ab Wheel Rollouts', target: 'Anti-Extension Core', scheme: '3 x 10' }
            ]
          },
          {
            day: 'Day 2: Heavy Conventional Deadlift', exercises: [
              { name: 'Deadlift (Competition Style)', target: 'Posterior & CNS Drive', scheme: '4 x 3 @ 85% 1RM' },
              { name: 'Close-Grip Bench Press', target: 'Triceps Lockout Strength', scheme: '4 x 6' },
              { name: 'Bulgarian Split Squats (Heavy)', target: 'Unilateral Stability', scheme: '3 x 6/leg' },
              { name: 'Barbell Shrugs (Heavy)', target: 'Trapezius', scheme: '4 x 8' }
            ]
          },
          {
            day: 'Day 3: Volume & Accessories', exercises: [
              { name: 'Box Squats (Speed / Dynamic)', target: 'Rate of Force Development', scheme: '6 x 2 @ 70% 1RM' },
              { name: 'Overhead Strict Barbell Press', target: 'Shoulder Power', scheme: '4 x 5' },
              { name: 'Romanian Deadlift (Slow Negative)', target: 'Hamstrings', scheme: '3 x 6-8' },
              { name: 'Heavy Barbell Curls', target: 'Biceps & Elbow Health', scheme: '3 x 8' }
            ]
          }
        ],
        4: [
          {
            day: 'Day 1: Heavy Squat & Accessories', exercises: [
              { name: 'Competition Back Squat', target: 'Leg Drive', scheme: '5 x 3 @ 85% 1RM' },
              { name: 'Pause Squat (2s in hole)', target: 'Reversal Strength', scheme: '3 x 4 @ 75%' },
              { name: 'Leg Press (Heavy)', target: 'Quad Volume', scheme: '4 x 8' },
              { name: 'Hanging Leg Raises (Weighted)', target: 'Core Bracing', scheme: '4 x 10' }
            ]
          },
          {
            day: 'Day 2: Heavy Bench Press', exercises: [
              { name: 'Competition Bench Press', target: 'Chest & Triceps Drive', scheme: '5 x 3 @ 85% 1RM' },
              { name: 'Larsen Press (Feet up)', target: 'Strict Upper Drive', scheme: '3 x 5' },
              { name: 'Chest Supported Row', target: 'Back Stability', scheme: '4 x 6-8' },
              { name: 'Dumbbell Skullcrushers', target: 'Lockout Strength', scheme: '4 x 8' }
            ]
          },
          {
            day: 'Day 3: Heavy Deadlift Day', exercises: [
              { name: 'Competition Deadlift', target: 'Total Pulling Power', scheme: '4 x 2 @ 88% 1RM' },
              { name: 'Deficit Deadlift (1.5 inch)', target: 'Starting Speed', scheme: '3 x 4 @ 75%' },
              { name: 'Barbell Good Mornings', target: 'Hamstrings & Low Back', scheme: '3 x 8' },
              { name: 'Heavy Farmer Carries', target: 'Grip & Core', scheme: '4 x 40m' }
            ]
          },
          {
            day: 'Day 4: Overhead & Upper Volume', exercises: [
              { name: 'Standing Overhead Strict Press', target: 'Deltoid Force', scheme: '5 x 5 @ 80%' },
              { name: 'Incline Dumbbell Bench', target: 'Upper Chest', scheme: '4 x 6-8' },
              { name: 'Weighted Pull-Ups', target: 'Lats & Grip', scheme: '4 x 5' },
              { name: 'Face Pulls with Heavy Band', target: 'Rotator Cuff', scheme: '4 x 15' }
            ]
          }
        ],
        5: [
          {
            day: 'Day 1: Squat Max Intensity', exercises: [
              { name: 'Competition Squat', target: 'Quads/Hips', scheme: '5 x 3 @ 85%' },
              { name: 'Front Squat', target: 'Core/Quads', scheme: '3 x 4' },
              { name: 'Walking DB Lunges', target: 'Unilateral', scheme: '3 x 8/leg' }
            ]
          },
          {
            day: 'Day 2: Bench Max Intensity', exercises: [
              { name: 'Competition Bench', target: 'Chest', scheme: '5 x 3 @ 85%' },
              { name: 'Pin Press', target: 'Triceps Lockout', scheme: '4 x 4' },
              { name: 'Barbell Row', target: 'Back', scheme: '4 x 6' }
            ]
          },
          {
            day: 'Day 3: Deadlift Max Intensity', exercises: [
              { name: 'Competition Deadlift', target: 'Pull', scheme: '4 x 2 @ 88%' },
              { name: 'Block Pulls', target: 'Lockout', scheme: '3 x 3' },
              { name: 'Hamstring Curls', target: 'Hamstrings', scheme: '4 x 8' }
            ]
          },
          {
            day: 'Day 4: Overhead Press & Shoulders', exercises: [
              { name: 'Strict Barbell Press', target: 'Shoulders', scheme: '5 x 5' },
              { name: 'Dips (Weighted)', target: 'Chest/Triceps', scheme: '4 x 6' },
              { name: 'Lateral Raises', target: 'Side Delts', scheme: '4 x 12' }
            ]
          },
          {
            day: 'Day 5: Full Body Power Accessories', exercises: [
              { name: 'Pause Squats', target: 'Hips', scheme: '4 x 3' },
              { name: 'Close Grip Bench', target: 'Triceps', scheme: '4 x 6' },
              { name: 'Romanian Deadlift', target: 'Hamstrings', scheme: '4 x 6' }
            ]
          }
        ],
        6: [
          { day: 'Day 1: Squat Primary', exercises: [{ name: 'Back Squat', target: 'Quads', scheme: '5 x 3 @ 85%' }, { name: 'Leg Press', target: 'Quads', scheme: '3 x 8' }] },
          { day: 'Day 2: Bench Primary', exercises: [{ name: 'Bench Press', target: 'Chest', scheme: '5 x 3 @ 85%' }, { name: 'Larsen Press', target: 'Chest', scheme: '3 x 5' }] },
          { day: 'Day 3: Deadlift Primary', exercises: [{ name: 'Deadlift', target: 'Posterior', scheme: '4 x 2 @ 88%' }, { name: 'Barbell Rows', target: 'Back', scheme: '4 x 6' }] },
          { day: 'Day 4: Squat Secondary', exercises: [{ name: 'Box Squats', target: 'Speed', scheme: '6 x 2 @ 70%' }, { name: 'Split Squats', target: 'Legs', scheme: '3 x 8' }] },
          { day: 'Day 5: Bench Secondary', exercises: [{ name: 'Spoto Press (1-inch pause)', target: 'Control', scheme: '4 x 4' }, { name: 'Close Grip Bench', target: 'Triceps', scheme: '4 x 6' }] },
          { day: 'Day 6: Deadlift Secondary & OHP', exercises: [{ name: 'Deficit Deadlift', target: 'Starting Speed', scheme: '3 x 3' }, { name: 'Overhead Press', target: 'Shoulders', scheme: '4 x 5' }] }
        ]
      }
    },
    hybrid: {
      name: 'Titan Hybrid Athlete & Combat Conditioning',
      desc: 'Combining raw strength, speed-endurance, functional gymnastics, and combat power.',
      days: {
        3: [
          {
            day: 'Day 1: Strength + Combat Power', exercises: [
              { name: 'Trap Bar Deadlift (Explosive)', target: 'Posterior Chain', scheme: '4 x 5' },
              { name: 'Heavy Bag Striking Combinations', target: 'Rotational Power', scheme: '5 x 3 min rounds' },
              { name: 'Weighted Pull-Ups', target: 'Lats & Grip', scheme: '4 x 6' },
              { name: 'Medicine Ball Slam to Sprawl', target: 'Core & Endurance', scheme: '4 x 15' }
            ]
          },
          {
            day: 'Day 2: Functional Hypertrophy & Agility', exercises: [
              { name: 'Front Squats', target: 'Quads & Bracing', scheme: '4 x 6' },
              { name: 'Kettlebell Overhead Press', target: 'Shoulders & Stability', scheme: '4 x 8/side' },
              { name: 'Plyometric Push-Ups', target: 'Fast Twitch Chest', scheme: '4 x 8' },
              { name: 'Agility Ladder + Cone Drills', target: 'Footwork & Speed', scheme: '6 Sets' }
            ]
          },
          {
            day: 'Day 3: Engine Capacity & Sled Warfare', exercises: [
              { name: 'Barbell Clean & Jerk', target: 'Olympic Power', scheme: '5 x 3' },
              { name: 'Sled Pushes & Rope Pulls', target: 'GPP & Lactate Threshold', scheme: '5 x 40m' },
              { name: 'Dumbbell Farmer Walk (Bodyweight)', target: 'Grip & Traps', scheme: '4 x 50m' },
              { name: 'Turkish Get-Ups', target: 'Shoulder & Core Stability', scheme: '3 x 5/side' }
            ]
          }
        ],
        4: [
          { day: 'Day 1: Explosive Push & Boxing Drills', exercises: [{ name: 'Push Press', target: 'Shoulders', scheme: '4 x 5' }, { name: 'Heavy Bag Boxing Rounds', target: 'Combat Stamina', scheme: '6 x 3 min' }, { name: 'Dips', target: 'Triceps', scheme: '3 x 10' }] },
          { day: 'Day 2: Explosive Pull & Gymnastics', exercises: [{ name: 'Power Cleans', target: 'Full Body', scheme: '5 x 3' }, { name: 'Muscle-Ups / Strict Pull-Ups', target: 'Gymnastics Pull', scheme: '4 x 6' }, { name: 'Kettlebell Snatches', target: 'Hips', scheme: '4 x 12/side' }] },
          { day: 'Day 3: Lower Body Athletic Force', exercises: [{ name: 'Olympic Back Squat', target: 'Quads', scheme: '4 x 6' }, { name: 'Broad Jumps to Sprint', target: 'Speed', scheme: '5 x 20m' }, { name: 'Romanian Deadlifts', target: 'Hamstrings', scheme: '4 x 8' }] },
          { day: 'Day 4: The Savage Metcon Challenge', exercises: [{ name: 'Assault Bike 500 Calorie Relay', target: 'Lactate Threshold', scheme: 'Timed' }, { name: 'Sled Push 100m', target: 'Legs', scheme: '4 Sets' }, { name: 'Burpee Box Jump Overs', target: 'Conditioning', scheme: '5 x 15' }] }
        ],
        5: [
          { day: 'Day 1: Boxing & Upper Strength', exercises: [{ name: 'Overhead Press', target: 'Delts', scheme: '4 x 5' }, { name: 'Heavy Bag Drills', target: 'Combat', scheme: '6 x 3 min' }] },
          { day: 'Day 2: Olympic Weightlifting', exercises: [{ name: 'Snatch & Clean & Jerk', target: 'Total Body', scheme: '5 x 3' }, { name: 'Front Squats', target: 'Quads', scheme: '4 x 5' }] },
          { day: 'Day 3: Combat Conditioning', exercises: [{ name: 'Kettlebell Complexes', target: 'Endurance', scheme: '5 Rounds' }, { name: 'Battle Ropes', target: 'Upper Body', scheme: '8 x 30s' }] },
          { day: 'Day 4: Posterior Power', exercises: [{ name: 'Trap Bar Deadlift', target: 'Posterior', scheme: '5 x 4' }, { name: 'Plyometric Lunges', target: 'Speed', scheme: '4 x 10/leg' }] },
          { day: 'Day 5: Functional Obstacle Turf', exercises: [{ name: 'Sled Pushes & Tire Flips', target: 'Pure Grit', scheme: '6 Sets' }, { name: 'Rope Climbs', target: 'Upper Body', scheme: '5 Climbs' }] }
        ],
        6: [
          { day: 'Day 1: Upper Power', exercises: [{ name: 'Push Press', target: 'Shoulders', scheme: '4 x 5' }, { name: 'Weighted Pull-Ups', target: 'Back', scheme: '4 x 5' }] },
          { day: 'Day 2: Boxing Rounds', exercises: [{ name: 'Boxing Pad Work & Sparring', target: 'Combat', scheme: '8 x 3 min' }] },
          { day: 'Day 3: Lower Power', exercises: [{ name: 'Back Squats', target: 'Quads', scheme: '5 x 5' }, { name: 'Box Jumps', target: 'Speed', scheme: '5 x 5' }] },
          { day: 'Day 4: Gymnastics & Core', exercises: [{ name: 'Ring Muscle Ups', target: 'Upper', scheme: '4 x 5' }, { name: 'Toes-To-Bar', target: 'Core', scheme: '4 x 12' }] },
          { day: 'Day 5: Olympic Lifting', exercises: [{ name: 'Power Cleans', target: 'Full Body', scheme: '5 x 3' }, { name: 'Deadlift', target: 'Posterior', scheme: '4 x 5' }] },
          { day: 'Day 6: Savage Engine', exercises: [{ name: 'Murph / Hero Metcon Style', target: 'Endurance', scheme: 'Timed Challenge' }] }
        ]
      }
    }
  };

  const renderRoutine = () => {
    if (!routineGoal || !routineDays || !routineDaysGrid) return;
    const goalVal = routineGoal.value;
    const daysVal = parseInt(routineDays.value, 10);
    const routineData = routinesDatabase[goalVal];

    if (!routineData) return;
    if (routineTitle) routineTitle.textContent = routineData.name;
    if (routineDesc) routineDesc.textContent = routineData.desc;

    const daysList = routineData.days[daysVal] || routineData.days[4];
    routineDaysGrid.innerHTML = '';

    daysList.forEach((d) => {
      const card = document.createElement('div');
      card.className = 'routine-day-card';
      let exHtml = '';
      d.exercises.forEach((ex) => {
        exHtml += `
          <div class="exercise-item">
            <div class="exercise-info">
              <span class="exercise-name">${ex.name}</span>
              <span class="exercise-target">${ex.target}</span>
            </div>
            <span class="exercise-scheme">${ex.scheme}</span>
          </div>
        `;
      });

      card.innerHTML = `
        <span class="day-badge">${d.day.split(':')[0]}</span>
        <h4 class="day-title">${d.day.includes(':') ? d.day.split(':')[1] : d.day}</h4>
        <div class="exercise-list">${exHtml}</div>
      `;
      routineDaysGrid.appendChild(card);
    });
  };

  if (routineGoal && routineDays) {
    routineGoal.addEventListener('change', renderRoutine);
    routineDays.addEventListener('change', renderRoutine);
    if (routineLevel) routineLevel.addEventListener('change', renderRoutine);
    renderRoutine();
  }

  // Rest Timer Logic
  const timerDigits = document.getElementById('timer-digits');
  const timerPills = document.querySelectorAll('.timer-pill');
  let restInterval = null;
  let remainingSeconds = 60;

  const updateTimerDisplay = (sec) => {
    if (!timerDigits) return;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    timerDigits.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startRestTimer = (seconds) => {
    if (restInterval) clearInterval(restInterval);
    remainingSeconds = seconds;
    updateTimerDisplay(remainingSeconds);

    restInterval = setInterval(() => {
      remainingSeconds--;
      updateTimerDisplay(remainingSeconds);
      if (remainingSeconds <= 0) {
        clearInterval(restInterval);
        playTimerChime();
        timerDigits.textContent = 'REST DONE!';
        setTimeout(() => updateTimerDisplay(60), 2000);
      }
    }, 1000);
  };

  timerPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      timerPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      const sec = parseInt(pill.getAttribute('data-seconds'), 10);
      startRestTimer(sec);
    });
  });

  // Copy routine button
  const copyRoutineBtn = document.getElementById('copy-routine-btn');
  if (copyRoutineBtn) {
    copyRoutineBtn.addEventListener('click', () => {
      const routineName = routineTitle ? routineTitle.textContent : 'Bold Living Routine';
      let routineText = `${routineName} - BOLD LIVING GYM CENTER\n\n`;
      const dayCards = document.querySelectorAll('.routine-day-card');
      dayCards.forEach((c) => {
        const title = c.querySelector('.day-title').textContent.trim();
        routineText += `[${title}]\n`;
        const items = c.querySelectorAll('.exercise-item');
        items.forEach((item) => {
          const name = item.querySelector('.exercise-name').textContent.trim();
          const scheme = item.querySelector('.exercise-scheme').textContent.trim();
          routineText += ` • ${name} (${scheme})\n`;
        });
        routineText += '\n';
      });
      navigator.clipboard.writeText(routineText).then(() => {
        const originalText = copyRoutineBtn.textContent;
        copyRoutineBtn.textContent = '✓ Copied to Clipboard!';
        setTimeout(() => { copyRoutineBtn.textContent = originalText; }, 2000);
      });
    });
  }

  // ==========================================================================
  // 10. PROGRAMS CATEGORY FILTERING
  // ==========================================================================
  const programFilterBtns = document.querySelectorAll('.filter-btn[data-program-cat]');
  const programCards = document.querySelectorAll('.program-card');

  programFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      programFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-program-cat');

      programCards.forEach((card) => {
        const cardCat = card.getAttribute('data-cat');
        if (cat === 'all' || cardCat === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // 11. DUAL FITNESS CALCULATORS (BMI/TDEE & 1RM)
  // ==========================================================================
  const calcTabs = document.querySelectorAll('.calc-tab-btn');
  const bmiCalculator = document.getElementById('bmi-calculator-wrapper');
  const oneRmCalculator = document.getElementById('onerm-calculator-wrapper');

  calcTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      calcTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-calc-tab');
      if (target === 'bmi') {
        if (bmiCalculator) bmiCalculator.style.display = 'block';
        if (oneRmCalculator) oneRmCalculator.style.display = 'none';
      } else {
        if (bmiCalculator) bmiCalculator.style.display = 'none';
        if (oneRmCalculator) oneRmCalculator.style.display = 'block';
      }
    });
  });

  // BMI & TDEE Calculation
  const calcWeight = document.getElementById('calc-weight');
  const calcHeight = document.getElementById('calc-height');
  const calcAge = document.getElementById('calc-age');
  const calcGender = document.getElementById('calc-gender');
  const calcActivity = document.getElementById('calc-activity');
  const calcGoal = document.getElementById('calc-goal');

  const bmiScoreNum = document.getElementById('bmi-score-number');
  const bmiCategoryBadge = document.getElementById('bmi-category-badge');
  const dailyCaloriesNum = document.getElementById('daily-calories-num');
  const proteinTargetNum = document.getElementById('protein-target-num');
  const carbsTargetNum = document.getElementById('carbs-target-num');
  const fatsTargetNum = document.getElementById('fats-target-num');
  const gaugeNeedle = document.getElementById('gauge-needle');

  const computeBmiAndMacros = () => {
    if (!calcWeight || !calcHeight) return;
    const w = parseFloat(calcWeight.value) || 75;
    const h = parseFloat(calcHeight.value) || 178;
    const age = parseInt(calcAge.value, 10) || 26;
    const gender = calcGender ? calcGender.value : 'male';
    const activityMult = parseFloat(calcActivity ? calcActivity.value : 1.55);
    const goalMod = parseFloat(calcGoal ? calcGoal.value : 0);

    // BMI
    const hMeters = h / 100;
    const bmi = w / (hMeters * hMeters);
    if (bmiScoreNum) bmiScoreNum.textContent = bmi.toFixed(1);

    // Gauge Needle (Angle between -90deg and +90deg)
    // Range: 15 (min) to 40 (max)
    let angle = ((bmi - 15) / (40 - 15)) * 180 - 90;
    angle = Math.max(-90, Math.min(90, angle));
    if (gaugeNeedle) {
      gaugeNeedle.style.transform = `rotate(${angle}deg)`;
    }

    // Category
    let category = 'Normal Weight';
    let catColor = '#00e676';
    if (bmi < 18.5) {
      category = 'Underweight';
      catColor = '#00f0ff';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = 'Normal / Athletic';
      catColor = '#00e676';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight / Bulking';
      catColor = '#ffb703';
    } else {
      category = 'Heavy Beast / Obese';
      catColor = '#ff3d00';
    }

    if (bmiCategoryBadge) {
      bmiCategoryBadge.textContent = category;
      bmiCategoryBadge.style.background = catColor;
      bmiCategoryBadge.style.color = '#0b0b0f';
    }

    // BMR (Mifflin-St Jeor)
    let bmr = 10 * w + 6.25 * h - 5 * age;
    if (gender === 'male') bmr += 5;
    else bmr -= 161;

    // TDEE + Goal
    const tdee = Math.round(bmr * activityMult + goalMod);
    if (dailyCaloriesNum) dailyCaloriesNum.textContent = tdee.toLocaleString('en-IN');

    // Macros: Protein 2.2g/kg, Fat 25% of calories, Rest Carbs
    const proteinGrams = Math.round(w * 2.2);
    const proteinCals = proteinGrams * 4;
    const fatCals = tdee * 0.25;
    const fatGrams = Math.round(fatCals / 9);
    const carbsCals = Math.max(0, tdee - proteinCals - fatCals);
    const carbsGrams = Math.round(carbsCals / 4);

    if (proteinTargetNum) proteinTargetNum.textContent = `${proteinGrams}g`;
    if (fatsTargetNum) fatsTargetNum.textContent = `${fatGrams}g`;
    if (carbsTargetNum) carbsTargetNum.textContent = `${carbsGrams}g`;
  };

  [calcWeight, calcHeight, calcAge, calcGender, calcActivity, calcGoal].forEach((input) => {
    if (input) input.addEventListener('input', computeBmiAndMacros);
  });
  computeBmiAndMacros();

  // 1-Rep Max (1RM) Calculator
  const onermWeight = document.getElementById('onerm-weight');
  const onermReps = document.getElementById('onerm-reps');
  const onermResult = document.getElementById('onerm-result-num');
  const onermTableBody = document.getElementById('onerm-table-body');

  const compute1Rm = () => {
    if (!onermWeight || !onermReps) return;
    const weight = parseFloat(onermWeight.value) || 100;
    const reps = parseInt(onermReps.value, 10) || 5;

    // Epley Formula: 1RM = Weight * (1 + Reps / 30)
    // Brzycki Formula: 1RM = Weight / (1.0278 - 0.0278 * Reps)
    let oneRm = reps === 1 ? weight : Math.round(weight * (1 + reps / 30));
    if (onermResult) onermResult.textContent = `${oneRm} kg`;

    if (onermTableBody) {
      const percentages = [
        { pct: 95, repsEstimate: '1 - 2 reps', purpose: 'Absolute Max Strength' },
        { pct: 90, repsEstimate: '3 - 4 reps', purpose: 'Heavy Triples / CNS Drive' },
        { pct: 85, repsEstimate: '5 - 6 reps', purpose: 'Strength & Power Zone' },
        { pct: 80, repsEstimate: '7 - 8 reps', purpose: 'Functional Hypertrophy' },
        { pct: 75, repsEstimate: '9 - 10 reps', purpose: 'Volume & Muscle Density' },
        { pct: 70, repsEstimate: '11 - 12 reps', purpose: 'Metabolic Pump & Endurance' }
      ];

      onermTableBody.innerHTML = '';
      percentages.forEach((row) => {
        const tr = document.createElement('tr');
        const calculatedWeight = Math.round((oneRm * row.pct) / 100);
        tr.innerHTML = `
          <td><strong>${row.pct}%</strong></td>
          <td><span style="color: var(--accent-primary); font-weight: 700;">${calculatedWeight} kg</span></td>
          <td>${row.repsEstimate}</td>
          <td>${row.purpose}</td>
        `;
        onermTableBody.appendChild(tr);
      });
    }
  };

  if (onermWeight && onermReps) {
    onermWeight.addEventListener('input', compute1Rm);
    onermReps.addEventListener('input', compute1Rm);
    compute1Rm();
  }

  // ==========================================================================
  // 12. WEEKLY CLASS TIMETABLE & LIVE SLOT BOOKING
  // ==========================================================================
  const dayTabPills = document.querySelectorAll('.day-tab-pill');
  const scheduleCards = document.querySelectorAll('.schedule-card');

  dayTabPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      dayTabPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      const selectedDay = pill.getAttribute('data-day');

      scheduleCards.forEach((card) => {
        const days = card.getAttribute('data-days') || '';
        if (days.includes(selectedDay)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Slot booking modal triggers
  const bookSlotButtons = document.querySelectorAll('.book-slot-btn');
  const slotModal = document.getElementById('booking-modal');
  const slotModalTitle = document.getElementById('slot-modal-title');
  const slotModalTime = document.getElementById('slot-modal-time');

  bookSlotButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-class-name') || 'Beast Training Class';
      const time = btn.getAttribute('data-class-time') || '06:00 AM';
      if (slotModalTitle) slotModalTitle.textContent = title;
      if (slotModalTime) slotModalTime.textContent = time;
      if (slotModal) slotModal.classList.add('open');
    });
  });

  // ==========================================================================
  // 13. BEFORE & AFTER TRANSFORMATION COMPARISON SLIDER
  // ==========================================================================
  const baContainer = document.querySelector('.before-after-container');
  const baAfter = document.querySelector('.ba-after');
  const baHandle = document.querySelector('.ba-slider-handle');
  const baRange = document.querySelector('.ba-range-input');

  if (baRange && baAfter && baHandle) {
    const updateSlider = (val) => {
      baAfter.style.width = `${val}%`;
      baHandle.style.left = `${val}%`;
    };

    baRange.addEventListener('input', (e) => {
      updateSlider(e.target.value);
    });

    // Touch & Mouse direct support
    let isDragging = false;
    const moveSlider = (clientX) => {
      const rect = baContainer.getBoundingClientRect();
      let percent = ((clientX - rect.left) / rect.width) * 100;
      percent = Math.max(0, Math.min(100, percent));
      baRange.value = percent;
      updateSlider(percent);
    };

    if (baContainer) {
      baContainer.addEventListener('mousedown', (e) => { isDragging = true; moveSlider(e.clientX); });
      window.addEventListener('mouseup', () => { isDragging = false; });
      window.addEventListener('mousemove', (e) => { if (isDragging) moveSlider(e.clientX); });
      baContainer.addEventListener('touchstart', (e) => { isDragging = true; moveSlider(e.touches[0].clientX); });
      window.addEventListener('touchend', () => { isDragging = false; });
      window.addEventListener('touchmove', (e) => { if (isDragging) moveSlider(e.touches[0].clientX); });
    }
  }

  // ==========================================================================
  // 14. PRICING BILLING CYCLE TOGGLE (Monthly / Quarterly / Yearly)
  // ==========================================================================
  const pricingToggle = document.getElementById('billing-toggle');
  const monthlyLabel = document.getElementById('label-monthly');
  const yearlyLabel = document.getElementById('label-yearly');
  const priceElements = document.querySelectorAll('.price-amount[data-monthly]');
  const periodElements = document.querySelectorAll('.price-period');

  let isYearly = false;

  const updatePricing = () => {
    isYearly = !isYearly;
    if (pricingToggle) pricingToggle.classList.toggle('yearly', isYearly);
    if (monthlyLabel) monthlyLabel.classList.toggle('active', !isYearly);
    if (yearlyLabel) yearlyLabel.classList.toggle('active', isYearly);

    priceElements.forEach((el) => {
      el.textContent = '0';
    });

    periodElements.forEach((el) => {
      el.textContent = '/ 100% Free Forever';
    });
  };

  if (pricingToggle) pricingToggle.addEventListener('click', updatePricing);
  if (monthlyLabel) monthlyLabel.addEventListener('click', () => { if (isYearly) updatePricing(); });
  if (yearlyLabel) yearlyLabel.addEventListener('click', () => { if (!isYearly) updatePricing(); });

  // ==========================================================================
  // 15. 100% FREE DIGITAL PASS GENERATOR (LEAD FORM)
  // ==========================================================================
  const leadForm = document.getElementById('vip-trial-form');
  const passModal = document.getElementById('vip-pass-modal');
  const passHolderName = document.getElementById('pass-holder-name');
  const passIdDisplay = document.getElementById('pass-id-display');
  const passGoalDisplay = document.getElementById('pass-goal-display');
  const passPhoneDisplay = document.getElementById('pass-phone-display');

  const passTabs = document.querySelectorAll('.pass-tab-btn');
  const passClaimBox = document.getElementById('pass-claim-box');
  const passVerifyBox = document.getElementById('pass-verify-box');

  passTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      passTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const action = tab.getAttribute('data-pass-tab');
      if (action === 'claim') {
        if (passClaimBox) passClaimBox.style.display = 'block';
        if (passVerifyBox) passVerifyBox.style.display = 'none';
      } else {
        if (passClaimBox) passClaimBox.style.display = 'none';
        if (passVerifyBox) passVerifyBox.style.display = 'block';
      }
    });
  });

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('lead-name').value || 'Bold Living Athlete';
      const phone = document.getElementById('lead-phone').value || '+91 89553 66977';
      const goal = document.getElementById('lead-goal').value || 'Muscle Building & Hypertrophy';
      const customIdInput = document.getElementById('lead-custom-pass-id');

      // Use custom Pass ID if provided, otherwise auto-generate BLG-XXXX-FREE
      let passId = (customIdInput && customIdInput.value.trim())
        ? customIdInput.value.trim().toUpperCase()
        : ('BLG-' + Math.floor(1000 + Math.random() * 9000) + '-FREE');

      if (!passId.includes('FREE')) passId += '-FREE';

      // Save pass in localStorage for verification lookup
      try {
        const saved = JSON.parse(localStorage.getItem('bold_living_passes') || '{}');
        saved[passId] = { name, phone, goal, timestamp: Date.now() };
        localStorage.setItem('bold_living_passes', JSON.stringify(saved));
      } catch (err) { }

      if (passHolderName) passHolderName.textContent = name;
      if (passIdDisplay) passIdDisplay.textContent = passId;
      if (passGoalDisplay) passGoalDisplay.textContent = `Goal: ${goal}`;
      if (passPhoneDisplay) passPhoneDisplay.textContent = `Registered Phone: ${phone}`;

      const passStatusBadge = document.getElementById('pass-status-badge');
      if (passStatusBadge) {
        passStatusBadge.textContent = '100% FREE PASS CONFIRMED';
        passStatusBadge.style.background = 'rgba(0, 230, 118, 0.15)';
        passStatusBadge.style.color = '#00e676';
      }

      // Open Modal
      if (passModal) passModal.classList.add('open');
      leadForm.reset();
    });
  }

  // Pass ID Verification Form
  const verifyPassForm = document.getElementById('verify-pass-form');
  const verifyPassInput = document.getElementById('verify-pass-input');

  if (verifyPassForm && verifyPassInput) {
    verifyPassForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchId = verifyPassInput.value.trim().toUpperCase();
      if (!searchId) return;

      let name = 'Bold Living Member';
      let phone = '+91 89553 66977';
      let goal = '100% Free All-Access Pass';

      try {
        const saved = JSON.parse(localStorage.getItem('bold_living_passes') || '{}');
        if (saved[searchId]) {
          name = saved[searchId].name || name;
          phone = saved[searchId].phone || phone;
          goal = saved[searchId].goal || goal;
        }
      } catch (err) { }

      if (passHolderName) passHolderName.textContent = name;
      if (passIdDisplay) passIdDisplay.textContent = searchId;
      if (passGoalDisplay) passGoalDisplay.textContent = `Goal: ${goal}`;
      if (passPhoneDisplay) passPhoneDisplay.textContent = `Registered Phone: ${phone}`;

      const passStatusBadge = document.getElementById('pass-status-badge');
      if (passStatusBadge) {
        passStatusBadge.textContent = 'FREE PASS VERIFIED • ACTIVE MEMBER';
        passStatusBadge.style.background = 'rgba(0, 230, 118, 0.25)';
        passStatusBadge.style.color = '#00e676';
      }

      if (passModal) passModal.classList.add('open');
      verifyPassForm.reset();
    });
  }

  // Share to WhatsApp Button
  const shareWaBtn = document.getElementById('share-pass-wa-btn');
  if (shareWaBtn) {
    shareWaBtn.addEventListener('click', () => {
      const passId = passIdDisplay ? passIdDisplay.textContent : 'BLG-FREE';
      const holder = passHolderName ? passHolderName.textContent : 'Athlete';
      const text = `Hey Bold Living Gym Center! My 100% Free Gym Pass is confirmed!\nPass ID: ${passId}\nHolder: ${holder}\nExcited to start my free workout!`;
      const url = `https://wa.me/918955366977?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
  }

  // ==========================================================================
  // 16. MODAL CLOSING LOGIC
  // ==========================================================================
  const modalCloseButtons = document.querySelectorAll('.modal-close-btn');
  const allModals = document.querySelectorAll('.modal-backdrop');

  modalCloseButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      allModals.forEach((m) => m.classList.remove('open'));
    });
  });

  allModals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach((m) => m.classList.remove('open'));
    }
  });

  // ==========================================================================
  // 17. FAQ ACCORDION
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach((f) => f.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // ==========================================================================
  // 18. FACILITY GALLERY FILTER
  // ==========================================================================
  const facilityFilterBtns = document.querySelectorAll('.filter-btn[data-facility-cat]');
  const facilityCards = document.querySelectorAll('.facility-card');

  facilityFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      facilityFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-facility-cat');

      facilityCards.forEach((card) => {
        const cardCat = card.getAttribute('data-fcat');
        if (cat === 'all' || cardCat === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // 19. 100% FREE GYM STEPS GUIDE (TABS, CHECKLIST, COPY & DOWNLOAD)
  // ==========================================================================

  // Toast Notification Helper
  const showStepsToast = (msg) => {
    let toast = document.getElementById('steps-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'steps-toast';
      toast.className = 'steps-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>🔥</span> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  // 1. Guide Tab Switcher
  const guideTabBtns = document.querySelectorAll('.guide-tab-btn');
  const guideTabPanels = document.querySelectorAll('.guide-tab-panel');

  guideTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-guide-tab');
      guideTabBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      guideTabPanels.forEach((panel) => {
        panel.classList.remove('active');
      });

      const activePanel = document.getElementById(`tab-content-${targetTab}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  // 2. Interactive Daily Checklist
  const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  const checklistProgressBar = document.getElementById('checklist-progress-bar');
  const checklistProgressText = document.getElementById('checklist-progress-text');
  const checklistResetBtn = document.getElementById('checklist-reset-btn');

  const updateChecklistProgress = () => {
    if (!checklistItems.length) return;
    const total = checklistItems.length;
    let checkedCount = 0;
    const savedStates = {};

    checklistItems.forEach((cb, idx) => {
      const parent = cb.closest('.checklist-item');
      if (cb.checked) {
        checkedCount++;
        if (parent) parent.classList.add('checked');
      } else {
        if (parent) parent.classList.remove('checked');
      }
      savedStates[idx] = cb.checked;
    });

    const percent = Math.round((checkedCount / total) * 100);
    if (checklistProgressBar) checklistProgressBar.style.width = `${percent}%`;
    if (checklistProgressText) {
      if (percent === 100) {
        checklistProgressText.textContent = `100% Completed! 🏆 Beast Mode Complete!`;
      } else {
        checklistProgressText.textContent = `${percent}% Completed (${checkedCount}/${total})`;
      }
    }

    try {
      localStorage.setItem('boldliving_gym_checklist', JSON.stringify(savedStates));
    } catch (e) { }
  };

  // Restore saved state from localStorage
  try {
    const saved = JSON.parse(localStorage.getItem('boldliving_gym_checklist') || '{}');
    checklistItems.forEach((cb, idx) => {
      if (saved[idx]) cb.checked = true;
    });
  } catch (e) { }
  updateChecklistProgress();

  checklistItems.forEach((cb) => {
    cb.addEventListener('change', updateChecklistProgress);
    const parent = cb.closest('.checklist-item');
    if (parent) {
      parent.addEventListener('click', (e) => {
        if (e.target !== cb) {
          cb.checked = !cb.checked;
          updateChecklistProgress();
        }
      });
    }
  });

  if (checklistResetBtn) {
    checklistResetBtn.addEventListener('click', () => {
      checklistItems.forEach((cb) => { cb.checked = false; });
      updateChecklistProgress();
      showStepsToast('Daily Checklist reset ho gayi hai!');
    });
  }

  // 3. Complete Guide Formatted Text (For Copy & Download)
  const getGuideFormattedText = () => {
    return `===============================================================
BOLD LIVING GYM CENTER - 100% FREE GYM WORKOUT BLUEPRINT
===============================================================
Gym Shuru Karne Se Lekar Pro Level Tak Sahi Steps (100% Free)
Address: Plot 42, Sector 29 Cyber Hub Arena, Gurugram, Delhi NCR
Helpline: +91 89553 66977 | Timing: 5:00 AM - 11:00 PM Daily

---------------------------------------------------------------
PART 1: GYM KARNE KE 6 SCIENTIFIC STEPS
---------------------------------------------------------------
STEP 1: PRE-WORKOUT & WARM-UP (8 - 10 Mins)
• Light Cardio: 3-5 Mins treadmill brisk walk ya jumping jacks.
• Joint Rotations: Neck, shoulders, wrists, hips 10-10 reps.
• Dynamic Stretches: Arm circles, bodyweight squats, torso twists.
* Golden Tip: Direct bhaari wazan na uthayein; pehle body heat badhayein!

STEP 2: MIND-MUSCLE & PROPER FORM (Safety First)
• Breathing Rule: Weight dhakelte/uthate waqt Exhale (saans chhorein),
  neeche laate waqt Inhale (saans lein).
• Posture: Chest up, shoulders back, core tight.
• No Ego Lifting: Pehla set hamesha light weight se form test karein.

STEP 3: COMPOUND EXERCISES FIRST (35 - 45 Mins)
• Pehle multi-joint heavy compound movements (Bench Press, Squats,
  Lat Pulldown, Overhead Press).
• Baad me single-joint isolation (Bicep curls, Tricep pushdowns).
• Progressive Overload: Har hafte 1 extra rep ya 1-2kg wazan badhayein.

STEP 4: SETS, REPS & REST DISCIPLINE
• Hypertrophy (Muscle Size): 3-4 Sets x 8-12 Repetitions.
• Fat Loss & Endurance: 3 Sets x 12-15 Repetitions (Kam rest).
• Pure Strength: 4-5 Sets x 4-6 Repetitions.
• Rest Time: Sets ke beech 60-90 seconds ka stopwatch timer lagayein.

STEP 5: POST-WORKOUT COOL DOWN & STRETCHING (5 - 8 Mins)
• 2 min slow walking heart rate normal karne ke liye.
• Static stretching (Hamstrings, Chest, Quads 20-30 seconds hold).
• Deep belly breathing jisse nervous system relax mode me switch ho.

STEP 6: NUTRITION, WATER & DEEP SLEEP (24/7 Muscle Growth)
• Post-workout Meal: 45 min ke andar 25-30g protein (Eggs, Paneer,
  Soya chunks, Whey, ya Dal/Sprouts).
• Hydration: Din me 3.5 se 4 Liters paani zaroori hai.
• 7-8 Hours Sleep: Body gym me nahi, raat ko gehri neend me banti hai!

---------------------------------------------------------------
PART 2: FREE WEEKLY WORKOUT SCHEDULE
---------------------------------------------------------------
DAY 01 (Monday): CHEST & TRICEPS
1. Flat Barbell Bench Press (4 Sets x 8-10 Reps)
2. Incline Dumbbell Press (3 Sets x 10-12 Reps)
3. Cable Chest Fly / Pec Deck (3 Sets x 12-15 Reps)
4. Cable Tricep Pushdown (3 Sets x 12 Reps)
5. Overhead Dumbbell Tricep Extension (3 Sets x 10-12 Reps)

DAY 02 (Tuesday): BACK & BICEPS
1. Lat Pulldown Wide Grip (4 Sets x 10-12 Reps)
2. Seated Cable Row (3 Sets x 10-12 Reps)
3. One-Arm Dumbbell Row (3 Sets x 10 Reps)
4. Standing Barbell Bicep Curl (3 Sets x 10-12 Reps)
5. Incline Dumbbell Hammer Curl (3 Sets x 12 Reps)

DAY 03 (Wednesday): LEGS & CORE
1. Barbell Back Squats / Leg Press (4 Sets x 8-10 Reps)
2. Romanian Deadlift (Hamstrings) (3 Sets x 10-12 Reps)
3. Leg Extension Machine (3 Sets x 12-15 Reps)
4. Standing Calf Raises (4 Sets x 15-20 Reps)
5. Hanging Leg Raises / Planks (3 Sets x 45 Sec Hold)

DAY 04 (Thursday): SHOULDERS & TRAPS
1. Dumbbell Overhead Shoulder Press (4 Sets x 8-10 Reps)
2. Dumbbell Lateral Raises (4 Sets x 12-15 Reps)
3. Cable Face Pulls (Rear Delts) (3 Sets x 15 Reps)
4. Dumbbell / Barbell Shrugs (3 Sets x 12-15 Reps)
5. Cable Woodchoppers (3 Sets x 12 Reps)

DAY 05 (Friday): ARMS BLAST & CARDIO HIIT
1. Close-Grip Bench Press (3 Sets x 10 Reps)
2. Preacher Curls EZ-Bar (3 Sets x 10-12 Reps)
3. Parallel Bar Dips (3 Sets x 10-12 Reps)
4. Incline Treadmill Sprint HIIT (15 Mins Interval)
5. Abdominal Crunches & Bicycle (3 Sets x 20 Reps)

WEEKEND (Sat & Sun): ACTIVE RECOVERY & REST
1. 30 Mins Nature Walk & Foam Rolling
2. High Protein Nutrition Intake
3. 3.5 - 4 Liters Clean Hydration
4. 8 Hours Deep Sleep Recharge

---------------------------------------------------------------
PART 3: GOLDEN RULES (DO'S & DON'TS)
---------------------------------------------------------------
✔ DO: Sahi form pehle seekhein, wazan baad me badhayein.
✔ DO: Gym me hamesha personal towel aur water bottle layein.
✔ DO: Workout ke baad weights rack par wapas rakhein.
✔ DO: Consistency banaye rakhein — excuses ko dominate karein.
✖ DON'T: Ego Lifting (dikhawa karne ke liye over-heavy weight uthana).
✖ DON'T: Sets ke beech 5-10 minute Instagram reels dekhna.
✖ DON'T: Leg day kabhi skip mat karna.
✖ DON'T: Khali pet heavy weight lifting karna.

===============================================================
BOLD LIVING GYM CENTER | DELHI NCR | UNLEASH THE BEAST WITHIN!
===============================================================`;
  };

  // 4. Copy Guide Button
  const copyStepsBtn = document.getElementById('copy-steps-guide-btn');
  if (copyStepsBtn) {
    copyStepsBtn.addEventListener('click', () => {
      const guideText = getGuideFormattedText();
      navigator.clipboard.writeText(guideText).then(() => {
        showStepsToast('✓ Free Gym Steps Guide Clipboard me copy ho gaya!');
        const origText = copyStepsBtn.textContent;
        copyStepsBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyStepsBtn.textContent = origText; }, 2000);
      }).catch(() => {
        showStepsToast('Guide copied!');
      });
    });
  }

  // 5. Download Guide Button
  const downloadStepsBtn = document.getElementById('download-steps-guide-btn');
  if (downloadStepsBtn) {
    downloadStepsBtn.addEventListener('click', () => {
      const guideText = getGuideFormattedText();
      const blob = new Blob([guideText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'BoldLiving_Free_Gym_Workout_Guide.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showStepsToast('📥 Free Gym Guide text file download ho gayi!');
    });
  }

  // ==========================================================================
  // 20. GLASSMORPHISM PHONE NUMBER LOGIN & AUTH ENGINE
  // ==========================================================================
  const loginModal = document.getElementById('glass-login-modal');
  const navLoginBtn = document.getElementById('nav-login-btn');
  const navLoginText = document.getElementById('nav-login-text');
  const mobileNavLogin = document.getElementById('mobile-nav-login');
  const closeLoginBtn = document.getElementById('close-login-modal');

  const authLoginView = document.getElementById('auth-login-view');
  const authSignupView = document.getElementById('auth-signup-view');
  const authAccountView = document.getElementById('auth-account-view');

  const tabBtnPassword = document.getElementById('tab-btn-password');
  const tabBtnOtp = document.getElementById('tab-btn-otp');
  const fieldPasswordGroup = document.getElementById('field-password-group');
  const fieldOtpGroup = document.getElementById('field-otp-group');

  const loginPhoneInput = document.getElementById('login-phone');
  const loginPasswordInput = document.getElementById('login-password');
  const loginOtpInput = document.getElementById('login-otp');
  const phoneErrorMsg = document.getElementById('phone-error-msg');
  const passwordErrorMsg = document.getElementById('password-error-msg');
  const otpErrorMsg = document.getElementById('otp-error-msg');

  const togglePasswordBtn = document.getElementById('toggle-password-btn');
  const getOtpBtn = document.getElementById('get-otp-btn');
  const glassLoginForm = document.getElementById('glass-login-form');
  const forgotPasswordLink = document.getElementById('forgot-password-link');

  const goToSignupLink = document.getElementById('go-to-signup');
  const goToLoginLink = document.getElementById('go-to-login');
  const glassSignupForm = document.getElementById('glass-signup-form');

  const accountUserName = document.getElementById('account-user-name');
  const accountUserPhone = document.getElementById('account-user-phone');
  const accountLogoutBtn = document.getElementById('account-logout-btn');

  let currentAuthMode = 'password'; // 'password' or 'otp'
  let generatedOtp = null;
  let otpTimerInterval = null;

  // Open & Close Modal
  const openLoginModal = () => {
    if (!loginModal) return;
    const isLoggedIn = localStorage.getItem('boldliving_user_logged_in') === 'true';
    if (isLoggedIn) {
      showView(authAccountView);
      const savedPhone = localStorage.getItem('boldliving_user_phone') || '9876543210';
      const savedName = localStorage.getItem('boldliving_user_name') || 'Athlete';
      if (accountUserName) accountUserName.textContent = savedName;
      if (accountUserPhone) accountUserPhone.textContent = `+91 ${savedPhone}`;
    } else {
      showView(authLoginView);
    }
    loginModal.classList.add('open');
  };

  const closeLoginModal = () => {
    if (loginModal) loginModal.classList.remove('open');
    clearErrors();
  };

  const showView = (viewToShow) => {
    [authLoginView, authSignupView, authAccountView].forEach((view) => {
      if (view) view.style.display = 'none';
    });
    if (viewToShow) viewToShow.style.display = 'block';
  };

  const clearErrors = () => {
    if (phoneErrorMsg) phoneErrorMsg.textContent = '';
    if (passwordErrorMsg) passwordErrorMsg.textContent = '';
    if (otpErrorMsg) otpErrorMsg.textContent = '';
  };

  // Nav Login Button Click
  if (navLoginBtn) {
    navLoginBtn.addEventListener('click', openLoginModal);
  }
  if (mobileNavLogin) {
    mobileNavLogin.addEventListener('click', (e) => {
      e.preventDefault();
      openLoginModal();
    });
  }
  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', closeLoginModal);
  }

  // View Switchers (Login <-> Signup)
  if (goToSignupLink) {
    goToSignupLink.addEventListener('click', (e) => {
      e.preventDefault();
      clearErrors();
      showView(authSignupView);
    });
  }
  if (goToLoginLink) {
    goToLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      clearErrors();
      showView(authLoginView);
    });
  }

  // Switch between Password and OTP method
  if (tabBtnPassword && tabBtnOtp) {
    tabBtnPassword.addEventListener('click', () => {
      currentAuthMode = 'password';
      tabBtnPassword.classList.add('active');
      tabBtnOtp.classList.remove('active');
      if (fieldPasswordGroup) fieldPasswordGroup.style.display = 'block';
      if (fieldOtpGroup) fieldOtpGroup.style.display = 'none';
      clearErrors();
    });

    tabBtnOtp.addEventListener('click', () => {
      currentAuthMode = 'otp';
      tabBtnOtp.classList.add('active');
      tabBtnPassword.classList.remove('active');
      if (fieldPasswordGroup) fieldPasswordGroup.style.display = 'none';
      if (fieldOtpGroup) fieldOtpGroup.style.display = 'block';
      clearErrors();
    });
  }

  // Toggle Password Visibility
  if (togglePasswordBtn && loginPasswordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = loginPasswordInput.type === 'password';
      loginPasswordInput.type = isPassword ? 'text' : 'password';
      const eyeOffSvg = togglePasswordBtn.querySelector('.eye-off-svg');
      const eyeOnSvg = togglePasswordBtn.querySelector('.eye-on-svg');
      if (eyeOffSvg && eyeOnSvg) {
        eyeOffSvg.style.display = isPassword ? 'none' : 'block';
        eyeOnSvg.style.display = isPassword ? 'block' : 'none';
      }
    });
  }

  // Send / Get OTP Handler
  if (getOtpBtn && loginPhoneInput) {
    getOtpBtn.addEventListener('click', () => {
      clearErrors();
      const phone = loginPhoneInput.value.trim().replace(/\D/g, '');
      if (phone.length !== 10) {
        if (phoneErrorMsg) phoneErrorMsg.textContent = 'Kripya 10-digit phone number dalein';
        loginPhoneInput.focus();
        return;
      }

      generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      showStepsToast(`🔐 OTP Sent to +91 ${phone}: ${generatedOtp}`);
      if (loginOtpInput) {
        loginOtpInput.value = generatedOtp;
        loginOtpInput.focus();
      }

      let count = 30;
      getOtpBtn.disabled = true;
      getOtpBtn.textContent = `${count}s`;
      clearInterval(otpTimerInterval);
      otpTimerInterval = setInterval(() => {
        count--;
        if (count <= 0) {
          clearInterval(otpTimerInterval);
          getOtpBtn.disabled = false;
          getOtpBtn.textContent = 'Resend OTP';
        } else {
          getOtpBtn.textContent = `${count}s`;
        }
      }, 1000);
    });
  }

  // Handle Login Form Submit
  if (glassLoginForm) {
    glassLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const phone = (loginPhoneInput ? loginPhoneInput.value : '').trim().replace(/\D/g, '');
      if (phone.length !== 10) {
        if (phoneErrorMsg) phoneErrorMsg.textContent = '10-digit phone number zaroori hai';
        if (loginPhoneInput) loginPhoneInput.focus();
        return;
      }

      if (currentAuthMode === 'password') {
        const password = (loginPasswordInput ? loginPasswordInput.value : '').trim();
        if (password.length < 4) {
          if (passwordErrorMsg) passwordErrorMsg.textContent = 'Password kam se kam 4 characters ka ho';
          if (loginPasswordInput) loginPasswordInput.focus();
          return;
        }
      } else {
        const otp = (loginOtpInput ? loginOtpInput.value : '').trim();
        if (otp.length !== 4) {
          if (otpErrorMsg) otpErrorMsg.textContent = '4-digit OTP code enter karein';
          if (loginOtpInput) loginOtpInput.focus();
          return;
        }
      }

      const submitBtn = document.getElementById('submit-login-btn');
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Verifying...</span>';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        localStorage.setItem('boldliving_user_logged_in', 'true');
        localStorage.setItem('boldliving_user_phone', phone);
        if (!localStorage.getItem('boldliving_user_name')) {
          localStorage.setItem('boldliving_user_name', 'Lifter');
        }

        updateNavbarUserState();
        if (submitBtn) {
          submitBtn.innerHTML = '<span>Login</span>';
          submitBtn.disabled = false;
        }

        showStepsToast(`🔥 Welcome! +91 ${phone} se successfully login ho gaye!`);
        closeLoginModal();
      }, 600);
    });
  }

  // Handle Signup Form Submit
  if (glassSignupForm) {
    glassSignupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('signup-name');
      const phoneInput = document.getElementById('signup-phone');
      const passInput = document.getElementById('signup-password');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim().replace(/\D/g, '') : '';
      const password = passInput ? passInput.value.trim() : '';

      const nameErr = document.getElementById('signup-name-error');
      const phoneErr = document.getElementById('signup-phone-error');
      const passErr = document.getElementById('signup-password-error');

      if (nameErr) nameErr.textContent = '';
      if (phoneErr) phoneErr.textContent = '';
      if (passErr) passErr.textContent = '';

      if (!name) {
        if (nameErr) nameErr.textContent = 'Apna naam enter karein';
        return;
      }
      if (phone.length !== 10) {
        if (phoneErr) phoneErr.textContent = '10-digit mobile number dalein';
        return;
      }
      if (password.length < 4) {
        if (passErr) passErr.textContent = 'Password minimum 4 characters ka ho';
        return;
      }

      localStorage.setItem('boldliving_user_logged_in', 'true');
      localStorage.setItem('boldliving_user_name', name);
      localStorage.setItem('boldliving_user_phone', phone);

      updateNavbarUserState();
      showStepsToast(`🎉 Account ban gaya! Welcome ${name}`);
      closeLoginModal();
    });
  }

  // Forgot password
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = (loginPhoneInput ? loginPhoneInput.value : '').trim().replace(/\D/g, '');
      if (phone.length === 10) {
        showStepsToast(`📩 Password reset link +91 ${phone} par SMS kar diya gaya hai.`);
      } else {
        showStepsToast('📩 Pehle apna 10-digit phone number enter karein.');
        if (loginPhoneInput) loginPhoneInput.focus();
      }
    });
  }

  // Logout Handler
  if (accountLogoutBtn) {
    accountLogoutBtn.addEventListener('click', () => {
      localStorage.removeItem('boldliving_user_logged_in');
      localStorage.removeItem('boldliving_user_phone');
      localStorage.removeItem('boldliving_user_name');
      updateNavbarUserState();
      showStepsToast('Aap account se logout ho chuke hain.');
      closeLoginModal();
    });
  }

  // Update Navbar State Helper
  function updateNavbarUserState() {
    const isLoggedIn = localStorage.getItem('boldliving_user_logged_in') === 'true';
    const savedPhone = localStorage.getItem('boldliving_user_phone');
    if (isLoggedIn && savedPhone) {
      if (navLoginText) navLoginText.textContent = `+91 ${savedPhone.slice(0, 5)}...`;
      if (navLoginBtn) navLoginBtn.classList.add('logged-in');
      if (mobileNavLogin) mobileNavLogin.textContent = `👤 My Account (+91 ${savedPhone})`;
    } else {
      if (navLoginText) navLoginText.textContent = 'Login';
      if (navLoginBtn) navLoginBtn.classList.remove('logged-in');
      if (mobileNavLogin) mobileNavLogin.textContent = '📱 Member Login (Phone)';
    }
  }

  // Initialize login state on page load
  updateNavbarUserState();

})();
