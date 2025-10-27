import { useEffect, useState } from "react";
import { subscriptionPlans } from "../../statics/settingsOptions";
import axios from "../../axios";
import { getErrorMessage } from "../../init/appValues";
import { useToast } from "../../hooks/useToast";
import Toast from "../global/Toast";
import ConfirmationModal from "../global/ConfirmationModal";
import { useAppStore } from "../../store/appStore";
import useAuthStore from "../../store/authStore";

export interface SubscriptionStatus {
  _id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  paymentIntentId: string;
  platform: "stripe" | "paypal" | string; // extend if needed
  productId: string;
  purchaseToken: string;
  renewed: number; // consider changing to boolean if it's always 0 or 1
  status: "active" | "inactive" | "cancelled" | string;
  subscriptionId: string;
  subscriptionPlan: string;
  subscriptionPrice: number;
  user: string; // user ID reference
  __v: number;
}

const SubscriptionPlans = () => {
  const { user, fetchUser } = useAppStore();
  const { updateUser } = useAuthStore();
  const { toast, showToast } = useToast();
  const [isDelete, setIsDelete] = useState(false);
  const [pendingSubscriptionId, setPendingSubscriptionId] = useState<
    string | null
  >(null);
  const [componentState, setComponentState] = useState<
    "ready" | "loading" | "error"
  >("ready");
  const [isSubscription, setIsSubscription] = useState<SubscriptionStatus>();

  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );

  useEffect(() => {
    if (user) {
      updateUser(user, true);
    }
  }, [user]);

  const cancelSubscription = async (subscriptionId: string) => {
    try {
      setState("loading");
      const response = await axios.post(
        "/subscription/cancelStripeSubscription",
        { subscriptionId }
      );
      if (response.status === 200) {
        setState("ready");
        showToast("Subscription Cancelled", "info");
        getUserSubscription();
        setIsSubscription({
          _id: "",
          createdAt: "",
          updatedAt: "",
          paymentIntentId: "",
          platform: "stripe", // or "" if you prefer
          productId: "",
          purchaseToken: "",
          renewed: 0,
          status: "cancelled", // or "" if you prefer
          subscriptionId: "",
          subscriptionPlan: "",
          subscriptionPrice: 0,
          user: "",
          __v: 0,
        });
        fetchUser();
      }
    } catch (error) {
      setState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  const handleSubscription = async (productId: string | undefined) => {
    try {
      setState("loading");
      const response = await axios.post(
        "/subscription/createStripeSubscription",
        {
          productId: productId,
        }
      );

      if (response.status === 200) {
        setState("ready");
        showToast("Subscription Buy Successfully", "success");
        fetchUser();
        getUserSubscription();
      }
    } catch (error) {
      setState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  const getUserSubscription = async () => {
    try {
      setComponentState("loading");
      const response = await axios.get("/subscription/currentSubscription");
      if (response.status === 200) {
        setComponentState("ready");
        setIsSubscription(response.data.data);
      }
    } catch (error) {
      setComponentState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  useEffect(() => {
    getUserSubscription();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl mb-4">
      {componentState === "error" && <Toast {...toast} />}
      <div className="flex items-center justify-center w-full">
        <p className="text-[24px] text-[#181818] font-semibold mb-4">
          SubscriptionPlans
        </p>
      </div>

      {/* Scrollable container */}
      <div className="overflow-x-auto">
        {componentState === "loading" ? (
          <div className="flex justify-center items-center w-full py-10">
            <p className="text-gray-500">Loading subscription plans...</p>
          </div>
        ) : (
          <div className="flex flex-nowrap gap-6 w-max">
            {subscriptionPlans.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white shadow-lite rounded-xl p-4 space-y-4 min-w-[320px] max-w-[360px] flex-shrink-0"
              >
                <div className="flex justify-end w-full">
                  <p className="text-[32px] font-semibold text-[#36C0EF]">
                    ${pkg.price}
                    <span className="text-[14px] text-gray-500">
                      /{pkg.name.replace(/_/g, " ")}
                    </span>
                  </p>
                </div>
                {/* <div>
                <p className="gradient-text">
                  Package {index + 1}: {pkg.name}
                </p>
              </div> */}
                <div>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    {pkg.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="w-full">
                  {isSubscription?.productId === pkg.productId ? (
                    <>
                      {isSubscription.productId === "lifetime_product" ? (
                        <button
                          disabled={true}
                          type="button"
                          className="w-full my-6 rounded-[8px] gradient-color text-white text-[16px] py-3 px-6 font-medium"
                        >
                          Subscribed
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setPendingSubscriptionId(
                              isSubscription?.subscriptionId
                            );
                            setIsDelete(true);
                          }}
                          type="button"
                          className="w-full my-6 cursor-pointer rounded-[8px] gradient-color text-white text-[16px] py-3 px-6 font-medium"
                        >
                          {state === "loading"
                            ? "Canceling..."
                            : "Cancel Subscription"}
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => handleSubscription(pkg.productId)}
                      disabled={isSubscription === undefined ? false : true}
                      type="button"
                      className={`w-full my-6 rounded-[8px] gradient-color ${
                        isSubscription === undefined
                          ? "opacity-95 cursor-pointer"
                          : "opacity-45"
                      } text-white text-[16px] py-3 px-6 font-medium`}
                    >
                      {state === "loading"
                        ? "Processing..."
                        : "Buy Subscription"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {isDelete && (
        <ConfirmationModal
          title="Cancel Subscription"
          content="Are you sure you want to cancel your subscription?"
          skipBtnContent="No"
          confirmBtnContent="Yes, Cancel"
          onClose={() => {
            setIsDelete(false);
            setPendingSubscriptionId(null);
          }}
          onSubmit={() => {
            if (pendingSubscriptionId) {
              cancelSubscription(pendingSubscriptionId);
              setIsDelete(false);
              setPendingSubscriptionId(null);
            }
          }}
          loading={state}
        />
      )}
    </div>
  );
};

export default SubscriptionPlans;
