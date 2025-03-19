import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import ProductShow from "../components/ProductShow";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <section id="home">
        <Hero />
      </section>
      <section id="features">
        <Features />
      </section>
      <ProductShow />
      <section id="faq">
        <FAQ />
      </section>

      <CallToAction />
      <Footer />
    </>
  );
};

export default HomePage;
