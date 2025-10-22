import { useEffect, useState } from "react";
import { signupSideImg, walletConnect } from "../../assets/export";
import { useNavigate } from "react-router";
import { CiCircleCheck } from "react-icons/ci";
import { useToast } from "../../hooks/useToast";
import axios from "../../axios";
import { formatProductId, getErrorMessage } from "../../init/appValues";
import Toast from "../../components/global/Toast";
import { subscriptionFeatures } from "../../statics/settingsOptions";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../../components/global/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { useAppStore } from "../../store/appStore";
import useAuthStore from "../../store/authStore";

export interface PackageData {
  _id: string;
  productId: string;
  subscriptionId: string;
  name: string;
  price: string; // backend returns string, not number
  stripePriceId: string;
  stripeProductId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ConnectStripeAccount = () => {
  const navigate = useNavigate();
  const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_KEY);

  const { user, fetchUser } = useAppStore();
  console.log("🚀 ~ PaymentForm ~ user:", user);
  const { updateUser } = useAuthStore();

  useEffect(() => {
    if (user) {
      updateUser(user, true);
    }
  }, [user]);

  const [isConnectAccount, setIsConnectAccount] = useState<string>("");
  const [selected, setSelected] = useState<string | null>(null);
  const { toast, showToast } = useToast();
  const [state, setState] = useState<LoadState>("idle");
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [planData, setPlanData] = useState<PackageData | null>(null);

  const handleNextClick = () => {
    if (!selected) return;

    const selectedPlan = packages.find((pkg) => pkg._id === selected);
    if (selectedPlan) {
      setPlanData(selectedPlan);
      setIsConnectAccount("stripe"); // move to stripe screen
    }
  };

  const getSubscriptions = async () => {
    try {
      setState("loading");
      const { data } = await axios.get(`/subscription`);
      console.log("🚀 ~ getRooms ~ data:", data);

      if (data.success) {
        setState("ready");
        setPackages(data?.data);
      }
    } catch (error) {
      setState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  useEffect(() => {
    getSubscriptions();
  }, []);
  return (
    <div className="lg:min-h-screen lg:flex p-8  lg:p-0">
      {state === "error" && <Toast {...toast} />}
      <div className="grid lg:grid-cols-3 grid-cols-1 p-0 lg:p-4">
        <div className="lg:block hidden">
          <img
            src={signupSideImg}
            alt="Background"
            className=" w-full h-full object-cover rounded-bl-[4em] rounded-tl-[2em]"
          />
        </div>
        {isConnectAccount === "create" ? (
          <div className="flex flex-col items-center justify-center px-16 lg:py-6 h-[800px] space-y-6 w-full col-span-2">
            <p className="text-[24px] text-[#181818] font-semibold">
              Subscription Plans
            </p>
            <div className="flex items-center justify-between w-full gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  onClick={() => setSelected(pkg._id)}
                  className={`
        rounded-xl p-4 space-y-4 cursor-pointer transition-all duration-300 w-full
        ${
          selected === pkg._id
            ? "bg-gradient-to-r from-[#36C0EF] to-[#29ABE2] text-white shadow-lg"
            : "bg-white shadow-lite hover:bg-gradient-to-r hover:from-[#36C0EF] hover:to-[#29ABE2] hover:text-white"
        }
      `}
                >
                  {/* Price + Duration */}
                  <div className="flex justify-between items-center w-[250px]">
                    <p
                      className={`text-[18px] font-semibold
            ${
              selected === pkg._id
                ? "text-white"
                : "text-[#36C0EF] group-hover:text-white"
            }`}
                    >
                      {formatProductId(pkg.productId)}
                    </p>

                    <span
                      className={`text-[14px] ml-1
              ${
                selected === pkg._id
                  ? "text-white"
                  : "text-gray-500 group-hover:text-white"
              }`}
                    >
                      {pkg.price}
                      {pkg.productId === "annual_plan"
                        ? "/Annual"
                        : pkg.productId === "premium_plan"
                        ? "/Monthly"
                        : ""}
                    </span>
                  </div>

                  {/* Features List */}
                  <div>
                    <ul
                      className={`list-disc pl-6 space-y-2
            ${
              selected === pkg._id
                ? "text-white"
                : "text-gray-700 hover:text-white"
            }
          `}
                    >
                      {subscriptionFeatures[pkg.productId]?.map(
                        (feature, idx) => (
                          <li key={idx}>{feature}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={!selected}
              onClick={handleNextClick}
              className={`w-[50%] my-6 rounded-[8px] text-white text-[16px] py-3 px-6 font-medium
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
              onClick={() => navigate("/home")}
              type="button"
              className={`w-full rounded-[8px] text-[16px] px-6 font-semibold bg-transparent gradient-text cursor-pointer`}
            >
              Skip
            </button>
          </div>
        ) : isConnectAccount === "complete" ? (
          <div
            onClick={() => navigate("/home")}
            className="flex flex-col items-center justify-center lg:p-6 h-[800px] space-y-4 col-span-2"
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
        ) : isConnectAccount === "stripe" && planData ? (
          <Elements stripe={stripePromise}>
            <PaymentForm
              planData={planData}
              setIsConnectAccount={setIsConnectAccount}
              fetchUser={fetchUser}
            />
          </Elements>
        ) : (
          <div className="w-full flex flex-col items-center justify-center lg:p-6 h-[800px] space-y-4 col-span-2">
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
              and enjoy hassle-free transactions. Stay in control of your funds
              with secure and instant access.
            </p>
            <button
              onClick={() => setIsConnectAccount("create")}
              type="button"
              className="w-[384px] my-6 rounded-[8px] gradient-color text-white text-[16px] py-3 px-6 font-medium"
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectStripeAccount;
