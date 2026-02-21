"use client";
import { usePathname } from "next/navigation";

function Footer() {
  const pathname = usePathname();
  // Determine if on property detail page (has sticky CTA bar)
  const isPropertyDetail = pathname?.startsWith("/property/");
  // Add padding bottom on mobile when on property detail page to avoid overlapping the sticky CTA bar
  const mobilePaddingClass = isPropertyDetail ? "pb-[80px]" : "pb-[10px]";

  return (
    <footer
      className={`footer bg-[var(--card)] text-[var(--foreground)] px-10 flex flex-wrap justify-between gap-1 relative w-full z-[80] md:fixed md:bottom-0 md:left-0 md:flex-row flex-col md:text-left text-center md:pt-3 md:pb-0 pt-[10px] ${mobilePaddingClass} md:px-[40px] px-[20px] md:gap-[5px] gap-[20px] transition-all duration-300`}
    >
      {/* Stylish Gradient Separator */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] via-[var(--secondary)] to-transparent opacity-100 shadow-[0_0_15px_var(--primary)] z-10 transition-all duration-300"></div>

      <div className="flex-1 min-w-[150px] md:min-w-auto">
        <h3 className="text-[var(--primary)] text-base mb-0 uppercase tracking-[0.5px] transition-colors duration-300">
          RealEstate
        </h3>
        <p className="leading-[1.2] text-[0.75rem] text-[var(--muted)] m-0 transition-colors duration-300">
          Your trusted partner for buying and selling premium open plots in
          Hyderabad. We offer HMDA and DTCP approved layouts in prime locations
          like Kompally, Medchal, and Shankarpally.
        </p>
      </div>

      <div className="flex-1 min-w-[150px] md:min-w-auto md:w-full">
        <h4 className="text-[var(--primary)] text-base mb-0 uppercase transition-colors duration-300">
          Quick Links
        </h4>
        <ul className="list-none p-0 m-0 grid grid-cols-2 md:grid-cols-3 gap-x-[10px] md:gap-x-[30px] gap-y-0 text-left md:max-w-none max-w-fit mx-auto">
          {[
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about" },
            { label: "Contact Us", href: "/contact" },
            { label: "Plots in Medchal", href: "/properties/medchal" },
            { label: "Plots in Kompally", href: "/properties/kompally" },
            {
              label: "Plots in Shankarpally",
              href: "/properties/shankarpally",
            },
          ].map((link, idx) => (
            <li
              key={idx}
              className="mb-0 block relative pl-[15px] before:content-['›'] before:absolute before:left-0 before:text-[var(--primary)] before:font-bold before:text-[1.2rem] before:leading-[0.8] before:top-[1px] transition-all duration-300"
            >
              <a
                href={link.href}
                className="text-[var(--muted)] no-underline text-[0.75rem] transition-all duration-300 hover:text-[var(--primary)]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full mt-0 pt-0 border-t border-white/5 text-center text-[#64748b] text-[0.65rem] leading-[1]">
        <p className="m-0 py-2">© 2026 RealEstate. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
