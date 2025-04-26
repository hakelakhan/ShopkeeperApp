import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, navigate to the Dashboard
        router.replace("/dashboard");
      } else {
        // User is logged out, navigate to the Register and Login screen
        router.replace("/auth/registerAndLogin");
      }
      setIsLoading(false); // Stop showing the loading indicator
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  if (isLoading) {
    // Show a loading indicator while checking auth state
    return (
      <View className="flex-1 justify-center items-center bg-base-100">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return null; // No UI is needed here since navigation is handled
}