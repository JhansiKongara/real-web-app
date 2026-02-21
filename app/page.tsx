import Carousel from "@/app/components/ui/carousel";
import Plots from "@/app/components/listings/plots";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between font-['Outfit']">
      <Carousel />

      {/* SEO Content Section */}
      <section className="relative mx-auto my-[20px] lg:mt-[60px] lg:mb-[50px] max-w-[1200px] w-[92%] text-center p-6 md:p-10 bg-[var(--card)] rounded-[24px] border-2 border-[var(--border)] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-[50px] -left-[50px] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(var(--primary-rgb),0.1)_0%,transparent_70%)] rounded-full -z-[1]"></div>
        <div className="absolute -bottom-[50px] -right-[50px] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(var(--secondary-rgb),0.1)_0%,transparent_70%)] rounded-full -z-[1]"></div>

        <h1 className="text-[1.2rem] md:text-[1.8rem] font-extrabold tracking-tight mb-2 text-[var(--foreground)] relative inline-block after:content-[''] after:block after:w-16 after:h-1 after:bg-gradient-to-r after:from-[var(--primary)] after:to-[var(--secondary)] after:mx-auto after:mt-3 after:rounded-full after:shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)] uppercase">
          Find Premium Open Plots & Land in Hyderabad
        </h1>
        <p className="text-[0.95rem] leading-[1.8] text-[var(--muted)] max-w-full mx-auto font-normal">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] max-w-[1200px] w-full mx-auto mt-10 md:mt-[40px] mb-10 md:mb-[60px] px-[15px]">
        {[
          {
            icon: "👑",
            title: "HMDA & DTCP Approved",
            desc: "100% clear title plots with all necessary government approvals for hassle-free ownership.",
          },
          {
            icon: "📍",
            title: "Prime Locations",
            desc: "Strategically located near ORR, Highways, and IT Hubs for high appreciation value.",
          },
          {
            icon: "⚡",
            title: "Seamless Transactions",
            desc: "We assist with clear documentation, registration, and bank loan processes.",
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="bg-[var(--card)] p-[25px] rounded-[24px] text-center border-2 border-[var(--border)] transition-all duration-400 hover:-translate-y-[8px] hover:border-[var(--primary)] hover:shadow-[0_25px_60px_-10px_rgba(var(--primary-rgb),0.3)] shadow-xl"
          >
            <div className="w-[50px] h-[50px] mx-auto mb-[10px] flex items-center justify-center bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10 rounded-full text-[1.8rem]">
              {feature.icon}
            </div>
            <h3 className="text-[var(--foreground)] text-xl font-extrabold mb-3 uppercase tracking-wide">
              {feature.title}
            </h3>
            <p className="text-[var(--muted)] leading-[1.6] text-[0.95rem]">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
