import Link from "next/link";
import { Button } from "@/components/ui/button"


export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* 1. HERO SECTION (MINIMALIST VISUAL) */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* Video Background - Full Screen, No Overlay, No Text */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </section>
    </main>
  );
}