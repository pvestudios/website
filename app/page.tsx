import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
// import Solution from '@/components/Solution';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <main id="main" className="bg-grid min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      {/* <Solution /> */}
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
      {/* Sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-zinc-800 bg-zinc-950/80 backdrop-blur pb-safe">
        <div className="mx-auto w-full px-4 pt-3">
          <a href='#pricing' className="w-full inline-flex justify-center rounded-xl px-4 py-3 font-semibold bg-brand-500 hover:bg-brand-500/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition">
            Ape Now
          </a>
        </div>
      </div>
    </main>
  );
}
