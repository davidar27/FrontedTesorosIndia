import ButtonIcon from "@/components/ui/buttons/ButtonIcon";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginButton = ({ textColor }: { textColor: string }) => {
    const navigate = useNavigate();
    return (
        <ButtonIcon
            onClick={() => navigate("/login")}
            className="font-bold"
            textColor={textColor}
        >
            <LogIn size={20} />
            <span>Iniciar Sesión</span>
        </ButtonIcon>
    );
};

export default LoginButton;