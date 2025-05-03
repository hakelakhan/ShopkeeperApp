import { Venue } from "../models/modelDefinations"; // Adjust the import path as necessary
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Adjust the import path as necessary

// Fetch venue data based on userId
export const getVenueDataByUser = async (userId: string): Promise<Venue| null> => {
  try {
    const venuesCollection = collection(db, "venues"); // Reference to the "venues" collection
    const q = query(venuesCollection, where("createdBy", "==", userId)); // Query venues created by the user
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]; // Get the first document
      return { id: doc.id, ...doc.data() } as Venue; // Return the first venue
    }

    return null; // Return null if no venues are found
  } catch (error) {
    console.error("Failed to fetch venue data:", error);
    throw error; // Re-throw the error for further handling
  }
};

// Service to write venue data to Firestore
export const writeVenueData = async (venue: Venue): Promise<void> => {
  try {
    const venuesCollection = collection(db, "venues"); // Reference to the "venues" collection
    await addDoc(venuesCollection, venue); // Add the venue data to Firestore
    console.log("Venue data written successfully:", venue);
  } catch (error) {
    console.error("Failed to write venue data:", error);
    throw error; // Re-throw the error for further handling
  }
};
// Service to update venue data in Firestore
export const updateVenueDataByUser = async (venueId: string, updatedVenue: Partial<Venue>): Promise<void> => {
  try {
    const venueDocRef = doc(db, "venues", venueId); // Reference to the specific venue document
    await updateDoc(venueDocRef, updatedVenue); // Update the venue document with new data
    console.log("Venue data updated successfully:", updatedVenue);
  } catch (error) {
    console.error("Failed to update venue data:", error);
    throw error; // Re-throw the error for further handling
  }
};

// Function to write or modify venue data
export const writeOrModifyVenueData = async (userId: string, venue: Venue): Promise<void> => {
  try {
    // Check if a venue exists for the user
    const existingVenue = await getVenueDataByUser(userId);

    if (existingVenue) {
      // If a venue exists, update it
      await updateVenueDataByUser(existingVenue.id, venue);
    } else {
      // If no venue exists, create a new one
      await writeVenueData(venue);
    }
  } catch (error) {
    console.error("Failed to write or modify venue data:", error);
    throw error; // Re-throw the error for further handling
  }
};