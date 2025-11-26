import {
  settingIcon,
  subscriptionSetting,
  walletSetting,
  privacySetting,
  shieldSetting,
  profileSetting,
  bell,
  passwordIcon,
  menIcon,
} from "../assets/export";

export const SETTINGS_OPTIONS: {
  key: string;
  label: string;
  icon: string;
  path?: string;
  active?: boolean;
  children?: {
    key: string;
    label: string;
    path?: string;
    icon?: string;
  }[];
}[] = [
  {
    key: "profile",
    label: "Profile",
    icon: profileSetting,
    active: true,
  },
  {
    key: "wallet",
    label: "Wallet",
    icon: walletSetting,
  },
  {
    key: "subscription",
    label: "Subscription Plans",
    icon: subscriptionSetting,
  },
  {
    key: "settings",
    label: "Settings",
    icon: settingIcon,
    children: [
      { key: "notifications", label: "Notifications", icon: bell },
      { key: "change-password", label: "Change Password", icon: passwordIcon },
      { key: "delete-account", label: "Delete Account", icon: menIcon },
    ],
  },
  {
    key: "terms",
    label: "Terms and Conditions",
    icon: shieldSetting,
  },
  {
    key: "privacy",
    label: "Privacy Policy",
    icon: privacySetting,
  },
];

export const subscriptionFeatures: Record<string, string[]> = {
  premium_plan: [
    "Create and manage property listings with detailed information.",
    "Upload high-quality photos and videos to showcase crash pads.",
    "Integrated calendar to track availability and manage reservations.",
    "Easy booking management with detailed user and payment information.",
  ],
  annual_plan: [
    "Create and manage property listings with detailed information.",
    "Upload high-quality photos and videos to showcase crash pads.",
    "Integrated calendar to track availability and manage reservations.",
    "Easy booking management with detailed user and payment information.",
  ],
  lifetime_product: [
    "Create and manage property listings with detailed information.",
    "Upload high-quality photos and videos to showcase crash pads.",
    "Integrated calendar to track availability and manage reservations.",
    "Easy booking management with detailed user and payment information.",
  ],
};

export const subscriptionPlans = [
  {
    _id: "687e48b6ddf31b5e0871f51b",
    name: "1 month",
    price: "24.99",
    productId: "premium_plan",
    stripePriceId: "price_1SKCiaPMsOS7ZJ7Y8TYTuTQt",
    stripeProductId: "premium_plan",
    subscriptionId: "seven_days_plan",
    createdAt: "2025-07-21T14:03:34.475Z",
    updatedAt: "2025-10-20T06:37:20.632Z",
    __v: 0,
    features: [
      "Create and manage property listings with detailed information.",
      "Upload high-quality photos and videos to showcase crash pads.",
      "Integrated calendar to track availability and manage reservations.",
      "Easy booking management with detailed user and payment information.",
    ],
  },
  {
    _id: "687e48d1ddf31b5e0871f51f",
    name: "1 year",
    price: "224.99",
    productId: "annual_plan",
    stripePriceId: "price_1SKYd7PMsOS7ZJ7Ylm9zXNxJ",
    stripeProductId: "annual_plan",
    subscriptionId: "fourteen_days_plan",
    createdAt: "2025-07-21T14:04:01.775Z",
    updatedAt: "2025-10-21T06:01:09.311Z",
    __v: 0,
    features: [
      "Create and manage property listings with detailed information.",
      "Upload high-quality photos and videos to showcase crash pads.",
      "Integrated calendar to track availability and manage reservations.",
      "Easy booking management with detailed user and payment information.",
    ],
  },
  {
    _id: "68e7516f46fbd78935eea732",
    name: "Lifetime",
    price: "999.99",
    productId: "lifetime_product",
    subscriptionId: "lifetime_product",
    createdAt: "2025-10-09T06:08:47.227Z",
    updatedAt: "2025-10-09T06:08:47.227Z",
    __v: 0,
    features: [
      "Create and manage property listings with detailed information.",
      "Upload high-quality photos and videos to showcase crash pads.",
      "Integrated calendar to track availability and manage reservations.",
      "Easy booking management with detailed user and payment information.",
    ],
  },
];
