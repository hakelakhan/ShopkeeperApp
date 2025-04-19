import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";

const VenueSetup = () => {
  const [step, setStep] = useState(1);
  const [venueName, setVenueName] = useState("");
  const [venueType, setVenueType] = useState("temple");
  const [venueCity, setVenueCity] = useState("");
  const [openingTime, setOpeningTime] = useState("9:00 AM");
  const [closingTime, setClosingTime] = useState("5:00 PM");
  const [lunchBreak, setLunchBreak] = useState("2:00 PM - 3:00 PM");
  const [holidays, setHolidays] = useState<string[]>([]); // List of selected holidays
  const [counters, setCounters] = useState<{ name: string; type: string }[]>([]);
  const [counterName, setCounterName] = useState("");
  const [counterType, setCounterType] = useState("");

  const addCounter = () => {
    if (counterName) {
      setCounters([...counters, { name: counterName, type: counterType }]);
      setCounterName("");
      setCounterType("");
    }
  };

  const toggleHoliday = (day: string) => {
    if (holidays.includes(day)) {
      setHolidays(holidays.filter((holiday) => holiday !== day));
    } else {
      setHolidays([...holidays, day]);
    }
  };

  const saveSettings = () => {
    // TODO: Save venue settings to the backend or database
    console.log({
      venueName,
      venueType,
      venueCity,
      openingTime,
      closingTime,
      lunchBreak,
      holidays,
      counters,
    });
  };

  return (
    <View className="flex-1 bg-base-100 px-4 py-6">
      <Text className="text-2xl font-bold text-primary mb-4 text-center">
        Complete your venue setup to start managing queue
      </Text>

      {step === 1 && (
        <View>
          <Text className="text-lg font-bold mb-2">Venue Name</Text>
          <TextInput
            className="border border-neutral rounded-lg px-4 py-2 mb-4"
            placeholder="Enter venue name"
            value={venueName}
            onChangeText={setVenueName}
          />

          <Text className="text-lg font-bold mb-2">Venue Type</Text>
          <Picker
            selectedValue={venueType}
            onValueChange={(itemValue) => setVenueType(itemValue)}
            className="border border-neutral rounded-lg mb-4"
          >
            <Picker.Item label="Temple" value="temple" />
            <Picker.Item label="Hospital" value="hospital" />
            <Picker.Item label="Barber Shop" value="barber_shop" />
          </Picker>

          <Text className="text-lg font-bold mb-2">Venue City</Text>
          <TextInput
            className="border border-neutral rounded-lg px-4 py-2 mb-4"
            placeholder="Enter venue city"
            value={venueCity}
            onChangeText={setVenueCity}
          />
        </View>
      )}

      {step === 2 && (
        <View>
          <Text className="text-lg font-bold mb-2">Operating Hours</Text>

          <Text className="text-md font-bold mb-2">Opening Time</Text>
          <Picker
            selectedValue={openingTime}
            onValueChange={(itemValue) => setOpeningTime(itemValue)}
            className="border border-neutral rounded-lg mb-4"
          >
            <Picker.Item label="9:00 AM" value="9:00 AM" />
            <Picker.Item label="10:00 AM" value="10:00 AM" />
            <Picker.Item label="11:00 AM" value="11:00 AM" />
          </Picker>

          <Text className="text-md font-bold mb-2">Closing Time</Text>
          <Picker
            selectedValue={closingTime}
            onValueChange={(itemValue) => setClosingTime(itemValue)}
            className="border border-neutral rounded-lg mb-4"
          >
            <Picker.Item label="5:00 PM" value="5:00 PM" />
            <Picker.Item label="6:00 PM" value="6:00 PM" />
            <Picker.Item label="7:00 PM" value="7:00 PM" />
          </Picker>

          <Text className="text-md font-bold mb-2">Lunch Break</Text>
          <Picker
            selectedValue={lunchBreak}
            onValueChange={(itemValue) => setLunchBreak(itemValue)}
            className="border border-neutral rounded-lg mb-4"
          >
            <Picker.Item label="1:00 PM - 2:00 PM" value="1:00 PM - 2:00 PM" />
            <Picker.Item label="2:00 PM - 3:00 PM" value="2:00 PM - 3:00 PM" />
            <Picker.Item label="3:00 PM - 4:00 PM" value="3:00 PM - 4:00 PM" />
          </Picker>

          <Text className="text-lg font-bold mb-2">Holidays</Text>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
            (day) => (
              <TouchableOpacity
                key={day}
                onPress={() => toggleHoliday(day)}
                className="flex-row items-center mb-2"
              >
                <View
                  className={`w-6 h-6 border-2 rounded mr-2 ${
                    holidays.includes(day) ? "bg-primary border-primary" : "border-neutral"
                  }`}
                />
                <Text className="text-neutral">{day}</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      )}

      {step === 3 && (
        <View>
          <Text className="text-lg font-bold mb-2">Counter Setup</Text>
          <TextInput
            className="border border-neutral rounded-lg px-4 py-2 mb-4"
            placeholder="Counter Name"
            value={counterName}
            onChangeText={setCounterName}
          />
          <TextInput
            className="border border-neutral rounded-lg px-4 py-2 mb-4"
            placeholder="Counter Type (Optional)"
            value={counterType}
            onChangeText={setCounterType}
          />
          <TouchableOpacity
            className="bg-primary py-2 rounded-lg mb-4"
            onPress={addCounter}
          >
            <Text className="text-center text-white font-bold">Add Counter</Text>
          </TouchableOpacity>

          {counters.length > 0 ? (
            <FlatList
              data={counters}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text className="text-neutral mb-2">
                  {item.name} - {item.type || "No Type"}
                </Text>
              )}
            />
          ) : (
            <Text className="text-neutral text-center mt-4">No counters added yet.</Text>
          )}
        </View>
      )}

      <View className="flex-row justify-between mt-6">
        {step > 1 && (
          <TouchableOpacity
            className="bg-neutral py-2 px-4 rounded-lg"
            onPress={() => setStep(step - 1)}
          >
            <Text className="text-white font-bold">Back</Text>
          </TouchableOpacity>
        )}
        {step < 3 ? (
          <TouchableOpacity
            className="bg-primary py-2 px-4 rounded-lg"
            onPress={() => setStep(step + 1)}
          >
            <Text className="text-white font-bold">Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-success py-2 px-4 rounded-lg"
            onPress={saveSettings}
          >
            <Text className="text-white font-bold">Save Settings</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default VenueSetup;