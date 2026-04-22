import { About } from "../components/About";
import { FAQ } from "../components/FAQ";
import { Features } from "../components/Features";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Navbar } from "../components/Navbar";
import { Pricing } from "../components/Pricing";
import { Testimonials } from "../components/Testimonials";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        {/* <Exams /> */}
        {/* <Categories /> */}
        <Pricing />
        <About />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
