import React from "react";
import Styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={Styles.footer}>
      <div className={Styles.container}>
        {/* About Section */}
        <div className={Styles.section}>
          <h4>About Us</h4>
          <p>
            We are a food delivery platform connecting you to the best restaurants in town. Enjoy fresh, delicious meals delivered fast to your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div className={Styles.section}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/app">Home</a></li>
            <li><a href="/app">Restaurants</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/profile">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className={Styles.section}>
          <h4>Contact</h4>
          <p>Email: anaskhan2209k@gmail.com</p>
          <p>Phone: +91 78277 61258</p>
          <p>Address: Delhi, India</p>
        </div>

        {/* Social Media */}
        <div className={Styles.section}>
          <h4>Follow Us</h4>
          <div className={Styles.socialIcons}>
            <a href="https://github.com/anasss09"><i className="fa fa-facebook"></i>Github</a>
            <a href="#"><i className="fa fa-twitter"></i></a>
            <a href="https://leetcode.com/u/ana1005"><i className="fa fa-instagram"></i>Leetcode</a>
            <a href="https://www.linkedin.com/in/anas-khan-5b166a287"><i className="fa fa-linkedin">LinkedIn</i></a>
          </div>
        </div>
      </div>

      <div className={Styles.bottom}>
        <p>© 2025 FoodApp. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
