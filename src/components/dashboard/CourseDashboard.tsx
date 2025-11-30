import { db } from '@/config/Firebase.config';
import { useAuth } from '@clerk/clerk-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. IMPORT useNavigate
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

import { Plus } from 'lucide-react';
import { deleteCourseById } from '@/lib/deleteCourseById';
// Assuming you've renamed the component to CoursePin (or CourseCard) 
// and adjusted its props for full course data.
// import CoursePin from '../card/CoursePin'; 
import CourseContentPin from '../card/CoursePin';

// Course Type (adjust fields as needed)
interface Course {
    id: string;
    title?: string;
    description?: string;
    createdAt?: any;
    [key: string]: any;
}

const CourseDashboard = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useAuth();
    const navigate = useNavigate(); 
    console.log(userId);// 2. INITIALIZE useNavigate

    // --- Data Fetching ---
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        
        const q = query(
            collection(db, "courses"),
            where("userId", "==", userId)
        );

        // Uses real-time listener (onSnapshot)
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const list: Course[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                })) as Course[];

                setCourses(list);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching:", error);
                toast.error("Error", {
                    description: "Something went wrong fetching your courses."
                });
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    // --- Handler Functions ---
    const handleEdit = (courseId: string) => {
    console.log("Navigating to edit page for course:", courseId);
    navigate(`/generate/content/edit/${courseId}`);
  };

    // 3. Define the handler for the 'Read/View' operation
    const handleRead = (id: string) => {
        // Navigate to the full course view page
        navigate(`/generate/content/view/${id}`);
    };

    // 4. Define the handler for the 'Delete' operation
    const handleDelete = (id: string) => {
        deleteCourseById(id)
            .then(() => {
                toast.success("Course deleted!");

                // Update local state (Optimistic UI update)
                setCourses((prev) => prev.filter((item) => item.id !== id));
            })
            .catch((error) => {
                console.error("Error deleting:", error);
                toast.error("Failed to delete course");
            });
    };


    return (
        <>
    {/* PAGE WRAPPER */}
    <div className="w-full min-h-screen bg-black text-white px-6 md:px-10 py-10 rounded-xl">

    {/* Header */}
    <div className="flex w-full items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Course Dashboard</h1>
        <p className="text-sm text-gray-400">
          Manage your generated AI courses
        </p>
      </div>

      <Link to="/generate/course/create">
        <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
          <Plus className="mr-1" />
          Add New
        </Button>
      </Link>
    </div>

    <Separator className="my-8 bg-white/10" />

    {/* Full Height Content */}
    <div className="w-full h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Loading skeleton */}
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-40 rounded-xl bg-white/10"
            />
          ))
        ) : courses.length > 0 ? (
          courses.map((course, index) => (
            <CourseContentPin
              key={course.id}
              course={course}
              index={index}
              onRead={handleRead}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-2 w-full flex flex-col items-center justify-center h-[60vh]">
            <img
              src="/assets/svg/not-found.svg"
              className="w-40 h-40 opacity-70"
              alt="No courses illustration"
            />

            <h2 className="text-lg font-semibold text-gray-300 mt-4">
              No Courses Found
            </h2>
            <p className="w-full md:w-96 text-center text-sm text-gray-400 mt-2">
              You haven't created any courses yet. Click below to create your first AI course!
            </p>

            <Link to="/generate/course/create" className="mt-4">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                <Plus className="mr-1" />
                Add New
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>

  </div>
  </>
    );
};

export default CourseDashboard;