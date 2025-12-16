import { db } from './firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';

const getDeviceType = () => {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
};

export const syncUserOnLogin = async (user: any) => {
  if (!user || !user.uid) return;
  try {
    const userRef = doc(db, 'calculator_users', user.uid);
    await setDoc(userRef, {
      email: user.email,
      lastLogin: serverTimestamp(),
      deviceType: getDeviceType(),
      displayName: user.displayName || '',
      uid: user.uid
    }, { merge: true });
  } catch (error) {
    console.error("Error syncing user to Firestore:", error);
  }
};

export const syncUserPhone = async (phone: string, user: any | null) => {
  try {
    if (user && user.uid) {
      // Update existing user doc if logged in
      const userRef = doc(db, 'calculator_users', user.uid);
      await setDoc(userRef, {
        phoneNumber: phone,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } else {
      // Create new doc for phone-only user
      // Using phone number (sanitized) as ID to prevent duplicates
      const sanitizedPhone = phone.replace(/[^\d+]/g, '');
      const userRef = doc(db, 'calculator_users', `phone_${sanitizedPhone}`);
      await setDoc(userRef, {
        phoneNumber: phone,
        deviceType: getDeviceType(),
        createdAt: serverTimestamp(),
        type: 'phone_only'
      }, { merge: true });
    }
  } catch (error) {
    console.error("Error syncing phone to Firestore:", error);
  }
};

export const saveInsight = async (userEmail: string | null, context: string, inputData: any, insightText: string) => {
  try {
    await addDoc(collection(db, 'calculator_insights'), {
      userEmail: userEmail || 'anonymous',
      context,
      inputData,
      insight: insightText,
      createdAt: serverTimestamp(),
      deviceType: getDeviceType(),
      type: 'general_insight'
    });
  } catch (error) {
    console.error("Error saving insight to Firestore:", error);
  }
};

export const saveOptimization = async (userEmail: string | null, context: string, originalData: any, optimizedData: any, explanation: string) => {
  try {
    await addDoc(collection(db, 'calculator_optimizations'), {
      userEmail: userEmail || 'anonymous',
      context,
      originalData,
      optimizedData,
      explanation,
      createdAt: serverTimestamp(),
      deviceType: getDeviceType(),
      type: 'ai_fix'
    });
  } catch (error) {
    console.error("Error saving optimization to Firestore:", error);
  }
};
