import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Switch, ActivityIndicator, Modal } from "react-native";
import { useRouter } from "expo-router";
import { getVenueDataByUser } from "../../src/services/venueServices";
import { Venue, Counter } from "../../src/models/modelDefinations";
import { getAuth } from "firebase/auth";
import { FontAwesome } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg"; // Import QRCode library

const Dashboard = () => {
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [selectedQRString, setSelectedQRString] = useState<string | null>(null); // State for selected QR code

  // Fetch venue data from Firestore
  const fetchVenue = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("No user is logged in.");
        router.replace("/settings/venue");
        return;
      }

      const userId = currentUser.uid;
      const venueData = await getVenueDataByUser(userId);

      if (!venueData) {
        router.replace("/settings/venue");
      } else {
        setVenue(venueData);
      }
    } catch (error) {
      console.error("Failed to fetch venue data:", error);
      router.replace("/settings/venue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVenue();
  }, []);

  const toggleVenueStatus = () => {
    if (venue) {
      setVenue({ ...venue, status: !venue.status });
    }
  };

  const toggleCounterStatus = (id: number) => {
    if (venue) {
      const updatedCounters = venue.counters.map((counter) =>
        counter.id === id ? { ...counter, isActive: !counter.isActive } : counter
      );
      setVenue({ ...venue, counters: updatedCounters });
    }
  };

  const showQRCode = (qrString: string) => {
    setSelectedQRString(qrString); // Set the selected QR code
    setIsModalVisible(true); // Show the modal
  };

  const closeModal = () => {
    setIsModalVisible(false); // Hide the modal
    setSelectedQRString(null); // Clear the selected QR code
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-base-100">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!venue) {
    return (
      <View className="flex-1 justify-center items-center bg-base-100">
        <Text className="text-lg font-bold">Failed to load venue data.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base-100">
      {/* Top Bar */}
      <View className="bg-primary py-4 px-6 flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">🏷️ {venue.name}</Text>
        <View className="flex-row items-center">
          <Text className="text-white text-lg mr-2">{venue.status ? "🟢 Online" : "🔴 Offline"}</Text>
          <Switch
            value={venue.status}
            onValueChange={toggleVenueStatus}
            trackColor={{ false: "#767577", true: "#4F46E5" }}
            thumbColor={venue.status ? "#FFFFFF" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Counter List */}
      <FlatList
        data={venue.counters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center px-6 py-4 border-b border-neutral">
            <Text className="text-lg font-bold">{item.name}</Text>
            <Text className="text-neutral">| {item.queue.length} in Queue |</Text>
            <Text className="text-neutral">🔢 {item.queue.currentToken}</Text>
            <View className="flex-row items-center">
              {/* QR Code Icon */}
              <TouchableOpacity onPress={() => showQRCode(item.qrString)}>
                <FontAwesome name="qrcode" size={24} color="#4F46E5" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Action Buttons */}
      <View className="flex-row justify-between px-6 py-4 border-t border-neutral">
        {/* Refresh Data Button */}
        <TouchableOpacity
          className="bg-secondary py-2 px-4 rounded-lg"
          onPress={() => fetchVenue()}
        >
          <Text className="text-white font-bold text-center">🔄 Refresh</Text>
        </TouchableOpacity>

        {/* Settings Button */}
        <TouchableOpacity
          className="bg-warning py-2 px-4 rounded-lg"
          onPress={() => router.push("/settings/venue")}
        >
          <Text className="text-white font-bold text-center">⚙️ Settings</Text>
        </TouchableOpacity>

        {/* View Stats Button */}
        <TouchableOpacity
          className="bg-info py-2 px-4 rounded-lg"
          onPress={() => console.log("View Stats")}
        >
          <Text className="text-white font-bold text-center">📈 View Stats</Text>
        </TouchableOpacity>
      </View>

      {/* QR Code Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg items-center">
            <Text className="text-lg font-bold mb-4">QR Code</Text>
            {selectedQRString && (
              <QRCode
                value={selectedQRString} // Render the selected QR code
                size={200} // Adjust the size as needed
              />
            )}
            <TouchableOpacity
              className="bg-primary py-2 px-4 rounded-lg mt-4"
              onPress={closeModal}
            >
              <Text className="text-white font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Dashboard;