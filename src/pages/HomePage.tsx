import React from "react";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import ProductShow from "../components/ProductShow";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <>
      <Banner />
      <Navbar />
      <Hero />
      <Features />
      <ProductShow />
      <CallToAction />
      <Footer />
    </>
  );
};

export default HomePage;
