import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Dashboard: undefined;
  CounterDetails: { counterName: string; currentToken: number; queueLength: number };
};

type CounterDetailsProps = NativeStackScreenProps<RootStackParamList, 'CounterDetails'>;

const CounterDetails = ({ route, navigation }: CounterDetailsProps) => {
  const { counterName, currentToken, queueLength } = route.params; // Passed from Dashboard
  const [queue, setQueue] = useState([
    { id: "1", name: "Rajesh Kumar", status: "waiting" },
    { id: "2", name: "Ananya Sharma", status: "waiting" },
    { id: "3", name: "John Doe", status: "waiting" },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");

  const markAsDone = (id: string) => {
    setQueue(queue.filter((person) => person.id !== id));
    console.log(`Person with ID ${id} marked as done.`);
  };

  const cancelPerson = (id: string) => {
    setQueue(queue.filter((person) => person.id !== id));
    console.log(`Person with ID ${id} marked as cancelled.`);
  };

  const addPerson = () => {
    const newId = (queue.length + 1).toString();
    setQueue([...queue, { id: newId, name: newPersonName, status: "waiting" }]);
    setNewPersonName("");
    setIsModalVisible(false);
  };

  const renderItem = ({ item, drag }: { item: { id: string; name: string; status: string }; drag: () => void }) => (
    <View className="flex-row justify-between items-center px-4 py-2 border-b border-neutral">
      <Text className="text-lg">🔢 {item.id}. 👤 {item.name}</Text>
      <View className="flex-row">
        <TouchableOpacity
          className="bg-success py-1 px-3 rounded-lg mr-2"
          onPress={() => markAsDone(item.id)}
        >
          <Text className="text-white font-bold">✅ Done</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-error py-1 px-3 rounded-lg mr-2"
          onPress={() => cancelPerson(item.id)}
        >
          <Text className="text-white font-bold">❌ Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onLongPress={drag}>
          <Text className="text-neutral font-bold">≡</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-base-100">
      {/* Header */}
      <View className="bg-primary py-4 px-6 flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">{counterName}</Text>
        <Text className="text-white text-lg">Queue: {queue.length}</Text>
        <TouchableOpacity
          className="bg-info py-2 px-4 rounded-lg"
          onPress={() => setIsModalVisible(true)}
        >
          <Text className="text-white font-bold">➕ Add Person</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Button */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CounterDetails", {
            counterName: "Counter 1",
            currentToken: 37,
            queueLength: 12,
          })
        }
      >
        <Text>Go to Counter Details</Text>
      </TouchableOpacity>

      {/* Live Queue List */}
      <DraggableFlatList
        data={queue}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={({ data }) => setQueue(data)}
      />

      {/* Now Serving */}
      <View className="px-6 py-4 border-t border-neutral">
        <Text className="text-lg font-bold">🧮 Now Serving: #{currentToken}</Text>
      </View>

      {/* Add Person Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-6 w-4/5">
            <Text className="text-lg font-bold mb-4">➕ Add Person</Text>
            <TextInput
              className="border border-neutral rounded-lg px-4 py-2 mb-4"
              placeholder="Person Name"
              value={newPersonName}
              onChangeText={setNewPersonName}
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
                onPress={addPerson}
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

export default CounterDetails;