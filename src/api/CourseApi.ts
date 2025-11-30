import { db } from "@/config/Firebase.config";
import { doc, getDoc, deleteDoc, updateDoc, collection, where, getDocs, query } from "firebase/firestore";

// Fetch single content
export async function getContentById(id) {
  const ref = doc(db, "courseContent", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// Delete content
export async function deleteContent(id) {
  const ref = doc(db, "courseContent", id);
  await deleteDoc(ref);
}

// Update content
export async function updateContent(id, data) {
  const ref = doc(db, "courseContent", id);
  await updateDoc(ref, data);
}

export async function getCourseById(id) {
  const ref = doc(db, "courses", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getContentsByCourseId(id) {
  const q = query(
    collection(db, "courseContent"),
    where("courseId", "==", id)
  );

  const querySnap = await getDocs(q);

  return querySnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export const updateCourse = async (courseId: string, updates: any) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    await updateDoc(courseRef, {
      ...updates,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Delete course function
export const deleteCourse = async (courseId: string) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    await deleteDoc(courseRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};