//assets
import background from "/images/FondoDesktop.webp";
import imgLogo from "@/assets/icons/logotesorosindiaPequeño.webp";

//components
import Card from "@/components/ui/cards/Card";
import CardContent from "@/components/ui/cards/CardContent";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import Label from "@/components/ui/Label";
import CircularLogo from "@/components/ui/CircularLogo";
import BackButton from "@/components/ui/buttons/BackButton";

//hooks
import { Link } from "react-router-dom";
import { FormEventHandler, useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

type Field = {
  label: string;
  placeholder: string;
  type: string;
  name: string;
};

interface AuthFormProps {
  title: string;
  subtitle: string;
  bold?: string;
  fields: Field[];
  submitText: string;
  bottomText: string;
  bottomLinkText: string;
  bottomLinkTo: string;
  extraLinkText?: string;
  extraLinkTo?: string;
  errorMessage?: string;
  isSubmitting?: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onChange: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors: FieldErrors;
  errorType?: "email" | "password" | "general" | null;
}

const AuthForm = ({
  title,
  subtitle,
  bold,
  extraLinkText,
  fields,
  submitText,
  bottomText,
  bottomLinkText,
  bottomLinkTo,
  extraLinkTo,
  onSubmit,
  onChange,
  register,
  errors,
  errorType,
  errorMessage,
  isSubmitting = false,
}: AuthFormProps) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // Evitar múltiples submissions
    if (isButtonDisabled || isSubmitting) {
      return;
    }

    // Deshabilitar el botón inmediatamente
    setIsButtonDisabled(true);

    try {
      // Llamar al onSubmit original
      await onSubmit(e);
    } catch (error) {
      // En caso de error, rehabilitar el botón
      console.error('Error en el formulario:', error);
      setIsButtonDisabled(false);
    }

    // Nota: El botón se rehabilitará cuando el componente se desmonte o 
    // cuando el componente padre maneje el éxito/error y cambie isSubmitting
  };

  // Rehabilitar el botón si isSubmitting cambia a false (indica que terminó el proceso)
  useState(() => {
    if (!isSubmitting && isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  });

  const buttonIsDisabled = isButtonDisabled || isSubmitting;
  const buttonText = isSubmitting ? "Procesando..." : submitText;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center text-black md:p-14"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Card className="rounded-2xl shadow-lg p-8 w-100 max-w-md relative pt-20">
        <CardContent>
          <CircularLogo
            src={imgLogo}
            alt="Tesoros de la India"
            size="xl"
            borderColor="none"
            shadow="lg"
            offsetY="-50px"
          />

          <BackButton
            to="/"
            position="top-left"
            size="lg"
            color="black"
            hoverColor="blue-700"
            className="p-2"
            iconClassName="stroke-2"
          />

          <div className="space-y-2 text-center pt-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-gray-500">
              {subtitle}{" "}
              <span className="font-bold text-black">{bold}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} onChange={onChange} className="space-y-4 mt-6">
            {fields.map(({ label, placeholder, type, name }) => (
              <div key={name} className="space-y-2">
                <Label htmlFor={name}>{label}</Label>
                <Input
                  id={name}
                  type={type}
                  placeholder={placeholder}
                  variant={errorType === name ? "error" : "success"}
                  disabled={buttonIsDisabled} // Deshabilitar inputs durante el proceso
                  {...register(name)}
                />
                {errors[name] && (
                  <p className="text-red-500 text-sm">
                    {(errors[name]?.message as string) || "Campo inválido"}
                  </p>
                )}
              </div>
            ))}

            {errorMessage && errorType === "general" && (
              <div className="text-red-500 text-center text-sm p-2 bg-red-50 rounded">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              className={`w-full transition-all duration-200 ${buttonIsDisabled
                  ? 'opacity-60 cursor-not-allowed bg-gray-400'
                  : 'hover:opacity-90'
                }`}
              disabled={buttonIsDisabled}
            >
              <div className="flex items-center justify-center gap-2">
                {isSubmitting && (
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                <span>{buttonText}</span>
              </div>
            </Button>
          </form>

          {extraLinkText && extraLinkTo && (
            <div className="text-center mt-4 text-sm">
              <Link
                to={extraLinkTo}
                className={`underline ${buttonIsDisabled ? 'pointer-events-none opacity-50' : ''}`}
              >
                {extraLinkText}
              </Link>
            </div>
          )}

          <div className="text-center mt-4 text-sm">
            {bottomText}{" "}
            <Link
              to={bottomLinkTo}
              className={`font-bold underline ${buttonIsDisabled ? 'pointer-events-none opacity-50' : ''}`}
            >
              <br />
              {bottomLinkText}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;