import { Leaf, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Product: ["Features", "How It Works", "Pricing", "Download"],
  Support: ["Help Center", "Privacy Policy", "Terms of Service", "Contact"],
  Company: ["About Us", "Blog", "Careers", "Press Kit"],
};

export default function Footer() {
  return (
    <footer className="bg-[#1B5E20] dark:bg-[#0a1f0d] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-[#4CAF50] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif font-bold text-xl">Arog</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              AI-powered calorie counter and nutrition tracker built for Indian food habits.
            </p>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4CAF50]" />
              <div className="w-2 h-2 rounded-full bg-[#FF9800]" />
              <div className="w-2 h-2 rounded-full bg-[#FFC107]" />
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <span className="text-white/50 text-sm hover:text-white/80 transition-colors cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Arog. All rights reserved.
          </p>
          <p className="text-white/40 text-sm flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-[#F44336] fill-[#F44336]" /> for Bharat
          </p>
        </div>
      </div>
    </footer>
  );
}
