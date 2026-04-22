import { Github, GraduationCap, Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Exams", "Categories", "Enterprise"],
  Company: ["About", "Blog", "Careers", "Contact", "Press"],
  Resources: ["Documentation", "Help Center", "Community", "Partners", "API"],
  Legal: ["Privacy", "Terms", "Cookies", "Licenses"],
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
              <span className="text-xl font-bold text-foreground">Examify</span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-xs">
              AI-powered certification exams to help you master new skills and
              advance your career.
            </p>
            <div className="flex items-center gap-4 mb-4">
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
            </div>
            <span className="text-muted-foreground text-sm">
              Copyright &copy; 2026 by rydefoundation.in. All rights reserved.
            </span>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
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
