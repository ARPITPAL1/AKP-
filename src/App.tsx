import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion, useScroll, useSpring, AnimatePresence, useTransform } from 'motion/react';
import { 
  Book, 
  History, 
  Globe, 
  Award, 
  Mail, 
  ChevronRight, 
  ArrowRight,
  Menu, 
  X,
  ScrollText,
  GraduationCap,
  ExternalLink,
  Plus,
  Bookmark,
  Sparkles,
  Check,
  Camera,
  Scan,
  Loader2,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType, Artifact } from './lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, doc, getDoc, setDoc } from 'firebase/firestore';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage } from '@react-three/drei';
import { WorldGlobe } from './components/WorldGlobe';

// --- Components ---

// --- AI Setup ------ AI Setup ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Legacy', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'World', href: '#world' },
    { name: 'Teaching', href: '#teaching' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-ink/90 backdrop-blur-md py-4 border-b border-gold/20 shadow-sm' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span className="text-2xl font-serif font-bold tracking-tight text-gold uppercase">DR. ANJAN KUMAR PAL</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted font-medium">professor in history</span>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="nav-link hover:text-gold"
            >
              {link.name}
            </motion.a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-ivory" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ink border-b border-gold/20 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-serif text-ivory hover:text-gold"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink py-20">
      <motion.div 
        style={{ scale: 1.1 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2600" 
          alt="Ancient Library" 
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-radial-glow opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink"></div>
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <span className="inline-block text-gold text-sm md:text-base tracking-[0.5em] uppercase font-medium mb-10">
            PhD (Fakir Mohan University) • 30+ Years of Academic Experience in Indian Heritage
          </span>
          <h1 className="text-6xl md:text-9xl font-normal text-gold mb-12 tracking-tight leading-[1.1] font-serif">
            Honouring Our <br /><span className="italic luxury-text-gradient">Ancient Roots.</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl font-light max-w-3xl mx-auto mb-16 leading-relaxed font-serif italic">
            Teacher and researcher dedicated to protecting the glorious history of India. Journeying through the ages to bring the wisdom of our ancestors to the modern world.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12">
            <button className="cta-button">
              Explore The Legacy
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/50 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.4em]">Chronicle</span>
        <div className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent"></div>
      </motion.div>
    </section>
  );
};const About = () => {
  const timeline = [
    { label: 'Roots', event: 'Early education in Barbatia village, Bhograi, and graduation from Government High School, Baleswar.' },
    { label: 'FMU', event: 'Pursued foundational higher education and successfully completed Graduation at Fakir Mohan University.' },
    { label: 'Utkal', event: 'Advanced to postgraduate studies, deepening academic specialization at Utkal University.' },
    { label: 'PhD', event: 'Returned to Fakir Mohan University for Doctoral Research on the development of educational institutions in Baleswar district.' },
    { label: 'Legacy', event: 'Dedicated 30 years of academic excellence and institutional building at Sitala Thakurani (Junior) College, Khuluda.' },
  ];

  return (
    <section id="about" className="py-32 md:py-48 bg-ink border-y border-gold/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 border border-gold/40 shadow-2xl rounded-sm overflow-hidden aspect-[3/4]"
          >
            <img 
              src="/src/assets/images/regenerated_image_1777920652435.png" 
              alt="Professor DR. ANJAN KUMAR PAL" 
              className="w-full h-full object-cover shadow-inner"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </motion.div>
          <div className="absolute -bottom-8 -right-8 w-64 h-64 border border-gold/20 -z-0"></div>
          <motion.div 
            initial={{ rotate: 10, opacity: 0 }}
            whileInView={{ rotate: -5, opacity: 1 }}
            className="absolute top-10 -left-10 p-8 glass-card text-ivory shadow-xl z-20 max-w-[240px]"
          >
            <History className="mb-4 text-gold" />
            <p className="text-sm font-serif italic leading-relaxed text-text-muted">"To know our future, we must look at the glorious past of Bharat."</p>
          </motion.div>
        </div>

        <div>
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block">The Life Story</span>
          <h2 className="text-5xl md:text-7xl font-light text-ivory mb-10 leading-tight font-serif italic uppercase tracking-tight">30 Years at <br /><span className="text-gold not-italic font-bold">Sitala Thakurani (Junior) College</span></h2>
          <p className="text-text-muted text-lg leading-relaxed mb-8 font-serif italic">
            Dr. Anjan Kumar Pal's journey began in the quiet village of Barbatia, situated in the Bhograi block of Baleswar district, Odisha. From these rural roots, he embarked on a path of relentless intellectual curiosity, completing his fundamental schooling at the local Government High School. His academic ascent continued at Fakir Mohan University, where he laid his collegiate foundation, followed by advanced postgraduate studies at the prestigious Utkal University. He eventually returned to Fakir Mohan University to culminate his academic journey with a PhD, dedicating his life to the belief that history is not a mere collection of dates, but a living, breathing tapestry of human endeavor.
          </p>
          <p className="text-text-muted text-lg leading-relaxed mb-16 font-serif italic">
            Specializing in the socio-educational evolution of his homeland, Dr. Pal's doctoral research provided a groundbreaking analysis of the history and development of educational institutions in the Baleswar district. This scholarly work meticulously chronicles the transition from traditional learning systems to modern academic structures, offering invaluable insights into the regional intellectual landscape. Beyond his institutional research, his explorations into ancient trade routes and local heritage continue to challenge existing historical paradigms, inspiring a new generation to find the living soul of Bharat's past.
          </p>
            <div className="space-y-12 relative">
            {/* Vertical Line */}
            <div className="absolute left-[3.2rem] top-2 bottom-2 w-px bg-gold/10 hidden md:block" />
            
            {timeline.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: i * 0.15,
                  ease: [0.215, 0.61, 0.355, 1] 
                }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex gap-10 group relative"
              >
                {/* Bullet point on the line */}
                <div className="absolute left-[3.15rem] top-3 w-1.5 h-1.5 bg-gold/40 border border-gold rounded-full hidden md:block group-hover:bg-gold transition-colors z-10" />
                
                <span className="text-gold font-bold font-serif text-xl border-r border-gold/30 pr-10 group-hover:border-gold transition-colors min-w-[7rem] text-right">{item.label}</span>
                <p className="text-text-muted group-hover:text-ivory transition-colors flex-1 py-1 font-serif text-base leading-relaxed">{item.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


interface Artifact3DProps {
  item: {
    title: string;
    period: string;
    img: string;
    description?: string;
    modelUrl?: string;
  };
  i: number;
  key?: React.Key;
}

const ModelViewer = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
};

const Artifact3D = ({ item, i }: Artifact3DProps) => {
  const [show3D, setShow3D] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const x = useSpring(0);
  const y = useSpring(0);
  
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (show3D) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 200;
    const yPct = (mouseY / height - 0.5) * 200;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: i * 0.1 }}
        viewport={{ once: true }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setShowDetails(true)}
        style={{ rotateX: show3D ? 0 : rotateX, rotateY: show3D ? 0 : rotateY, transformStyle: 'preserve-3d' }}
        className="group relative overflow-hidden rounded-sm aspect-square bg-[#0a0a0a] museum-glow cursor-pointer border border-gold/10 hover:border-gold/40 transition-colors"
      >
        {show3D && item.modelUrl ? (
          <div className="absolute inset-0 z-20">
            <button 
              onClick={(e) => { e.stopPropagation(); setShow3D(false); }}
              className="absolute top-4 right-4 z-30 p-2 bg-ink/80 text-gold rounded-full border border-gold/20 hover:bg-gold hover:text-ink transition-colors"
            >
              <X size={16} />
            </button>
            <Canvas shadows dpr={[1, 2]}>
              <Suspense fallback={<div className="flex items-center justify-center h-full text-gold text-[10px] animate-pulse">Loading Artifact...</div>}>
                <Stage environment="city" intensity={0.5} shadows="contact">
                  <ModelViewer url={item.modelUrl} />
                </Stage>
              </Suspense>
              <OrbitControls autoRotate enableZoom={false} makeDefault />
            </Canvas>
          </div>
        ) : (
          <>
            <div style={{ transform: 'translateZ(50px)' }} className="absolute inset-0">
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
            <div style={{ transform: 'translateZ(80px)' }} className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white pointer-events-none">
              <span className="text-[10px] uppercase tracking-widest text-gold mb-2">{item.period}</span>
              <h4 className="text-2xl font-serif italic">{item.title}</h4>
              <div className="w-0 group-hover:w-full h-px bg-gold transition-all duration-700 mt-4 origin-left"></div>
              {item.modelUrl && (
                <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gold">
                  <Globe size={14} className="animate-pulse" /> 3D View Available
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {showDetails && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="absolute inset-0 bg-ink/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-card max-w-2xl w-full p-8 md:p-12 overflow-y-auto max-h-[90vh] rounded-sm"
            >
              <button 
                onClick={() => setShowDetails(false)}
                className="absolute top-6 right-6 text-text-muted hover:text-gold transition-colors"
              >
                <X size={24} />
              </button>
              
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full aspect-video object-cover rounded-sm mb-8 border border-gold/10"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              
              <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">{item.period}</span>
              <h3 className="text-4xl font-serif text-ivory italic mb-6">{item.title}</h3>
              
              <div className="w-16 h-px bg-gold/40 mb-8"></div>
              
              <p className="text-text-muted font-serif text-lg leading-relaxed mb-8 italic">
                {item.description || "The history of this artifact is a testament to the enduring spirit of human creation. Every detail whispers stories of an era long past, inviting us to contemplate our shared heritage."}
              </p>
              
              <div className="flex justify-between items-center pt-8 border-t border-gold/10">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-gold/40 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-gold/20 rounded-full"></div>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-gold/60">Archives of Bharat</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const ComparisonSlider = ({ after, title, period }: { after: string, title: string, period: string }) => {
  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-sm border border-gold/10 museum-glow group">
      <img 
        src={after} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
        referrerPolicy="no-referrer" 
        loading="lazy"
      />
      <div className="absolute top-0 left-0 right-0 p-8 z-20 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-gold"></div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-gold">{period}</span>
        </div>
        <h4 className="text-2xl font-serif text-ivory italic uppercase">{title}</h4>
      </div>
      <div className="absolute bottom-6 right-6 z-20 px-4 py-2 bg-black/90 backdrop-blur-md border border-gold/40 text-[10px] text-gold uppercase tracking-[0.2em] font-bold shadow-2xl">
        Heritage View
      </div>
    </div>
  );
};

const HeritageModal = ({ post, isOpen, onClose }: { post: any | null, isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && post && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/95 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative bg-ink/40 border border-gold/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl glass-card no-scrollbar"
          >
            <button onClick={onClose} className="absolute top-8 right-8 z-20 text-text-muted hover:text-gold transition-colors">
              <X size={28} />
            </button>
            
            <div className="p-10 md:p-20">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">{post.period}</span>
                <div className="w-12 h-px bg-gold/20"></div>
              </div>
              
              <h3 className="text-4xl md:text-6xl font-serif text-ivory italic leading-tight mb-12">{post.title}</h3>
              
              <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div className="rounded-sm overflow-hidden border border-gold/20">
                  <img 
                    src={post.imgAfter} 
                    alt={post.title} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-center space-y-6">
                  <div className="p-6 border-l-2 border-gold/30 bg-gold/5 italic text-gold/80 font-serif">
                    "A monument is not merely stone; it is a frozen moment of human consensus."
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Archive ID</p>
                    <p className="text-ivory font-mono text-xs uppercase">WH-ARCH-822-CL</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-invert prose-gold max-w-none">
                <div className="text-text-muted font-serif leading-loose space-y-8 text-xl whitespace-pre-line selection:bg-gold/30">
                  {post.fullHistory}
                </div>
              </div>
              
              <div className="mt-20 pt-10 border-t border-gold/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <Globe size={14} className="text-gold" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Heritage Archive Entry</span>
                </div>
                <button 
                  onClick={onClose}
                  className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-ivory transition-colors"
                >
                  Close Record
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const InternationalExhibitions = () => {
  const [selectedEx, setSelectedEx] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const exhibitions = [
    {
      title: "The Roman Colosseum",
      period: "Italy • 80 AD",
      imgAfter: "/src/assets/images/regenerated_image_1777923454898.jpg",
      description: "Beyond its standard classification as a ruin, the Flavian Amphitheatre represents a pinnacle of Roman sociological engineering. My analysis of its structural 'vomitoria' and tiered seating reveals a society obsessed with rigid hierarchy and the mastery of public movement. It stands today as a silent, skeletal monument to the sheer audacity of Imperial architecture.",
      fullHistory: `Completed in 80 AD under Emperor Titus, the Colosseum was the largest amphitheatre ever built. But to view it strictly as a sports arena is to miss its primary function: the physical manifestation of the Roman 'Pax Romana.' 

      It was built using the spoils from the Temple in Jerusalem after the Great Jewish Revolt, serving as a political statement of dominance. The structure itself—a marvel of travertine limestone, tuff, and brick-faced concrete—utilised a complex system of vaults and arches to support a load that timber could never hold.

      My personal research has focused on the 'Hypogeum'—the intricate underground network of tunnels and cages. This was the engine room of Roman entertainment, where elevators worked by pulleys manually lifted wild animals and gladiators into the arena, creating a sense of terrifyingly divine-like appearances for the audience. Today, it serves as a stark reminder of the cost of such grandeur.`
    },
    {
      title: "The Parthenon, Athens",
      period: "Greece • 438 BC",
      imgAfter: "/src/assets/images/regenerated_image_1777923185358.jpg",
      description: "In my lectures, I often refer to the Parthenon as the 'Miracle of Symmetry.' Every Doric column is subtly tapered to correct the human eye's tendency for distortion—an optical correction known as entasis. This commitment to mathematical perfection in honour of Athena Parthenos defined the aesthetic vocabulary of the entire Western world for two millennia.",
      fullHistory: `The Parthenon stands at the summit of the Acropolis, a beacon of the Periclean Golden Age. Its significance lies in its absolute refusal of the straight line. The architects Ictinus and Callicrates understood that a perfectly straight column would appear concave and weak to the human observer.

      By employing 'entasis'—a slight convex curve—and slightly tilting the columns inward, they created an illusion of perfect verticality and strength. This is not just architecture; it is psychology carved in marble. 

      Despite suffering massive damage during the 1687 Venetian siege and later through foreign extractions, the spirit of the Parthenon remains indomitable. It continues to be the primary source text for our understanding of classical proportion. To study its ruins is to study the first instance where human reason was given a monument capable of outlasting its creators.`
    },
    {
      title: "Great Sphinx of Giza",
      period: "Egypt • 2558 BC",
      imgAfter: "/src/assets/images/regenerated_image_1777923182840.jpg",
      description: "Carved from a single limestone bedrock, the Sphinx is more than a guardian; it is an astronomical marker of the Old Kingdom's cosmic understanding. For centuries it remained buried to its neck in sand, which perhaps preserved its enigmatic features. Our current archaeological perspective treats it as the ultimate synthesis of solar worship and kingly authority.",
      fullHistory: `The Great Sphinx of Giza is arguably the world's most enduring mystery. Carved during the reign of Khafre, it aligns perfectly with the rising sun at the vernal equinox. This alignment suggests that the Egyptians viewed architecture as a way to synchronize terrestrial power with celestial mechanics.

      Through the centuries, the Sphinx has witnessed the rise and fall of countless dynasties. In 1817, Captain Giovanni Battista Caviglia first attempted to fully excavate its chest, revealing the Dream Stele of Thutmose IV. 

      The weathering patterns on the body of the Sphinx are a subject of intense debate among geologists and Egyptologists. While some suggest it displays signs of water erosion, pointing to an even older origin, the archaeological consensus remains fixed on the Fourth Dynasty. For the modern scholar, it remains a testament to the Egyptian belief in 'Ma'at'—the eternal order of the universe.`
    },
    {
      title: "Schönbrunn Palace",
      period: "Austrian Empire • 1744 AD",
      imgAfter: "/src/assets/images/regenerated_image_1777923180794.jpg",
      description: "Schönbrunn is where Baroque architecture meets the Enlightenment's quest for order. As a residence for the Habsburgs, its 1,441 rooms were not just a display of wealth, but a physical stage for the intricate diplomacy of central Europe. The transition from a royal hunting lodge to a cultural landmark reflects the evolution of the modern European state.",
      fullHistory: `Designed by Johann Bernhard Fischer von Erlach and later transformed in the Rococo style by Nicolaus Pacassi, Schönbrunn was the seat of power for Empress Maria Theresa. It was here that she consolidated the Habsburg authority, navigating the treacherous waters of 18th-century European politics.

      The palace's influence extends to its gardens, where the Gloriette stands as a monument to 'Just War' and Habsburg victory. The interior, particularly the Hall of Mirrors where a six-year-old Mozart once performed, is a study in the intersection of high art and royal protocol.

      As a historian, I find Schönbrunn fascinating because it represents the zenith of the 'Absolute Monarchy' which would soon be challenged by the social revolutions of the late 19th century. Its survival as a UNESCO site allows us to walk through the corridors of power that shaped the modern map of Europe.`
    }
  ];

  const handleOpenModal = (ex: any) => {
    setSelectedEx(ex);
    setIsModalOpen(true);
  };

  return (
    <section id="international" className="py-32 md:py-48 bg-ink border-b border-gold/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24 text-center">
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">Interactive Heritage</span>
          <h2 className="text-5xl md:text-7xl font-serif text-ivory italic uppercase tracking-tight">World <span className="text-gold not-italic font-bold tracking-tighter">Heritage</span></h2>
          <p className="text-text-muted mt-8 max-w-xl mx-auto font-serif italic text-lg leading-relaxed">
            "History breathes through these stones. Witness the architectural spirits of the ancient world as they stand today, preserving the majesty of their heritage across millennia."
          </p>
        </div>

        <div className="grid grid-cols-1 gap-24">
          {exhibitions.map((ex, i) => (
            <motion.div
              key={ex.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="grid lg:grid-cols-12 gap-8 items-center"
            >
              <div className={`lg:col-span-8 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <ComparisonSlider 
                  after={ex.imgAfter} 
                  title={ex.title} 
                  period={ex.period} 
                />
              </div>
              <div className={`lg:col-span-4 ${i % 2 === 1 ? 'lg:order-1' : ''} space-y-6`}>
                <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-gold/20 rounded-full bg-gold/5">
                  <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase">Chronicle {i + 1}</span>
                </div>
                <h3 className="text-3xl font-serif text-ivory italic leading-tight">{ex.title}</h3>
                <p className="text-text-muted font-serif italic text-lg leading-relaxed">
                  {ex.description}
                </p>
                <div className="pt-6">
                  <button 
                    onClick={() => handleOpenModal(ex)}
                    className="flex items-center gap-3 text-gold text-[10px] font-bold uppercase tracking-[0.3em] hover:gap-5 transition-all group"
                  >
                    <div className="w-12 h-px bg-gold/30 group-hover:bg-gold transition-colors"></div>
                    Learn Full History
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <HeritageModal post={selectedEx} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </section>
  );
};


const stateHeritageData = [
  { id: 'rj', name: "Rajasthan", title: "Land of Kings", history: "Home to the valorous Rajputs, magnificent forts of Chittorgarh, and the desert kingdoms of Jaipur and Udaipur.", img: "/src/assets/images/regenerated_image_1777992831600.jpg", fullHistory: "Rajasthan's history dates back to the Indus Valley Civilization. By the 7th century, the Rajputs established several kingdoms, including the House of Mewar. This era was defined by a code of chivalry and legendary battles against various Sultanates. The Mughal Emperor Akbar later formed strategic alliances with Rajput kings, leading to a fusion of Persian and Indian architecture seen in Amber Fort. The state eventually integrated into independent India in 1949, preserving its royal heritage in modern cities like Jaipur, the 'Pink City'." },
  { id: 'mh', name: "Maharashtra", title: "Maratha Stronghold", history: "The land of Shivaji Maharaj, rock-cut Ajanta-Ellora wonders, and the rugged Western Ghats forts.", img: "/src/assets/images/regenerated_image_1777992834506.jpg", fullHistory: "Maharashtra has been a cultural crossroads since the Satavahana era. The rock-cut temples of Ajanta (Buddhist) and Ellora (Hindu, Buddhist, Jain) represent the pinnacle of ancient Indian rock-cut architecture. In the 17th century, Chhatrapati Shivaji Maharaj established the Maratha Empire, challenging the Mughal hegemony through innovative guerrilla warfare and a powerful navy. The Peshwas later expanded this empire across much of India. Today, Maharashtra is India's industrial powerhouse, with Mumbai serving as the financial and cultural capital." },
  { id: 'tn', name: "Tamil Nadu", title: "Dravidian Soul", history: "Cradle of the Chola, Chera, and Pandya empires. Famous for majestic Dravidian temples and classical arts.", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800", fullHistory: "Home to one of the world's oldest living civilizations, Tamil Nadu's history is synonymous with the great dynasties of the Chola, Chera, and Pandya. The Cholas, under Raja Raja I, created a maritime empire and built architectural marvels like the Brihadeeswarar Temple. The state is safe-keeper of the classical Tamil language and the intricate Bharatanatyam dance form. Its temples are characterized by massive 'Gopurams' (gateway towers) that define the skyline of holy cities like Madurai and Srirangam." },
  { id: 'up', name: "Uttar Pradesh", title: "Heartland of Antiquity", history: "The setting of the Ramayana and Mahabharata. Home to Magadha, Mughals, and the historic cities of Kashi and Agra.", img: "/src/assets/images/regenerated_image_1777992837666.jpg", fullHistory: "Uttar Pradesh is the spiritual and cultural heart of India. It was the center of the powerful Mahajanapadas, including the Magadha Empire. The holy city of Kashi (Varanasi) is one of the world's oldest continuously inhabited cities. During the medieval period, the state became the core of the Mughal Empire, witnessing the construction of the Taj Mahal and Fatehpur Sikri. It played a pivotal role in the 1857 First War of Indian Independence through leaders in Lucknow and Kanpur." },
  { id: 'ka', name: "Karnataka", title: "Empire of Vijayanagara", history: "The golden era of Krishnadevaraya in Hampi, and the grand heritage of Badami Chalukyas.", img: "/src/assets/images/regenerated_image_1777992840487.jpg", fullHistory: "Karnataka's history spans from the Mauryan empire to the powerful houses of Chalukyas and Hoysalas. Its zenith was reached during the Vijayanagara Empire (14th-17th century), which stood as a bastion of Hindu culture. The ruins of Hampi, a UNESCO site, reveal the scale of its former glory. Later, Hyder Ali and Tipu Sultan of Mysore resisted British colonial expansion. Today, Karnataka blends this rich antiquity with its status as a global technology hub in Bengaluru." },
  { id: 'wb', name: "West Bengal", title: "Cultural Renaissance", history: "Centre of the Indian National Movement and the Bengal Renaissance. Land of Palas and Nawabs.", img: "/src/assets/images/regenerated_image_1777992843708.jpg", fullHistory: "Bengal was once the most prosperous province of the Mughal Empire. After the Battle of Plassey in 1757, it became the nerve center of British colonial rule in India. This spurred the Bengal Renaissance in the 19th century, led by visionaries like Raja Ram Mohan Roy and Rabindranath Tagore. The state was a forge for revolutionary independence movements. Its heritage is marked by Terracotta temples in Bishnupur and the Victorian grandeur of Kolkata." },
  { id: 'kl', name: "Kerala", title: "God's Own Country", history: "Legendary maritime trade post. Home to the Chera Dynasty and ancient churches, synagogues, and temples.", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800", fullHistory: "Kerala's history is shaped by its spice-rich coast, which attracted Phoenician, Roman, and Arab traders. The ancient port of Muziris was a hub of global commerce. Following the arrival of Vasco da Gama in 1498, it became a focal point of European colonial interest (Portuguese, Dutch, and British). The state is known for its syncretic culture where diverse religious traditions have coexisted for centuries. It boasts a tradition of classical theatre like Kathakali and the martial art Kalaripayattu." },
  { id: 'gj', name: "Gujarat", title: "Gateway to the West", history: "From the Indus Valley site of Lothal to the mercantile brilliance of the Solanki dynasty.", img: "/src/assets/images/regenerated_image_1777993214666.jpg", fullHistory: "Gujarat's shoreline hosted the ancient Lothal, one of the primary ports of the Indus Valley Civilization. It later flourished under the Solanki kings, who built the exquisite Sun Temple at Modhera and Rani ki Vav. As a maritime trade center, it has always been outward-looking. The state is the birthplace of Mahatma Gandhi and served as a base for the non-violent struggle for freedom. Its architectural heritage is a rich tapestry of Hindu, Jain, and Islamic styles." },
  { id: 'pb', name: "Punjab", title: "Shield of Bharat", history: "The sacred land of Five Rivers and the valorous Sikh Empire founded by Maharaja Ranjit Singh.", img: "/src/assets/images/regenerated_image_1777993216024.jpg", fullHistory: "Known as the 'Granary of India,' Punjab's history is one of resilience. It was the entry point for numerous historical migrations and invasions. In the 15th century, Guru Nanak founded Sikhism, which profoundly shaped the region's social and spiritual identity. Maharaja Ranjit Singh consolidated a powerful Sikh Empire in the 19th century. The state suffered the trauma of Partition in 1947 but rebounded through the Green Revolution, becoming a symbol of agricultural prosperity." },
  { id: 'br', name: "Bihar", title: "Cradle of Enlightenment", history: "The land of Nalanda, the Mauryan Empire, and the birthplace of Buddhism and Jainism.", img: "/src/assets/images/regenerated_image_1777993218344.jpg", fullHistory: "Bihar is essentially the birthplace of ancient Indian empires. It was the heart of the Magadha Empire, which under Chandragupta Maurya and Ashoka the Great, unified most of South Asia. It is the land where Gautama Buddha attained enlightenment at Bodh Gaya and where Lord Mahavira was born. Nalanda and Vikramshila universities made Bihar a global center for learning. Its history is a record of profound intellectual and spiritual revolutions." },
  { id: 'mp', name: "Madhya Pradesh", title: "Heart of Heritage", history: "Home to Khajuraho's architectural poetry, Sanchi's peace, and the rock shelters of Bhimbetka.", img: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?auto=format&fit=crop&q=80&w=800", fullHistory: "Centrally located, Madhya Pradesh holds the record of human habitation from the Paleolithic era in the Bhimbetka rock shelters. It houses the Great Stupa of Sanchi, commissioned by Emperor Ashoka. The Chandela dynasty built the world-renowned erotic and spiritual temples of Khajuraho between 950 and 1050 AD. The Gwalior Fort and the deserted city of Mandu are testaments to its later medieval prominence. It is a state where prehistoric art and imperial grandeur meet." },
  { id: 'od', name: "Odisha", title: "Soul of Kalinga", history: "Land of the maritime Kalinga empire, world-famous Konark Sun Temple, and ancient rock edicts.", img: "/src/assets/images/regenerated_image_1777993220563.jpg", fullHistory: "Odisha was known in ancient times as Kalinga. The Kalinga War (261 BC) was a turning point for Emperor Ashoka, leading him to embrace Buddhism. The state developed a unique temple architecture style known as Kalinga Architecture, seen in the Lingaraja and Puri Jagannath temples. The Sun Temple at Konark, built in the shape of a massive chariot, is an engineering marvel. Odisha also has a rich maritime history, with merchants trading as far as Bali and Sumatra." },
  { id: 'tg', name: "Telangana", title: "Dominion of Nizams", history: "Legacy of the Qutb Shahi rulers and the magnificent Kakatiya dynasty. Land of the Charminar.", img: "/src/assets/images/regenerated_image_1777993741498.jpg", fullHistory: "Telangana was once the heart of the Kakatiya Empire (12th-14th centuries), known for unique temple architecture and engineering. After its fall, the Qutb Shahi dynasty established themselves in Golconda and later founded Hyderabad. The Nizams eventually became the rulers, making Hyderabad one of the richest princely states in British India. The state's history is a blend of Persian-inflected culture and ancient Telugu traditions, epitomized by the Charminar and Golconda Fort." },
  { id: 'ap', name: "Andhra Pradesh", title: "Glory of Kakatiyas", history: "Ancient Buddhist roots at Amaravati and the architectural splendor of the Vijayanagara frontiers.", img: "/src/assets/images/regenerated_image_1777993743713.jpg", fullHistory: "Andhra Pradesh has roots in the Satavahana dynasty, which was prominent in the Deccan after the Mauryas. It was a major center for early Buddhism, as evidenced by the stupas at Amaravati and Nagarjunakonda. The state later saw the rule of the Eastern Chalukyas and the Kakatiyas. Its coastline was a major window for trade and cultural exchange with Southeast Asia. It is also the home of the world-famous Kuchipudi dance and the religious hub of Tirumala." },
  { id: 'as', name: "Assam", title: "Legacy of Ahoms", history: "The invincible Ahom Kingdom that ruled for 600 years and the spiritual land of Kamakhya.", img: "/src/assets/images/regenerated_image_1777993745219.jpg", fullHistory: "Assam's history is uniquely defined by the Ahom Dynasty, which migrated from present-day Myanmar and ruled for nearly 600 years (1228-1826), successfully repelling multiple Mughal invasions. Before the Ahoms, the region was known as Kamarupa. It is home to the Kamakhya Temple, a seat of Tantric worship. The colonial era introduced large-scale tea plantations, which transformed its economy. Assam is also a land of Vaishnavite spirituality, centered around the 'Satras' founded by Srimanta Sankardev." },
  { id: 'hr', name: "Haryana", title: "Battlefield of Mahabharata", history: "The epic land of Kurukshetra where history and mythology intertwined to shape the Vedic culture.", img: "/src/assets/images/regenerated_image_1777994357147.jpg", fullHistory: "Haryana is deeply rooted in India's proto-history. Kurukshetra is the legendary site of the Mahabharata war and the place where the Bhagavad Gita was delivered. The region was also home to part of the Indus Valley Civilization (Rakhi Garhi). Throughout the medieval era, being near Delhi, it was the site of several decisive battles (Panipat) that determined India's fate. Today, it is a leading player in India's agricultural and modern industrial growth." },
  { id: 'hp', name: "Himachal Pradesh", title: "Abode of Snow", history: "Quiet valleys that served as retreats for sages and historical mountain kingdoms of Kangra.", img: "/src/assets/images/regenerated_image_1777994359611.jpg", fullHistory: "Himachal's history is a collection of small mountain principalities like Kangra, Kullu, and Chamba. These states were known for their unique Pahari miniature paintings. The region was a retreat for sages and part of ancient trans-Himalayan trade routes. Shimla later became the summer capital of British India. The state's rugged terrain has preserved its distinct folk cultures and wooden temple architecture, such as the Hidimba Devi Temple in Manali." },
  { id: 'jk', name: "Jammu & Kashmir", title: "Crown of India", history: "Synthesizing Buddhist, Shaivite, and Sufi traditions. Land of Kalhana, Lal Ded, and Nund Rishi.", img: "/src/assets/images/regenerated_image_1777994362759.jpg", fullHistory: "The history of J&K is a rich synthesis of religions and philosophies. Kalhana's Rajatarangini (12th century) provides a rare chronological record of its early rulers. It was a center for Sanskrit learning and later for Sufi mysticism. The Mughal emperors referred to it as 'Paradise on Earth' and built famous gardens in Srinagar. The Dogra dynasty unified the diverse regions of Jammu, Kashmir, and Ladakh in the 19th century into a single princely state." },
  { id: 'jh', name: "Jharkhand", title: "Land of Forests", history: "Sacred tribal kingdoms and the ancient Jain temples of Shikharji atop the Parasnath hills.", img: "/src/assets/images/regenerated_image_1777994366084.jpg", fullHistory: "Jharkhand is characterized by its tribal history. Groups like the Santhals and Mundas have lived here for millennia, often resisting outside encroachment through leaders like Birsa Munda. The region is home to the Parasnath hills, the most sacred pilgrimage site for Jains (Sammeta Shikhar). During British rule, its mineral wealth became critical, leading to the establishment of India's first industrial city, Jamshedpur. It remains a state where deep tribal culture meets heavy industry." },
  { id: 'cg', name: "Chhattisgarh", title: "Thirty Six Forts", history: "Abode of tribal heritage and the ancient temple city of Sirpur, a center of Buddhist learning.", img: "/src/assets/images/regenerated_image_1777994370009.jpg", fullHistory: "In ancient times, Chhattisgarh was known as South Kosala. It was a flourishing center of Buddhist learning and Hindu temple construction under the Sarabhapuriya and Somavamshi dynasties. The brick-built Lakshmana Temple at Sirpur is an archaeological treasure. The region's name likely comes from its 36 ancient forts. Its history is also deeply tribal, with the Bastar region preserving unique Ghotul social traditions and vibrant iron and bell-metal crafts." },
  { id: 'uk', name: "Uttarakhand", title: "Dev Bhoomi", history: "Spiritual gateway of India, home to Badrinath-Kedarnath and the ancient Katyuri kings.", img: "https://images.unsplash.com/photo-1554162088-7e53f1ee9048?auto=format&fit=crop&q=80&w=800", fullHistory: "Known as 'Land of the Gods,' Uttarakhand has been a spiritual magnet for millennia. Ancient eparchies like the Katyuri and Chand dynasties ruled its valleys. It is the location of the Char Dham (Yamunotri, Gangotri, Kedarnath, and Badrinath) which form a core part of Hindu pilgrimage. The state also has a history of environmental activism, most notably the Chipko Movement started in the 1970s. It remains a tranquil refuge of high peaks and sacred rivers." },
  { id: 'ga', name: "Goa", title: "Rome of the East", history: "A unique fusion of Indian and Portuguese cultures, land of the Kadamba dynasty and old churches.", img: "https://images.unsplash.com/photo-1512757776214-26d36777b513?auto=format&fit=crop&q=80&w=800", fullHistory: "Goa's ancient history includes the rule of the Kadambas and the Vijaynagara Empire. It took a unique turn in 1510 when the Portuguese captured it, making it their capital in Asia for 450 years. This led to a distinct Luso-Indian culture, visible in its language, cuisine, and Baroque churches. Goa was integrated into India in 1961 via Operation Vijay. Today, it is famous for its beaches and its blend of Western and Indian heritage, particularly in the Konkani language." },
  { id: 'sk', name: "Sikkim", title: "Peak of Purity", history: "The Namgyal dynasty and the spiritual legacy of the Guru Rinpoche under the Kanchenjunga.", img: "https://images.unsplash.com/photo-1550951160-843867623992?auto=format&fit=crop&q=80&w=800", fullHistory: "Sikkim's early history involves its indigenous Lepcha people. In the 17th century, it was established as a Buddhist kingdom under the Namgyal dynasty (Chogyals). Legend says Guru Rinpoche blessed the land in the 8th century. It became a British protectorate in the 19th century due to its strategic position on the road to Tibet. In 1975, following a referendum, it joined India as its 22nd state. It is now a global leader in organic farming and environmental preservation." },
  { id: 'mn', name: "Manipur", title: "Jewel of India", history: "Ancient Kangleipak kingdom with a history of profound cultural resilience and martial arts.", img: "https://images.unsplash.com/photo-1623101569083-d58674723049?auto=format&fit=crop&q=80&w=800", fullHistory: "Manipur has a history of over 2000 years, centered on the Meitei Kangleipak kingdom. The region was a hub of cultural exchange between India and Southeast Asia. It developed unique traditions like the Manipuri classical dance and various forms of indigenous polo. The state witnessed fierce battles during World War II when Japanese forces reached the gates of Imphal. Its history is marked by a deep sense of identity and a long lineage of warrior-scholars." },
  { id: 'ml', name: "Meghalaya", title: "Abode of Clouds", history: "Centuries-old Khasi, Jaintia, and Garo clans known for their unique matrilineal social structure.", img: "https://images.unsplash.com/photo-1528148816576-963d3326f634?auto=format&fit=crop&q=80&w=800", fullHistory: "Meghalaya's history is the history of its tribes—the Khasi, Jaintia, and Garo. For centuries, they maintained independent chieftainships based on clans. They are notable for one of the few matrilineal societies in the world, where lineage and inheritance are traced through women. The British established Shillong as a hill station and regional administrative center. Known for its living root bridges and heavy rainfall, the state's heritage is deeply tied to the natural world." },
  { id: 'nl', name: "Nagaland", title: "Land of Festivals", history: "Warrior clans with a rich tapestry of oral traditions and the legendary Hornbill spirit.", img: "https://images.unsplash.com/photo-1626014303757-6ea633599317?auto=format&fit=crop&q=80&w=800", fullHistory: "Nagaland is a collective home to 16 major tribes, each with its own language and distinct cultural protocols. Their history was largely oral, passed down through songs and stories of warriors and 'Morungs' (youth dormitories). The region saw significant action during WWII, particularly the Battle of Kohima. After years of negotiation for autonomy, it was created as a state in 1963. The Hornbill Festival is a modern celebration that brings these diverse tribal heritages together." },
  { id: 'mz', name: "Mizoram", title: "Land of Hill People", history: "Vibrant ethnic history of the Mizo tribes and their folklore of the deep blue mountains.", img: "https://images.unsplash.com/photo-1522511440788-df058098e945?auto=format&fit=crop&q=80&w=800", fullHistory: "The Mizos originally migrated from the Chin Hills of Myanmar into these lush mountain ranges. Their society was organized around hereditary village chiefs. In the late 19th century, the region came under British influence, and Christian missionaries had a transformative impact on its literacy and culture. After a period of insurgency in the 1960s-80s, the Mizo Peace Accord (1986) brought stability. Today, Mizoram is one of the most peaceful and literate states in India." },
  { id: 'tr', name: "Tripura", title: "Kingdom of Manikya", history: "One of the oldest continuously ruled princely states, known for the Unakoti rock carvings.", img: "https://images.unsplash.com/photo-1624385412423-7fa38c8e14b2?auto=format&fit=crop&q=80&w=800", fullHistory: "Tripura was an independent princely state ruled by the Manikya dynasty for nearly 500 years. The 'Rajmala', a royal chronicle, lists 184 kings. It has amazing archaeological sites like Unakoti (gigantic rock-cut murals) and the Ujjayanta Palace in Agartala. The state merged with independent India in 1949. Its history is a synthesis of indigenous Tripuri tribal culture and Bengali cultural influences, reflected in its art, music, and social customs." },
  { id: 'ar', name: "Arunachal Pradesh", title: "Land of Rising Sun", history: "Ancient spiritual retreats at Tawang and the mystical remains of the Bhismaknagar city.", img: "https://images.unsplash.com/photo-1581792984183-14574971c221?auto=format&fit=crop&q=80&w=800", fullHistory: "Arunachal's history is mentioned in the Kalika Purana and Mahabharata. It hosts the Tawang Monastery, the largest monastery in India and second largest in the world, founded in the 17th century. The ruins of Bhismaknagar (8th-12th century) suggest an ancient kingdom with brick architecture. The state has an immense diversity of tribes (over 100), each maintaining its own spiritual practices (many Animist or Buddhist). Its history is one of remote mountain survival and hidden spiritual gems." },
  { id: 'dl', name: "Delhi", title: "Imperial City", history: "Seat of seven ancient cities, from Indraprastha to the Mughal and British imperial capitals.", img: "https://images.unsplash.com/photo-1585467314765-06137c2c388b?auto=format&fit=crop&q=80&w=800", fullHistory: "Delhi is a historical palimpsest. Tradition identifies it with Indraprastha, the capital of the Pandavas. Since the 12th century, it has been the seat of empires—the Delhi Sultanate, the Mughals (who built Lal Qila and Jama Masjid), and later as the capital of the British Raj (New Delhi). Each era left a layer of architecture, from the Qutub Minar to Rashtrapati Bhavan. As the capital of modern India, it is a city where every corner has a story of power, conquest, and culture." },
  { id: 'la', name: "Ladakh", title: "Highest Plateau", history: "Strategic Silk Road outpost, and a spiritual bastion of Himalayan Buddhist heritage.", img: "https://images.unsplash.com/photo-1563821033280-91a566548545?auto=format&fit=crop&q=80&w=800", fullHistory: "Ladakh was an independent kingdom for nearly a millennium, strategically located at the crossroads of ancient trade routes between India, China, and Tibet. Its culture is deeply influenced by Tibetan Buddhism, with spectacular monasteries like Hemis and Thiksay. It was annexed by the Dogra dynasty of Jammu in the 19th century. Known as 'Little Tibet,' its high-altitude desert history is one of adaptation, spiritual devotion, and being a cultural bridge across the Himalayas." },
  { id: 'py', name: "Puducherry", title: "French Riviera of the East", history: "Historical site of Arikamedu trade with Rome and the later French colonial architectural legacy.", img: "https://images.unsplash.com/photo-1589793463357-5fb813435467?auto=format&fit=crop&q=80&w=800", fullHistory: "Puducherry's history goes back to Roman times, with Arikamedu serving as a key trade post. In 1674, it became a French colonial settlement and stayed so for nearly 300 years, long after the rest of India was British. This left a lasting legacy of French town planning and architecture in the White Town. It is also the home of the Sri Aurobindo Ashram, making it a place of both colonial history and modern spiritual exploration. It merged with India in 1954." }
];

// Full History Modal View
const FullHistoryModal = ({ isOpen, onClose, selectedState }: { isOpen: boolean, onClose: () => void, selectedState: any }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink/95 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className="relative w-full max-w-4xl bg-black border border-gold/20 rounded-sm overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Visual Side */}
          <div className="w-full md:w-2/5 relative h-48 md:h-auto">
            <img 
              src={selectedState.img} 
              className="w-full h-full object-cover brightness-50 grayscale" 
              alt={selectedState.name}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
            <div className="absolute bottom-8 left-8">
              <span className="text-gold text-[10px] font-bold uppercase tracking-[0.4em] block mb-2">{selectedState.title}</span>
              <h3 className="text-4xl font-serif text-ivory italic leading-tight">{selectedState.name}</h3>
            </div>
          </div>

          {/* Narrative Side */}
          <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-ink/50">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-px bg-gold/50" />
                <span className="text-gold text-[10px] uppercase font-bold tracking-[0.3em]">Historical Archives</span>
              </div>
              <button 
                onClick={onClose}
                className="text-gold/40 hover:text-gold transition-colors p-2"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-ivory font-serif italic text-2xl mb-6 leading-relaxed border-l-2 border-gold/30 pl-6">
                  {selectedState.history}
                </h4>
                <div className="space-y-6 text-ivory/70 font-serif italic text-lg leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-gold first-letter:mr-3 first-letter:float-left">
                  {(selectedState as any).fullHistory || "Full archive entry pending further research..."}
                </div>
              </div>

              {/* Aesthetic Detail */}
              <div className="pt-12 border-t border-gold/10 flex flex-wrap gap-8">
                <div className="space-y-1">
                  <span className="text-gold/40 text-[9px] uppercase font-bold tracking-widest block">Region Category</span>
                  <span className="text-ivory text-xs uppercase tracking-widest font-medium">Ancient Dominion</span>
                </div>
                <div className="space-y-1">
                  <span className="text-gold/40 text-[9px] uppercase font-bold tracking-widest block">Scroll Status</span>
                  <span className="text-ivory text-xs uppercase tracking-widest font-medium">Verified Chronicle</span>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const StateHeritageRegistry = () => {
  const [selectedState, setSelectedState] = useState(stateHeritageData[0]);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [savedStates, setSavedStates] = useState<string[]>([]);

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedStates(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <section id="states" className="py-32 md:py-48 bg-ink border-b border-gold/10 relative overflow-hidden">
      <FullHistoryModal isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} selectedState={selectedState} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">State Chronicles</span>
          <h2 className="text-5xl md:text-7xl font-serif text-ivory italic uppercase tracking-tight">Regional <span className="text-gold not-italic font-bold tracking-tighter">Legacy</span></h2>
          <p className="text-text-muted mt-8 max-w-xl mx-auto font-serif italic text-lg leading-relaxed">
            "Every province of Bharat is a living museum. Select a region to explore the scrolls of its local history."
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* List of States */}
          <div className="lg:col-span-4 h-[600px] overflow-y-auto pr-4 custom-scrollbar space-y-2">
            {stateHeritageData.map((state) => (
              <div
                key={state.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedState(state)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setSelectedState(state); e.preventDefault(); } }}
                className={`cursor-pointer w-full text-left p-4 transition-all duration-300 border rounded-sm group relative flex gap-4 items-center ${selectedState.id === state.id ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-gold/10 hover:border-gold/30 hover:bg-gold/5'}`}
              >
                {selectedState.id === state.id && (
                  <motion.div layoutId="active-state-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gold shadow-[0_0_10px_rgba(212,175,55,1)]" />
                )}
                
                <div className="w-16 h-16 shrink-0 overflow-hidden rounded-sm border border-gold/10 group-hover:border-gold/30 transition-colors">
                  <img 
                    src={state.img} 
                    alt={state.name} 
                    className={`w-full h-full object-cover transition-all duration-500 ${selectedState.id === state.id ? 'grayscale-0 opacity-100 scale-110' : 'grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110'}`} 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className={`text-lg font-serif tracking-wide italic transition-colors ${selectedState.id === state.id ? 'text-gold' : 'text-ivory group-hover:text-gold/80'}`}>{state.name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleSave(e, state.id)}
                        className={`p-1.5 rounded-full transition-all duration-300 ${savedStates.includes(state.id) ? 'bg-gold/20 text-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'text-gold/20 hover:text-gold/50 hover:bg-gold/5'}`}
                      >
                        <Bookmark size={12} fill={savedStates.includes(state.id) ? 'currentColor' : 'none'} />
                      </button>
                      <ChevronRight size={14} className={`transition-transform ${selectedState.id === state.id ? 'text-gold rotate-90' : 'text-gold/20'}`} />
                    </div>
                  </div>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-text-muted mt-1">{state.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Map/Display Visual */}
          <div className="lg:col-span-8 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedState.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative aspect-video rounded-sm overflow-hidden museum-glow border border-gold/10"
              >
                <img 
                  src={selectedState.img} 
                  alt={selectedState.name} 
                  className="w-full h-full object-cover brightness-50 contrast-125" 
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                  <div className="max-w-2xl">
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }} 
                      transition={{ delay: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-px bg-gold" />
                        <span className="text-gold text-[10px] font-bold uppercase tracking-[0.5em]">{selectedState.title}</span>
                      </div>
                      <h3 className="text-5xl md:text-6xl font-serif text-ivory italic leading-tight tracking-tight">
                        {selectedState.name} <span className="text-gold not-italic font-bold tracking-tighter">History</span>
                      </h3>
                      <p className="text-ivory/80 font-serif italic text-xl leading-relaxed">
                        "{selectedState.history}"
                      </p>
                      <div className="pt-8">
                        <button 
                          onClick={() => setIsArchiveOpen(true)}
                          className="flex items-center gap-4 text-gold text-xs font-bold uppercase tracking-widest group"
                        >
                          <span className="border-b border-gold/20 pb-2 group-hover:border-gold transition-colors">Read Full Archives</span>
                          <ScrollText size={20} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Decorative Map Vector Overlay (Stylized) */}
                <div className="absolute top-10 right-10 w-32 h-32 opacity-20 pointer-events-none group">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-gold">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                    <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="0.3" />
                    <motion.circle 
                      animate={{ r: [2, 5, 2], opacity: [0.3, 0.8, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      cx="50" cy="50" r="3" fill="currentColor" 
                    />
                  </svg>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Robust query: first get all, then handle sorting and nulls in mapping
    const q = query(collection(db, 'artifacts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artifact));
      setArtifacts(docs);
      setLoading(false);
    }, (error) => {
      console.error("Firestore List Error:", error);
      handleFirestoreError(error, OperationType.LIST, 'artifacts');
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <section id="gallery" className="py-32 md:py-48 bg-ink relative overflow-hidden border-y border-gold/10">
      <div className="bg-radial-glow absolute inset-0 opacity-40"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">Historical Archives</span>
          <h2 className="text-5xl md:text-7xl font-light text-ivory font-serif italic leading-tight uppercase tracking-tight">Archive of <br /><span className="text-gold not-italic font-bold tracking-tighter">Historical Marvels</span></h2>
          <p className="text-text-muted mt-8 max-w-xl mx-auto font-serif italic text-lg leading-relaxed">
            "A collection of ancient wonders from our history. These are the treasures of our ancestors."
          </p>
          <div className="w-24 h-px bg-gold/40 mx-auto mt-12"></div>
        </div>

        <div className="mt-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-gold w-12 h-12" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-16" style={{ perspective: '1200px' }}>
              {artifacts.length > 0 ? (
                artifacts.map((art, i) => (
                  <Artifact3D key={art.id || i} item={art} i={i} />
                ))
              ) : (
                <div className="col-span-3 text-center py-20 border border-gold/10 glass-card">
                  <p className="text-text-muted font-serif italic">The archive is currently being restoration. Please check back later for more marvels.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-20 text-center">
          <button className="cta-button">
            Launch Virtual Museum
          </button>
        </div>
      </div>
    </section>
  );
};

const Teaching = () => {
  const courses = [
    { title: 'The Rise of Ancient Kingdoms', code: 'IND301', level: 'Post Graduate', description: 'Study of administrative systems in the Chandragupta Maurya era.' },
    { title: 'Spices & Spells: Ancient Trade', code: 'IND405', level: 'PhD Course', description: 'Deep study of Indias trade relations with the world in medieval times.' },
    { title: 'Preserving Heritage Sites', code: 'ARC209', level: 'Undergraduate', description: 'New ways to save our ancient temples and historical locations.' },
  ];

  return (
    <section id="teaching" className="py-32 md:py-48 bg-ink text-ivory border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block">Teaching Journey</span>
            <h2 className="text-5xl md:text-7xl font-light mb-10 font-serif italic leading-tight uppercase tracking-tight">Classroom & <br /><span className="text-gold not-italic font-bold tracking-tighter">Guidance</span></h2>
            <p className="text-text-muted text-lg font-serif mb-8 leading-relaxed italic">
              "To teach history is to prepare our students for a better tomorrow. My goal is to make every student feel proud of our rich cultural heritage."
            </p>
            <p className="text-text-muted text-lg font-serif mb-16 leading-relaxed italic">
              In my thirty years of academic service, I have seen how the study of our past can ignite a flame of consciousness in the young mind. Teaching is not merely the transfer of information; it is the cultivation of a historical perspective—a way to see the present as a continuation of a grand, millenary narrative.
            </p>
            
            <div className="space-y-8">
              {courses.map((course, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 glass-card group hover:border-gold transition-all rounded-sm cursor-default"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-mono tracking-widest text-gold">{course.code}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">{course.level}</span>
                  </div>
                  <h4 className="text-2xl font-serif italic mb-4 group-hover:text-gold transition-colors">{course.title}</h4>
                  <p className="text-sm text-text-muted font-serif leading-relaxed line-clamp-2">{course.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="relative group order-1 lg:order-2">
            <div className="absolute inset-4 border border-gold/20 rounded-sm -z-0"></div>
            <img 
              src="/src/assets/images/regenerated_image_1777923838914.jpg" 
              alt="Lecture Hall" 
              className="relative z-10 w-full h-full object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all duration-1000 shadow-2xl brightness-75"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute -bottom-10 -right-10 z-20 glass-card p-10 text-ivory max-w-[280px] shadow-2xl border-gold/40">
              <GraduationCap className="mb-6 w-10 h-10 text-gold" />
              <h4 className="text-2xl font-serif italic mb-3">EXPERIENCE</h4>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">30 yrs of teaching experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BlogModal = ({ post, isOpen, onClose }: { post: any | null, isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && post && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/95 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative bg-ink/40 border border-gold/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl glass-card no-scrollbar"
          >
            <button onClick={onClose} className="absolute top-8 right-8 z-20 text-text-muted hover:text-gold transition-colors">
              <X size={28} />
            </button>
            
            <div className="p-10 md:p-20">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">{post.date}</span>
                <div className="w-12 h-px bg-gold/20"></div>
              </div>
              
              <h3 className="text-4xl md:text-6xl font-serif text-ivory italic leading-tight mb-12">{post.title}</h3>
              
              <div className="prose prose-invert prose-gold max-w-none">
                <div className="text-text-muted font-serif leading-loose space-y-8 text-xl whitespace-pre-line selection:bg-gold/30">
                  {post.content}
                </div>
              </div>
              
              <div className="mt-20 pt-10 border-t border-gold/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <ScrollText size={14} className="text-gold" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Part of the Digital Bharat Archive</span>
                </div>
                <button 
                  onClick={onClose}
                  className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-ivory transition-colors"
                >
                  Close Manuscript
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState([
    { 
      title: 'The Lost Rivers of Saraswati', 
      date: 'Oct 24, 2023', 
      excerpt: 'How ancient people lived on the banks of rivers that are gone now...',
      content: `The Saraswati was once the lifeblood of ancient Bharat, a river so mighty it was hailed in the Rigveda as 'Ambitame, Naditame, Devitame'—the best of mothers, the best of rivers, the best of goddesses. For centuries, this river was considered a myth, a poetic exaggeration of a nomadic people. However, modern geological surveys and satellite imagery have changed the narrative.

      Our investigations in the Thar Desert have uncovered vast paleo-channels, silent witnesses to a time when these arid sands were lush floodplains. The Saraswati was not just a source of water; it was the cradle of a sophisticated urban civilization. 

      The tragedy of the Saraswati is a story of tectonic shifts and climatic transformation. As the Himalayas rose, the Yamuna and Sutlej, which once fed the Saraswati, were diverted eastward and westward. Deprived of its glacial source, the river began to retreat. This was not a sudden catastrophe but a slow, agonizing drying that lasted generations.

      This cultural exodus forced our ancestors to migrate, shaping the geography of our civilization as we know it today. The memory of the Saraswati survives in the 'Sangam' at Prayagraj—where the invisible river still flows in the hearts of millions.`
    },
    { 
      title: 'Indus Scripts: Decoding Our Past', 
      date: 'Sep 12, 2023', 
      excerpt: 'New technology is helping us read the messages left by our ancestors...',
      content: `For nearly a century, the Indus script has stood as the greatest unsolved puzzle of antiquity. Across thousands of steatite seals discovered from Mohenjo-Daro to Lothal, these enigmatic symbols have teased historians with the promise of a lost worldview.

      Each seal, measuring no more than a few centimeters, carries a universe of meaning. They were the ID cards, the trade marks, and perhaps the prayers of the Harappan people. The 'Unicorn' seal, the 'Pashupati' figure, and the geometric signs suggest a society that was highly organized and deeply symbolic.

      My research into the frequency and positioning of these signs suggests a complex linguistic structure. Unlike simple pictograms, the Indus script appears to be logosyllabic. We are looking for patterns that might reveal names of merchants, titles of officials, or names of deities.

      We are now at the threshold of a new era. Using AI-driven pattern recognition and computational linguistics, we are beginning to see the 'syntax' of the script. While we may not yet have a Rosetta Stone, the digital scribes are helping us hear the whispers of the Lothal markets once again.`
    },
    { 
      title: 'Temples of the Chola Kings', 
      date: 'Aug 05, 2023', 
      excerpt: 'The engineering secrets behind the grand temples of South India...',
      content: `Standing before the Brihadisvara Temple in Thanjavur, one is struck by an overwhelming sense of the audacious. Known as the 'Dakshina Meru', this temple is a physical manifestation of the Chola Empire's cosmic ambitions.

      How did the architects of Rajaraja Chola I achieve such perfection? The main vimana rises 216 feet, a skyscraper of granite in an age before modern machinery. Most remarkable is the Kumbam—the monolithic granite capstone. This 80-ton marvel was reportedly moved to the summit along a ramp that stretched four miles into the surrounding countryside.

      This was not just an engineering feat; it was a feat of logistics and statecraft. The inscriptions on the temple walls are a meticulous record of every offering, every dancer, every musician, and every village that contributed to the temple's maintenance. It was the heart of the Chola economy.

      The narrative hidden in the stone tells of a state that valued the perfection of the aesthetic as much as the precision of the sword. The bronze Natarajas cast in the royal workshops represent the pinnacle of metallurgical science and spiritual grace. To study the Chola temples is to study the soul of a kingdom that understood that grandeur must be built for eternity.`
    },
  ]);

  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Poetic & Scholarly');
  const [length, setLength] = useState('Medium');
  const [draft, setDraft] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDraft = async () => {
    if (!topic.trim()) {
      setError("Please provide a topic or keywords.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setDraft(null);

    try {
      const response = await fetch('/api/ai/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone, length })
      });

      const data = await response.json();

      if (response.ok && data.text) {
        setDraft(data.text);
      } else {
        throw new Error(data.error || "No response from AI library.");
      }
    } catch (err: any) {
      console.error("AI Blog Error:", err);
      if (err.message === "GEMINI_API_KEY_MISSING") {
        setError("AI integration key missing. Please configure GEMINI_API_KEY in the Secrets panel.");
      } else if (err.message?.toLowerCase().includes("too many requests")) {
        setError("The digital archives are currently busy. Please try again after some time.");
      } else {
        setError("The digital scriptorium is temporarily closed. Please try again later.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="blog" className="py-32 md:py-48 bg-ink border-y border-gold/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">Diary</span>
            <h2 className="text-5xl md:text-7xl font-serif text-ivory italic uppercase tracking-tight">Stories & <span className="text-gold not-italic font-bold tracking-tighter">Blogs</span></h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <button 
              onClick={() => setIsAiOpen(!isAiOpen)}
              className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gold hover:text-ivory transition-colors border-b border-gold/20 pb-2"
            >
              <Sparkles size={16} /> AI Draft Generator
            </button>
            <a href="#" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold hover:text-ivory transition-colors border-b border-gold/20 pb-2">
              View full chronicle <ChevronRight size={16} />
            </a>
          </div>
        </div>

        <AnimatePresence>
          {isAiOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-24 overflow-hidden"
            >
              <div className="glass-card p-10 md:p-16 border-gold/30">
                <div className="max-w-4xl">
                  <div className="flex items-center gap-4 mb-8">
                    <Sparkles className="text-gold" size={24} />
                    <h3 className="text-3xl font-serif text-ivory italic uppercase">Manuscript Architect</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-10 mb-12">
                    <div className="md:col-span-1 border-r border-gold/10 pr-10">
                      <div className="space-y-8">
                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted mb-3 block">Research Topic</label>
                          <textarea 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. The irrigation systems of the Hampi empire..."
                            className="w-full bg-ink/40 border border-gold/10 p-4 rounded-sm outline-none focus:border-gold transition-colors font-serif italic text-ivory text-sm h-32 resize-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted mb-3 block">Tone</label>
                          <select 
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="w-full bg-ink/40 border border-gold/10 p-4 rounded-sm outline-none focus:border-gold transition-colors font-serif text-ivory text-sm"
                          >
                            <option value="Poetic & Scholarly">Poetic & Scholarly</option>
                            <option value="Scientific & Analytical">Scientific & Analytical</option>
                            <option value="Storytelling & Narrative">Storytelling & Narrative</option>
                            <option value="Provocative & Critical">Provocative & Critical</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted mb-3 block">Length</label>
                          <div className="flex gap-2">
                            {['Short', 'Medium', 'Long'].map((l) => (
                              <button
                                key={l}
                                onClick={() => setLength(l)}
                                className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-widest transition-all rounded-sm ${length === l ? 'bg-gold text-ink' : 'bg-ink/40 border border-gold/10 text-text-muted hover:border-gold/40'}`}
                              >
                                {l}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button 
                          onClick={generateDraft}
                          disabled={isGenerating}
                          className="w-full cta-button flex items-center justify-center gap-3 py-6"
                        >
                          {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                          {isGenerating ? 'SUMMONING SCROLL...' : 'GENERATE DRAFT'}
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      {draft ? (
                        <div className="space-y-8 animate-in fade-in duration-700">
                          <div className="flex justify-between items-center pb-4 border-b border-gold/10">
                            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-gold">Draft Generated Successfully</span>
                            <button 
                              onClick={() => setDraft(null)}
                              className="text-[10px] uppercase font-bold tracking-widest text-text-muted hover:text-gold transition-colors"
                            >
                              Clear
                            </button>
                          </div>
                          <div className="prose prose-invert prose-gold max-w-none">
                            <div className="whitespace-pre-line text-ivory/90 font-serif leading-loose text-lg selection:bg-gold/30">
                              {draft}
                            </div>
                          </div>
                          <div className="pt-8 border-t border-gold/10 flex gap-6">
                            <button 
                              className="text-[10px] uppercase font-bold tracking-widest text-gold hover:text-ivory transition-colors"
                              onClick={() => {
                                // Add to a temp store or copy
                                navigator.clipboard.writeText(draft);
                              }}
                            >
                              Copy to Clipboard
                            </button>
                            <span className="text-text-muted/40 italic text-sm">Created by the Manuscript Architect AI</span>
                          </div>
                        </div>
                      ) : isGenerating ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-6">
                          <div className="relative">
                            <div className="w-16 h-16 border-2 border-gold/20 rounded-full border-t-gold animate-spin"></div>
                            <Sparkles className="absolute inset-0 m-auto text-gold animate-pulse" size={24} />
                          </div>
                          <p className="text-text-muted font-serif italic text-lg">Consulting the archives of knowledge...</p>
                        </div>
                      ) : error ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-6 bg-red-900/5 rounded-sm">
                          <X className="text-red-500/50 mb-4" size={48} />
                          <p className="text-red-400 font-serif italic text-lg max-w-md">{error}</p>
                          <button 
                            onClick={() => setError(null)}
                            className="bg-red-500/10 text-red-400 px-6 py-2 rounded-sm text-[10px] uppercase font-bold tracking-widest hover:bg-red-500/20 transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center opacity-40">
                          <ScrollText className="text-gold/30 mb-8" size={64} />
                          <p className="text-text-muted font-serif italic text-xl max-w-md">
                            "Provide a spark of an idea, and witness it transform into a manuscript."
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-3 gap-10">
          {posts.map((post, i) => (
            <motion.article 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => { setSelectedPost(post); setIsBlogModalOpen(true); }}
              className="glass-card p-10 lg:p-16 group hover:border-gold transition-all duration-500 rounded-sm cursor-pointer"
            >
              <span className="text-[10px] uppercase tracking-widest text-gold/40 mb-8 block font-mono">{post.date}</span>
              <h3 className="text-3xl font-serif mb-8 group-hover:text-gold transition-colors leading-tight italic uppercase">{post.title}</h3>
              <p className="text-text-muted font-serif mb-10 text-base leading-relaxed line-clamp-3">{post.excerpt}</p>
              <button className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-gold group-hover:text-ivory transition-colors">
                Read Narrative <ScrollText size={16} />
              </button>
            </motion.article>
          ))}
        </div>

        <BlogModal 
          post={selectedPost}
          isOpen={isBlogModalOpen}
          onClose={() => setIsBlogModalOpen(false)}
        />
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setStatusMessage(data.message || 'Thank you. Your message has been sent to processing scrolls.');
        setFormData({ name: '', institution: '', email: '', message: '' });
      } else {
        throw new Error(data.error || 'The digital scribe failed to deliver your message.');
      }
    } catch (error: any) {
      console.error('Contact Error:', error);
      setStatus('error');
      setStatusMessage(error.message || 'The digital library is currently unreachable.');
    }
  };

  return (
    <section id="contact" className="py-32 md:py-48 bg-ink border-t border-gold/10 relative overflow-hidden">
      <div className="bg-radial-glow absolute inset-0 opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 relative z-10">
        <div>
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block">Sampark</span>
          <h2 className="text-5xl md:text-7xl font-light text-ivory mb-12 font-serif italic leading-tight uppercase">Get in <br /><span className="text-gold not-italic font-bold tracking-tighter">Touch</span></h2>
          <p className="text-text-muted text-xl font-serif mb-16 leading-relaxed italic">
            "I am always happy to speak with young students, fellow teachers, and researchers. Please reach out for any academic help."
          </p>
          
          <div className="space-y-10">
            <div className="flex items-start gap-8 group">
              <div className="p-5 glass-card rounded-sm text-gold group-hover:bg-gold group-hover:text-ink transition-all shadow-xl">
                <Mail size={28} />
              </div>
              <div>
                <h4 className="text-text-muted uppercase tracking-widest text-[10px] mb-2 font-bold">Email Address</h4>
                <p className="text-xl font-serif italic">anjankuamrpal257@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-8 group">
              <div className="p-5 glass-card rounded-sm text-gold group-hover:bg-gold group-hover:text-ink transition-all shadow-xl">
                <Globe size={28} />
              </div>
              <div>
                <p className="text-xl font-serif italic">Depatment of History</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-12 lg:p-20 shadow-2xl rounded-sm border-gold/20 relative">
          <div className="absolute top-10 right-10 text-gold/30 text-[10px] font-mono uppercase tracking-widest">SI. NO: 0822-CL</div>
          
          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-8 py-10"
            >
              <div className="w-20 h-20 rounded-full border-2 border-gold flex items-center justify-center text-gold">
                <Check size={40} />
              </div>
              <h3 className="text-3xl font-serif text-ivory italic uppercase">Manuscript Received</h3>
              <p className="text-text-muted max-w-sm font-serif">{statusMessage}</p>
              <button 
                onClick={() => setStatus('idle')}
                className="text-[10px] uppercase font-bold tracking-widest text-gold hover:text-ivory transition-colors border-b border-gold/20 pb-2"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form className="space-y-10 relative z-10" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-gold/20 py-4 px-1 outline-none focus:border-gold transition-colors font-serif italic text-lg text-ivory" 
                    placeholder="Your Name" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted">College / Institution</label>
                  <input 
                    type="text" 
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full bg-transparent border-b border-gold/20 py-4 px-1 outline-none focus:border-gold transition-colors font-serif italic text-lg text-ivory" 
                    placeholder="Your College Name" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-gold/20 py-4 px-1 outline-none focus:border-gold transition-colors font-serif italic text-lg text-ivory" 
                  placeholder="your@email.com" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Message</label>
                <textarea 
                  rows={4} 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent border-b border-gold/20 py-4 px-1 outline-none focus:border-gold transition-colors font-serif italic text-lg text-ivory resize-none" 
                  placeholder="How can I help you?"></textarea>
              </div>
              
              {status === 'error' && (
                <div className="bg-red-500/10 border-l-2 border-red-500 p-4 text-red-400 text-sm font-serif italic">
                  {statusMessage}
                </div>
              )}
              
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="cta-button w-full justify-center flex items-center gap-4 py-6 font-bold disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <>DELIVERING... <Loader2 className="animate-spin" size={18} /></>
                ) : (
                  <>Send Message <ScrollText size={18} /></>
                )}
              </button>
            </form>
          )}
          <div className="absolute bottom-10 right-10 opacity-5 pointer-events-none text-9xl font-serif italic text-gold select-none uppercase -z-0">LEGACY</div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsAdminLoginOpen(false);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const stats = [
    { label: 'Lectures Given', value: '120+' },
    { label: 'Teaching Service', value: '30y' },
  ];

  return (
    <footer className="bg-ink border-t border-gold/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-12 mb-20 border-b border-gold/10 pb-20">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-4xl text-gold font-serif italic mb-2 tracking-tight">{stat.value}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-serif text-ivory/80 mb-2 italic tracking-widest uppercase">DR. ANJAN KUMAR PAL</h2>
            <span className="text-[10px] uppercase tracking-[0.6em] text-gold font-bold">Bharatiya Itihas Legacy • MMXXIV</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12 mb-16">
            {['Archives', 'Expeditions', 'Lectures', 'Legacy'].map((link) => (
              <a key={link} href="#" className="nav-link hover:text-gold transition-colors">{link}</a>
            ))}
            {user ? (
              <button 
                onClick={handleLogout}
                className="nav-link hover:text-gold transition-colors flex items-center gap-2"
              >
                <LogOut size={14} /> Admin Logout
              </button>
            ) : (
              <button 
                onClick={() => setIsAdminLoginOpen(true)}
                className="nav-link hover:text-gold transition-colors flex items-center gap-2"
              >
                <ShieldCheck size={14} /> Admin Login
              </button>
            )}
          </div>

          <div className="max-w-md mx-auto h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-10"></div>
          
          <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">
            &copy; {new Date().getFullYear()} DR. ANJAN KUMAR PAL. Preserving the Glory of India.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isAdminLoginOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminLoginOpen(false)}
              className="absolute inset-0 bg-ink/95 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative p-12 bg-ink border border-gold/20 rounded-sm shadow-2xl max-w-sm w-full text-center"
            >
              <button 
                onClick={() => setIsAdminLoginOpen(false)}
                className="absolute top-6 right-6 text-text-muted hover:text-gold transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                <ShieldCheck className="text-gold" size={32} />
              </div>

              <h3 className="text-2xl font-serif text-ivory mb-4 italic tracking-widest">ADMIN PORTAL</h3>
              <p className="text-text-muted text-sm font-serif italic mb-10 leading-relaxed">
                Access restricted to authorized scribes and custodians of this digital legacy.
              </p>

              <button 
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-4 border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gold hover:text-ink transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
                    Sign In with Google
                  </>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Scroll to Top Ornament */}
      <svg className="absolute bottom-10 right-10 w-24 h-24 opacity-10 pointer-events-none" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="0.5" />
      </svg>
    </footer>
  );
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen selection:bg-gold selection:text-ink overflow-x-hidden bg-ink relative"
      >
        <div className="border-frame"></div>
        <div className="bg-radial-glow fixed inset-0 z-0"></div>
        
        <div className="relative z-10 font-serif">
          <Navbar />
          <Hero />
          <About />
          <StateHeritageRegistry />

          <Gallery />
          <InternationalExhibitions />
          <div id="world" className="bg-ink py-32 md:py-48 border-y border-gold/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-24">
                <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">Universal Tapestry</span>
                <h2 className="text-5xl md:text-7xl font-light text-ivory font-serif italic leading-tight uppercase tracking-tight">Global <span className="text-gold not-italic font-bold tracking-tighter">Heritage</span></h2>
                <p className="text-text-muted mt-8 max-w-xl mx-auto font-serif italic text-lg leading-relaxed">
                  "Explore the artifacts of history across the nations of the world. Each land carries a different scroll of time."
                </p>
                <div className="w-24 h-px bg-gold/40 mx-auto mt-12"></div>
              </div>
              <div className="h-[600px] md:h-[800px] relative rounded-sm overflow-hidden border border-gold/10">
                <WorldGlobe />
              </div>
            </div>
          </div>
          <Teaching />
          <Blog />
          <Contact />
          <Footer />
        </div>

        {/* Progress Bar */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 h-1 bg-gold z-[60] origin-left shadow-[0_0_10px_rgba(197,160,89,0.5)]"
          style={{ scaleX }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
