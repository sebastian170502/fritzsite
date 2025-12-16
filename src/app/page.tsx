import Link from "next/link";
import { Button } from "@/components/ui/button"


export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row">
      
      {/* LEFT SIDE - CUSTOM ORDER (VIDEO) */}
      <div className="relative w-full md:w-1/2 h-[50vh] md:h-screen group overflow-hidden border-b md:border-b-0 md:border-r border-border/20">
        <Link href="/custom" className="block w-full h-full relative z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white mb-4 drop-shadow-lg transform transition-transform duration-500 group-hover:-translate-y-2">
              Custom Order
            </h2>
            <span className="inline-block px-6 py-2 border border-white/30 rounded-full text-white/80 hover:bg-white/10 transition-all backdrop-blur-sm uppercase tracking-widest text-sm">
              Start Your Project
            </span>
          </div>
        </Link>
      </div>

      {/* RIGHT SIDE - SHOP (GLOSSY) */}
      <div className="relative w-full md:w-1/2 h-[50vh] md:h-screen group overflow-hidden bg-zinc-900">
        <Link href="/shop" className="block w-full h-full relative z-10 flex flex-col items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          >
            <source src="/shop-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
           
           {/* Content */}
           <div className="relative z-20 text-center p-8">
              <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white mb-4 drop-shadow-lg transform transition-transform duration-500 group-hover:-translate-y-2 text-glow">
                Shop
              </h2>
              <span className="inline-block px-6 py-2 border border-white/30 rounded-full text-white/80 bg-white/5 backdrop-blur-md group-hover:bg-white/10 transition-all uppercase tracking-widest text-sm shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                Browse Collection
              </span>
           </div>
        </Link>
      </div>

    </main>
  );
}