import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/Firebase.config"; 
import { Loader2 } from "lucide-react";

const ContentViewer = () => {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const ref = doc(db, "courses", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setContent({ id: snap.id, ...snap.data() });
      }

      setLoading(false);
    };

    fetchContent();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin" size={30} />
      </div>
    );

  if (!content) return <h2>No Content Found</h2>;

  const type = content.contentType?.toLowerCase();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{content.title}</h1>

      {/* SUMMARY / LONG TEXT */}
      {(type.includes("summary") || type.includes("notes")) && (
        <div className="bg-gray-100 p-4 rounded-lg shadow whitespace-pre-line">
          {content.description || content.longText}
        </div>
      )}

      {/* PDF FILE */}
      {type.includes("pdf") && content.fileUrl && (
        <div className="w-full h-[600px] mt-4">
          <embed
            src={content.fileUrl}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        </div>
      )}

      {/* PPT / PRESENTATION */}
      {(type.includes("ppt") || type.includes("presentation")) &&
        content.fileUrl && (
          <div className="mt-4">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                content.fileUrl
              )}`}
              width="100%"
              height="500px"
            />
          </div>
        )}
    </div>
  );
};

export default ContentViewer;
