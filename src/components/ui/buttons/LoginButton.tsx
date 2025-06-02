import ButtonIcon from "@/components/ui/buttons/ButtonIcon";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const LoginButton = ({ textColor }: { textColor?: string }) => {
    const navigate = useNavigate();
    return (
        <>
           
            <Button
                onClick={() => navigate("/auth/iniciar-sesion")}
                className="font-bold md:hidden "
                textColor={textColor}
            >
                <span>Iniciar Sesión</span>
            </Button>

            <ButtonIcon
                onClick={() => navigate("/auth/iniciar-sesion")}
                className="font-bold hidden md:flex"
                textColor={textColor}
            >
                <LogIn size={20} />
                <span>Iniciar Sesión</span>
            </ButtonIcon>
        </>
    );
};

export default LoginButton;