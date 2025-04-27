import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Switch, TextInput, Modal, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getVenueDataByUser } from "../../src/services/venueServices"; // Use the updated function
import { Venue, Counter } from "../../src/models/modelDefinations"; // Import the Venue and Counter interfaces
import { getAuth } from "firebase/auth"; // Import Firebase Auth to get the user ID

const Dashboard = () => {
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null); // State to hold venue data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCounterName, setNewCounterName] = useState("");
  const [newCounterType, setNewCounterType] = useState("");
  const [newCounterLimit, setNewCounterLimit] = useState("");

  // Fetch venue data from Firestore
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.error("No user is logged in.");
          router.replace("/settings/venue"); // Redirect to venue setup if no user is logged in
          return;
        }

        const userId = currentUser.uid; // Get the logged-in user's UID
        const venueData = await getVenueDataByUser(userId); // Fetch venue data for the user

        if (!venueData) {
          router.replace("/settings/venue"); // Redirect to venue setup if no venue is found
        } else {
          setVenue(venueData); // Set the venue data
        }
      } catch (error) {
        console.error("Failed to fetch venue data:", error);
        router.replace("/settings/venue"); // Redirect to venue setup if fetching fails
      } finally {
        setIsLoading(false);
      }
    };

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

  const addCounter = () => {
    if (venue) {
      const newCounterId = venue.counters.length + 1;
      const newCounter: Counter = {
        id: newCounterId,
        name: newCounterName || `Counter ${newCounterId}`,
        type: newCounterType || "General",
        isActive: true,
        qrString: `https://example.com/qr/counter${newCounterId}`,
        queue: {
          id: 100 + newCounterId,
          length: 0,
          currentToken: 0,
        },
      };
      setVenue({ ...venue, counters: [...venue.counters, newCounter] });
      setNewCounterName("");
      setNewCounterType("");
      setNewCounterLimit("");
      setIsModalVisible(false);
    }
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
            <Switch
              value={item.isActive}
              onValueChange={() => toggleCounterStatus(item.id)}
              trackColor={{ false: "#767577", true: "#4F46E5" }}
              thumbColor={item.isActive ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>
        )}
      />

      {/* Action Buttons */}
      <View className="flex-row justify-between px-6 py-4 border-t border-neutral">
        <TouchableOpacity
          className="bg-primary py-2 px-4 rounded-lg"
          onPress={() => setIsModalVisible(true)}
        >
          <Text className="text-white font-bold text-center">➕ Add Counter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-info py-2 px-4 rounded-lg"
          onPress={() => console.log("View Stats")}
        >
          <Text className="text-white font-bold text-center">📈 View Stats</Text>
        </TouchableOpacity>
      </View>

      {/* Add Counter Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-6 w-4/5">
            <Text className="text-lg font-bold mb-4">➕ Add Counter</Text>
            <TextInput
              className="border border-neutral rounded-lg px-4 py-2 mb-4"
              placeholder="Counter Name"
              value={newCounterName}
              onChangeText={setNewCounterName}
            />
            <TextInput
              className="border border-neutral rounded-lg px-4 py-2 mb-4"
              placeholder="Counter Type (e.g., VIP, General)"
              value={newCounterType}
              onChangeText={setNewCounterType}
            />
            <TextInput
              className="border border-neutral rounded-lg px-4 py-2 mb-4"
              placeholder="Max Limit (Optional)"
              value={newCounterLimit}
              onChangeText={setNewCounterLimit}
              keyboardType="numeric"
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-neutral py-2 px-4 rounded-lg"
                onPress={() => setIsModalVisible(false)}
              >
                <Text className="text-white font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-primary py-2 px-4 rounded-lg"
                onPress={addCounter}
              >
                <Text className="text-white font-bold">Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Dashboard;