import { useRef, useState } from "react";
import { signupSideImg } from "../../assets/export";
import AuthButton from "../../components/Auth/AuthButton";
import CountDown from "../../components/Auth/CountDown";
import { ErrorToast } from "../../components/global/Toaster";
import { CiCircleCheck } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router";
import axios from "../../axios";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../init/appValues";
import Toast from "../../components/global/Toast";
import useAuthStore from "../../store/authStore";

const LoginOtp = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const { toast, showToast } = useToast();
  const [state, setState] = useState<LoadState>("idle");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const { email } = location.state || {};
  const [resendLoading, setResendLoading] = useState(false);

  const [isActive, setIsActive] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  const [seconds, setSeconds] = useState(10);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/\D/, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .slice(0, otp.length)
      .split("");
    const newOtp = [...otp];
    pasteData.forEach((char, idx) => {
      if (/\d/.test(char)) {
        newOtp[idx] = char;
      }
    });
    setOtp(newOtp);
    const nextIndex =
      pasteData.length < otp.length ? pasteData.length : otp.length - 1;
    inputs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.some((digit) => digit === "")) {
      ErrorToast("Please enter complete OTP.");
      return;
    }
    const otpValue = parseInt(otp.join(""), 10);
    setState("loading");
    try {
      const response = await axios.post("/auth/verifyOTP", {
        otp: otpValue,
        email: email,
        role: "lister",
      });
      if (response.status === 200) {
        const data = response?.data?.data;
        setAuth(data.token, data.user, true);
        setState("ready");
        setIsVerified(true);
      }
    } catch (error) {
      setState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      handleRestart();
      const obj = {
        email: email,
        role: "lister",
      };
      const response = await axios.post("/auth/resendOtp", obj);
      if (response.status === 201 || response.status === 200) {
        setOtp(Array(6).fill(""));
        setState("ready");
        showToast("OTP has been resent successfully!.", "success");
      }
    } catch (err) {
      setState("error");
      showToast(getErrorMessage(err), "error");
    } finally {
      setResendLoading(false);
    }
  };

  const handleRestart = () => {
    setSeconds(10);
    setIsActive(true);
  };

  return (
    <div className="lg:min-h-screen lg:flex p-8  lg:p-0">
      {(state === "error" || state === "ready") && <Toast {...toast} />}
      <div className="grid lg:grid-cols-2 grid-cols-1 p-0 lg:p-4">
        <div className="lg:block hidden">
          <img
            src={signupSideImg}
            alt="Background"
            className=" w-full h-full object-cover rounded-bl-[4em] rounded-tl-[2em]"
          />
        </div>
        {isVerified ? (
          <div
            onClick={() => navigate("/connect-account")}
            className="flex flex-col items-center justify-center lg:p-6 h-[800px] space-y-4"
          >
            <div className="py-2">
              <CiCircleCheck className="text-[120px] text-[#36C0EF]" />
            </div>
            <p className="text-[24px] text-[#181818] font-semibold">
              Email Verified!
            </p>
            <p className="text-[16px] text-[#565656] w-[290px] text-center">
              Your email has been verified successfully.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center lg:p-6 h-[800px]">
            <div className="mb-8 text-center space-y-2 lg:max-w-[55%] md:max-w-[60%] sm:max-w-[75%] xs:max-w-[90%] ">
              <p className="text-[24px] font-semibold">Verification</p>
              <p className="text-[14px] text-[#565656]">
                Enter the code send to{" "}
                <span className="text-black">{email}</span>
              </p>
            </div>
            <div className="flex justify-center items-center w-full ">
              <form
                onSubmit={handleSubmit}
                className="w-full lg:max-w-[60%] md:max-w-[60%] sm:max-w-[75%] xs:max-w-[90%]"
              >
                <div className="flex gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      ref={(el) => {
                        inputs.current[index] = el;
                      }}
                      className="w-[50px] h-[55px] rounded-[8px] text-blue-600 bg-[#ffffff] outline-none text-center field-shadow text-xl focus:border-[#36C0EF] focus:ring-1 focus:ring-[#36C0EF] transition"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 relative z-10 mt-6">
                  <p className=" text-[13px] leading-[21.6px] text-[#565656]">
                    Didn&apos;t receive code?
                    {isActive ? (
                      <span className="inline-block ml-1 align-middle">
                        <CountDown
                          isActive={isActive}
                          setIsActive={setIsActive}
                          seconds={seconds}
                          setSeconds={setSeconds}
                        />
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={resendLoading}
                        onClick={handleResendOtp}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent font-medium pl-1 cursor-pointer"
                      >
                        {resendLoading ? "Resending..." : "Resend"}
                      </button>
                    )}
                  </p>
                </div>

                <div className="mt-6">
                  <AuthButton
                    text="Verify"
                    loading={state === "loading" ? true : false}
                    type="submit"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginOtp;
