import { Link } from "react-router-dom";
import Container from "./Container";
import { MainRoutes } from "@/lib/helpers";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  hoverColor: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, hoverColor }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:${hoverColor} hover:bg-white/20 transition`}
    >
      {icon}
    </a>
  );
};

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => {
  return (
    <li>
      <Link
        to={to}
        className="hover:text-yellow-400 transition text-gray-300"
      >
        {children}
      </Link>
    </li>
  );
};

const Footer = () => {
  return (
    <footer className="w-full bg-black pt-16 pb-10 text-gray-300 rounded-t-3xl mt-20 shadow-inner">

      <Container>
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {MainRoutes.map((route) => (
                <FooterLink key={route.href} to={route.href}>
                  {route.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">About Us</h3>
            <p className="leading-relaxed text-gray-400">
              We help you create world-class AI-generated digital courses 
              with the click of a button. Learn faster and teach smarter.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-3">
              <FooterLink to="/services/course-generator">
                AI Course Generator
              </FooterLink>
              <FooterLink to="/services/material-builder">
                Material Builder
              </FooterLink>
              <FooterLink to="/services/lesson-planner">
                Lesson Planner
              </FooterLink>
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
            <p className="text-gray-400 mb-4">KLE MCA COLLEGE CHIKODI</p>

            <div className="flex gap-4">
              <SocialLink
                href="https://facebook.com"
                icon={<Facebook size={20} />}
                hoverColor="text-yellow-400"
              />
              <SocialLink
                href="https://twitter.com"
                icon={<Twitter size={20} />}
                hoverColor="text-yellow-400"
              />
              <SocialLink
                href="https://instagram.com"
                icon={<Instagram size={20} />}
                hoverColor="text-yellow-400"
              />
              <SocialLink
                href="https://linkedin.com"
                icon={<Linkedin size={20} />}
                hoverColor="text-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Aispire · All Rights Reserved
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
