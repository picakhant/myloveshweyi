import React, { useState, useEffect, useRef } from "react";

// --- Configuration ---
const HERO_IMAGE = "/images/holding-hand-on-view.png";
const CLOSING_IMAGE = "/images/holding-hand-on-view.png";
const VIDEO_PATH = "/videos/our_video.mp4";
const MUSIC_PATH = "/music/song.m4a";

// ⚡️ FIXED DATE: May 17, 2026
const ANNIVERSARY_DATE = "2026-05-17T00:00:00";

const GALLERY_IMAGES = [
  "/images/love.jpg",
  "/images/hand-on-hair.png",
  "/images/tree-portrait.png",
];

const REASONS = [
  "From that first hello on Facebook to our 6th Anniversary.",
  "Two Virgos against the world (born just days apart!).",
  "2.5 years of long distance, yet you feel closer than ever.",
  "Even when we fight or cry, I always choose you.",
  "Waiting for May 17th to celebrate 'Us'.", // <--- Updated Text
  "No matter the distance, you are my home.",
];

// --- Components ---

const Reveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.disconnect();
    };
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      {children}
    </div>
  );
};

const RosePetals = () => {
  const [petals, setPetals] = useState([]);
  useEffect(() => {
    const newPetals = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 5 + 10,
      size: Math.random() * 15 + 15,
    }));
    setPetals(newPetals);
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(110vh) translateX(20px) rotate(360deg); opacity: 0; }
        }
        @keyframes float-mobile {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .petal {
          position: absolute;
          top: -20px;
          background: linear-gradient(to bottom right, #e11d48, #be123c);
          border-radius: 100% 0 100% 0;
          animation: fall linear infinite;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
        }
        .animate-float-mobile {
          animation: float-mobile 4s ease-in-out infinite;
        }
      `}</style>
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}vw`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `-${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const AnniversaryCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(ANNIVERSARY_DATE).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-4 text-center max-w-sm mx-auto mt-8">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div
          key={unit}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-2 md:p-4 border border-white/10"
        >
          <div className="text-xl md:text-3xl font-bold text-rose-400">
            {value}
          </div>
          <div className="text-[10px] md:text-xs text-rose-200/60 uppercase tracking-widest">
            {unit}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ValentinePage() {
  const [reasonIndex, setReasonIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Playback failed:", e));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-rose-100 font-sans selection:bg-rose-500 selection:text-white overflow-x-hidden">
      <audio ref={audioRef} src={MUSIC_PATH} loop />

      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000">
          <RosePetals />
          <div className="z-10 text-center animate-pulse">
            <p className="text-rose-300 mb-4 tracking-widest uppercase text-xs">
              A Surprise for You
            </p>
            <button
              onClick={handleStart}
              className="bg-rose-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-[0_0_30px_rgba(225,29,72,0.6)] hover:scale-105 transition-transform"
            >
              💌 Click to Open
            </button>
          </div>
        </div>
      )}

      <div
        className={`transition-opacity duration-1000 ${hasStarted ? "opacity-100" : "opacity-0"}`}
      >
        <RosePetals />

        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => {
              if (audioRef.current.paused) audioRef.current.play();
              else audioRef.current.pause();
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-white/10 backdrop-blur-md border border-white/20 animate-[spin_4s_linear_infinite]"
          >
            🎵
          </button>
        </div>

        {/* --- Hero Section --- */}
        <header className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className={`w-full h-full transition-transform duration-[3000ms] ease-out ${isLoaded ? "scale-100 opacity-40" : "scale-110 opacity-0"}`}
            >
              <img
                src={HERO_IMAGE}
                alt="Us"
                className="w-full h-full object-cover object-center grayscale opacity-60"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
          </div>

          <div className="relative z-20 max-w-4xl w-full mt-[-10vh]">
            <div
              className={`transition-all duration-1000 delay-300 transform ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <p className="text-rose-400 font-bold uppercase mb-4 text-xs md:text-sm tracking-[0.2em]">
                Happy Valentine's Day
              </p>
            </div>
            <h1
              className={`text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl transition-all duration-1000 delay-500 transform ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            >
              My Favorite <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">
                Virgo
              </span>
            </h1>
            <div
              className={`h-1 bg-gradient-to-r from-rose-400 to-rose-600 mx-auto rounded-full mb-8 transition-all duration-1000 delay-700 ${isLoaded ? "w-24" : "w-0"}`}
            />
          </div>

          <div
            className={`absolute bottom-8 z-20 transition-opacity duration-1000 delay-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          >
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-[10px] text-rose-300/70 uppercase tracking-widest">
                Scroll
              </span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-rose-500 to-transparent" />
            </div>
          </div>
        </header>

        {/* --- Gallery Section --- */}
        <section className="relative z-10 py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
                Our Journey
              </h2>
              <div className="w-16 h-1 bg-rose-600 mx-auto rounded-full opacity-80" />
            </div>
          </Reveal>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-8">
            {GALLERY_IMAGES.map((src, index) => (
              <Reveal key={index} delay={index * 100}>
                <div
                  className="animate-float-mobile break-inside-avoid relative group rounded-2xl overflow-hidden shadow-2xl bg-gray-900 cursor-pointer"
                  style={{ animationDelay: `${index * 1.5}s` }}
                >
                  <img
                    src={src}
                    alt={`Moment ${index}`}
                    loading="lazy"
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* --- VIDEO SECTION --- */}
        <section className="relative z-10 py-16 px-4 max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
                Us in Motion 🎥
              </h2>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/50">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-rose-500/20 blur-[120px] -z-10" />
              <video
                controls
                playsInline
                preload="metadata"
                poster={GALLERY_IMAGES[0]}
                className="w-full h-auto rounded-2xl"
              >
                <source src={VIDEO_PATH} type="video/mp4" />
              </video>
            </div>
          </Reveal>
        </section>

        {/* --- Reasons Section --- */}
        <section className="relative z-10 py-24 md:py-32 px-4">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-rose-500/20 blur-[100px] -z-10" />
                <h3 className="text-sm md:text-lg font-bold text-rose-300 mb-8 uppercase tracking-[0.2em]">
                  Why I Love Us
                </h3>
                <div className="min-h-[160px] md:min-h-[200px] flex items-center justify-center flex-col relative">
                  {REASONS.map((reason, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-500 transform ${idx === reasonIndex ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"}`}
                    >
                      <p className="text-2xl md:text-4xl text-white font-medium leading-relaxed italic px-2">
                        "{reason}"
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 relative z-20">
                  <button
                    onClick={() =>
                      setReasonIndex((prev) => (prev + 1) % REASONS.length)
                    }
                    className="px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-full font-bold shadow-lg shadow-rose-600/20 transition-all duration-200 transform active:scale-95 border border-rose-400/20 text-sm md:text-base"
                  >
                    Next Reason ❤️
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* --- COUNTDOWN SECTION --- */}
        <section className="relative z-10 py-16 px-4">
          <Reveal>
            <div className="text-center">
              <h2 className="text-white text-lg md:text-xl font-bold uppercase tracking-widest mb-4">
                Countdown to Our 6th Anniversary
              </h2>
              {/* Updated Date Display */}
              <p className="text-rose-300/70 mb-6 italic">May 17th, 2026</p>
              <AnniversaryCountdown />
            </div>
          </Reveal>
        </section>

        {/* --- Footer --- */}
        <footer className="relative py-16 px-6 text-center overflow-hidden bg-black border-t border-white/5">
          <Reveal>
            <div className="max-w-xl mx-auto relative z-10">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full p-1 bg-gradient-to-tr from-rose-400 to-rose-700">
                <img
                  src={CLOSING_IMAGE}
                  alt="Holding Hands"
                  className="w-full h-full object-cover rounded-full border-4 border-black"
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Forever & Always
              </h2>
              <p className="text-rose-200/60 leading-relaxed mb-8 text-sm md:text-base">
                Coding this site was fun, but building a life with you is my
                favorite project. <br />I love you, Shwe Yi.
              </p>
              <div className="text-[10px] md:text-xs text-rose-800 uppercase tracking-widest mt-12 pt-8">
                Made with ❤️ by Zaw Win Khant
              </div>
            </div>
          </Reveal>
        </footer>
      </div>
    </div>
  );
}
