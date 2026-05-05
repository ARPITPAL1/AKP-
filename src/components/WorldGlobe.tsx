import React, { useState, useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { motion, AnimatePresence } from 'motion/react';
import { X, History, Globe as GlobeIcon, MapPin, Sparkles, Loader2 } from 'lucide-react';

interface CountryHistory {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color: string;
  history: string;
  era: string;
  img: string;
}

export const WorldGlobe = () => {
  const globeRef = useRef<any>(null);
  const [countries, setCountries] = useState<any>({ features: [] });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedHub, setSelectedHub] = useState<CountryHistory | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [aiHistory, setAiHistory] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load country polygons for the entire world
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) observer.observe(containerRef.current);

    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = false;
      // Critical: Disable wheel capturing to allow page scroll
      controls.mouseButtons.WHEEL = null;
      globeRef.current.pointOfView({ lat: 20, lng: 78, altitude: 2.5 });
    }
  }, []);

  const fetchDetailedHistory = async (name: string) => {
    setIsFetching(true);
    setAiHistory(null);
    setAiError(null);
    try {
      const response = await fetch('/api/ai/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: name })
      });

      const data = await response.json();

      if (response.ok && data.text) {
        setAiHistory(data.text);
      } else {
        throw new Error(data.error || "No response from AI");
      }
    } catch (error: any) {
      console.error("AI Proxy Error:", error);
      if (error.message === "GEMINI_API_KEY_MISSING") {
        setAiError("AI integration key missing. Please configure GEMINI_API_KEY in the Secrets panel to enable AI historical insights.");
      } else if (error.message?.toLowerCase().includes("too many requests")) {
        setAiError("Our digital scribes are currently at capacity for your region. Please try again later.");
      } else {
        setAiError("The digital library is temporarily unreachable. We couldn't fetch the historical scrolls for this region.");
      }
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden" ref={containerRef}>
      <div className="bg-radial-glow absolute inset-0 opacity-30 pointer-events-none"></div>
      
      <div className="absolute top-10 left-6 z-20 max-w-sm pointer-events-none">
        <p className="text-gold/60 font-serif italic text-sm leading-relaxed">
          The archive is live. Click any nation on the globe to awaken its history.
        </p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {dimensions.width > 0 && (
          <Globe
            ref={globeRef}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            showAtmosphere={true}
            atmosphereColor="#adcfeb"
            atmosphereAltitude={0.1}
            
            polygonsData={countries.features}
            polygonCapColor={d => (d as any).properties.ADMIN === hoveredCountry ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0)'}
            polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
            polygonStrokeColor={() => 'rgba(212, 175, 55, 0.4)'}
            polygonLabel={({ properties: d }: any) => `
              <div class="px-4 py-2 bg-ink/90 border border-gold/40 text-gold text-[10px] uppercase tracking-widest font-bold backdrop-blur-md rounded-sm">
                ${d.ADMIN}
              </div>
            `}
            onPolygonHover={d => setHoveredCountry(d ? (d as any).properties.ADMIN : null)}
            onPolygonClick={({ properties: d, bbox }: any) => {
              const countryName = d.ADMIN;
              setSelectedHub({
                id: d.ISO_A3,
                name: countryName,
                lat: (bbox[1] + bbox[3]) / 2,
                lng: (bbox[0] + bbox[2]) / 2,
                color: '#D4AF37',
                era: 'Historical Archive',
                history: `Unveiling the legacy of ${countryName}...`,
                img: `https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=800` // Default scenic placeholder
              });
              setAiHistory(null);
              fetchDetailedHistory(countryName);
              if (globeRef.current) {
                globeRef.current.pointOfView({ 
                  lat: (bbox[1] + bbox[3]) / 2, 
                  lng: (bbox[0] + bbox[2]) / 2, 
                  altitude: 1.8 
                }, 1000);
                globeRef.current.controls().autoRotate = false;
              }
            }}
          />
        )}
      </div>

      <AnimatePresence>
        {selectedHub && (
          <div className="absolute inset-0 z-50 flex items-center justify-end p-6 md:p-12 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="relative glass-card w-full max-w-md p-8 md:p-12 pointer-events-auto rounded-sm museum-glow max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              <button 
                onClick={() => {
                  setSelectedHub(null);
                  setAiHistory(null);
                  if (globeRef.current) {
                    globeRef.current.controls().autoRotate = true;
                  }
                }}
                className="absolute top-6 right-6 text-gold/60 hover:text-gold transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="mb-8 overflow-hidden rounded-sm border border-gold/10 aspect-video">
                <img 
                  src={selectedHub.img} 
                  alt={selectedHub.name} 
                  className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <GlobeIcon size={16} className="text-gold" />
                <span className="text-gold font-bold uppercase tracking-[0.2em] text-[10px]">{selectedHub.era}</span>
              </div>
              
              <h3 className="text-4xl font-serif text-ivory italic mb-6">{selectedHub.name}</h3>
              
              <div className="w-12 h-px bg-gold/40 mb-8"></div>
              
              <p className="text-text-muted font-serif text-lg leading-relaxed mb-8 italic">
                {selectedHub.history}
              </p>

              {aiHistory ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gold/5 border-l-2 border-gold p-6 mb-8 rounded-r-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-gold" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gold">AI Deep Dive</span>
                  </div>
                  <div className="prose prose-sm prose-invert text-ivory/80 font-serif leading-relaxed italic whitespace-pre-wrap">
                    {aiHistory}
                  </div>
                </motion.div>
              ) : aiError ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/10 border-l-2 border-red-500/50 p-6 mb-8 rounded-r-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <X size={14} className="text-red-400" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">Library Error</span>
                  </div>
                  <p className="text-sm text-ivory/70 font-serif italic mb-4 leading-relaxed">
                    {aiError}
                  </p>
                  <button 
                    onClick={() => fetchDetailedHistory(selectedHub.name)}
                    className="text-[10px] uppercase font-bold tracking-widest text-gold hover:text-ivory transition-colors flex items-center gap-2"
                  >
                    <History size={12} /> Retry Connection
                  </button>
                </motion.div>
              ) : (
                <button 
                  onClick={() => fetchDetailedHistory(selectedHub.name)}
                  disabled={isFetching}
                  className="w-full py-4 border border-gold/30 hover:border-gold hover:bg-gold/10 text-[10px] uppercase tracking-[0.3em] font-bold text-gold transition-all flex items-center justify-center gap-3 mb-8"
                >
                  {isFetching ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Consulting Archives...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Fetch AI Insight
                    </>
                  )}
                </button>
              )}

              <div className="flex justify-between items-center pt-8 border-t border-gold/10">
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-gold" />
                  <span className="text-[10px] uppercase font-mono tracking-widest text-gold/60">
                    {selectedHub.lat.toFixed(2)}°N, {selectedHub.lng.toFixed(2)}°E
                  </span>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-gold/60">Historical Archives</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        {/* Navigation dots removed for direct globe interaction */}
      </div>
    </div>
  );
};
