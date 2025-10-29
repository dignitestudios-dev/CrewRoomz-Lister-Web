import { db } from "./firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { getToken, onMessage, type MessagePayload } from "firebase/messaging";
import { messaging } from "./firebase";

type ChatCallback = (chats: Chat[]) => void;

export function getUserChatsWithDetails(
  currentRole: string,
  userId: string | number,
  callback: ChatCallback
) {
  if (!userId) {
    callback([]);
    return () => {}; // safe unsubscribe fallback
  }

  const chatsRef = collection(db, "chats");
  const q = query(
    chatsRef,
    where(`participants.${currentRole}`, "==", userId)
    // orderBy("timestamp", "asc")
  );

  // Return unsubscribe function
  return onSnapshot(q, async (snapshot) => {
    const chatList = await Promise.all(
      snapshot.docs.map(async (chatDoc) => {
        const chatDocData = chatDoc.data() as Omit<Chat, "id">;
        const chatData: Chat = { id: chatDoc.id, ...chatDocData };
        const participants = chatData.participants || {};

        const otherRole = currentRole === "tenant" ? "landlord" : "tenant";
        const otherUserId = participants[otherRole];

        if (otherUserId) {
          const otherUserRef = doc(db, "users", otherUserId);
          const otherUserSnap = await getDoc(otherUserRef);

          if (otherUserSnap.exists()) {
            const userDoc = otherUserSnap.data();
            const roleData = (userDoc.roles || {})[otherRole];

            if (roleData) {
              chatData.user = {
                uid: otherUserId,
                email: userDoc.email,
                id: userDoc._id,
                name: roleData.name,
                profilePicture: roleData.profilePicture,
                role: otherRole,
              };
            }
          }
        }

        return chatData;
      })
    );

    callback(chatList);
  });
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  text: string
) {
  const messagesRef = collection(db, "chats", chatId, "messages");

  await addDoc(messagesRef, {
    senderId,
    text,
    timestamp: serverTimestamp(),
  });
}

export const onMessageListener = (): Promise<MessagePayload> =>
  new Promise((resolve) => {
    const unsubscribe = onMessage(messaging, (payload) => {
      resolve(payload);
      unsubscribe(); // Optional: if you want one-time
    });
  });

// Request permission and get FCM token
export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};
