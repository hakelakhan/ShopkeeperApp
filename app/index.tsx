import { Text, TouchableOpacity, View } from "react-native";
import { useRouter, Link } from 'expo-router';


export default function Index() {
  const router = useRouter();
  
  return (
    <View
      className="flex-1 justify-center items-center"      
    >
      <Text className="text-5xl text-accent font-bold">Welcome</Text>
      <TouchableOpacity onPress={() => router.push('/auth')}>
        <Text className="text-5xl text-primary">Go to login screen</Text>
      </TouchableOpacity>
      <Link href="/onboadring">Onboarding </Link>      
      <Link href="/auth/registerAndLogin">Register and Login </Link>
      <Link href="/settings/venue">Settings </Link>
      <Link href="/dashboard">Dashboard </Link>
      <Link href="/dashboard/counter">Counter </Link>
    </View>
  );
}
