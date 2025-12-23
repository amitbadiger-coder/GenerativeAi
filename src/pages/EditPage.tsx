import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getCourseById, updateContent } from "@/api/userApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { useToast } from "@/components/ui/use-toast";
import { Sun, Moon, Save, Image as ImageIcon, ArrowLeft } from "lucide-react";
import type { CourseContent } from "./ViewCourseDetails";

export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

   const [content, setContent] = useState<CourseContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dark, setDark] = useState(true);

  // useEffect(() => {
  //   let mounted = true;
  //   async function load() {
  //     try {
  //       const data = await getCourseById(id);
  //       if (!mounted) return;
  //       setContent(data);
  //     } catch (err) {
  //       console.error(err);
  //       setContent({ title: "", description: "", imge: "" });
  //     } finally {
  //       if (mounted) setLoading(false);
  //     }
  //   }
  //   load();
  //   return () => (mounted = false);
  // }, [id]);
  useEffect(() => {
  let mounted = true;

  const load = async () => {
    try {
      const data = await getCourseById(id);
      if (mounted) setContent(data);
    } catch (err) {
      console.error(err);
      if (mounted) setContent(null);
    } finally {
      if (mounted) setLoading(false);
    }
  };

  load();

  return () => {
    mounted = false;
  };
}, [id]);


  if (loading)
    return <div className="min-h-[40vh] flex items-center justify-center">Loading...</div>;

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      await updateContent(id, content);
      toast({ title: "Updated Successfully ✅", description: "Your content was saved." });
      navigate(`/content/view/${id}`);
    } catch (err) {
      console.error(err);
      toast({ title: "Error ❌", description: "Update failed. Try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleImage = (file: File| null) => {
    if (!file) return;
    const url= URL.createObjectURL(file);
    setPreview(url);
    setContent({ ...(content as CourseContent), coverImage: file });
  };

  return (
    <div className={`${dark ? "bg-black text-white" : "bg-white text-black"} min-h-screen transition-all duration-500 py-10 px-4 rounded-xl`}>
      <div className="max-w-3xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
         <Button
  onClick={() => navigate(-1)}
  className="gap-2 rounded-2xl border border-gray-300 hover:bg-gray-100"
>
  <ArrowLeft size={16} /> Back
</Button>


          <div className="flex items-center gap-3">
  <button
    type="button"
    onClick={() => setDark(!dark)}
    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    aria-label="Toggle theme"
  >
    {dark ? <Moon size={18} /> : <Sun size={18} />}
  </button>
</div>

        </div>

        {/* Glass Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl mb-6">
            <CardContent className="p-6">
              <h1 className="text-2xl font-semibold">Edit Content</h1>
              <p className="text-sm text-white/70 mt-1">Black • White • Yellow Glass UI</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-white rounded-3xl shadow-2xl">
            <CardContent className="p-6 space-y-5">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">Title</label>
                <div className="relative">
                  <Input
                    className="pl-10 rounded-2xl"
                    value={content?.title ?? ""}
                    onChange={(e) =>
  setContent((prev) =>
    prev ? { ...prev, title: e.target.value } : prev
  )
}

                    placeholder="Enter course title"
                  />
                  <Save className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700">Description</label>
                <Textarea
                  className="rounded-2xl"
                  rows={4}
                  value={content?.description ?? ""}
                  onChange={(e) =>
  setContent((prev) =>
    prev ? { ...prev, description: e.target.value } : prev
  )
}

                  placeholder="Short summary of content"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Upload Image</label>
                <div className="flex gap-4 items-center">
                  <Input type="file" onChange={(e) => {
    const file = e.target.files?.[0] ?? null;
    handleImage(file);
  }} />
                  <ImageIcon />
                </div>
                {preview && (
                  <img src={preview} alt="preview" className="w-full mt-3 rounded-2xl shadow-md" />
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-black gap-2"
                >
                  <Save size={16} /> {saving ? "Saving…" : "Save Changes"}
                </Button>

                <Button
  onClick={() => navigate(-1)}
  className="rounded-2xl border border-gray-300 hover:bg-gray-100 px-4 py-2"
>
  Cancel
</Button>

              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
function useToast(): { toast: any; } {
  throw new Error("Function not implemented.");
}

