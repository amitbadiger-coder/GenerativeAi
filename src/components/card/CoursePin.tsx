// ---- Modern AI Course Card (White + Yellow + Black theme) ---- //

import React from "react";
import { Eye, Pencil, Trash, BookOpen, Image as ImgIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CourseContent } from "@/pages/ViewCourseDetails";


// type Course = CourseContent;

interface CoursePinProps {
    content:Partial<CourseContent>;
    index?: number; 
    onRead: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
}



const CourseContentPin: React.FC<CoursePinProps> = ({
    content,
    index = 0,
    onRead,
    onDelete,
    onEdit
}) => {

    // Theme based styling
    const cardThemes = [
        "bg-white text-black",
        "bg-yellow-400 text-black",
        "bg-black text-white"
    ];

    const theme = cardThemes[index % 3];

    const contentType = content?.outputType?.toUpperCase() || "content";

    // Thumbnail logic
    const thumbnail =
        content?.coverImage || content?.generated?.images?.cover||
        "https://via.placeholder.com/400x220?text=AI+Course+Image";

    return (
        <div
            className={`
                rounded-2xl p-5 border shadow-md
                transition-all duration-300 cursor-pointer
                transform
                hover:-translate-y-2 hover:shadow-2xl
                hover:scale-[1.02]
                ${theme}
            `}
        >
            {/* IMAGE TOP */}
            <div className="w-full h-40 rounded-xl overflow-hidden mb-4 relative group">
                <img
                    src={thumbnail}
                    alt={content?.title || "Course image"}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                />

                {/* If image missing, show icon overlay */}
                {!content?.coverImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <ImgIcon className="w-10 h-10 text-white" />
                    </div>
                )}
            </div>

            {/* CONTENT TYPE BADGE */}
            <Badge className="mb-3 text-xs font-medium bg-opacity-20 bg-black text-white px-3 py-1 rounded-full">
                {contentType}
            </Badge>

            {/* TITLE */}
            <h2 className="text-xl font-bold leading-tight">
                {content?.title || "Untitled Course"}
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-2 text-sm opacity-80 line-clamp-2">
                {content?.description || "AI generated course overview."}
            </p>

            {/* METADATA BADGES */}
            <div className="flex gap-2 mt-3 flex-wrap">
                <Badge className="bg-gray-200 text-black">
                    {content?.modules || 0} Modules
                </Badge>
                <Badge className="bg-gray-200 text-black">
                    {content?.level || "All Levels"}
                </Badge>
                <Badge className="bg-gray-200 text-black">
                    {content?.duration || "Self-paced"}
                </Badge>
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-300/30">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">Learn more</span>
                </div>

                <div className="flex gap-1">
                    {/* View */}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-gray-300 rounded-full"
                        onClick={(e) => {
    e.stopPropagation();
    if (content.id) {
        onRead(content.id);
    }
}}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>

                    {/* Edit */}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-yellow-300 rounded-full"
                        onClick={(e) => {
    e.stopPropagation();
    if (content.id) {
        onEdit(content.id);
    }
}}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>

                    {/* Delete */}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-red-300 rounded-full"
                        onClick={(e) => {
    e.stopPropagation();
    // Only proceed if content.id exists AND user confirms
    if (content.id && confirm("Delete this course permanently?")) {
        onDelete(content.id);
    }
}}
                    >
                        <Trash className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CourseContentPin;
