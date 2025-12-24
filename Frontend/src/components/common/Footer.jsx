const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-dark text-white text-center py-4 ">
      <div className="container">
        <p className="mb-1">&copy; {year} OneTap. All rights reserved.</p>
        <small>Made with ❤️ for stranded heroes on the road.</small>
      </div>
    </footer>
  );
};

export default Footer;
