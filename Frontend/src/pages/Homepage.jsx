import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ServiceHighlights from '../components/ServiceHighlights';
import Footer from '../components/Footer';
import { MechanicApplicationTerms } from './MechanicTerns';

const Homepage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ServiceHighlights />
      {/* Add more sections like FaultCategories, Testimonials later */}
      {/* <MechanicApplicationTerms/> */}
      <Footer />
    </>
  );
};

export default Homepage;
