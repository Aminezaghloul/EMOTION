import Navbar        from './components/Navbar';
import Hero          from './components/Hero';
import AnalyzeSection from './components/AnalyzeSection';
import HowItWorks   from './components/HowItWorks';
import Footer        from './components/Footer';

export default function App() {
  return (
    // Main wrapper — the subtle radial glow behind the hero lives here
    <div className="relative min-h-screen overflow-hidden dark:bg-ink-950 bg-[#eef0ff] text-slate-900 dark:text-white">
      {/* Background radial glow (top center) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[120vh]
                   bg-[radial-gradient(circle_at_50%_-20%,rgba(124,58,237,0.25),transparent_60%)]"
      />

      <Navbar />

      <main className="relative">
        <Hero />
        <AnalyzeSection />
        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}
