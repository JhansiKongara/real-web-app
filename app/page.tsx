import Carousel from "@/app/components/ui/carousel";
import Plots from "@/app/components/listings/plots";
import "@/app/styles/home.scss";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <Carousel />

      {/* SEO Content Section */}
      <section className="seo-content">
        <h1>Find Premium Open Plots & Land in Hyderabad</h1>
        <p>
          Discover the best investment opportunities in Hyderabad's rapidly
          growing real estate market. Whether you're looking for HMDA approved
          layouts in Kompally, DTCP plots in Shankarpally, or premium gated
          community lands near Medchal, we have the perfect property for you.
          Start building your dream home today with our verified and clear-title
          listings.
        </p>
      </section>

      <Plots />

      {/* Features Grid for SEO and Trust */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="icon-wrapper">👑</div>
          <h3>HMDA & DTCP Approved</h3>
          <p>
            100% clear title plots with all necessary government approvals for
            hassle-free ownership.
          </p>
        </div>
        <div className="feature-card">
          <div className="icon-wrapper">📍</div>
          <h3>Prime Locations</h3>
          <p>
            Strategically located near ORR, Highways, and IT Hubs for high
            appreciation value.
          </p>
        </div>
        <div className="feature-card">
          <div className="icon-wrapper">⚡</div>
          <h3>Seamless Transactions</h3>
          <p>
            We assist with clear documentation, registration, and bank loan
            processes.
          </p>
        </div>
      </div>
    </main>
  );
}
