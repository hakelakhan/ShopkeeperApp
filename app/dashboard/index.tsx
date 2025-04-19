import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Switch, TextInput, Modal } from "react-native";

const Dashboard = () => {
  const [venueStatus, setVenueStatus] = useState(true); // Venue status toggle
  const [counters, setCounters] = useState([
    { id: 1, name: "Counter 1", queue: 12, currentToken: 37, status: true },
    { id: 2, name: "Counter 2", queue: 5, currentToken: 24, status: false },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCounterName, setNewCounterName] = useState("");
  const [newCounterType, setNewCounterType] = useState("");
  const [newCounterLimit, setNewCounterLimit] = useState("");

  const toggleVenueStatus = () => {
    setVenueStatus((prevStatus) => !prevStatus);
  };

  const toggleCounterStatus = (id) => {
    setCounters((prevCounters) =>
      prevCounters.map((counter) =>
        counter.id === id ? { ...counter, status: !counter.status } : counter
      )
    );
  };

  const addCounter = () => {
    const newCounterId = counters.length + 1;
    setCounters([
      ...counters,
      {
        id: newCounterId,
        name: newCounterName || `Counter ${newCounterId}`,
        queue: 0,
        currentToken: 0,
        status: true,
        type: newCounterType || "General",
        maxLimit: newCounterLimit || "Unlimited",
      },
    ]);
    setNewCounterName("");
    setNewCounterType("");
    setNewCounterLimit("");
    setIsModalVisible(false);
  };

  return (
    <View className="flex-1 bg-base-100">
      {/* Top Bar */}
      <View className="bg-primary py-4 px-6 flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">🏷️ Sai Baba Temple</Text>
        <View className="flex-row items-center">
          <Text className="text-white text-lg mr-2">{venueStatus ? "🟢 Online" : "🔴 Offline"}</Text>
          <Switch
            value={venueStatus}
            onValueChange={toggleVenueStatus}
            trackColor={{ false: "#767577", true: "#4F46E5" }}
            thumbColor={venueStatus ? "#FFFFFF" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Counter List */}
      <FlatList
        data={counters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center px-6 py-4 border-b border-neutral">
            <Text className="text-lg font-bold">{item.name}</Text>
            <Text className="text-neutral">| {item.queue} in Queue |</Text>
            <Text className="text-neutral">🔢 {item.currentToken}</Text>
            <Switch
              value={item.status}
              onValueChange={() => toggleCounterStatus(item.id)}
              trackColor={{ false: "#767577", true: "#4F46E5" }}
              thumbColor={item.status ? "#FFFFFF" : "#f4f3f4"}
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