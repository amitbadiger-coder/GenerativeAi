// EditCourse.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, updateCourse } from "@/api/courseApi"; // Make sure you have these functions
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Heading from "@/components/Heading";

interface CourseData {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: number;
  outputType: string;
}

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCourseById(id);
        setCourse(data);
      } catch (error) {
        console.error("Error loading course:", error);
        toast.error("Error", { description: "Failed to load course" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSave = async () => {
    if (!course) return;
    
    try {
      setSaving(true);
      await updateCourse(id, {
        title: course.title,
        description: course.description,
        level: course.level,
        duration: course.duration,
        modules: course.modules,
      });

      toast.success("Success", { description: "Course updated successfully!" });
      navigate("/generate/course");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Error", { description: "Failed to update course" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="mt-10 text-center">Loading...</p>;
  if (!course) return <p className="mt-10 text-center">Course not found</p>;

  return (
    <div className="p-4 sm:p-8">
      <Heading title="Edit Course" />
      
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border mt-6">
        <h1 className="text-2xl font-bold mb-6">Edit Course Details</h1>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Course Title</label>
            <Input
              value={course.title}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
              placeholder="Enter course title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              rows={4}
              value={course.description}
              onChange={(e) => setCourse({ ...course, description: e.target.value })}
              placeholder="Enter course description"
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium mb-2">Level</label>
            <select 
              value={course.level}
              onChange={(e) => setCourse({ ...course, level: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <Input
              value={course.duration}
              onChange={(e) => setCourse({ ...course, duration: e.target.value })}
              placeholder="e.g., 4 Weeks, 10 Hours"
            />
          </div>

          {/* Modules */}
          <div>
            <label className="block text-sm font-medium mb-2">Number of Modules</label>
            <Input
              type="number"
              min="1"
              value={course.modules}
              onChange={(e) => setCourse({ ...course, modules: parseInt(e.target.value) || 1 })}
              placeholder="Number of modules"
            />
          </div>

          {/* Output Type (Read-only) */}
          <div>
            <label className="block text-sm font-medium mb-2">Output Type</label>
            <Input
              value={course.outputType}
              disabled
              className="bg-gray-100"
            />
            <p className="text-sm text-gray-500 mt-1">Output type cannot be changed after creation</p>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => navigate("/generate/course")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;