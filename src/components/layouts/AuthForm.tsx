import { Link } from "react-router-dom";
import React from "react";
import { ChevronLeft } from "lucide-react";
import background from "@/assets/images/Paisaje.webp";
import imgLogo from "@/assets/icons/logotesorosindiaPequeño.webp";
import Picture from "@/components/ui/Picture";
import Button from "../ui/Button";
import { Eye, EyeOff } from 'lucide-react';
import { useState } from "react";

interface InputField {
  label: string;
  placeholder: string;
  type?: string;
  name: string;
  value?: string;
  errorMessage?: string;
}

interface AuthFormProps {
  title: string;
  subtitle: string;
  bold?: string;
  fields: InputField[];
  submitText: string;
  bottomText: string;
  bottomLinkText: string;
  bottomLinkTo: string;
  extraLinkText?: string;
  extraLinkTo?: string;
  errorMessage?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

}


const AuthForm: React.FC<AuthFormProps> = ({
  title,
  subtitle,
  bold,
  fields,
  submitText,
  bottomText,
  bottomLinkText,
  bottomLinkTo,
  extraLinkText,
  extraLinkTo,
  errorMessage,
  onSubmit,
  onChange,

}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center text-black  md:p-14" style={{ backgroundImage: `url(${background})` }}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-100 max-w-md  relative pt-30">

        <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 w-36 h-36 rounded-full overflow-hidden bg-white p-1.5 shadow-md">
          <Picture src={imgLogo} alt="Logo" className="w-full h-full object-contain" />
        </div>

        <Link to="/" className="absolute top-4 left-4 hover:text-gray-700 transition duration-200">
          <ChevronLeft className="w-10 h-10" />
        </Link>

        <h2 className="text-2xl font-bold text-center mb-1">{title}</h2>
        <p className="text-center text-sm mb-6">{subtitle} <span className="font-bold" >{bold}</span></p>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map(({ label, placeholder, type = "text", name, value }) => {
            const isPasswordField = type === "password";
            return (
              <div key={name} className="relative">
                <label className="block text-sm font-medium mb-1 ml-1">{label}</label>
                <input
                  name={name}
                  type={isPasswordField ? (showPassword ? "text" : "password") : type}
                  placeholder={placeholder}
                  className="w-full border-2 border-green-500 rounded-lg px-3 py-2 focus:outline-none"
                  value={value}
                  onChange={onChange}
                />
                {isPasswordField && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[35px] text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>


                )}
              </div>

            );
          })}
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold cursor-pointer">
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
          <Link to={bottomLinkTo} className="font-bold underline">
            {bottomLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
