import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const RegisterAndLogin = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth login
    console.log("Google Login");
  };

  const handleEmailAuth = () => {
    if (isRegister) {
      // TODO: Implement Firebase registration
      console.log("Register with Email:", email, password);
    } else {
      // TODO: Implement Firebase login
      console.log("Login with Email:", email, password);
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
};

export default RegisterAndLogin;