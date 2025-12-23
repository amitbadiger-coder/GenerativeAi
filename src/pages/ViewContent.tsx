import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "@/api/courseApi";

interface CourseContent {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: number;
  outputType: "ppt" | "summary" | "pdf" | "full-course";
  generated: any;
}

const ViewContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState<CourseContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setSpeaking] = useState(false);
const [, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

const speakText = (text: string) => {
  if (!text) return;

  window.speechSynthesis.cancel(); // stop previous

  const speech = new SpeechSynthesisUtterance(text);
  speech.rate = 1;    // speed
  speech.pitch = 1;   // voice tone
  speech.volume = 1; // volume

  speech.onend = () => setSpeaking(false);

  setUtterance(speech);
  setSpeaking(true);
  window.speechSynthesis.speak(speech);
};

const pauseSpeech = () => {
  window.speechSynthesis.pause();
};

// const resumeSpeech = () => {
//   window.speechSynthesis.resume();
// };

const stopSpeech = () => {
  window.speechSynthesis.cancel();
  setSpeaking(false);
};

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getCourseById(id);
        console.log("🔥 FULL COURSE DATA:", data);
        setContent(data);
      } catch (error) {
        console.error("Error loading course:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);
  const AudioControls = ({ text }: { text: string }) => (
  <div className="flex gap-3 mt-4">
    <button
      onClick={() => speakText(text)}
      className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold"
    >
      ▶ Play Audio
    </button>

    <button
      onClick={pauseSpeech}
      className="px-4 py-2 bg-black text-yellow-400 rounded-lg border border-yellow-400"
    >
      ⏸ Pause
    </button>

    <button
      onClick={stopSpeech}
      className="px-4 py-2 bg-red-500 text-white rounded-lg"
    >
      ⏹ Stop
    </button>
  </div>
);


  // Download PDF function
  const downloadPDF = async () => {
    try {
      // Dynamic import of jsPDF to avoid initial bundle size
      const { jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF();
      const pdfContent = getPDFContent();
      const title = content?.title || 'Course Content';
      
      // Set PDF properties with black & yellow theme
      pdf.setProperties({
        title: title,
        subject: 'Course Material',
        author: 'AI Course Generator',
        keywords: 'course, education, learning',
        creator: 'AI Course Platform'
      });

      // Add header with course title
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 0); // Black
      pdf.text(title, 20, 30);
      
      // Add course details
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100); // Dark gray
      pdf.text(`Level: ${content?.level}`, 20, 45);
      pdf.text(`Duration: ${content?.duration}`, 20, 55);
      pdf.text(`Modules: ${content?.modules}`, 20, 65);
      
      // Add description
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0); // Black
      const descriptionLines = pdf.splitTextToSize(content?.description || '', 170);
      pdf.text(descriptionLines, 20, 80);
      
      // Add content with black & yellow theme
      let yPosition = 110;
      const sections = pdfContent.split('\n\n');
      
      pdf.setFontSize(16);
      pdf.setTextColor(255, 193, 7); // Yellow for main headings
      pdf.text('Course Content', 20, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0); // Black for content
                                        // index: number
      sections.forEach((section: string, ) => {
        // Check if we need a new page
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        
        // Check if section is a heading (starts with number or capital letters)
        if (section.match(/^\d+\./) || section.match(/^[A-Z][A-Za-z ]+:/)) {
          pdf.setFontSize(14);
          pdf.setTextColor(255, 193, 7); // Yellow for headings
          const headingLines = pdf.splitTextToSize(section, 170);
          pdf.text(headingLines, 20, yPosition);
          yPosition += headingLines.length * 7 + 5;
        } else {
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0); // Black for content
          const contentLines = pdf.splitTextToSize(section, 170);
          pdf.text(contentLines, 20, yPosition);
          yPosition += contentLines.length * 6 + 8;
        }
        
        // Add some space between sections
        yPosition += 5;
      });
      
      // Add page numbers
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${i} of ${pageCount}`, 180, 290);
      }
      
      // Download the PDF
      pdf.save(`${title.replace(/[^a-zA-Z0-9]/g, '_')}_course.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Get PDF content with proper type handling
  const getPDFContent = (): string => {
    if (!content) return "No PDF content available";
    
    console.log("🔍 PDF content structure:", content.generated);
    
    // Handle different possible structures
    let pdfText = "";
    
    if (content.generated?.content) {
      pdfText = content.generated.content;
    } else if (content.generated?.pdf) {
      pdfText = content.generated.pdf;
    } else if (typeof content.generated === 'string') {
      pdfText = content.generated;
    } else {
      pdfText = content.description || "No PDF content available";
    }
    
    // Ensure we return a string
    if (typeof pdfText !== 'string') {
      console.warn("PDF content is not a string, converting:", pdfText);
      pdfText = String(pdfText);
    }
    
    return pdfText;
  };
  const downloadFullCoursePDF = async () => {
  try {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    const title = content?.title || 'Complete Course';
    
    // Set PDF properties
    pdf.setProperties({
      title: title,
      subject: 'Complete Course Material',
      author: 'AI Course Generator',
      keywords: 'course, education, learning, study guide',
      creator: 'AI Course Platform'
    });

    let yPosition = 20;
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Add title
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text(title, margin, yPosition);
    yPosition += 15;

    // Add course details
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Level: ${content?.level}`, margin, yPosition);
    pdf.text(`Duration: ${content?.duration}`, margin + 60, yPosition);
    pdf.text(`Modules: ${content?.modules}`, margin + 120, yPosition);
    yPosition += 15;

    // Add description
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    const descriptionLines = pdf.splitTextToSize(content?.description || '', contentWidth);
    pdf.text(descriptionLines, margin, yPosition);
    yPosition += (descriptionLines.length * 7) + 10;

    // Add course overview
    if (content?.generated?.courseOverview) {
      pdf.setFontSize(16);
      pdf.setTextColor(255, 193, 7); // Yellow
      pdf.text('Course Overview', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      const overviewLines = pdf.splitTextToSize(content.generated.courseOverview, contentWidth);
      pdf.text(overviewLines, margin, yPosition);
      yPosition += (overviewLines.length * 6) + 10;
    }

    // Add modules content
    const modules = content?.generated?.modules || [];
    modules.forEach((module: any, index: number) => {
      // Check if new page needed
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      // Module header
      pdf.setFontSize(16);
      pdf.setTextColor(255, 193, 7); // Yellow
      pdf.text(`Module ${index + 1}: ${module.moduleTitle || ''}`, margin, yPosition);
      yPosition += 10;

      // Module description
      if (module.moduleDescription) {
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        const descLines = pdf.splitTextToSize(module.moduleDescription, contentWidth);
        pdf.text(descLines, margin, yPosition);
        yPosition += (descLines.length * 6) + 5;
      }

      // Lessons
      module.lessons?.forEach((lesson: any, lessonIndex: number) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }

        // Lesson title
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Lesson ${lessonIndex + 1}: ${lesson.title || ''}`, margin, yPosition);
        yPosition += 8;

        // Lesson content
        if (lesson.content) {
          pdf.setFontSize(10);
          pdf.setTextColor(60, 60, 60);
          const contentLines = pdf.splitTextToSize(lesson.content, contentWidth);
          pdf.text(contentLines, margin, yPosition);
          yPosition += (contentLines.length * 5) + 5;
        }

        // Add space between lessons
        yPosition += 5;
      });

      // Add space between modules
      yPosition += 10;
    });

    // Add page numbers
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 30, 290);
    }

    // Download the PDF
    pdf.save(`${title.replace(/[^a-zA-Z0-9]/g, '_')}_complete_course.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

  // Get summary content (for summary output type)
  const getSummaryContent = (): string => {
    if (!content) return "No content available";
    
    let summaryText = "";
    
    if (content.generated?.summary) {
      summaryText = content.generated.summary;
    } else if (content.generated?.course_summary) {
      if (typeof content.generated.course_summary === 'string') {
        summaryText = content.generated.course_summary;
      } else if (content.generated.course_summary.description) {
        summaryText = content.generated.course_summary.description;
      } else {
        summaryText = JSON.stringify(content.generated.course_summary);
      }
    } else {
      summaryText = content.description || "No summary content available";
    }
    
    if (typeof summaryText !== 'string') {
      summaryText = String(summaryText);
    }
    
    return summaryText;
  };

  // Get word count safely
  const getWordCount = (text: string): number => {
    if (typeof text !== 'string') return 0;
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  // Print function for summary content
  const handlePrintSummary = () => {
    const summaryContent = getSummaryContent();
    const printContent = `
      <html>
        <head>
          <title>${content?.title} - Summary</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 40px; 
              line-height: 1.6;
              color: #000000;
              background: #ffffff;
            }
            h1 { 
              color: #000000; 
              border-bottom: 3px solid #FFD700; 
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .summary-content { 
              white-space: pre-line; 
              font-size: 14px;
              text-align: justify;
              color: #000000;
            }
            @media print {
              body { margin: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>${content?.title} - Course Summary</h1>
          <div class="summary-content">${summaryContent}</div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  // Determine content type
  const getContentType = (): string => {
    if (!content) return "unknown";
    return content.outputType || content.generated?.type || "unknown";
  };

  if (loading) return <p className="mt-10 text-center text-black">Loading...</p>;
  if (!content) return <p className="mt-10 text-center text-black">Course not found</p>;

  const contentType = getContentType();

  const renderContent = () => {
    switch (contentType) {
      case "ppt":
        return renderPPT();
      case "summary":
        return renderSummary();
      case "pdf":
        return renderPDF();
      case "full-course":
        return renderFullCourse();
      default:
        return renderUnknown();
    }
  };

  const renderPPT = () => {
    const slides = content?.generated?.slides || [];
    
    if (slides.length === 0) {
      return (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-black">No Slides Available</h3>
          <p className="text-gray-800">PPT content is not available.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-5 p-5">
        <h2 className="text-2xl font-bold mb-3 text-black p-4">Presentation Slides</h2>
        <AudioControls
  text={slides.map((s: any) => `${s.title}. ${s.content}`).join(" ")}
/>

        {slides.map((slide: any, index: number) => (
          <div key={index} className="border-2 border-yellow-400 rounded-lg p-6 bg-white shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-black">
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm mr-2">
                {index + 1}
              </span>
              {slide.title || "Untitled Slide"}
            </h3>
            <div className="text-gray-800 whitespace-pre-line bg-yellow-50 p-4 rounded border border-yellow-200">
              {slide.content || "No content"}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSummary = () => {
    const summaryContent = getSummaryContent();
    const wordCount = getWordCount(summaryContent);
    
    return (
      <div className="bg-white rounded-lg shadow-lg border-2 border-yellow-400">
        <div className="border-b-2 border-yellow-400 p-6 bg-black">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400 mb-2">{content.title}</h1>
              <p className="text-yellow-200 text-lg">{content.description}</p>
            </div>
            <button
              onClick={handlePrintSummary}
              className="px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors font-semibold flex items-center gap-2 border-2 border-yellow-400 hover:border-yellow-500"
            >
              <span className="text-lg">🖨️</span>
              Print Summary
            </button>
            
          </div>
        </div>

        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-black whitespace-pre-line text-lg leading-relaxed text-justify bg-white p-8 rounded-lg border-2 border-yellow-400 shadow-sm">
              {summaryContent}
            </div>

            <AudioControls text={summaryContent} />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 bg-yellow-100 inline-block px-4 py-2 rounded-full">
                Summary length: <strong>{wordCount}</strong> words
              </p>
            </div>
          </div>
        </div>
        
      </div>
    );
  };

  const renderPDF = () => {
    const pdfContent = getPDFContent();
    const wordCount = getWordCount(pdfContent);
    
    return (
      <div className="bg-white rounded-lg shadow-lg border-2 border-yellow-400">
        {/* Header with Download Button */}
        <div className="border-b-2 border-yellow-400 p-6 bg-black">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400 mb-2">{content.title}</h1>
              <p className="text-yellow-200 text-lg">{content.description}</p>
            </div>
            <button
              onClick={downloadPDF}
              className="px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors font-semibold flex items-center gap-2 border-2 border-yellow-400 hover:border-yellow-500"
            >
              <span className="text-lg">📥</span>
              Download PDF
            </button>
          </div>
          <div className="mt-4 flex gap-4 text-sm text-yellow-200">
            <span className="bg-gray-800 px-3 py-1 rounded-full">Level: <strong>{content.level}</strong></span>
            <span className="bg-gray-800 px-3 py-1 rounded-full">Duration: <strong>{content.duration}</strong></span>
            <span className="bg-gray-800 px-3 py-1 rounded-full">Content: <strong>{wordCount} words</strong></span>
          </div>
        </div>

        {/* PDF Content Preview */}
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg border-2 border-yellow-400 shadow-sm">
              <div className="text-black whitespace-pre-line text-base leading-relaxed">
                {pdfContent}
                <AudioControls text={pdfContent} />

              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 bg-yellow-100 px-4 py-2 rounded-full inline-block">
                This content will be formatted into a professional PDF with black & yellow theme when downloaded.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFullCourse = () => {
  const modules = content?.generated?.modules || [];
  
  
  if (modules.length === 0) {
    return (
      
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-black">No Modules Available</h3>
        <p className="text-gray-800">Full course content is not available.</p>
      </div>
    );
  }
 const fullCourseText = modules
  .map((m: any) =>
    `Module ${m.moduleTitle}. ${
      m.lessons?.map((l: any) => l.content).join(" ")
    }`
  )
  .join(" ");

  return (
    <div className="space-y-6 pl-4 pb-3">
      {/* Course Header with Download Button */}
      
      <div className="flex justify-between items-center mb-6 p-3 pt-9">
        
        <h2 className="text-2xl font-bold text-black pr-8">Course Modules</h2>
         
        <button
          onClick={downloadFullCoursePDF}
          className="px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors font-semibold flex items-center gap-2 border-2 border-yellow-400 hover:border-yellow-500"
        >
          <span className="text-lg">📥</span>
          Download Full Course
        </button>
        
      </div>

      {/* Course Overview */}
      {content?.generated?.courseOverview && (
        <div className="bg-white border-2 border-yellow-400 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-black mb-3">📚 Course Overview</h3>
          <p className="text-gray-800 whitespace-pre-line">{content.generated.courseOverview}</p>
        </div>
      )}

      {/* Learning Objectives */}
      {content?.generated?.learningObjectives && (
        <div className="bg-white border-2 border-yellow-400 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-black mb-3">🎯 Learning Objectives</h3>
          <ul className="list-disc list-inside space-y-2">
            {content.generated.learningObjectives.map((objective: string, index: number) => (
              <li key={index} className="text-gray-800">{objective}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Modules */}
      {modules.map((module: any, index: number) => (
        <div key={index} className="border-2 border-yellow-400 rounded-lg p-6 bg-white shadow-md">
          {/* Module Header */}
          <div className="flex items-start mb-4">
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm mr-3 font-bold">
              {index + 1}
            </span>
            <div>
              <h3 className="text-xl font-semibold text-black">
                {module.moduleTitle || `Module ${index + 1}`}
              </h3>
              {module.moduleDescription && (
                <p className="text-gray-700 mt-2">{module.moduleDescription}</p>
              )}
            </div>
          </div>

          {/* Lessons */}
          <div className="ml-12 space-y-4">
            {module.lessons && module.lessons.map((lesson: any, lessonIndex: number) => (
              <div key={lessonIndex} className="border border-yellow-300 rounded-lg p-4 bg-yellow-50">
                {/* Lesson Header */}
                <h4 className="text-lg font-semibold text-black mb-3">
                  <span className="bg-black text-yellow-400 px-2 py-1 rounded text-sm mr-2">
                    {lessonIndex + 1}
                  </span>
                  {lesson.title || `Lesson ${lessonIndex + 1}`}
                </h4>

                {/* Lesson Duration */}
                {lesson.duration && (
                  <p className="text-sm text-gray-600 mb-3">
                    ⏱️ Estimated time: {lesson.duration}
                  </p>
                )}

                {/* Lesson Content */}
                {lesson.content && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-black mb-2">📖 Content:</h5>
                    <p className="text-gray-800 whitespace-pre-line text-sm">{lesson.content}</p>
                  </div>
                )}

                {/* Learning Objectives */}
                {lesson.objectives && lesson.objectives.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-black mb-2">🎯 Objectives:</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {lesson.objectives.map((objective: string, objIndex: number) => (
                        <li key={objIndex} className="text-gray-800 text-sm">{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Examples */}
                {lesson.examples && lesson.examples.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-black mb-2">💡 Examples:</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {lesson.examples.map((example: string, exIndex: number) => (
                        <li key={exIndex} className="text-gray-800 text-sm">{example}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Points */}
                {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-black mb-2">🔑 Key Points:</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {lesson.keyPoints.map((point: string, pointIndex: number) => (
                        <li key={pointIndex} className="text-gray-800 text-sm">{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Exercises */}
                {lesson.exercises && lesson.exercises.length > 0 && (
                  <div className="mt-4 p-3 bg-white border border-yellow-400 rounded">
                    <h5 className="font-semibold text-black mb-2">🏋️ Exercises:</h5>
                    <ul className="list-decimal list-inside space-y-1">
                      {lesson.exercises.map((exercise: string, exerIndex: number) => (
                        <li key={exerIndex} className="text-gray-800 text-sm">{exercise}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Module Assessment */}
          {module.assessment && (
            <div className="ml-12 mt-4 p-4 bg-black text-yellow-400 rounded-lg">
              <h5 className="font-semibold mb-2">📝 Module Assessment:</h5>
              <p className="text-sm whitespace-pre-line">{module.assessment}</p>
            </div>
          )}

          {/* Module Resources */}
          {module.resources && module.resources.length > 0 && (
            <div className="ml-12 mt-4 p-4 bg-gray-100 rounded-lg">
              <h5 className="font-semibold text-black mb-2">📚 Additional Resources:</h5>
              <ul className="list-disc list-inside space-y-1">
                {module.resources.map((resource: string, resIndex: number) => (
                  <li key={resIndex} className="text-gray-800 text-sm">{resource}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      {/* Study Plan */}
      {content?.generated?.studyPlan && (
        <div className="bg-white border-2 border-yellow-400 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-black mb-3">📅 Study Plan</h3>
          <p className="text-gray-800 whitespace-pre-line">{content.generated.studyPlan}</p>
        </div>
      )}

      {/* Additional Resources */}
      {content?.generated?.additionalResources && (
        <div className="bg-white border-2 border-yellow-400 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-black mb-3">🌐 Additional Resources</h3>
          <ul className="list-disc list-inside space-y-2">
            {content.generated.additionalResources.map((resource: string, index: number) => (
              <li key={index} className="text-gray-800">{resource}</li>
            ))}
          </ul>
        </div>
      )}
      <AudioControls text={fullCourseText} />
    </div>
  );
};
    

  const renderUnknown = () => {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Unable to Display Content</h3>
        <p className="text-gray-800">Data structure issue detected.</p>
        <div className="bg-white p-4 rounded border-2 border-yellow-400 text-xs mt-2">
          <strong className="text-black">Debug Information:</strong>
          <pre className="mt-2 overflow-auto text-black">
            Generated: {JSON.stringify(content?.generated, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white min-h-screen">
      <button
        className="mb-6 px-4 py-2 bg-black text-yellow-400 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2 border-2 border-yellow-400 font-semibold"
        onClick={() => navigate(-1)}
      >
        <span className="text-lg">⬅</span> Back to Courses
      </button>

      <div className="bg-white rounded-xl border-2 border-yellow-400">
        {renderContent()}
      </div>
    </div>
  );
};

export default ViewContent;