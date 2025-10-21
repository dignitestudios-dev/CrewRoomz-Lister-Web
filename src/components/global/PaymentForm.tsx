import { useEffect, useState } from "react";
import {
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "../../axios";
import type { PackageData } from "../../pages/app/ConnectStripeAccount";
import { formatProductId, getErrorMessage } from "../../init/appValues";
import { useToast } from "../../hooks/useToast";
import Toast from "./Toast";

interface PaymentFormProps {
  planData: PackageData;
  setIsConnectAccount: React.Dispatch<React.SetStateAction<string>>;
}

const ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#1A202C",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: "16px",
      "::placeholder": {
        color: "#CBD5E0",
      },
    },
    invalid: {
      color: "#E53E3E",
      iconColor: "#E53E3E",
    },
  },
};

const PaymentForm: React.FC<PaymentFormProps> = ({
  planData,
  setIsConnectAccount,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast, showToast } = useToast();
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [componentState, setComponentState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [isCard, setIsCard] = useState(false);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setState("loading");
    if (!stripe || !elements) {
      console.error("Stripe.js has not yet loaded.");
      setState("error");
      showToast(getErrorMessage("Stripe.js has not yet loaded."), "error");
      return;
    }
    const cardNumberElement = elements?.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setState("error");
      showToast(getErrorMessage("Card element not found"), "error");
      console.error("Card element not found");
      return;
    }

    // Create payment method using stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
    });

    if (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      setState("error");
      showToast(getErrorMessage(error), "error");
    } else {
      try {
        const response = await axios.post("/card", {
          paymentMethodId: paymentMethod.id,
        });

        if (response.status === 200) {
          const response = await axios.post(
            "/subscription/createStripeSubscription",
            {
              productId: planData.productId,
            }
          );
          console.log("🚀 ~ handleSubmit ~ response:", response);

          if (response.status === 200) {
            // try {
            //   const res = await axios.get(`/users/me`);
            //   if (res.status === 200) {
            //     // loginContext({ user: res?.data?.data });
            //     setIsConnectAccount("complete");
            //   }
            // } catch (error) {
            // console.log("🚀 ~ handleSubmit ~ error:", error)
            // //   ErrorToast(error?.response?.data?.message);
            // }
          }
        }
      } catch (apiError) {
        console.log("🚀 ~ handleSubmit ~ apiError:", apiError);

        setState("error");
        showToast(getErrorMessage(apiError), "error");
      }
    }
  };

  const handleSubscription = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    try {
      setState("loading");
      const response = await axios.post(
        "/subscription/createStripeSubscription",
        {
          productId: planData.productId,
        }
      );
      console.log("🚀 ~ handleSubmit ~ response:", response);

      if (response.status === 200) {
        setState("ready");
        setIsConnectAccount("complete");
      }
    } catch (error) {
      setState("error");
      showToast(getErrorMessage(error), "error");
      console.log("🚀 ~ handleSubscription ~ error:", error);
    }
  };

  const getUserCard = async () => {
    try {
      setComponentState("loading");
      const response = await axios.get("/card");
      if (response.status === 200) {
        setComponentState("ready");
        setIsCard(true);
      }
    } catch (error) {
      setComponentState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  useEffect(() => {
    getUserCard();
  }, []);

  return (
    <div className="col-span-2 w-full flex flex-col items-center justify-center">
      {state === "error" && <Toast {...toast} />}

      <h2 className="text-[24px] font-[600]  ">Payment Details</h2>
      <div className="flex justify-between items-center p-6 mt-3 w-[480px] gradient-color text-white h-[79px] rounded-3xl ">
        <h2 className="text-[18px] font-[600] text-white ">
          {formatProductId(planData.productId)}
        </h2>
        <p className="text-[20px] text-white font-[600] ">
          ${planData?.price}{" "}
          <span className="text-[16px] font-[400] ">
            {planData?.productId === "annual_plan" ? "/year" : "/month"}
          </span>{" "}
        </p>
      </div>
      {/* <div className="flex justify-between items-center border-b border-b-[#D9D9D9]  pb-4 my-5">
        <h2 className="text-[14px] font-[500]  ">
          Non-Refundable Application Fee -{" "}
        </h2>
        <p className="text-[14px] font-[700] ">{planData?.price}</p>
      </div> */}
      <div className="flex justify-end items-center w-[480px]  pb-4 my-5">
        <h2 className="text-[14px] font-[500]  ">Total Amount </h2>
        <p className="text-[16px] font-[500] ">${planData?.price}</p>
      </div>

      {componentState === "loading" ? (
        <div className=" rounded-2xl shadow-md overflow-hidden w-[350px]">
          {/* Image Placeholder */}
          <div className="h-48 bg-gray-200 w-full"></div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      ) : (
        <form>
          {isCard ? (
            <div className="w-[480px] grid grid-cols-2 mt-4 gap-4">
              <div>
                <button
                  type={"button"}
                  onClick={() => setIsConnectAccount("create")}
                  className="rounded-2xl w-full font-[500] bg-slate-200 border-gray-100  text-[16px] h-[49px] "
                >
                  <div className="flex justify-center items-center">
                    <span className="mr-1">Back</span>
                  </div>
                </button>
              </div>
              <div>
                <button
                  disabled={state === "loading"}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleSubscription(e)
                  }
                  className="block w-full px-4 py-3 gradient-color text-white rounded-2xl font-semibold text-center hover:opacity-90 transition"
                >
                  <div className="flex justify-center items-center">
                    <span className="mr-1">
                      {state === "loading" ? "Loading..." : "Buy Now"}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-3xl p-6 space-y-4 w-[480px] xl:max-w-[880px] md:max-w-[550px]">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Card Number
                  </label>
                  <div className="border border-gray-300 rounded-md px-4 py-2 bg-white">
                    <CardNumberElement options={ELEMENT_OPTIONS} />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Expiry
                    </label>
                    <div className="border border-gray-300 rounded-md px-4 py-2 bg-white">
                      <CardExpiryElement options={ELEMENT_OPTIONS} />
                    </div>
                  </div>

                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      CVC
                    </label>
                    <div className="border border-gray-300 rounded-md px-4 py-2 bg-white">
                      <CardCvcElement options={ELEMENT_OPTIONS} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 mt-4 gap-4">
                <div>
                  <button
                    type={"button"}
                    onClick={() => setIsConnectAccount("create")}
                    className="rounded-2xl w-full font-[500] bg-slate-200 border-gray-100  text-[16px] h-[49px] "
                  >
                    <div className="flex justify-center items-center">
                      <span className="mr-1">Back</span>
                    </div>
                  </button>
                </div>
                <div>
                  <button
                    disabled={state === "loading"}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      handleSubmit(e)
                    }
                    className="block w-full px-4 py-3 gradient-color text-white rounded-2xl font-semibold text-center hover:opacity-90 transition"
                  >
                    <div className="flex justify-center items-center">
                      <span className="mr-1">
                        {state === "loading" ? "Loading..." : "Pay Now"}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default PaymentForm;
