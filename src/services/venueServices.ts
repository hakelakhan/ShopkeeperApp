import { Venue } from "../models/modelDefinations"; // Adjust the import path as necessary
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
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