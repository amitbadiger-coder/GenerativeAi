import { db } from "@/config/Firebase.config";
import type { CourseContent } from "@/pages/ViewCourseDetails";
import { doc, getDoc, deleteDoc, updateDoc, collection, where, getDocs, query } from "firebase/firestore";

// Fetch single content
export async function getContentById(
  id: string | undefined
): Promise<CourseContent | null> {
  if (!id) return null; // ✅ guard

  const ref = doc(db, "courseContent", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<CourseContent, "id">),
  };
}
// Delete content
export async function deleteContent(id: string | undefined): Promise<void> {
  if (!id) return; // ✅ guard

  const ref = doc(db, "courseContent", id);
  await deleteDoc(ref);
}

// Update content
export async function updateContent(
  id: string | undefined,
  data: Partial<CourseContent>
): Promise<void> {
  if (!id) return; // ✅ guard

  const ref = doc(db, "courseContent", id);
  await updateDoc(ref, data);
}

export async function getCourseById(
  id: string | undefined
): Promise<CourseContent | null> {
  if (!id) return null;
  const ref = doc(db, "courses", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<CourseContent, "id">),
  };
}

export async function getContentsByCourseId(
  courseId: string | undefined
): Promise<CourseContent []> {
  const q = query(
    collection(db, "courseContent"),
    where("courseId", "==", courseId)
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<CourseContent, "id">),
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