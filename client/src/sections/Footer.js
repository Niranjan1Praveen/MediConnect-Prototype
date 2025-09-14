import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import { AuroraText } from "@/components/magicui/aurora-text";

const footerLinks = [
  { href: "#", label: "Contact" },
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms & Conditions" },
];

export default function Footer() {
  return (
    <footer className="border-t border-t-muted-foreground/10 py-10 px-4 flex items-center justify-center">
      <footer className="container flex flex-col md:flex-row md:justify-between items-center gap-6">
        <div className="flex flex-col gap-2 items-center text-center md:items-start">
          <div className="flex items-center gap-2 mb-4">
            <Image src={logo} alt="footer-logo" className="h-auto w-20" />
            <p className="text-2xl font-bold text-white/20 md:inline-flex hidden">
              <AuroraText colors={["#4ade80", "#30f6d5", "#5EF7BA", "#06b6d4"]}>
                MediConnect
              </AuroraText>
            </p>
          </div>
          <small className="text-white/50">
            The source code is available on{" "}
            <Link
              href={"https://github.com/Niranjan1Praveen/NTCC-2025.git"}
              className="underline italic"
            >
              GitHub.
            </Link>
          </small>
        </div>
        <nav className="flex gap-6">
          {footerLinks.map((link) => (
            <a
              href={link.href}
              key={link.label}
              className="text-white/50 text-sm hover:underline"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </footer>
    </footer>
  );
}
