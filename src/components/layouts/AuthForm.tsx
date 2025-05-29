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
import { FormEventHandler, useState, useEffect, ReactNode } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

type Field = {
  label: string;
  placeholder: string;
  type: string;
  name: string;
  rightElement?: ReactNode;
  disabled?: boolean;
};

interface AuthFormProps {
  title: string;
  subtitle: string | ReactNode;
  bold?: string;
  fields?: Field[];
  submitText: string;
  loadingText?: string;
  bottomText: string;
  bottomLinkText: string;
  bottomLinkTo: string;
  extraLinkText?: string;
  extraLinkTo?: string;
  Message?: string;
  messageStyle?: {
    textColor?: string;
    backgroundColor?: string;
  };
  isSubmitting?: boolean;
  hideSubmitButton?: boolean;
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
  loadingText = "Procesando...",
  bottomText,
  bottomLinkText,
  bottomLinkTo,
  extraLinkTo,
  onSubmit,
  onChange,
  register,
  errors,
  errorType,
  Message,
  messageStyle = {
    textColor: "text-red-500",
    backgroundColor: "bg-red-50"
  },
  isSubmitting = false,
  hideSubmitButton = false,
}: AuthFormProps) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (!isSubmitting) {
      setIsButtonDisabled(false);
    }
  }, [isSubmitting]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (isButtonDisabled || isSubmitting) {
      return;
    }
    
    setIsButtonDisabled(true);

    try {
      await onSubmit(e);
    } catch  {
      setIsButtonDisabled(false);
    }
  };

  const buttonIsDisabled = isButtonDisabled || isSubmitting;
  const buttonText = isSubmitting ? (loadingText || "Procesando...") : submitText;

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
            <div className="text-sm text-gray-500">
              {subtitle}{" "}
              <span className="font-bold text-black">{bold}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} onChange={onChange} className="space-y-4 mt-6">
            {fields && fields.map(({ label, placeholder, type, name }) => (
              <div key={name} className="space-y-2">
                <Label htmlFor={name}>{label}</Label>
                <Input
                  id={name}
                  type={type}
                  placeholder={placeholder}
                  variant={errorType === name ? "error" : "success"}
                  {...register(name)}
                />
                {errors[name] && (
                  <p className="text-red-500 text-sm">
                    {(errors[name]?.message as string) || "Campo inválido"}
                  </p>
                )}
              </div>
            ))}

            {Message && errorType === "general" && (
              <div className={`text-center text-sm p-2 rounded ${messageStyle.textColor} ${messageStyle.backgroundColor}`}>
                {Message}
              </div>
            )}

            {!hideSubmitButton && submitText && (
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
            )}
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