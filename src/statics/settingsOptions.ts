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
