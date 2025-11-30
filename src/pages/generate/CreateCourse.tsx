import { useAuth } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import { Loader, FileText, Presentation, NotebookPen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FormField, FormItem, FormMessage, FormControl, FormLabel } from "../../components/ui/form";
import {FormProvider, useForm,} from 'react-hook-form'
import { toast } from "sonner";
import { z } from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/Firebase.config";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Heading from "@/components/Heading";
import { chatSession } from "@/scripts";

// ============= ZOD SCHEMA =============
const courseSchema = z.object({
  title: z.string().min(3, "Course title is required"),
  description: z.string().min(10, "Description must be at least 10 characters."),
  level: z.string().min(1),
  duration: z.string().min(1),
  modules: z.string()
    .transform((val, ctx) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Must be a valid number of modules",
            });
            return z.NEVER;
        }
        return parsed;
    })
    .pipe(z.number().min(1, "Minimum 1 module")),
  outputType: z.enum(["ppt", "summary", "pdf", "full-course"]),
});

type FormData = z.infer<typeof courseSchema>;

// ============= IMAGE GENERATION SERVICES =============
const generateImageWithHuggingFace = async (prompt: string): Promise<string> => {
  try {
    console.log("🖼️ Generating image with Hugging Face for prompt:", prompt);
    
    const API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5";
    const API_TOKEN = import.meta.env.VITE_HUGGING_FACE_TOKEN;

    if (!API_TOKEN) {
      console.warn("Hugging Face API token not found, using placeholder");
      return getPlaceholderImage(prompt);
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: 512,
          height: 512,
          num_inference_steps: 20,
          guidance_scale: 7.5
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Hugging Face API error: ${response.status} - ${errorText}`);
      return getPlaceholderImage(prompt);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    console.log("✅ Image generated successfully");
    return imageUrl;

  } catch (error: any) {
    console.error("❌ Hugging Face image generation failed:", error);
    return getPlaceholderImage(prompt);
  }
};

const getPlaceholderImage = (prompt: string): string => {
  const keywords = prompt
    .split(' ')
    .slice(0, 3)
    .map(word => word.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(word => word.length > 2)
    .join('+');
  
  const colorSchemes: { [key: string]: string } = {
    'programming': '3B82F6',
    'design': '8B5CF6',
    'business': '10B981',
    'science': 'EF4444',
    'art': 'F59E0B',
    'default': '6B7280'
  };
  
  let color = colorSchemes.default;
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('programming') || lowerPrompt.includes('code') || lowerPrompt.includes('software')) {
    color = colorSchemes.programming;
  } else if (lowerPrompt.includes('design') || lowerPrompt.includes('creative') || lowerPrompt.includes('art')) {
    color = colorSchemes.design;
  } else if (lowerPrompt.includes('business') || lowerPrompt.includes('marketing') || lowerPrompt.includes('management')) {
    color = colorSchemes.business;
  } else if (lowerPrompt.includes('science') || lowerPrompt.includes('math') || lowerPrompt.includes('physics')) {
    color = colorSchemes.science;
  }
  
  return `https://placehold.co/600x400/${color}/FFFFFF?text=${encodeURIComponent(keywords)}&font=montserrat`;
};

const generateCourseImages = async (content: any, courseTitle: string, outputType: string) => {
  const images: any = {};
  
  try {
    console.log("🎨 Starting image generation for course...");
    
    // Generate enhanced cover image prompt
    const enhancedCoverPrompt = enhanceImagePrompt(
      content.coverImageDescription, 
      courseTitle, 
      "cover"
    );
    
    console.log("📸 Generating cover image...");
    images.cover = await generateImageWithHuggingFace(enhancedCoverPrompt);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate specific images based on output type
    switch (outputType) {
      case "full-course":
        if (content.modules) {
          images.modules = {};
          for (let i = 0; i < Math.min(content.modules.length, 3); i++) {
            const module = content.modules[i];
            if (module.imageDescription) {
              const enhancedModulePrompt = enhanceImagePrompt(
                module.imageDescription,
                `${courseTitle} - ${module.moduleTitle}`,
                "module"
              );
              console.log(`📸 Generating image for module ${i + 1}: ${module.moduleTitle}...`);
              images.modules[module.moduleTitle] = await generateImageWithHuggingFace(enhancedModulePrompt);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }
        
        // Generate lesson-specific images for the first module
        if (content.modules && content.modules[0]?.lessons) {
          images.lessons = {};
          const firstModule = content.modules[0];
          for (let i = 0; i < Math.min(firstModule.lessons.length, 2); i++) {
            const lesson = firstModule.lessons[i];
            const lessonPrompt = createLessonImagePrompt(lesson, courseTitle, firstModule.moduleTitle);
            console.log(`📸 Generating image for lesson ${i + 1}: ${lesson.title}...`);
            images.lessons[lesson.title] = await generateImageWithHuggingFace(lessonPrompt);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
        break;

      case "ppt":
        if (content.slides) {
          images.slides = {};
          for (let i = 0; i < Math.min(content.slides.length, 3); i++) {
            const slide = content.slides[i];
            const enhancedSlidePrompt = enhanceImagePrompt(
              slide.imageDescription,
              `${courseTitle} - ${slide.title}`,
              "slide"
            );
            console.log(`📸 Generating image for slide ${i + 1}: ${slide.title}...`);
            images.slides[i] = {
              image: await generateImageWithHuggingFace(enhancedSlidePrompt),
              title: slide.title
            };
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
        break;

      case "pdf":
        if (content.sectionImages) {
          images.sections = {};
          for (let i = 0; i < Math.min(content.sectionImages.length, 3); i++) {
            const section = content.sectionImages[i];
            const enhancedSectionPrompt = enhanceImagePrompt(
              section.imageDescription,
              `${courseTitle} - ${section.section}`,
              "section"
            );
            console.log(`📸 Generating image for section: ${section.section}...`);
            images.sections[section.section] = await generateImageWithHuggingFace(enhancedSectionPrompt);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
        
        // Generate additional concept images for PDF content
        if (content.content) {
          images.concepts = {};
          const conceptPrompts = extractConceptsFromContent(content.content, courseTitle);
          for (let i = 0; i < Math.min(conceptPrompts.length, 2); i++) {
            console.log(`📸 Generating concept image ${i + 1}...`);
            images.concepts[`concept_${i + 1}`] = await generateImageWithHuggingFace(conceptPrompts[i]);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
        break;
    }
    
    console.log("✅ All images generated successfully");
    
  } catch (error) {
    console.warn("⚠️ Some images failed to generate:", error);
  }
  
  return images;
};

// Enhanced image prompt generator
const enhanceImagePrompt = (baseDescription: string, context: string, type: string): string => {
  const styleEnhancements = {
    cover: "professional education course cover, modern design, academic, clean layout, educational technology, vibrant colors, professional typography",
    module: "educational concept visualization, informative, clear composition, learning-focused, professional illustration",
    slide: "presentation slide visual, clean design, educational content, professional graphics, easy to understand",
    section: "detailed educational illustration, concept visualization, professional diagram style"
  };

  const style = styleEnhancements[type as keyof typeof styleEnhancements] || "professional educational visual";
  
  return `Create a specific, relevant image for: "${baseDescription}"
  
Context: ${context}
Type: ${type}

Requirements:
- MUST be directly relevant to the course content
- Professional educational style
- Clear and informative
- Modern design
- High quality, detailed
- No generic or stock photo look
- Specifically related to "${context}"

Style: ${style}
Format: Professional educational illustration/diagram/visual

Make it SPECIFIC to the course topic and content.`;
};

// Create detailed lesson image prompts
const createLessonImagePrompt = (lesson: any, courseTitle: string, moduleTitle: string): string => {
  const lessonContent = lesson.content || '';
  const keyPoints = lesson.keyPoints ? lesson.keyPoints.join(', ') : '';
  const examples = lesson.examples ? lesson.examples.join(', ') : '';
  
  return `Create an educational visual for lesson: "${lesson.title}"
  
Course: ${courseTitle}
Module: ${moduleTitle}
Lesson Content: ${lessonContent.substring(0, 200)}...
Key Points: ${keyPoints}
Examples: ${examples}

Create a specific, detailed educational illustration that visually explains the core concepts of this lesson. 
Professional style, clear visualization, educational diagram or illustration that directly relates to the lesson content.`;
};

// Extract specific concepts from content for additional images
const extractConceptsFromContent = (content: string, courseTitle: string): string[] => {
  const concepts = [];
  
  // Look for key concepts in the content
  const sentences = content.split('.').slice(0, 5);
  
  for (const sentence of sentences) {
    if (sentence.length > 20) {
      concepts.push(`Educational diagram illustrating: "${sentence.trim()}" for course "${courseTitle}". Professional educational style, clear visualization, concept-specific.`);
    }
  }
  
  // Add some default educational concepts if none found
  if (concepts.length === 0) {
    concepts.push(
      `Professional educational visual for "${courseTitle}" showing key learning concepts, detailed diagram style`,
      `Educational illustration for "${courseTitle}" demonstrating core principles, clean professional design`
    );
  }
  
  return concepts.slice(0, 2);
};

// Alternative: Use AI to generate better image prompts
const generateEnhancedImagePromptWithAI = async (basePrompt: string, context: string): Promise<string> => {
  const enhancementPrompt = `
    Improve this image description to make it more specific and relevant to the course context.
    
    Original description: "${basePrompt}"
    Course context: "${context}"
    
    Create a detailed, specific image prompt that:
    1. Is directly relevant to the course topic
    2. Includes specific visual elements related to the content
    3. Uses professional educational style
    4. Avoids generic or stock photo descriptions
    5. Includes concrete visual concepts
    
    Return only the enhanced image description, no additional text.
  `;

  try {
    // You would call your AI service here to enhance the prompt
    // For now, we'll use the manual enhancement
    return enhanceImagePrompt(basePrompt, context, "educational");
  } catch (error) {
    console.warn("Failed to enhance prompt with AI, using fallback");
    return enhanceImagePrompt(basePrompt, context, "educational");
  }
};

// ============= COMPONENT =============
const CreateCourse = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      level: "Beginner",
      duration: "",
      modules: 5,
      outputType: "full-course",
    }
  });

  const { userId } = useAuth();
  const navigate = useNavigate();
  const { isSubmitting, isValid } = form.formState;

  // ============= AI GENERATION =============
const generateCourseAI = async (data: any) => {
    // Safe data access with fallbacks
    const safeData = {
        title: data?.title || "Untitled Course",
        level: data?.level || "beginner", 
        description: data?.description || "No description provided",
        duration: data?.duration || "1 week",
        modules: data?.modules || 1,
        outputType: data?.outputType || "full-course"
    };

    console.log("🔍 Using safe data:", safeData);

    const imagePrompt = `Create a professional cover image for a ${safeData.level} level course about "${safeData.title}". 
    The course is about: ${safeData.description}.
    Style: modern, educational, clean design with professional appearance.`;

    const contentPrompt = `Create a detailed course ${safeData.outputType} for "${safeData.title}" at ${safeData.level} level.

Course Details:
- Title: ${safeData.title}
- Level: ${safeData.level}
- Description: ${safeData.description}
- Duration: ${safeData.duration}
- Modules: ${safeData.modules}

IMPORTANT: 
1. Return ONLY valid JSON, no additional text or markdown
2. Use double quotes for all keys and strings
3. No trailing commas
4. No comments in JSON

Return STRICT JSON in this exact format:

${getOutputTypeTemplate(safeData.outputType, imagePrompt)}

Return ONLY the JSON object, no additional text or explanations.`;

    try {
      console.log("🤖 Starting AI content generation...");
      const aiRes = await chatSession.sendMessage(contentPrompt);
      const responseText = aiRes.response.text().trim();
      
      console.log("📝 Raw AI Response:", responseText);
      
      // Enhanced JSON cleaning with better error handling
      const parsedContent = parseAndValidateJSON(responseText);
      console.log("✅ Successfully parsed JSON:", parsedContent);
        
      // Generate images based on the content
      console.log("🎨 Starting image generation...");
      const images = await generateCourseImages(parsedContent, safeData.title, safeData.outputType);
      
      const finalContent = {
        ...parsedContent,
        images: images
      };
      
      console.log("✅ Final content with images:", finalContent);
      return finalContent;
      
    } catch (error: any) {
      console.error("❌ AI Generation failed:", error);
      console.error("Error details:", error.message);
      throw new Error("Failed to generate course content: " + error.message);
    }
  };

// Helper function to get output type templates
const getOutputTypeTemplate = (outputType: string, imagePrompt: string) => {
  const templates = {
    "ppt": `{
  "type": "ppt",
  "slides": [
    {
      "title": "Slide 1 Title",
      "content": "Slide content...",
      "imageDescription": "Visual description for slide 1 image"
    }
  ],
  "coverImageDescription": "${imagePrompt.replace(/"/g, '\\"')}"
}`,

    "summary": `{
  "type": "summary",
  "summary": "Detailed 200-300 word summary text here in paragraph format...",
  "coverImageDescription": "${imagePrompt.replace(/"/g, '\\"')}"
}`,

    "pdf": `{
  "type": "pdf",
  "content": "Comprehensive PDF content with headings and sections...",
  "coverImageDescription": "${imagePrompt.replace(/"/g, '\\"')}",
  "sectionImages": [
    {
      "section": "Introduction",
      "imageDescription": "Visual for introduction section"
    },
    {
      "section": "Core Concepts",
      "imageDescription": "Visual for core concepts section"
    }
  ]
}`,

    "full-course": `{
  "type": "full-course",
  "modules": [
    {
      "moduleTitle": "Module 1 Title",
      "lessons": ["Lesson 1", "Lesson 2"],
      "imageDescription": "Visual representation of module 1 concepts"
    }
  ],
  "coverImageDescription": "${imagePrompt.replace(/"/g, '\\"')}"
}`
  };

  return templates[outputType as keyof typeof templates] || templates["full-course"];
};

// Robust JSON parsing with validation
const parseAndValidateJSON = (jsonString: string) => {
  console.log("🔧 Parsing JSON string:", jsonString);

  // Step 1: Clean the JSON string
  let cleanJSON = jsonString
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .replace(/^[^{[]*/, '') // Remove anything before first { or [
    .replace(/[^}\]]*$/, '') // Remove anything after last } or ]
    .trim();

  console.log("🧹 Cleaned JSON:", cleanJSON);

  // Step 2: Try direct parse first
  try {
    return JSON.parse(cleanJSON);
  } catch (initialError) {
    console.warn("⚠️ Initial parse failed, attempting fixes...", initialError);
    
    // Step 3: Apply common fixes
    const fixedJSON = applyJSONFixes(cleanJSON);
    console.log("🔧 Fixed JSON attempt:", fixedJSON.substring(0, 200) + "...");
    
    try {
      return JSON.parse(fixedJSON);
    } catch (secondError) {
      console.error("❌ Fixed JSON also failed:", secondError);
      
      // Step 4: Try to extract JSON object manually
      const extractedJSON = extractJSONObject(cleanJSON);
      if (extractedJSON) {
        try {
          return JSON.parse(extractedJSON);
        } catch (thirdError) {
          console.error("❌ Extracted JSON also failed");
        }
      }
      
      // Step 5: Final fallback - create basic structure
      console.error("🚨 All parsing attempts failed, using fallback");
      return createFallbackContent(cleanJSON);
    }
  }
};

// Apply common JSON fixes
const applyJSONFixes = (jsonString: string): string => {
  return jsonString
    // Fix unquoted keys
    .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*:)/g, '$1"$2"$3')
    // Fix single quotes to double quotes
    .replace(/'/g, '"')
    // Remove trailing commas
    .replace(/,\s*([}\]])/g, '$1')
    // Fix missing quotes around string values
    .replace(/:\s*([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*[,}])/g, ':"$1"')
    // Remove comments
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Fix newlines in strings
    .replace(/"(.*?)"/g, (match, group) => {
      return '"' + group.replace(/\n/g, '\\n') + '"';
    })
    // Ensure proper array formatting
    .replace(/"lessons":\s*\[(.*?)\]/gs, (match, lessonsContent) => {
      const fixedLessons = lessonsContent
        .split(',')
        .map(lesson => lesson.trim())
        .filter(lesson => lesson.length > 0)
        .map(lesson => lesson.startsWith('"') ? lesson : `"${lesson}"`)
        .join(',');
      return `"lessons":[${fixedLessons}]`;
    });
};

// Extract JSON object from malformed response
const extractJSONObject = (text: string): string | null => {
  // Try to find the first { and last }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.substring(firstBrace, lastBrace + 1);
  }
  
  // Try to find the first [ and last ] for arrays
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');
  
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    return text.substring(firstBracket, lastBracket + 1);
  }
  
  return null;
};

// Create fallback content when JSON parsing completely fails
const createFallbackContent = (originalText: string) => {
  console.warn("🔄 Using fallback content due to JSON parsing failure");
  
  return {
    type: "full-course",
    modules: [
      {
        moduleTitle: "Introduction",
        lessons: ["Basic concepts and overview"],
        imageDescription: "Educational visual for introduction"
      }
    ],
    coverImageDescription: "Professional course cover image",
    error: "Original content parsing failed",
    originalContent: originalText.substring(0, 500) // Store first 500 chars for debugging
  };
};

  // ============= SUBMIT =============
const onSubmit = async (formData: any) => {
    try {
      if (!userId) {
        toast.error("Authentication Error", { description: "User ID is missing." });
        return;
      }

      console.log("🚀 Starting course creation...");
      console.log("📋 Form Data:", formData);
      
      // Show loading state
      toast.loading("Generating AI course content...", { id: "course-creation" });

      // 1️⃣ Generate AI output with images
      const generatedContent = await generateCourseAI(formData);
      console.log("📦 Generated content ready for storage:", generatedContent);

      // 2️⃣ Store in Firestore
      const courseData = {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        duration: formData.duration,
        modules: parseInt(formData.modules) || 1,
        outputType: formData.outputType,
        userId,
        createdAt: serverTimestamp(),
        generated: generatedContent
      };

      await addDoc(collection(db, "courses"), courseData);

      toast.success("Course Created", {
        description: "Your AI Course with images has been generated successfully!"
      });

      navigate("/generate/course");

    } catch (error: any) {
      console.error("❌ Submit error:", error);
      toast.error("Error generating course", { 
        description: error.message || "An unknown error occurred." 
      });
    } finally {
      toast.dismiss("course-creation");
    }
  };
  return (
    <div className=" w-full h-full bg-black p-4 sm:p-8 rounded-xl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Create <span className="text-yellow-400">AI Course</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Generate complete courses with AI-powered content and images
          </p>
        </div>

        <Separator className="my-6 bg-gray-800" />

        {/* Form Container */}
        <div className="bg-white rounded-t-3xl rounded-b-xl shadow-2xl border border-gray-200 overflow-hidden">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full p-6 sm:p-8 flex flex-col gap-6"
            >
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black font-semibold text-base">Course Title</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., Mastering React.js" 
                        className="border-2 border-gray-300 rounded-xl h-12 px-4 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />
              
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black font-semibold text-base">Course Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={4} 
                        {...field} 
                        placeholder="Describe what your course is about"
                        className="border-2 border-gray-300 rounded-xl p-4 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Level */}
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black font-semibold text-base">Course Level</FormLabel>
                      <FormControl>
                        <select 
                          {...field} 
                          className="border-2 border-gray-300 rounded-xl h-12 px-4 w-full bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </FormControl>
                      <FormMessage className="text-red-500 font-medium" />
                    </FormItem>
                  )}
                />

                {/* Duration */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black font-semibold text-base">Duration</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g., 4 Weeks, 10 Hours" 
                          className="border-2 border-gray-300 rounded-xl h-12 px-4 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 font-medium" />
                    </FormItem>
                  )}
                />

                {/* Modules */}
                <FormField
                  control={form.control}
                  name="modules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black font-semibold text-base">Number of Modules</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          min="1" 
                          placeholder="Minimum 1" 
                          className="border-2 border-gray-300 rounded-xl h-12 px-4 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 font-medium" />
                    </FormItem>
                  )}
                />

                {/* Output Type */}
                <FormField
                  control={form.control}
                  name="outputType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black font-semibold text-base">Generate As</FormLabel>
                      <FormControl>
                        <select 
                          {...field} 
                          className="border-2 border-gray-300 rounded-xl h-12 px-4 w-full bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all"
                        >
                          <option value="full-course">Full Course</option>
                          <option value="ppt">PPT Slides</option>
                          <option value="summary">Summary</option>
                          <option value="pdf">PDF Format</option>
                        </select>
                      </FormControl>
                      <FormMessage className="text-red-500 font-medium" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Info Message about Images */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-yellow-600 mt-0.5">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-800 text-base">AI-Powered Course Generation</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      Your course will include AI-generated images and content. 
                      This may take a few moments as we create visual assets for your course.
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                <Button 
                  type="reset" 
                  variant="outline" 
                  disabled={isSubmitting}
                  className="border-2 border-gray-300 text-black rounded-xl px-6 h-12 hover:bg-gray-50 font-semibold transition-all"
                >
                  Reset
                </Button>
                <Button 
                  type="submit" 
                  disabled={!isValid || isSubmitting}
                  className="bg-black text-white border-2 border-yellow-400 rounded-xl px-8 h-12 hover:bg-gray-900 hover:border-yellow-300 font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-2" /> 
                      Generating Course & Images...
                    </>
                  ) : (
                    <>
                      <NotebookPen className="h-5 w-5 mr-2" />
                      Generate Course
                    </>
                  )}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;