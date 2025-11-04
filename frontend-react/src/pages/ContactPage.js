// frontend-react/src/pages/ContactPage.js
import React from 'react';
import '../App.css'; // Assuming styles.css content is in App.css

const ContactPage = () => {
  // You would typically add state and a submission handler for the form here
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Contact form submitted! (Backend integration needed)");
    // In a real app, you'd send this data to a backend API endpoint (e.g., /api/contact)
    // using fetch or axios, similar to how bookings are handled.
  };

  return (
    <>
      <section className="banner small-banner">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Reach out for inquiries, feedback, or support.</p>
        <a href="#contact-form" className="banner-btn">Get in Touch</a>
      </section>

      <div className="container">
        <div className="card" id="contact-form">
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" placeholder="Enter your name" required />

            <label htmlFor="email">Your Email</label>
            <input type="email" id="email" placeholder="Enter your email" required />

            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" placeholder="Subject" required />
            <button type="submit">Submit</button>
          </form>
        </div>

        <div className="card">
          <h2>Our Contact Information</h2>
          <p><strong>Address:</strong> VIT Chennai Campus, Kelambakkam - Vandalur Rd, Chennai</p>
          <p><strong>Email:</strong> info@vit.ac.in</p>
          <p><strong>Phone:</strong> +91 98984 XXXXX</p>

          <div className="assistant-box" style={{ marginTop: '10px' }}>
            <p><strong>Need Help?</strong> Our support team is available 24/7. Please submit the form or reach us via phone/email for quick assistance.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;