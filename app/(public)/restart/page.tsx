import Image from "next/image";
import localFont from "next/font/local";
import type { Metadata } from "next";

const chalkboard = localFont({
  src: "../../../public/restart/chalkboard.ttf",
  variable: "--font-chalkboard",
});

export const metadata: Metadata = {
  title: "Restart | Camp for 1st Year Students",
  description: "Restart Camp for 1st-year students by IJT Bahawalpur. Coming soon.",
};

export default function RestartPage() {
  return (
    <main 
      className={`relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center ${chalkboard.variable}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/restart/bg-green.jpg"
          alt="Chalkboard Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Top Books: Bottom half visible, cropped more aggressively behind the top border */}
      <div 
        className="absolute top-0 left-0 right-0 h-14 sm:h-20 md:h-28 w-full -z-10 bg-[url('/restart/books.png')] bg-bottom bg-repeat-x bg-[length:100%_auto] md:bg-[length:600px_auto] opacity-95 pointer-events-none" 
      />

      {/* Bottom Books: Top half visible, cropped more aggressively behind the bottom border */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-14 sm:h-20 md:h-28 w-full -z-10 bg-[url('/restart/books.png')] bg-top bg-repeat-x bg-[length:100%_auto] md:bg-[length:600px_auto] opacity-95 pointer-events-none" 
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full min-h-screen pt-20 pb-4">
        
        {/* "zero se kar" text */}
        <p 
          className="text-4xl sm:text-5xl md:text-6xl text-white tracking-wide -rotate-[3deg] mb-0 drop-shadow-md"
          style={{ fontFamily: "var(--font-chalkboard)" }}
        >
          zero se kar
        </p>

        {/* Logo Card */}
        <div className="relative flex items-center justify-center w-[300px] sm:w-[450px] md:w-[580px] z-10 -mt-1 sm:-mt-2 mb-0">
          <Image 
            src="/restart/logorestart.png" 
            alt="RESTART Logo" 
            width={800} 
            height={320} 
            className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)]"
            priority
          />
        </div>

        {/* "Camp for 1st year students" */}
        <p 
          className="text-3xl sm:text-4xl md:text-5xl text-white tracking-wide -rotate-[2deg] -mt-1 sm:-mt-2 drop-shadow-md z-10"
          style={{ fontFamily: "var(--font-chalkboard)" }}
        >
          Camp for 1st year students
        </p>

        {/* Urdu Text */}
        <p
          className="mt-3 sm:mt-4 text-5xl sm:text-6xl md:text-7xl text-white drop-shadow-lg"
          style={{ fontFamily: "var(--font-nastaliq), 'Jameel Noori Nastaleeq', 'Urdu Typesetting', serif", lineHeight: 1.6 }}
          dir="rtl"
          lang="ur"
        >
          جلد آ رہا ہے۔۔
        </p>
      </div>
    </main>
  );
}
