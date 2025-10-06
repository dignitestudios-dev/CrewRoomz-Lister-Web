import { useRef, useState } from "react";
import CountDown from "../Auth/CountDown";
// import { ErrorToast } from "../global/Toaster";

const DeleteAccount = () => {
  const [isDelete, setIsDelete] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const [isActive, setIsActive] = useState(true);
  const [seconds, setSeconds] = useState(10);

  const [resendLoading, setResendLoading] = useState(false);

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

  const handleResendOtp = async () => {
    try {
      handleRestart();

      setResendLoading(true);
      //   let obj = {
      //     email: email,
      //     role: "landlord",
      //   };

      //   const response = await axios.post("/auth/sendPassOTP", obj);

      //   if (response.status === 201) {
      //     SuccessToast(response?.data?.message);
      //     setResendLoading(false);
      //     setOtp(Array(5).fill("")); // Reset OTP fields
      //     handleRestart();
      //   }
    } catch (err) {
      console.log("🚀 ~ handleResendOtp ~ err:", err);
      // ErrorToast(err?.response?.data?.message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleRestart = () => {
    setSeconds(10);
    setIsActive(true);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-custom-sm flex flex-col py-6 px-4 h-[480px]">
      {isDelete ? (
        <div className="py-12">
          <div className="flex justify-center">
            <p className="text-[13px] text-[#181818] font-[400] w-[325px] py-2">
              To permanently delete your account, please enter the 6 digit code
              send to your email{" "}
              <span className="text-[13px] text-[#181818] font-[600]">
                mikesith@gmail.com
              </span>
            </p>
          </div>
          <div className="flex justify-center gap-6 py-8">
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
          <div className="flex items-center justify-center gap-2 relative z-10 mt-2">
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
          <div className="flex items-center justify-center">
            <button
              onClick={() => setIsDelete(true)}
              type="button"
              className="w-[343px] my-4 rounded-[8px] bg-[#DC1D00] text-white text-[14px] py-3 px-6 font-semibold cursor-pointer hover:bg-[#d01c00]"
            >
              Delete Now
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-[20px] text-[#181818] font-semibold">
            Delete Account
          </p>
          <p className="text-[13px] text-[#18181899] py-2">
            Deleting your account will delete all your data
          </p>
          <button
            onClick={() => setIsDelete(true)}
            type="button"
            className="w-[150px] my-4 rounded-[8px] bg-[#DC1D00] text-white text-[14px] py-3 px-6 font-semibold cursor-pointer hover:bg-[#d01c00]"
          >
            Delete Now
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
