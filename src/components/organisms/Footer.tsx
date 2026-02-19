import Link from 'next/link';
import { Container } from '@/components/layouts/Container';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  products: [
    { label: 'All Models', href: '/models' },
    { label: 'Compare Scooters', href: '/compare' },
    { label: 'Find Dealers', href: '/dealers' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/enquiry' },
  ],
  support: [
    { label: 'FAQ', href: '/support' },
    { label: 'Service Centers', href: '/dealers' },
    { label: 'Warranty', href: '/support#warranty' },
    { label: 'Charging Guide', href: '/support#charging' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/gururani', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/gururani', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com/gururani', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/gururani', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="bg-accent text-white">
      {/* Main Footer */}
      <div className="py-16">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <span className="text-2xl font-heading font-bold text-white">
                  Guru Rani
                </span>
              </Link>
              <p className="text-white/70 text-sm mb-6">
                Leading the electric revolution in India. Experience the future of urban mobility.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a
                  href="tel:+911234567890"
                  className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
                >
                  <Phone size={16} />
                  <span>+91 123 456 7890</span>
                </a>
                <a
                  href="mailto:hello@gururani.in"
                  className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
                >
                  <Mail size={16} />
                  <span>hello@gururani.in</span>
                </a>
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-heading font-semibold mb-4">Products</h4>
              <ul className="space-y-2">
                {footerLinks.products.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-heading font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-heading font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-heading font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/70 text-sm">
              &copy; {new Date().getFullYear()} Guru Rani Electric Vehicles. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/70 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
