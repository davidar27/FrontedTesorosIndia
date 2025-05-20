import { Instagram, Facebook } from "lucide-react";
import Whatsapp from "@/assets/icons/whatsapp.svg?react";

type IconName = "instagram" | "facebook" | "whatsapp";

interface IconProps {
  name: IconName;
  className?: string;
}

const icons = {
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: Whatsapp,
};

export const Icon = ({ name, className }: IconProps) => {
  const Component = icons[name];
  return <Component className={className} />;
};
