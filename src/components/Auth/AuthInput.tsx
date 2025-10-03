// src/components/Input.jsx
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

type AuthInputProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showToggle?: boolean;
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  name?: string;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
};

export default function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  showToggle = false,
  className,
  onBlur,
  error,
  touched,
  name,
  maxLength,
  disabled,
  required = false,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-[16px] font-medium text-gray-800 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          disabled={disabled}
          type={showToggle ? (showPassword ? "text" : "password") : type}
          value={value}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          onBlur={onBlur}
          maxLength={maxLength}
          required={required}
          className={`w-full px-4 py-4 text-sm rounded-xl bg-white focus:ring-2 focus:ring-gray-200 focus:outline-none pr-12 field-shadow ${
            className || ""
          }`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        )}
      </div>
      {error && touched && <p className="text-red-600 text-[12px]">{error}</p>}
    </div>
  );
}
