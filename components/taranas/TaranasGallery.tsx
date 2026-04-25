'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Tarana } from '@/lib/types';

export default function TaranasGallery({ initialTaranas }: { initialTaranas: Tarana[] }) {
  const [activeTarana, setActiveTarana] = useState<Tarana | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeRaw, setCurrentTimeRaw] = useState("00:00");
  const [durationRaw, setDurationRaw] = useState("00:00");
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Setup URL Sync
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const playId = params.get('play');
      if (playId) {
        const match = initialTaranas.find(t => t.id === playId);
        if (match) {
          setActiveTarana(match);
          setIsFullScreen(true);
        }
      } else {
        setIsFullScreen(false);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Initial check on mount
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initialTaranas]);

  const openFullScreenFor = (tarana: Tarana) => {
    setIsFullScreen(true);
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (url.searchParams.get('play') !== tarana.id) {
           url.searchParams.set('play', tarana.id);
           window.history.pushState(null, '', url.toString());
        }
    }
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (url.searchParams.has('play')) {
           url.searchParams.delete('play');
           window.history.pushState(null, '', url.toString());
        }
    }
  };

  // Derived Data
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    initialTaranas.forEach(t => {
      if (t.tags && Array.isArray(t.tags)) {
        t.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [initialTaranas]);

  const filteredTaranas = useMemo(() => {
    return initialTaranas.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (t.artist && t.artist.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = selectedTag ? (t.tags && t.tags.includes(selectedTag)) : true;
      return matchesSearch && matchesTag;
    });
  }, [initialTaranas, searchQuery, selectedTag]);

  // Playback Handlers
  const handlePlayPause = (tarana: Tarana) => {
    if (!tarana.audioUrl) {
      alert("Audio file not available for this tarana yet.");
      return;
    }

    if (activeTarana?.id === tarana.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().catch(e => console.log("Playback error:", e));
        setIsPlaying(true);
      }
    } else {
      setActiveTarana(tarana);
      setIsPlaying(true);
      setIsFullScreen(true);
      if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          if (url.searchParams.get('play') !== tarana.id) {
             url.searchParams.set('play', tarana.id);
             window.history.pushState(null, '', url.toString()); 
          }
      }
    }
  };

  const handleNext = () => {
    if (!activeTarana) return;
    const currentIndex = filteredTaranas.findIndex(t => t.id === activeTarana.id);
    if (currentIndex >= 0 && currentIndex < filteredTaranas.length - 1) {
      handlePlayPause(filteredTaranas[currentIndex + 1]);
    } else if (filteredTaranas.length > 0) {
       // Loop to first
       handlePlayPause(filteredTaranas[0]);
    }
  };

  const handlePrev = () => {
    if (!activeTarana) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      // If played for more than 3 seconds, just restart current track
      audioRef.current.currentTime = 0;
      return;
    }
    const currentIndex = filteredTaranas.findIndex(t => t.id === activeTarana.id);
    if (currentIndex > 0) {
      handlePlayPause(filteredTaranas[currentIndex - 1]);
    } else if (filteredTaranas.length > 0) {
       // Loop to last
       handlePlayPause(filteredTaranas[filteredTaranas.length - 1]);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
        
        const durMins = Math.floor(duration / 60);
        const durSecs = Math.floor(duration % 60);
        setDurationRaw(`${durMins.toString().padStart(2, '0')}:${durSecs.toString().padStart(2, '0')}`);
      }
      
      const mins = Math.floor(current / 60);
      const secs = Math.floor(current % 60);
      setCurrentTimeRaw(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
     if (audioRef.current && audioRef.current.duration && progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
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

  const handleShare = async (tarana: Tarana) => {
    const shareUrl = new URL(`/taranas/${tarana.id}`, window.location.origin).toString();

    if (navigator.share) {
      try {
        await navigator.share({
          title: tarana.title,
          text: `Listen to "${tarana.title}" by ${tarana.artist || 'IJT'} on IJT Bahawalpur Taranas Gallery!`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Tarana link copied to clipboard!");
    }
  };

  const handleDownload = (tarana: Tarana) => {
    if (!tarana.audioUrl) return;

    const sanitizeFileName = (value: string) =>
      value.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').trim() || 'tarana';

    const extensionFromUrl = (() => {
      try {
        const pathname = new URL(tarana.audioUrl).pathname;
        const fileName = pathname.split('/').pop();
        const extension = fileName?.split('.').pop();
        return extension ? `.${extension}` : '.mp3';
      } catch {
        return '.mp3';
      }
    })();

    fetch(tarana.audioUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to download audio.');
        }
        return response.blob();
      })
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${sanitizeFileName(tarana.title)}${extensionFromUrl}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error('Download failed:', error);
        alert('Could not download this tarana right now. Please try again.');
      });
  };

  const handleAddToSpotify = (tarana: Tarana) => {
    // TuneMyMusic search URL that allows users to add tracks to Spotify
    const searchQuery = `${tarana.title} ${tarana.artist || 'IJT'}`;
    const tuneMyMusicUrl = `https://www.tunemymusic.com/search?q=${encodeURIComponent(searchQuery)}&from=spotify`;
    window.open(tuneMyMusicUrl, '_blank');
  };

  // Audio source assignment and auto-play
  useEffect(() => {
    if (activeTarana && audioRef.current) {
       // Only change src if it's different to prevent resetting playback
       if (audioRef.current.src !== activeTarana.audioUrl && !audioRef.current.src.endsWith(activeTarana.audioUrl)) {
          audioRef.current.src = activeTarana.audioUrl;
          if (isPlaying) {
             audioRef.current.play().catch(e => console.log("Auto-play prevented:", e));
          }
       }
    }
  }, [activeTarana]); // isPlaying is intentionally omitted to avoid resetting src on pause

  // Setup Event Listeners & Media Session
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => {
        handleNext(); // Auto-play next track
      };
      
      const handlePlayEvent = () => setIsPlaying(true);
      const handlePauseEvent = () => setIsPlaying(false);
      
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('play', handlePlayEvent);
      audio.addEventListener('pause', handlePauseEvent);
      
      return () => {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('play', handlePlayEvent);
        audio.removeEventListener('pause', handlePauseEvent);
      };
    }
  }, [filteredTaranas, activeTarana]); // Re-bind when filtered list or active track changes for handleNext

  // Background playback (MediaSession API)
  useEffect(() => {
    if ('mediaSession' in navigator && activeTarana) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: activeTarana.title,
        artist: activeTarana.artist || 'IJT Bahawalpur',
        album: 'IJT Taranas',
        artwork: [
          { src: activeTarana.coverUrl || '/logo.png', sizes: '96x96', type: 'image/png' },
          { src: activeTarana.coverUrl || '/logo.png', sizes: '128x128', type: 'image/png' },
          { src: activeTarana.coverUrl || '/logo.png', sizes: '256x256', type: 'image/png' },
          { src: activeTarana.coverUrl || '/logo.png', sizes: '512x512', type: 'image/png' },
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', handlePrev);
      navigator.mediaSession.setActionHandler('nexttrack', handleNext);
    }
  }, [activeTarana, filteredTaranas]);

  return (
    <div className="relative pb-32">
      {/* Hidden Audio Element */}
      {/* playsInline is important for iOS to play without forcing fullscreen */}
      <audio ref={audioRef} className="hidden" preload="metadata" playsInline />
      
      {isFullScreen && activeTarana ? (
          <div className="bg-gradient-to-br from-[#0f213f] via-[#1C7F93] to-[#2669A9] rounded-[2rem] sm:rounded-[2.5rem] p-3 sm:p-8 lg:p-8 shadow-[0_20px_60px_rgba(2,6,23,0.45)] border border-[#74b8d8]/20 mb-8 max-w-7xl mx-auto overflow-hidden">
             <div className="flex justify-between items-center mb-4 sm:mb-8">
             <button onClick={closeFullScreen} className="flex items-center gap-2 text-white/85 hover:text-white font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/15 backdrop-blur px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                  <span className="hidden sm:inline">Back to Collection</span>
                  <span className="sm:hidden">Back</span>
                 </button>
                 <div className="flex gap-2">
                  <button onClick={() => handleShare(activeTarana)} className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/15 text-white/85 hover:text-white rounded-full transition-all backdrop-blur" title="Share">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
                    </button>
                  <button onClick={() => handleAddToSpotify(activeTarana)} className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/15 text-white/85 hover:text-white rounded-full transition-all backdrop-blur" title="Add to Spotify">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.122-.899-.539-.12-.417.122-.776.54-.899 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.26.3-3.24-1.992-8.159-2.592-12.021-1.409-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.079 10.561 18.72 12.84c.361.21.599.659.301 1.1z"/></svg>
                    </button>
                  <button onClick={() => handleDownload(activeTarana)} className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/15 text-white/85 hover:text-white rounded-full transition-all backdrop-blur" title="Download">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    </button>
                 </div>
             </div>

                 <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 lg:items-start">
                  <div className="lg:col-span-7 xl:col-span-8 rounded-[1.5rem] sm:rounded-[2rem] bg-[#0c1f3a]/30 border border-white/10 p-3 sm:p-6 overflow-hidden">
                    <div className="lg:flex lg:items-start lg:gap-5 lg:mb-5">
                  <div className="w-full max-w-[220px] sm:max-w-md lg:max-w-none lg:w-28 lg:h-28 mx-auto lg:mx-0 aspect-square lg:aspect-auto rounded-[1.5rem] sm:rounded-[3rem] lg:rounded-2xl shadow-2xl relative overflow-hidden mb-4 sm:mb-10 lg:mb-0 border border-white/20 flex items-center justify-center bg-gradient-to-br from-[#123962] to-[#1C7F93]">
                      {activeTarana.coverUrl ? (
                        <img src={activeTarana.coverUrl} className="w-full h-full object-cover relative z-10" alt="" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32 text-white/20 relative z-10"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" /><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" /></svg>
                      )}
                      {isPlaying && (
                         <div className="absolute inset-0 border-[6px] border-white/20 rounded-[2rem] sm:rounded-[3rem] animate-pulse pointer-events-none z-20"></div>
                      )}
                    </div>

                    <div className="text-center lg:text-left mb-4 sm:mb-10 lg:mb-0 lg:flex-1 min-w-0 max-w-full overflow-hidden px-1">
                      <h2 className="text-2xl sm:text-4xl lg:text-3xl font-black text-white mb-2 lg:mb-2 leading-tight truncate">{activeTarana.title}</h2>
                      <p className="text-cyan-100/90 font-bold text-xs sm:text-base lg:text-lg uppercase lg:normal-case tracking-[0.16em] sm:tracking-[0.2em] lg:tracking-normal lg:truncate">{activeTarana.artist || 'IJT Bahawalpur'}</p>
                    </div>
                    </div>

                    <div className="w-full max-w-2xl lg:max-w-none mx-auto mb-5 sm:mb-12 lg:mb-6">
                      <div 
                        ref={progressBarRef}
                        className="h-2 sm:h-3 lg:h-1.5 bg-white/20 rounded-full cursor-pointer relative group flex items-center overflow-hidden"
                        onClick={handleSeek}
                      >
                        <div className="h-full bg-[#1C7F93] rounded-full relative transition-all duration-75 ease-linear" style={{ width: `${progress}%` }}>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-5 sm:h-5 bg-white border-[3px] sm:border-4 border-[#1C7F93] rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 shadow-md transition-opacity"></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-cyan-100/80 mt-2 px-1">
                        <span>{currentTimeRaw}</span>
                        <span>{durationRaw !== "00:00" ? durationRaw : (activeTarana?.duration || "00:00")}</span>
                      </div>
                    </div>

                    <div className="mx-auto mb-2 w-full max-w-[280px] sm:max-w-md lg:max-w-none sm:mb-8 overflow-hidden">
                      <div className="grid grid-cols-5 items-center gap-1 sm:gap-3">
                          <button onClick={toggleMute} className={`justify-self-center h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-400/25 text-red-100' : 'bg-white/12 text-cyan-100/80 hover:text-white hover:bg-white/20'}`}>
                            {isMuted ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" /></svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" /><path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" /></svg>
                            )}
                          </button>

                          <button onClick={handlePrev} className="justify-self-center h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center bg-white/12 text-cyan-100/80 hover:text-white hover:bg-white/20 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-8.56c0-1.44-1.555-2.342-2.805-1.628L3.622 9.778c-1.25.714-1.25 2.52 0 3.234L9.195 18.44z" /><path d="M19.5 18.44c1.25.713 2.805-.19 2.805-1.629v-8.56c0-1.44-1.555-2.342-2.805-1.628L13.928 9.778c-1.25.714-1.25 2.52 0 3.234L19.5 18.44z" /></svg>
                          </button>
                        <button onClick={() => activeTarana && handlePlayPause(activeTarana)} className="col-start-3 justify-self-center w-[58px] h-[58px] sm:w-[72px] sm:h-[72px] lg:w-14 lg:h-14 bg-[#1C7F93] hover:bg-[#156373] text-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(28,127,147,0.35)] hover:shadow-[0_10px_28px_rgba(28,127,147,0.45)] transition-all">
                          {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 sm:w-9 sm:h-9 lg:w-7 lg:h-7"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" /></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 sm:w-9 sm:h-9 lg:w-7 lg:h-7 ml-0.5"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
                          )}
                        </button>

                          <button onClick={handleNext} className="col-start-4 justify-self-center h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center bg-white/12 text-cyan-100/80 hover:text-white hover:bg-white/20 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M14.805 5.56c-1.25-.713-2.805.19-2.805 1.629v8.56c0 1.44 1.555 2.342 2.805 1.628L20.378 14.222c1.25-.714 1.25-2.52 0-3.234L14.805 5.56z" /><path d="M4.5 5.56c-1.25-.713-2.805.19-2.805 1.629v8.56c0 1.44 1.555 2.342 2.805 1.628L10.072 14.222c1.25-.714 1.25-2.52 0-3.234L4.5 5.56z" /></svg>
                          </button>
                          <div className="col-start-5 justify-self-center h-8 w-8 sm:h-10 sm:w-10 opacity-0 pointer-events-none" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  {/* Up Next List */}
                  {filteredTaranas.filter(t => t.id !== activeTarana.id).length > 0 && (
                    <div className="lg:col-span-5 xl:col-span-4 border-t border-white/20 pt-6 sm:pt-10 lg:pt-6 lg:border-t-0 lg:border-l lg:pl-6 xl:pl-8 min-w-0 overflow-hidden">
                      <h3 className="text-sm font-black text-cyan-100/90 uppercase tracking-widest mb-4">Up Next</h3>
                      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                        {filteredTaranas.filter(t => t.id !== activeTarana.id).map(t => (
                          <div 
                            key={t.id} 
                            onClick={() => {
                              handlePlayPause(t);
                            }}
                            className="flex items-center p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer group"
                          >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/10 shrink-0 overflow-hidden mr-3 sm:mr-4 shadow-sm border border-white/20">
                              {t.coverUrl ? (
                                <img src={t.coverUrl} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#123962] to-[#1C7F93] opacity-50"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-extrabold text-white text-[13px] sm:text-base truncate transition-colors">{t.title}</h4>
                              <p className="text-cyan-100/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">{t.artist || 'IJT'}</p>
                            </div>
                            <div className="text-cyan-100/75 font-bold text-[10px] sm:text-xs ml-2 sm:ml-4">{t.duration || 'AUDIO'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                 </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] p-4 sm:p-8 lg:p-12 shadow-[0_20px_60px_rgba(18,57,98,0.03)] border border-slate-50 mb-8">
        
        {/* Search and Filters */}
        <div className="mb-8 space-y-5">
          <div className="relative group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#1C7F93] transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search taranas by title or artist..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-700 shadow-sm focus:bg-white focus:ring-2 focus:ring-[#1C7F93]/30 focus:border-[#1C7F93] outline-none transition-all placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
              </button>
            )}
          </div>
          
          {uniqueTags.length > 0 && (
            <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">Filters:</span>
              <button 
                onClick={() => setSelectedTag(null)} 
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${!selectedTag ? 'bg-[#123962] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                All
              </button>
              {uniqueTags.map(tag => (
                <button 
                  key={tag}
                  onClick={() => setSelectedTag(tag)} 
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${selectedTag === tag ? 'bg-[#1C7F93] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* List of Taranas */}
        <div className="space-y-3">
           {filteredTaranas.length === 0 ? (
             <div className="text-center py-16 text-slate-500 font-medium bg-slate-50 rounded-3xl border border-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-slate-300 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v16.308c0 .841-.673 1.543-1.513 1.583A1.803 1.803 0 015.688 21.5V10.25z" /></svg>
                No taranas found matching your criteria.
             </div>
           ) : filteredTaranas.map(t => {
             const isActive = activeTarana?.id === t.id;
             
             return (
             <div 
                key={t.id} 
                onClick={() => handlePlayPause(t)}
                className={`group flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer ${isActive ? 'bg-gradient-to-r from-white to-[#1C7F93]/5 border-[#1C7F93]/20 shadow-[0_8px_20px_rgba(28,127,147,0.08)]' : 'bg-white border-slate-100 hover:border-[#1C7F93]/30 hover:shadow-md'}`}
             >
                <div className="flex items-center space-x-4 w-full">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 shadow-sm rounded-2xl shrink-0 border border-slate-200 overflow-hidden">
                     {t.coverUrl ? (
                       <img src={t.coverUrl} alt={t.title} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full bg-gradient-to-br from-[#123962] to-[#1C7F93]" />
                     )}
                     <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                       {isActive && isPlaying ? (
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-white"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" /></svg>
                       ) : (
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
                       )}
                     </div>

                     {isActive && isPlaying && (
                       <div className="absolute inset-0 border-2 border-[#1C7F93] rounded-2xl animate-pulse"></div>
                     )}
                  </div>
                  <div className="flex-1 pr-2 min-w-0">
                    <h4 className={`font-extrabold text-sm sm:text-base mb-1 truncate transition-colors ${isActive ? 'text-[#1C7F93]' : 'text-[#123962]'}`}>{t.title}</h4>
                    <p className="text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider truncate">{t.duration || 'AUDIO'}</p>
                  </div>
                </div>
             </div>
             );
           })}
        </div>
      </div>
      )}

      {/* Persistent Bottom Player */}
      {!isFullScreen && (
         <div 
           className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-slate-200/60 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${activeTarana ? 'translate-y-0' : 'translate-y-[120%]'}`}
         >
            {/* Scrub Bar (Absolute top) */}
         <div 
            ref={progressBarRef}
            className="absolute top-0 left-0 right-0 h-1.5 bg-slate-200 cursor-pointer group"
            onClick={handleSeek}
         >
            <div 
               className="h-full bg-[#1C7F93] relative"
               style={{ width: `${progress}%` }}
            >
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#1C7F93] rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1/2 shadow-sm"></div>
            </div>
         </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:h-24 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            
            {/* Track Info */}
          <div 
             className="flex items-center gap-3 sm:gap-4 w-full sm:w-1/3 min-w-0 cursor-pointer group"
             onClick={() => activeTarana && openFullScreenFor(activeTarana)}
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl shrink-0 shadow-md overflow-hidden border border-slate-200 group-hover:shadow-lg transition-all group-hover:scale-105">
              {activeTarana?.coverUrl ? (
                <img src={activeTarana.coverUrl} alt={activeTarana.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#123962] to-[#1C7F93]"></div>
              )}
            </div>
            <div className="min-w-0 hidden sm:block flex-1">
                  <h4 className="font-extrabold text-[#123962] text-sm sm:text-base truncate">{activeTarana?.title || 'Unknown Track'}</h4>
                  <p className="text-[#1C7F93] text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">{activeTarana?.artist || 'Unknown Artist'}</p>
               </div>
            <div className="min-w-0 sm:hidden flex-1 marquee-container overflow-hidden">
                  <div className="whitespace-nowrap font-extrabold text-[#123962] text-sm animate-marquee">
                     {activeTarana?.title} • {activeTarana?.artist || 'IJT'}
                  </div>
                  <style dangerouslySetInnerHTML={{__html: `
                    .animate-marquee {
                       display: inline-block;
                       animation: marquee 10s linear infinite;
                    }
                    @keyframes marquee {
                       0% { transform: translateX(100%); }
                       100% { transform: translateX(-100%); }
                    }
                  `}} />
               </div>
            </div>

            {/* Main Controls */}
            <div className="flex flex-col items-center justify-center w-full sm:w-1/3 shrink-0">
               <div className="flex items-center gap-4 sm:gap-6">
                  <button onClick={handlePrev} className="text-slate-400 hover:text-[#123962] transition-colors p-1" title="Previous">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7"><path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-8.56c0-1.44-1.555-2.342-2.805-1.628L3.622 9.778c-1.25.714-1.25 2.52 0 3.234L9.195 18.44z" /><path d="M19.5 18.44c1.25.713 2.805-.19 2.805-1.629v-8.56c0-1.44-1.555-2.342-2.805-1.628L13.928 9.778c-1.25.714-1.25 2.52 0 3.234L19.5 18.44z" /></svg>
                  </button>
                  
                  <button 
                     onClick={() => activeTarana && handlePlayPause(activeTarana)} 
                     className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1C7F93] hover:bg-[#156373] text-white rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(28,127,147,0.4)] hover:shadow-[0_6px_20px_rgba(28,127,147,0.5)] hover:-translate-y-0.5 transition-all"
                  >
                     {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-8 sm:h-8"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" /></svg>
                     ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-8 sm:h-8 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
                     )}
                  </button>
                  
                  <button onClick={handleNext} className="text-slate-400 hover:text-[#123962] transition-colors p-1" title="Next">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7"><path d="M14.805 5.56c-1.25-.713-2.805.19-2.805 1.629v8.56c0 1.44 1.555 2.342 2.805 1.628L20.378 14.222c1.25-.714 1.25-2.52 0-3.234L14.805 5.56z" /><path d="M4.5 5.56c-1.25-.713-2.805.19-2.805 1.629v8.56c0 1.44 1.555 2.342 2.805 1.628L10.072 14.222c1.25-.714 1.25-2.52 0-3.234L4.5 5.56z" /></svg>
                  </button>
               </div>
               
               <div className="hidden sm:flex items-center justify-between w-full mt-2 text-[10px] font-bold text-slate-400">
                  <span>{currentTimeRaw}</span>
                  <span>{durationRaw !== "00:00" ? durationRaw : (activeTarana?.duration || "00:00")}</span>
               </div>
              <div className="sm:hidden flex items-center justify-between w-full mt-1 text-[10px] font-bold text-slate-400 px-1">
                <span>{currentTimeRaw}</span>
                <span>{durationRaw !== "00:00" ? durationRaw : (activeTarana?.duration || "00:00")}</span>
              </div>
            </div>

            {/* Extra Controls */}
            <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-4 w-full sm:w-1/3">
               <button 
                  onClick={toggleMute}
                className="text-slate-400 hover:text-[#1C7F93] transition-colors p-2"
                  title={isMuted ? "Unmute" : "Mute"}
               >
                  {isMuted ? (
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" /></svg>
                  ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" /><path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" /></svg>
                  )}
               </button>
               <button 
                  onClick={() => activeTarana && handleShare(activeTarana)} 
                  className="p-2 text-slate-400 hover:text-[#1C7F93] hover:bg-slate-100 rounded-full transition-all"
                  title="Share"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
               </button>
               <button 
                  onClick={() => activeTarana && handleAddToSpotify(activeTarana)} 
                  className="p-2 text-slate-400 hover:text-[#1C7F93] hover:bg-slate-100 rounded-full transition-all"
                  title="Add to Spotify"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.122-.899-.539-.12-.417.122-.776.54-.899 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.26.3-3.24-1.992-8.159-2.592-12.021-1.409-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.079 10.561 18.72 12.84c.361.21.599.659.301 1.1z"/></svg>
               </button>
               <button 
                  onClick={() => activeTarana && handleDownload(activeTarana)} 
                  className="p-2 text-slate-400 hover:text-[#1C7F93] hover:bg-slate-100 rounded-full transition-all"
                  title="Download"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
               </button>
            </div>
         </div>
      </div>
      )}
    </div>
  );
}
