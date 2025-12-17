import Link from "next/link";
import { Button } from "@/components/ui/button"


export default function Home() {
  return (
    <main className="h-[calc(100vh-8rem)] w-full flex flex-col md:flex-row overflow-hidden">
      
       {/* LEFT SIDE - CUSTOM ORDER (VIDEO) */}
       <div className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden border-b md:border-b-0 md:border-r border-border/20 bg-zinc-900">
         <Link href="/custom" className="block w-full h-full relative z-10">
           <video
             autoPlay
             loop
             muted
             playsInline
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
           >
             <source src="/hero-video.mp4" type="video/mp4" />
           </video>
           
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 gap-6">
             <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white drop-shadow-md transform transition-transform duration-500 group-hover:-translate-y-2">
               Custom Order
             </h2>
             <span className="inline-block px-8 py-3 border border-white/30 rounded-full text-white hover:text-primary hover:border-primary transition-colors uppercase tracking-widest text-sm font-medium">
               Start Your Project
             </span>
           </div>
         </Link>
       </div>
 
       {/* RIGHT SIDE - SHOP (GLOSSY) */}
       <div className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden bg-zinc-900">
         <Link href="/shop" className="block w-full h-full relative z-10 flex flex-col items-center justify-center">
           <video
             autoPlay
             loop
             muted
             playsInline
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
           >
             <source src="/shop-video.mp4" type="video/mp4" />
           </video>
            
            {/* Content */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center p-8 gap-6 h-full w-full">
               <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white drop-shadow-md transform transition-transform duration-500 group-hover:-translate-y-2">
                 Shop
               </h2>
               <span className="inline-block px-8 py-3 border border-white/30 rounded-full text-white hover:text-primary hover:border-primary transition-colors uppercase tracking-widest text-sm font-medium">
                 Browse Collection
               </span>
            </div>
         </Link>
       </div>

    </main>
  );
}