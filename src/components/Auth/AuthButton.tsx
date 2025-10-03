import { RiLoader5Line } from "react-icons/ri";

type AuthButtonProps = {
  text: string;
  onClick?: () => void;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
};

const AuthButton: React.FC<AuthButtonProps> = ({
  text,
  onClick,
  loading,
  type,
}) => {
  return (
    <button
      disabled={loading}
      type={type}
      onClick={onClick}
      className="w-full py-3.5 gradient-color text-white text-sm rounded-lg hover:opacity-90 transition"
    >
      <div className="flex justify-center items-center">
        <span className="mr-1">{text}</span>
        {loading && <RiLoader5Line className="animate-spin text-lg" />}
      </div>
    </button>
  );
};

export default AuthButton;
