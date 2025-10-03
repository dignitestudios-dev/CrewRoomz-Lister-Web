import { useState } from "react";
import { signupSideImg, walletConnect } from "../assets/export";
import { useNavigate } from "react-router";
import { CiCircleCheck } from "react-icons/ci";

const ConnectStripeAccount = () => {
  const navigate = useNavigate();
  const [isConnectAccount, setIsConnectAccount] = useState<string>("");
  const [selected, setSelected] = useState<number | null>(null);

  const packages = [
    {
      id: 1,
      price: "$2.99",
      duration: "/7days",
      title: "Package 1",
      features: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
      ],
    },
    {
      id: 2,
      price: "$4.99",
      duration: "/14days",
      title: "Package 2",
      features: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
      ],
    },
  ];
  return (
    <div className="lg:min-h-screen lg:flex p-8  lg:p-0">
      <div className="grid lg:grid-cols-2 grid-cols-1 p-0 lg:p-4">
        <div className="lg:block hidden">
          <img
            src={signupSideImg}
            alt="Background"
            className=" w-full h-full object-cover rounded-bl-[4em] rounded-tl-[2em]"
          />
        </div>
        {isConnectAccount === "create" ? (
          <div className="flex flex-col items-center justify-center px-16 lg:py-6 h-[800px] space-y-6">
            <p className="text-[24px] text-[#181818] font-semibold">
              Subscription Plans
            </p>
            <div className="flex items-center justify-between w-full gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelected(pkg.id)}
                  className={`
        rounded-xl p-4 space-y-4 cursor-pointer transition-all duration-300 w-full
        ${
          selected === pkg.id
            ? "bg-gradient-to-r from-[#36C0EF] to-[#29ABE2] text-white shadow-lg"
            : "bg-white shadow-lite hover:bg-gradient-to-r hover:from-[#36C0EF] hover:to-[#29ABE2] hover:text-white"
        }
      `}
                >
                  {/* Price + Duration */}
                  <div className="flex justify-end w-full">
                    <p
                      className={`text-[32px] font-semibold 
            ${
              selected === pkg.id
                ? "text-white"
                : "text-[#36C0EF] group-hover:text-white"
            }`}
                    >
                      {pkg.price}
                      <span
                        className={`text-[14px] ml-1
              ${
                selected === pkg.id
                  ? "text-white"
                  : "text-gray-500 group-hover:text-white"
              }`}
                      >
                        {pkg.duration}
                      </span>
                    </p>
                  </div>

                  {/* Title */}
                  <div>
                    <p
                      className={`text-lg font-semibold
            ${
              selected === pkg.id
                ? "text-white"
                : "gradient-text hover:text-white"
            }
          `}
                    >
                      {pkg.title}
                    </p>
                  </div>

                  {/* Features List */}
                  <div>
                    <ul
                      className={`list-disc pl-6 space-y-2
            ${
              selected === pkg.id
                ? "text-white"
                : "text-gray-700 hover:text-white"
            }
          `}
                    >
                      {pkg.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={!selected}
              onClick={() => setIsConnectAccount("complete")}
              className={`w-full my-6 rounded-[8px] text-white text-[16px] py-3 px-6 font-medium
          ${
            selected
              ? "gradient-color cursor-pointer"
              : "bg-[#29aae244] cursor-not-allowed"
          }`}
            >
              Next
            </button>

            {/* Skip Button */}
            <button
              type="button"
              className={`w-full rounded-[8px] text-[16px] px-6 font-semibold bg-transparent gradient-text cursor-pointer`}
            >
              Skip
            </button>
          </div>
        ) : isConnectAccount === "complete" ? (
          <div
            onClick={() => navigate("/home")}
            className="flex flex-col items-center justify-center lg:p-6 h-[800px] space-y-4"
          >
            <div className="py-2">
              <CiCircleCheck className="text-[120px] text-[#36C0EF]" />
            </div>
            <p className="text-[24px] text-[#181818] font-semibold">
              Subscription Activated
            </p>
            <p className="text-[16px] text-[#565656] w-[380px] text-center">
              Your CrewRoomz subscription is now active.Head to your Home Screen
              to start listing and managing your Crash Pads!
            </p>
          </div>
        ) : (
          <div>
            <div className="w-full flex flex-col items-center justify-center lg:p-6 h-[800px] space-y-4">
              <p className="text-[24px] text-[#181818] font-semibold">
                Connect Your Stripe Account
              </p>
              <div className="py-2">
                <img
                  src={walletConnect}
                  alt="image"
                  className="w-[146px] h-[146px]"
                />
              </div>

              <p className="text-[14px] text-[#000000] w-[450px] text-center">
                Link your wallet to manage payouts, receive earnings seamlessly,
                and enjoy hassle-free transactions. Stay in control of your
                funds with secure and instant access.
              </p>
              <button
                onClick={() => setIsConnectAccount("create")}
                type="button"
                className="w-[384px] my-6 rounded-[8px] gradient-color text-white text-[16px] py-3 px-6 font-medium"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectStripeAccount;
