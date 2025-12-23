// src/pages/ViewCourseDetails.jsx
import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { getContentsByCourseId, getCourseById } from "@/api/userApi";   // Assuming this API exists
import CourseContentPin from "@/components/card/CoursePin"; // Pin for PDF/Summary

// Interface for content items (match your Firestore structure)
 export interface CourseContent {
  coverImage: any;
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: number;
  outputType: "ppt" | "summary" | "pdf" | "full-course";
  generated: any;
}

const ViewCourseDetails = () => {
   const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    const [course, setCourse] = useState<any>(null);
    const [contents, setContents] = useState<CourseContent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
         if (!courseId) return;
        async function loadCourseData() {
            setLoading(true);
            try {
                // 1. Fetch main course data
                const courseData = await getCourseById(courseId);
                setCourse(courseData);

                // 2. Fetch associated content (PDFs, Summaries, etc.)
                const contentList = await getContentsByCourseId(courseId);
                setContents(contentList);
            } catch (error) {
                console.error("Error loading course details:", error);
            } finally {
                setLoading(false);
            }
        }
        if (courseId) {
            loadCourseData();
        }
    }, [courseId]);
    
    // --- Handler to View Individual Content ---
    const handleViewContent = (contentId: string) => {
        // This navigates to the ViewContent.jsx component using its route
        navigate(`/generate/content/view/${contentId}`); 
    };
    
    // --- Handler for Content Deletion (Optional) ---
    const handleDeleteContent = (contentId: string) => {
        // Implement logic to delete the content from Firestore and update state
        console.log(`Deleting content: ${contentId}`);
    };

    if (loading) return <p className="mt-10 text-center">Loading Course Details...</p>;
    if (!course) return <p className="mt-10 text-center text-red-600">Course not found.</p>;

    return (
        <div className="max-w-6xl mx-auto p-8">
            <button
                className="mb-6 px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
                onClick={() => navigate(-1)}
            >
                ⬅ Back to Courses
            </button>

            {/* Course Details */}
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-6">{course.description}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 border-b pb-2">Generated Materials</h2>

            {/* Content List */}
            <div className="grid md:grid-cols-3 gap-6">
                {contents.length > 0 ? (
                    contents.map(item => (
                        <CourseContentPin // This is the pin component for PDF/Summary
                            key={item.id}
                            content={item}
                            // 🔑 Call the handler that navigates to the ViewContent page
                            onRead={() => handleViewContent(item.id)}
                            onDelete={handleDeleteContent} 
                            onEdit={(id) => handleViewContent(id)}
                        />
                    ))
                ) : (
                    <div className="md:col-span-3 text-center p-10 bg-gray-50 rounded-lg">
                        No materials (PDF, Summary, PPT) generated yet for this course.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewCourseDetails;