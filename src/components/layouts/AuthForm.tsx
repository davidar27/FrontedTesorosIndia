//assets
import background from "@/assets/images/Paisaje.webp";
import imgLogo from "@/assets/icons/logotesorosindiaPequeño.webp";


//components
import Card from "@/components/ui/Card";
import CardContent from "@/components/ui/CardContent";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import CircularLogo from "@/components/ui/CircularLogo";
import BackButton from "@/components/ui/BackButton";

//hooks
import { Link } from "react-router-dom";
import { FormEventHandler } from "react";
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
  errors
}: AuthFormProps) => {
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center text-black  md:p-14" style={{ backgroundImage: `url(${background})` }}>

      <Card className="rounded-2xl shadow-lg p-8 w-100 max-w-md  relative pt-20">

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
            color="blue-500"
            hoverColor="blue-700"
            className="p-2"
            iconClassName="stroke-2"
          />

          <div className="space-y-2 text-center pt-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-gray-500">{subtitle} <span className="font-bold text-black">{bold}</span></p>
          </div>

          <form onSubmit={onSubmit} onChange={onChange} className="space-y-4 mt-6">
            {fields.map(({ label, placeholder, type, name }) => (
              <div key={name} className="space-y-2">
                <Label htmlFor={name}>{label}</Label>
                <Input
                  id={name}
                  type={type}
                  placeholder={placeholder}
                  variant="success"
                  {...register(name)}
                />
                {errors[name] && (
                  <p className="text-red-500 text-sm">{(errors[name]?.message as string) || "Campo inválido"}</p>
                )}
              </div>
            ))}

            <Button type="submit" className="w-full">
              {submitText}
            </Button>
          </form>

          {extraLinkText && extraLinkTo && (
            <div className="text-center mt-4 text-sm">
              <Link to={extraLinkTo} className="underline">
                {extraLinkText}
              </Link>
            </div>
          )}

          <div className="text-center mt-4 text-sm">
            {bottomText}{" "}
            <Link to={bottomLinkTo} className="font-bold underline"> <br />
              {bottomLinkText}
            </Link>
          </div>
        </CardContent>
      </Card>
      /</div>

  );
};

export default AuthForm;
