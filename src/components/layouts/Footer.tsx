import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/icons/Icons";
import Logo from "@/assets/icons/logotesorosindia.webp";

const Footer = () => {
  const contactLinks = [
    { label: "Sobre nosotros", path: "/nosotros" },
    { label: "Términos y condiciones", path: "/terminos" },
    { label: "Ayuda", path: "/ayuda" },
  ];

  const serviceLinks = [
    { label: "Productos", path: "/productos" },
    { label: "Paquetes", path: "/paquetes" },
    { label: "Reservas", path: "/reservas" },
  ];

  const socialLinks = [
    { name: "Instagram", icon: "instagram", url: "https://www.instagram.com" },
    { name: "Facebook", icon: "facebook", url: "https://www.facebook.com" },
    { name: "WhatsApp", icon: "whatsapp", url: "https://wa.me/" },
  ] as const;

  return (
    <footer className="bg-[#F1F6FA] text-black px-8 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">

        {/* Contacto */}
        <div>
          <h3 className="font-semibold mb-2">SERVICIO DE CONTACTO</h3>
          <ul className="space-y-1">
            {contactLinks.map(({ label, path }) => (
              <li key={label}>
                <Link to={path} className="hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Servicios */}
        <div>
          <h3 className="font-semibold mb-2">SERVICIOS</h3>
          <ul className="space-y-1">
            {serviceLinks.map(({ label, path }) => (
              <li key={label}>
                <Link to={path} className="hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Redes Sociales */}
        <div>
          <h3 className="font-semibold mb-2">SOCIAL</h3>
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition"
              >
                <Icon name={link.icon} className="text-[30px] w-10 h-10 " />
              </a>
            ))}
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center md:justify-end items-center">
          <img src={Logo} alt="Tesoros de la India" className="h-20" />
        </div>
      </div>

      <div className="mt-8 border-t border-gray-300 pt-4 text-center text-sm font-semibold">
        Copyright © Tesoros de la India
      </div>
    </footer>
  );
};

export default Footer;
