'use client';

import { useState, useRef, useEffect } from 'react';

export default function Taranas() {
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeRaw, setCurrentTimeRaw] = useState("00:00");
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const taranasData = [
    {
      id: 't1', 
      title: 'Gamzan hay soo e Manzil Jamiat ka karwan',
      artist: 'Jamiat',
      duration: '05:46',
      file: '/tarana1.mp3'
    },
    {
      id: 't2',
      title: 'Tumhi Badlogay Pakistan',
      artist: 'Fahad Farooqi',
      duration: '06:50',
      file: '/tarana2.mp3'
    }
  ];

  const handlePlayPause = (tarana: any) => {
    if (!tarana.file) {
      alert("Audio file not available for this tarana yet.");
      return;
    }

    if (activeId === tarana.id) {
      // Toggle play/pause for the currently loaded track
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      // Load and play a new track
      if (audioRef.current) {
        audioRef.current.src = tarana.file;
        audioRef.current.play();
        setActiveId(tarana.id);
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
      
      const mins = Math.floor(current / 60);
      const secs = Math.floor(current % 60);
      setCurrentTimeRaw(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
     if (audioRef.current && audioRef.current.duration) {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const newTime = (clickX / width) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
     }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTimeRaw("00:00");
      };
      
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-transparent pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0 overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce-bar {
          0%, 100% { height: 3px; }
          50% { height: 14px; }
        }
      `}} />

      <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-gradient-to-bl from-[#1C7F93]/10 to-transparent blur-[120px] rounded-bl-full -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <audio ref={audioRef} className="hidden" preload="none" />
        
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Official Audio</h2>
          <h1 className="text-5xl font-black text-[#123962] mb-6 tracking-tight">Taranas Gallery</h1>
          <p className="text-slate-500 font-medium leading-relaxed">The rhythmic heartbeat of our revolution. Listen to the anthems that have inspired millions across generations.</p>
        </div>

        <div className="bg-white rounded-[3rem] p-4 sm:p-8 lg:p-12 shadow-[0_20px_60px_rgba(18,57,98,0.03)] border border-slate-50">
          <div className="space-y-4">
             {taranasData.map(t => {
               const isActive = activeId === t.id;
               
               return (
               <div key={t.id} className={`group flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl border transition-all duration-300 transform hover:-translate-y-1 ${isActive ? 'bg-white border-[#1C7F93]/20 shadow-[0_10px_30px_rgba(28,127,147,0.08)]' : 'bg-[#FAFCFF] border-transparent hover:bg-white hover:border-slate-100 shadow-sm hover:shadow-[0_10px_30px_rgba(28,127,147,0.06)]'}`}>
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0 w-full sm:w-auto">
                    <button 
                      onClick={() => handlePlayPause(t)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 shadow-sm rounded-full flex items-center justify-center transition-colors duration-300 shrink-0 border border-slate-50 ${isActive && isPlaying ? 'bg-[#1C7F93] text-white hover:bg-[#156373]' : 'bg-white text-[#1C7F93] hover:bg-[#1C7F93] hover:text-white'}`}>
                       {isActive && isPlaying ? (
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" /></svg>
                       ) : (
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
                       )}
                    </button>
                    <div className="flex-1">
                      <h4 className="font-extrabold text-[#123962] text-lg sm:text-xl mb-1 line-clamp-1">{t.title}</h4>
                      <p className="text-[#1C7F93] text-[10px] sm:text-xs font-bold uppercase tracking-widest">{t.artist}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:w-auto w-full flex-1 sm:ml-8 mt-2 sm:mt-0">
                     
                     {isActive && (
                       <button 
                         onClick={toggleMute}
                         className="text-slate-400 hover:text-[#1C7F93] transition-colors p-2 mr-2"
                         title={isMuted ? "Unmute" : "Mute"}
                       >
                         {isMuted ? (
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" /></svg>
                         ) : (
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" /><path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" /></svg>
                         )}
                       </button>
                     )}
                     
                     <div className="flex-1 flex flex-col mx-2 relative min-w-[120px]">
                       {isActive && (
                         <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1.5 px-1">
                           <span>{currentTimeRaw}</span>
                           <span>{t.duration}</span>
                         </div>
                       )}
                       <div 
                         className={`w-full bg-slate-100 rounded-full overflow-hidden flex relative items-center justify-start ${isActive ? 'h-3 cursor-pointer' : 'h-1.5'}`}
                         onClick={isActive ? handleSeek : undefined}
                       >
                         <div 
                           className={`h-full rounded-full transition-all duration-300 relative z-10 ${isActive && isPlaying ? 'bg-[#1C7F93]/60' : isActive ? 'bg-[#1C7F93]/40' : 'bg-slate-300 w-1/3 group-hover:bg-[#1C7F93]/50'}`}
                           style={isActive ? { width: `${progress}%`, transition: 'width 0.1s linear' } : {}}
                         ></div>
                       </div>
                     </div>
                     
                     <div className={`ml-4 font-bold text-xs min-w-[80px] h-[34px] flex items-center justify-center rounded-full border shadow-sm shrink-0 transition-colors duration-300 ${isActive ? 'bg-white text-[#1C7F93] border-[#1C7F93]/20 shadow-[0_4px_10px_rgba(28,127,147,0.1)]' : 'bg-white text-slate-400 border-slate-100'}`}>
                       {isActive && isPlaying ? (
                         <div className="flex space-x-[2px] items-end h-[14px]">
                            <div className="w-1 bg-[#1C7F93] rounded-full" style={{ animation: 'bounce-bar 0.8s ease-in-out infinite alternate', animationDelay: '0.0s' }}></div>
                            <div className="w-1 bg-[#1C7F93] rounded-full" style={{ animation: 'bounce-bar 1.2s ease-in-out infinite alternate', animationDelay: '0.2s' }}></div>
                            <div className="w-1 bg-[#1C7F93] rounded-full" style={{ animation: 'bounce-bar 0.9s ease-in-out infinite alternate', animationDelay: '0.4s' }}></div>
                            <div className="w-1 bg-[#1C7F93] rounded-full" style={{ animation: 'bounce-bar 1.1s ease-in-out infinite alternate', animationDelay: '0.1s' }}></div>
                            <div className="w-1 bg-[#1C7F93] rounded-full" style={{ animation: 'bounce-bar 1.3s ease-in-out infinite alternate', animationDelay: '0.3s' }}></div>
                         </div>
                       ) : isActive && !isPlaying ? (
                         'PAUSED'
                       ) : (
                         t.duration
                       )}
                     </div>
                  </div>
               </div>
               );
             })}
          </div>
        </div>
      </div>
    </div>
  );
}
