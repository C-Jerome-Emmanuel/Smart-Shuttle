// frontend-react/src/pages/HomePage.js
import React from 'react';
import '../App.css'; // Assuming styles.css content is in App.css

const HomePage = () => {
  return (
    <header className="banner">
      <h1>Welcome to Shuttle Service</h1>
      <p>Book your seat with ease</p>
      <a href="/booking" className="banner-btn">Book Now</a> {/* Use href for simple link for now */}
    </header>
  );
};

export default HomePage;