import { Github, GraduationCap, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    { text: "Pricing", href: "/#pricing" },
    { text: "Exams", href: "/exams" },
  ],
  Company: [
    { text: "About", href: "/about-us" },
    { text: "Contact", href: "/contact-us" },
  ],
  Resources: [
    // { text: "Documentation", href: "#" },
    { text: "Help Center", href: "/help-center" },
    // { text: "Community", href: "#" },
    // { text: "Partners", href: "#" },
    // { text: "API", href: "#" },
  ],
  Legal: [
    { text: "Privacy", href: "/privacy-policy" },
    { text: "Terms", href: "/terms-and-conditions" },
    { text: "Cookies", href: "/cookie-policy" },
    { text: "Refund Policy", href: "/refund-and-cancellation-policy" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <a href="#home" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-foreground">QnHub</span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-xs">
              AI-powered certification exams to help you master new skills and
              advance your career.
            </p>
            {/* <div className="flex items-center gap-4 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-accent transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground" />
                </a>
              ))}
            </div> */}
            <span className="text-muted-foreground text-sm">
              Copyright &copy; 2026 by Ryde Consulting. All rights reserved.
            </span>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.text}>
                    {link.href === "#" ? (
                      <span className="text-muted-foreground cursor-not-allowed opacity-60">
                        {link.text}
                      </span>
                    ) : link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.text}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.text}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
