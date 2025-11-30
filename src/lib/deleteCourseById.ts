import { db } from "@/config/Firebase.config";
import { doc, deleteDoc } from "firebase/firestore";

export const deleteCourseById = async (id: string) => {
  try {
    const courseRef = doc(db, "courses", id);
    await deleteDoc(courseRef);
    return true;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};
