import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { IconType } from "react-icons";

type IconName = "instagram" | "facebook" | "whatsapp";

interface IconProps {
  name: IconName;
  className?: string;
}

const icons: Record<IconName, IconType> = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  whatsapp: FaWhatsapp,
};

export const Icon = ({ name, className }: IconProps) => {
  const Component = icons[name];
  return <Component className={className} />;
};

