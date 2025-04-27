// filepath: d:\Downloads\tmp\front-end-project\ShopkeeperApp\app\auth\registerAndLogin.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function RegisterAndLogin() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Add an onAuthStateChanged listener to navigate to the dashboard after login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Navigate to the Dashboard if the user is logged in
        router.replace("/dashboard");
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  const handleEmailAuth = async () => {
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert("Success", "Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert("Success", "Logged in successfully!");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      Alert.alert("Error", errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      Alert.alert("Success", "Logged in with Google!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-base-100 px-4">
      <Text className="text-3xl font-bold text-primary mb-6">
        {isRegister ? "Register" : "Login"}
      </Text>

      <TextInput
        className="w-full border border-neutral rounded-lg px-4 py-2 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="w-full border border-neutral rounded-lg px-4 py-2 mb-4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="w-full bg-primary py-3 rounded-lg mb-4"
        onPress={handleEmailAuth}
      >
        <Text className="text-center text-white font-bold">
          {isRegister ? "Register" : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full bg-info py-3 rounded-lg mb-4"
        onPress={handleGoogleLogin}
      >
        <Text className="text-center text-white font-bold">
          Login with Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
        <Text className="text-primary">
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}