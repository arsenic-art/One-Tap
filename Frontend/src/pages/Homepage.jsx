import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ServiceHighlights from '../components/ServiceHighlights';
import Footer from '../components/Footer';
import { MechanicApplicationTerms } from './MechanicTerns';

const Homepage = () => {
  return (
    <>
      <HeroSection />
      <ServiceHighlights />
      <Footer />
    </>
  );
};

export default Homepage;
