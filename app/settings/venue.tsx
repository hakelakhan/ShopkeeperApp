import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { writeOrModifyVenueData, getVenueDataByUser } from "../../src/services/venueServices";
import { Venue } from "../../src/models/modelDefinations";
import { getAuth } from "firebase/auth";
import QRCode from "react-native-qrcode-svg"; // Import QRCode from react-native-qrcode-svg

const VenueSetup = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [venueName, setVenueName] = useState("");
  const [venueType, setVenueType] = useState("temple");
  const [venueCity, setVenueCity] = useState("");
  const [openingTime, setOpeningTime] = useState("9:00 AM");
  const [closingTime, setClosingTime] = useState("5:00 PM");
  const [lunchBreak, setLunchBreak] = useState("2:00 PM - 3:00 PM");
  const [holidays, setHolidays] = useState<string[]>([]);
  const [counters, setCounters] = useState<{ name: string; type: string; qrString?: string; deleted?: boolean }[]>([]);
  const [counterName, setCounterName] = useState("");
  const [counterType, setCounterType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [venueId, setVenueId] = useState(""); // Store the venue ID

  // Fetch existing venue data
  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.error("No user is logged in.");
          return;
        }

        const userId = currentUser.uid;
        const venueData = await getVenueDataByUser(userId);

        if (venueData) {
          // Pre-fill form fields with existing venue data
          setVenueName(venueData.name);
          setVenueCity(venueData.address);
          setOpeningTime(venueData.openingTime || "9:00 AM");
          setClosingTime(venueData.closingTime || "5:00 PM");
          setLunchBreak(`${venueData.lunchBreak.start} - ${venueData.lunchBreak.end}`);
          setHolidays(venueData.holidays || []);
          setCounters(
            venueData.counters.map((counter) => ({
              name: counter.name,
              type: counter.type,
              qrString: counter.qrString,
            }))
          );
          setVenueId(venueData.id); // Store the venue ID
        }
      } catch (error) {
        console.error("Failed to fetch venue details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenueDetails();
  }, []);

  const addCounter = () => {
    if (counterName) {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("No user is logged in.");
        return;
      }

      const userId = currentUser.uid;
      const counterId = counters.length + 1; // Generate a new counter ID

      // Generate QR code data as a string
      const qrData = JSON.stringify({
        venueId: venueId || "new-venue", // Use "new-venue" if venueId is not yet generated
        userId: userId,
        counterId: counterId,
      });

      // Add the new counter with the QR code data
      setCounters([
        ...counters,
        { name: counterName, type: counterType, qrString: qrData, deleted: false },
      ]);
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

  const saveSettings = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("No user is logged in.");
        return;
      }

      const userId = currentUser.uid;

      const venue: Venue = {
        id: venueId || "", // Pass the existing venueId if available, otherwise Firestore will generate it
        name: venueName,
        address: venueCity,
        status: true,
        openingTime: openingTime,
        closingTime: closingTime,
        holidays: holidays,
        lunchBreak: {
          start: lunchBreak.split(" - ")[0],
          end: lunchBreak.split(" - ")[1],
        },
        counters: counters
          .filter((counter) => !counter.deleted) // Exclude deleted counters
          .map(({ deleted, ...counter }, index) => ({
            id: index + 1,
            name: counter.name,
            type: counter.type || "General",
            isActive: true,
            qrString: counter.qrString || "",
            queue: {
              id: 100 + index + 1,
              length: 0,
              currentToken: 0,
            },
          })),
        createdBy: userId,
        createdAt: new Date().toISOString(),
      };

      // Use writeOrModifyVenueData to either update or create the venue
      await writeOrModifyVenueData(userId, venue);

      console.log("Venue settings saved successfully!");
      router.replace("/dashboard");
    } catch (error) {
      console.error("Failed to save venue settings:", error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-base-100">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const removeCounter = (index: number) => {
    // Mark the counter as deleted
    const updatedCounters = counters.map((counter, i) =>
      i === index ? { ...counter, deleted: true } : counter
    );
    setCounters(updatedCounters);
  };

  const generateTimeOptions = () => {
    const times = [];
    let hour = 0;
    let minute = 0;

    while (hour < 24) {
      const formattedTime = `${hour % 12 === 0 ? 12 : hour % 12}:${minute === 0 ? "00" : "30"} ${
        hour < 12 ? "AM" : "PM"
      }`;
      times.push(formattedTime);

      if (minute === 0) {
        minute = 30;
      } else {
        minute = 0;
        hour++;
      }
    }

    return times;
  };

  return (
    <View className="flex-1 bg-base-100 px-4 py-6">
      <Text className="text-2xl font-bold text-primary mb-4 text-center">
        {venueName ? "Modify your venue settings" : "Complete your venue setup to start managing queue"}
      </Text>

      {step === 1 && (
        <View>
          {/* Step 1: Venue Details */}
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
          {/* Step 2: Operating Hours */}
          <Text className="text-lg font-bold mb-2">Operating Hours</Text>

          {/* Opening Time */}
          <Text className="text-md font-bold mb-2">Opening Time</Text>
          <Picker
            selectedValue={openingTime}
            onValueChange={(itemValue) => setOpeningTime(itemValue)}
            className="border border-neutral rounded-lg mb-4"
          >
            {generateTimeOptions().map((time, index) => (
              <Picker.Item key={index} label={time} value={time} />
            ))}
          </Picker>

          {/* Closing Time */}
          <Text className="text-md font-bold mb-2">Closing Time</Text>
          <Picker
            selectedValue={closingTime}
            onValueChange={(itemValue) => setClosingTime(itemValue)}
            className="border border-neutral rounded-lg mb-4"
          >
            {generateTimeOptions().map((time, index) => (
              <Picker.Item key={index} label={time} value={time} />
            ))}
          </Picker>
        </View>
      )}

      {step === 3 && (
        <View>
          {/* Step 3: Counter Setup */}
          <Text className="text-lg font-bold mb-2">Counter Setup</Text>
          <TextInput
            className="border border-neutral rounded-lg px-4 py-2 mb-4"
            placeholder="Counter Name"
            value={counterName}
            onChangeText={setCounterName}
          />
          <TextInput
            className="border border-neutral rounded-lg px-4 py-2 mb-4"
            placeholder="Counter Type"
            value={counterType}
            onChangeText={setCounterType}
          />
          <TouchableOpacity
            className="bg-primary py-2 px-4 rounded-lg"
            onPress={addCounter}
          >
            <Text className="text-white font-bold">Add Counter</Text>
          </TouchableOpacity>

          {/* List of Counters */}
          <FlatList
            data={counters.filter((counter) => !counter.deleted)} // Exclude deleted counters
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View className="flex-row justify-between items-center px-4 py-2 border-b border-neutral">
                <View>
                  <Text className="text-lg font-bold">{item.name}</Text>
                  <Text className="text-neutral">{item.type}</Text>
                  {/* Render QR Code */}
                  {item.qrString && (
                    <QRCode
                      value={item.qrString} // Use the qrString field to generate the QR code
                      size={100} // Adjust the size as needed
                    />
                  )}
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: "red", // Ensure the button has a visible background color
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                  }}
                  onPress={() => removeCounter(index)} // Call removeCounter with the index
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {/* Navigation Buttons */}
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