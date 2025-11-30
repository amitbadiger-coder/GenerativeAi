// ============= IMAGE GENERATION SERVICES =============
const generateImageWithHuggingFace = async (prompt: string): Promise<string> => {
  try {
    console.log("🖼️ Generating image with Hugging Face for prompt:", prompt);
    
    const API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5";
    const API_TOKEN = import.meta.env.VITE_HUGGING_FACE_TOKEN;

    if (!API_TOKEN) {
      console.warn("Hugging Face API token not found, using placeholder");
      return getTechnologySpecificPlaceholder(prompt);
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
          num_inference_steps: 25,
          guidance_scale: 8.5
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Hugging Face API error: ${response.status} - ${errorText}`);
      return getTechnologySpecificPlaceholder(prompt);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    console.log("✅ Image generated successfully");
    return imageUrl;

  } catch (error: any) {
    console.error("❌ Hugging Face image generation failed:", error);
    return getTechnologySpecificPlaceholder(prompt);
  }
};

// Technology-specific placeholder images
const getTechnologySpecificPlaceholder = (prompt: string): string => {
  const techKeywords = extractTechnologyKeywords(prompt);
  const { color, icon } = getTechTheme(techKeywords.primaryTech);
  
  return `https://placehold.co/600x400/${color}/FFFFFF?text=${encodeURIComponent(techKeywords.displayText)}&font=montserrat`;
};

// Extract technology keywords from course title and description
const extractTechnologyKeywords = (prompt: string) => {
  const techMap: { [key: string]: { color: string, icon: string } } = {
    'html': { color: 'E34F26', icon: '🌐' },
    'css': { color: '1572B6', icon: '🎨' },
    'javascript': { color: 'F7DF1E', icon: '⚡' },
    'react': { color: '61DAFB', icon: '⚛️' },
    'nextjs': { color: '000000', icon: '▲' },
    'node': { color: '339933', icon: '🟢' },
    'python': { color: '3776AB', icon: '🐍' },
    'java': { color: '007396', icon: '☕' },
    'typescript': { color: '3178C6', icon: '🔷' },
    'angular': { color: 'DD0031', icon: '🅰️' },
    'vue': { color: '4FC08D', icon: '🟢' },
    'mongodb': { color: '47A248', icon: '🍃' },
    'sql': { color: '4479A1', icon: '🗄️' },
    'aws': { color: 'FF9900', icon: '☁️' },
    'docker': { color: '2496ED', icon: '🐳' },
    'kubernetes': { color: '326CE5', icon: '⚓' },
    'php': { color: '777BB4', icon: '🐘' },
    'c++': { color: '00599C', icon: '➕' },
    'c#': { color: '239120', icon: '🔷' },
    'swift': { color: 'FA7343', icon: '🐦' },
    'kotlin': { color: '7F52FF', icon: '🟣' },
    'rust': { color: '000000', icon: '🦀' },
    'go': { color: '00ADD8', icon: '🔵' }
  };

  const promptLower = prompt.toLowerCase();
  let primaryTech = 'default';
  let displayText = prompt.split(' ').slice(0, 2).join(' ');

  // Find the most relevant technology
  for (const [tech, data] of Object.entries(techMap)) {
    if (promptLower.includes(tech)) {
      primaryTech = tech;
      displayText = `${data.icon} ${tech.toUpperCase()} COURSE`;
      break;
    }
  }

  return { primaryTech, displayText };
};

const getTechTheme = (tech: string) => {
  const techThemes: { [key: string]: { color: string, icon: string } } = {
    'html': { color: 'E34F26', icon: '🌐' },
    'css': { color: '1572B6', icon: '🎨' },
    'javascript': { color: 'F7DF1E', icon: '⚡' },
    'react': { color: '61DAFB', icon: '⚛️' },
    'nextjs': { color: '000000', icon: '▲' },
    'node': { color: '339933', icon: '🟢' },
    'python': { color: '3776AB', icon: '🐍' },
    'java': { color: '007396', icon: '☕' },
    'typescript': { color: '3178C6', icon: '🔷' },
    'default': { color: '3B82F6', icon: '📚' }
  };

  return techThemes[tech] || techThemes.default;
};

const generateCourseImages = async (content: any, courseTitle: string, outputType: string, courseDescription: string) => {
  const images: any = {};
  
  try {
    console.log("🎨 Starting image generation for course...");
    
    // Generate technology-specific cover image
    if (content.coverImageDescription) {
      console.log("📸 Generating technology-specific cover image...");
      
      // Create a more specific prompt based on course content
      const techSpecificPrompt = createTechSpecificPrompt(courseTitle, courseDescription, content.coverImageDescription);
      images.cover = await generateImageWithHuggingFace(techSpecificPrompt);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Generate module-specific images
    if (content.modules && outputType === "full-course") {
      images.modules = {};
      for (let i = 0; i < Math.min(content.modules.length, 2); i++) {
        const module = content.modules[i];
        if (module.imageDescription) {
          console.log(`📸 Generating image for module ${i + 1}...`);
          const modulePrompt = createModuleSpecificPrompt(courseTitle, module.moduleTitle, module.imageDescription);
          images.modules[module.moduleTitle] = await generateImageWithHuggingFace(modulePrompt);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    // Generate slide-specific images for PPT
    if (content.slides && outputType === "ppt") {
      images.slides = {};
      for (let i = 0; i < Math.min(content.slides.length, 2); i++) {
        const slide = content.slides[i];
        if (slide.imageDescription) {
          console.log(`📸 Generating image for slide ${i + 1}...`);
          const slidePrompt = createSlideSpecificPrompt(courseTitle, slide.title, slide.imageDescription);
          images.slides[i] = await generateImageWithHuggingFace(slidePrompt);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    console.log("✅ All images generated successfully");
    
  } catch (error) {
    console.warn("⚠️ Some images failed to generate:", error);
  }
  
  return images;
};

// Create technology-specific prompts
const createTechSpecificPrompt = (courseTitle: string, courseDescription: string, basePrompt: string): string => {
  const techKeywords = extractTechnologyKeywords(courseTitle + ' ' + courseDescription);
  
  // More specific prompts for different technologies
  const techSpecificPrompts: { [key: string]: string } = {
    'html': `modern web development, HTML5 code structure, semantic elements, web page structure, clean code, digital technology, ${basePrompt}`,
    'css': `CSS3 styling, modern web design, responsive layout, flexbox grid, beautiful UI, color gradients, web development, ${basePrompt}`,
    'javascript': `JavaScript code, interactive web applications, ES6+ features, programming logic, web development, modern syntax, ${basePrompt}`,
    'react': `React.js components, modern UI library, virtual DOM, JavaScript framework, component architecture, web development, ${basePrompt}`,
    'nextjs': `Next.js framework, server-side rendering, React framework, full-stack development, modern web applications, ${basePrompt}`,
    'node': `Node.js runtime, server-side JavaScript, backend development, API development, web servers, ${basePrompt}`,
    'python': `Python programming, clean code, data science, web development, automation, modern software development, ${basePrompt}`,
    'default': `modern technology course, digital learning, programming education, online course, ${basePrompt}`
  };

  return techSpecificPrompts[techKeywords.primaryTech] || techSpecificPrompts.default;
};

const createModuleSpecificPrompt = (courseTitle: string, moduleTitle: string, basePrompt: string): string => {
  return `${basePrompt}, ${courseTitle} - ${moduleTitle}, educational content, learning module`;
};

const createSlideSpecificPrompt = (courseTitle: string, slideTitle: string, basePrompt: string): string => {
  return `${basePrompt}, ${courseTitle} - ${slideTitle}, presentation slide, educational content`;
};