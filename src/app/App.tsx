import { useEffect, useRef } from "react";
import logoUrl from "@/assets/logo.svg";

// ── Animated Multi-Orb Background ────────────────────────────────────────────
// Reproduces the ELEMYNT mesh-gradient background:
//   • Large purple/violet blob — upper center-right
//   • Teal/cyan blob          — right side, mid-height
//   • Yellow/amber blob       — lower right
// Each orb parallax-shifts at a different rate on mousemove for depth.

interface OrbProps {
  color: string;
  colorMid: string;
  size: string;
  x: number;
  y: number;
  parallax: number;
  blur: number;
  opacity: number;
  breathDuration: number;
  blend?: "screen" | "plus-lighter" | "normal";
  shape?: string;
}

const ORBS: OrbProps[] = [
  // Upper-left amber/olive wash from the reference, partly tucked under the large dome.
  {
    color: "rgba(255, 190, 55, 0.94)",
    colorMid: "rgba(158, 150, 53, 0.62)",
    size: "clamp(500px, 64vw, 980px)",
    x: 34,
    y: 7,
    parallax: 18,
    blur: 16,
    opacity: 1,
    breathDuration: 9.5,
    blend: "screen",
  },
  // Right-side blue field: the dominant cool glow in the lower-right half.
  {
    color: "rgba(58, 142, 209, 0.62)",
    colorMid: "rgba(27, 92, 176, 0.42)",
    size: "clamp(640px, 66vw, 1040px)",
    x: 78,
    y: 53,
    parallax: 30,
    blur: 20,
    opacity: 0.72,
    breathDuration: 8.5,
    blend: "screen",
  },
  // Lower-left violet fog, broad and low like the screenshot's purple haze.
  {
    color: "rgba(179, 137, 255, 0.72)",
    colorMid: "rgba(103, 81, 180, 0.48)",
    size: "clamp(520px, 56vw, 900px)",
    x: 30,
    y: 78,
    parallax: 24,
    blur: 26,
    opacity: 0.78,
    breathDuration: 10.5,
    blend: "screen",
    shape: "58% 42% 55% 45% / 48% 56% 44% 52%",
  },
  // Small cyan pocket around the lower center-right transition.
  {
    color: "rgba(40, 218, 216, 0.56)",
    colorMid: "rgba(12, 145, 165, 0.36)",
    size: "clamp(300px, 34vw, 540px)",
    x: 70,
    y: 72,
    parallax: 42,
    blur: 24,
    opacity: 0.64,
    breathDuration: 7.5,
    blend: "screen",
  },
  // Faint lavender near the left edge where the large circle crosses the page.
  {
    color: "rgba(156, 119, 255, 0.56)",
    colorMid: "rgba(105, 70, 190, 0.28)",
    size: "clamp(360px, 39vw, 640px)",
    x: 15,
    y: 35,
    parallax: 14,
    blur: 28,
    opacity: 0.58,
    breathDuration: 11,
    blend: "screen",
  },
];

function OrbBackground() {
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const domeRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 0.5, y: 0.5 });
  const current = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX / window.innerWidth;
      target.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.035;
      current.current.y += (target.current.y - current.current.y) * 0.035;

      const mx = current.current.x - 0.5;
      const my = current.current.y - 0.5;

      if (domeRef.current) {
        domeRef.current.style.transform = `translate(${mx * 12}px, ${my * 10}px)`;
      }

      ORBS.forEach((orb, i) => {
        const el = orbRefs.current[i];
        if (!el) return;
        el.style.transform = `translate(${mx * orb.parallax}px, ${my * orb.parallax}px)`;
      });

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#090b14]" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_33%_12%,rgba(218,168,48,0.22),transparent_30%),radial-gradient(circle_at_73%_61%,rgba(40,129,190,0.22),transparent_35%),radial-gradient(circle_at_29%_83%,rgba(125,91,178,0.24),transparent_31%),linear-gradient(115deg,#090b14_0%,#11151f_46%,#08101a_100%)]" />

      {ORBS.map((orb, i) => (
        <div
          key={i}
          ref={(el) => { orbRefs.current[i] = el; }}
          className="absolute will-change-transform"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            translate: "-50% -50%",
            opacity: orb.opacity,
            filter: orb.blur ? `blur(${orb.blur}px)` : undefined,
            mixBlendMode: orb.blend ?? "screen",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              borderRadius: orb.shape ?? "9999px",
              animation: `orb-breathe ${orb.breathDuration}s ease-in-out infinite`,
              animationDelay: `${i * -1.65}s`,
              background: `radial-gradient(circle at 47% 45%, ${orb.color} 0%, ${orb.colorMid} 38%, transparent 72%)`,
              filter: "blur(34px)",
            }}
          />
        </div>
      ))}

      {/* The reference's defining shape: a huge cropped circular dome from the top. */}
      <div
        ref={domeRef}
        className="absolute left-1/2 top-[-84vh] will-change-transform"
        style={{
          width: "min(1240px, 92vw)",
          height: "min(1240px, 92vw)",
          translate: "-50% 0",
        }}
      >
        <div
          className="absolute inset-0 rounded-full opacity-[0.9]"
          style={{
            animation: "orb-breathe 12s ease-in-out infinite",
            background: `radial-gradient(ellipse at 29% 22%, rgba(238, 196, 70, 0.74) 0%, rgba(180, 164, 69, 0.48) 26%, transparent 48%),
              radial-gradient(ellipse at 72% 29%, rgba(117, 158, 220, 0.42) 0%, rgba(72, 108, 187, 0.22) 30%, transparent 52%),
              radial-gradient(ellipse at 48% 87%, rgba(185, 130, 255, 0.62) 0%, rgba(149, 104, 220, 0.28) 25%, transparent 47%),
              radial-gradient(ellipse at 50% 57%, rgba(203, 210, 186, 0.20) 0%, rgba(147, 154, 137, 0.10) 28%, transparent 58%),
              linear-gradient(145deg, rgba(24, 30, 42, 0.14), rgba(125, 135, 164, 0.32) 52%, rgba(42, 87, 151, 0.24))`,
            boxShadow: "0 82px 140px rgba(106, 94, 202, 0.18), inset 0 -62px 96px rgba(176, 126, 248, 0.18), inset 0 42px 82px rgba(238, 201, 82, 0.18)",
            filter: "blur(0.5px) saturate(0.92)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full opacity-[0.34]"
          style={{
            background: "linear-gradient(176deg, transparent 0 49%, rgba(9,11,20,0.28) 49.2% 100%)",
            filter: "blur(10px)",
          }}
        />
      </div>

      {/* Vignettes tuned to leave dark corners and a readable left column. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_33%,rgba(9,11,20,0.30)_72%,rgba(9,11,20,0.92)_100%)]" />
      <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-r from-[#090b14] via-[#090b14]/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-[#090b14] via-[#090b14]/45 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[10%] bg-gradient-to-b from-[#090b14]/80 to-transparent" />

      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />
    </div>
  );
}

// ── Nav ──────────────────────────────────────────────────────────────────────

type NavLink = { label: string; href: string; external?: boolean };

const NAV_LINKS: NavLink[] = [
  { label: "Contact", href: "mailto:hello@elemynt.ai" },
  { label: "Careers", href: "https://apply.workable.com/xora-innovation", external: true },
  { label: "Company", href: "https://www.linkedin.com/company/elemynt", external: true },
];

function Nav() {
  return (
    <nav className="animate-fade-up flex items-center justify-between gap-4 px-5 sm:px-8 lg:px-14 py-5 sm:py-6">
      <div className="flex items-center gap-2 sm:gap-2.5">
        <img src={logoUrl} alt="Elemynt" className="h-6 sm:h-7 w-auto opacity-90" />
        <span
          className="hidden sm:inline text-[15px] font-semibold tracking-[0.14em] uppercase text-white/90"
          style={{ fontFamily: "Figtree, sans-serif" }}
        >
          Elemynt
        </span>
      </div>

      <div className="flex items-center gap-3.5 sm:gap-7 text-[12px] sm:text-[13px] font-medium text-white/50">
        {NAV_LINKS.map(({ label, href, external }) => (
          <a
            key={label}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="hover:text-white/90 transition-colors duration-200"
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <main className="flex-1 flex flex-col justify-center px-8 lg:px-14 pt-4 pb-24">
      {/* Headline */}
      <h1
        className="animate-fade-up-1 text-[38px] sm:text-5xl lg:text-[58px] font-medium leading-[1.08] tracking-[-0.02em] text-white mb-6 max-w-2xl"
        style={{ fontFamily: "Figtree, sans-serif" }}
      >
        The materials AI
        <br />
        infrastructure layer
        <br />
        for industrial R&D
      </h1>

      {/* Body */}
      <p
        className="animate-fade-up-2 text-[15px] lg:text-base text-white/48 leading-relaxed max-w-sm mb-10"
        style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(240,242,248,0.46)" }}
      >
        Accelerate discovery. From atomic simulation to deployment, give research teams the computational infrastructure to move from lab to production.
      </p>
    </main>
  );
}

// ── Feature pills ─────────────────────────────────────────────────────────────

const FEATURES = [
  "Atomic Simulation",
  "Materials Graph",
  "Enterprise Compliance",
  "High-throughput Screening",
  "Multi-scale Modeling",
] as const;

function FeaturePills() {
  return (
    <div className="animate-fade-in-4 px-8 lg:px-14 pb-8 flex flex-wrap gap-2">
      {FEATURES.map((tag) => (
        <span
          key={tag}
          className="text-[11px] tracking-wide text-white/32 border border-white/10 rounded-full px-4 py-1.5 hover:border-white/20 hover:text-white/50 transition-all duration-200 cursor-default"
          style={{ color: "rgba(240,242,248,0.3)" }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="px-8 lg:px-14 py-5 flex items-center justify-between">
      <span
        className="text-[11px] text-white/25"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        © 2026 Elemynt. All Rights Reserved.
      </span>
      <span
        className="text-[22px] font-bold tracking-[0.28em] uppercase text-white/60"
        style={{ fontFamily: "Figtree, sans-serif" }}
      >
        ELEMYNT
      </span>
    </footer>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#090b14", fontFamily: "DM Sans, system-ui, sans-serif" }}
    >
      <OrbBackground />

      <div className="relative z-10 flex flex-col min-h-screen text-white">
        <Nav />
        <Hero />
        <FeaturePills />
        <Footer />
      </div>
    </div>
  );
}
