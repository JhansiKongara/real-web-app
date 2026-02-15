"use client";
import "@/app/styles/footer.scss";
function Footer() {
  return (
    <div className="footer">
      <div className="footer-section">
        <h3>RealEstate</h3>
        <p>
          Your trusted partner for buying and selling premium open plots in
          Hyderabad. We offer HMDA and DTCP approved layouts in prime locations
          like Kompally, Medchal, and Shankarpally.
        </p>
      </div>

      <div className="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About Us</a>
          </li>
          <li>
            <a href="/contact">Contact Us</a>
          </li>
          <li>
            <a href="/properties/medchal">Plots in Medchal</a>
          </li>
          <li>
            <a href="/properties/kompally">Plots in Kompally</a>
          </li>
          <li>
            <a href="/properties/shankarpally">Plots in Shankarpally</a>
          </li>
        </ul>
      </div>

      <div className="footer-bottom">
        <p>© 2026 RealEstate. All Rights Reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
