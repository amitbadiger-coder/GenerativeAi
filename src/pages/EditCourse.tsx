// EditCourse.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, updateCourse } from "@/api/userApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Heading from "@/components/Heading";
import { Save, ArrowLeft } from "lucide-react";

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

  if (loading) return <p className="mt-20 text-center text-white">Loading...</p>;
  if (!course) return <p className="mt-20 text-center text-white">Course not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black p-4 sm:p-10 rounded-xl">
      <div className="max-w-3xl mx-auto">
        <Heading title="Edit Course" />

        {/* Glass Card */}
        <div className="mt-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-yellow-400 mb-6">
            Edit Course Details
          </h1>

          <div className="space-y-5 text-white">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Course Title
              </label>
              <Input
                value={course.title}
                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                placeholder="Enter course title"
                className="rounded-2xl bg-black/40 text-white border-white/20 focus:ring-yellow-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Description
              </label>
              <Textarea
                rows={4}
                value={course.description}
                onChange={(e) =>
                  setCourse({ ...course, description: e.target.value })
                }
                placeholder="Enter course description"
                className="rounded-2xl bg-black/40 text-white border-white/20 focus:ring-yellow-400"
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Level
              </label>
              <select
                value={course.level}
                onChange={(e) =>
                  setCourse({ ...course, level: e.target.value })
                }
                className="w-full p-3 rounded-2xl bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Duration
              </label>
              <Input
                value={course.duration}
                onChange={(e) =>
                  setCourse({ ...course, duration: e.target.value })
                }
                placeholder="e.g., 4 Weeks, 10 Hours"
                className="rounded-2xl bg-black/40 text-white border-white/20 focus:ring-yellow-400"
              />
            </div>

            {/* Modules */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Number of Modules
              </label>
              <Input
                type="number"
                min="1"
                value={course.modules}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    modules: parseInt(e.target.value) || 1,
                  })
                }
                className="rounded-2xl bg-black/40 text-white border-white/20 focus:ring-yellow-400"
                placeholder="Number of modules"
              />
            </div>

            {/* Output Type */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Output Type
              </label>
              <Input
                value={course.outputType}
                disabled
                className="rounded-2xl bg-white/10 text-white border-white/20"
              />
              <p className="text-xs text-white/50 mt-1">
                Output type cannot be changed after creation
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-8 justify-end items-end">
            
            <Button
              variant="outline"
              onClick={() => navigate("/generate/course")}
              disabled={saving}
              className="rounded-2xl border-white/30 text-gray-800 hover:bg-white/10"
            >
              <ArrowLeft className="mr-2" size={16} />
              Cancel
            </Button>
             <Button
              onClick={handleSave}
              disabled={saving}
              className="rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-black font-semibold gap-2"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </Button>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
