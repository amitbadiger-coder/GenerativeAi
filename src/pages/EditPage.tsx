import { getCourseById, updateContent } from "@/api/courseApi";
import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getCourseById(id);
      setContent(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  const handleSave = async () => {
    await updateContent(id, {
      title: content.title,
      description: content.description,
    });

    alert("Updated successfully!");
    navigate(`/content/view/${id}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Edit Content</h1>

      <label className="block text-sm font-medium">Title</label>
      <input
        className="w-full p-2 border rounded mb-4"
        value={content.title}
        onChange={(e) =>
          setContent({ ...content, title: e.target.value })
        }
      />

      <label className="block text-sm font-medium">Description</label>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={3}
        value={content.description}
        onChange={(e) =>
          setContent({ ...content, description: e.target.value })
        }
      />

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditPage;
