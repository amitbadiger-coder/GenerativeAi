import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "./Container";
import { Button } from "./ui/button";
import Marquee from "react-fast-marquee";
import { MarkImage } from "./MarkImage";

const HomePage = () => {
  return (
    <>    <div className="flex flex-col w-full pb-24 bg-[#f7f7f7]">
      {/* HERO SECTION */}
      <Container>
        <div className="mt-10 md:mt-20 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* LEFT TEXT */}
          <div className="flex-1">
            <p className="uppercase tracking-wide text-sm text-gray-600 mb-2">
              Empowering businesses worldwide
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-black">
             <span> AI-Powered Digital Course Generator</span>
            </h1>

            <p className="mt-6 text-gray-600 max-w-md">
              Create complete, high‑quality digital courses instantly with the power of AI. Upload a topic, choose a style, and let the system generate structured modules, lessons, quizzes, summaries, and downloadable materials.
            </p>

            <div className="flex gap-4 mt-8">
              <Link to="/generate/course">
              <Button className="px-6 py-3 bg-yellow-500 text-black rounded-xl font-semibold hover:bg-yellow-600">
                Generate Course
              </Button>
              </Link>
              <Button variant="outline" className="px-6 py-3 rounded-xl font-semibold">
                View Samples
              </Button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex-1 flex justify-center relative">
            <div className="relative bg-white rounded-full p-2 shadow-2xl">
              <img
                src="/img/round.jpeg"
                alt="hero"
                className="w-100 h-100 object-cover rounded-full"
              />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-yellow-400 w-40 h-6 rounded-full -mb-3"></div>
            </div>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mt-16 bg-black text-white rounded-2xl py-10 px-4 shadow-xl">
          <div>
            <p className="text-3xl font-bold">2000+</p>
            <p className="text-gray-400">Courses Generated</p>
          </div>
          <div>
            <p className="text-3xl font-bold">10+</p>
            <p className="text-gray-400">Topics Supported</p>
          </div>
          <div>
            <p className="text-3xl font-bold">800+</p>
            <p className="text-gray-400">Modules Auto‑Generated</p>
          </div>
          <div>
            <p className="text-3xl font-bold">150M+</p>
            <p className="text-gray-400">Users Worldwide</p>
          </div>
        </div>
      </Container>

      {/* BRAND MARQUEE */}
      <div className="w-full my-16">
        <Marquee pauseOnHover>
          <MarkImage img="/img/logo/c.jpeg" />
          <MarkImage img="/img/logo/c1.jpeg" />
          <MarkImage img="/img/logo/html.jpeg" />
          <MarkImage img="/img/logo/java.jpeg" />
          <MarkImage img="/img/logo/py.jpeg" />
          <MarkImage img="/img/logo/js.jpeg" />
          <MarkImage img="/img/logo/mysql.jpeg" />
          <MarkImage img="/img/logo/node.jpeg" />
          <MarkImage img="/img/logo/php.jpeg" />
          <MarkImage img="/img/logo/react.jpeg" />
        </Marquee>
      </div>

      {/* SECOND SECTION */}
     <Container>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-800 relative overflow-hidden">
    
    {/* Background decorative elements */}
    <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl -translate-y-36 translate-x-36"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-x-32 translate-y-32"></div>
    
    {/* TEXT CONTENT */}
    <div className="relative z-10">
      <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-2 mb-6">
        <Sparkles className="w-4 h-4 text-yellow-400" />
        <span className="text-yellow-400 text-sm font-medium">AI-Powered Learning</span>
      </div>
      
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
        Create Stunning Courses in{' '}
        <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
          Seconds
        </span>
      </h2>
      
      <p className="text-gray-300 mb-2 text-lg leading-relaxed">
        Transform your expertise into engaging digital courses with AI. 
        No design skills needed.
      </p>
      
      <ul className="space-y-3 mb-8">
        {[
          "🎯 AI-generated content & images",
          "⚡ Instant PPTs, PDFs & full courses", 
          "🎨 Professional layouts automatically",
          "🚀 No technical skills required"
        ].map((item, index) => (
          <li key={index} className="flex items-center gap-3 text-gray-300">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            {item}
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/generate">
          <Button className="px-8 py-4 flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg hover:shadow-yellow-500/25">
            Create Your Course <Sparkles className="w-5 h-5" />
          </Button>
        </Link>
        
        <Button variant="outline" className="px-8 py-4 border-2 border-gray-700 text-white font-bold rounded-xl hover:bg-gray-800 transition-all">
          View Examples
        </Button>
      </div>
      
      <div className="flex items-center gap-4 mt-8 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full border-2 border-gray-900"></div>
            ))}
          </div>
          <span>500+ courses created</span>
        </div>
      </div>
    </div>

    {/* IMAGE */}
    <div className="relative z-10">
      <div className="relative">
        <img
          src="/img/hero2.jpeg"
          alt="AI Course Generator Interface"
          className="w-full rounded-2xl shadow-2xl border border-gray-700 transform hover:scale-105 transition-transform duration-300"
        />
        
        {/* Floating elements */}
        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-xl font-bold shadow-lg">
          AI Generated
        </div>
        
        <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-3 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-sm">Ready in 30s</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</Container>
    </div>
    </>

  );
};

export default HomePage;
