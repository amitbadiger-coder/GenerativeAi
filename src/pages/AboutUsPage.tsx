import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className=" w-full bg-black text-white">
      
      {/* HERO */}
      <section className="relative w-full h-[60vh] flex items-center justify-center">
        <img
          src="/img/about.jpeg"
          className="absolute w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold">About Our AI Course Generator</h1>
          <p className="mt-4 text-gray-300 text-lg">
            Transforming ideas into professional digital courses in minutes.
          </p>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="py-20 px-6 md:px-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Our <span className="text-yellow-400">Mission</span>
        </h2>
        <div className="max-w-4xl mx-auto text-gray-300 text-lg text-center leading-relaxed">
          <p>
            We built this platform to empower creators, educators, and businesses 
            to generate full-fledged online courses using AI. No editing, no content 
            writing, no manual structure — just describe your topic and our AI does 
            the rest.
          </p>
          <p className="mt-6">
            Our goal is to make high-quality education accessible and easy to create 
            for everyone worldwide.
          </p>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 px-6 md:px-20">
        <h2 className="text-4xl font-bold text-center mb-14">
          Why <span className="text-yellow-400">Creators</span> Choose Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-white text-black p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold">AI Course Creation</h3>
            <p className="text-gray-600 mt-3">
              Turn a simple idea into a full digital course with modules, quizzes, 
              PDFs, slides & video scripts.
            </p>
          </div>

          <div className="bg-white text-black p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold">Auto Study Material</h3>
            <p className="text-gray-600 mt-3">
              Generate ebooks, summaries, slides, worksheets & interactive content 
              instantly.
            </p>
          </div>

          <div className="bg-white text-black p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold">Easy Publish System</h3>
            <p className="text-gray-600 mt-3">
              Export your course or publish it directly to your learning platform 
              with a single click.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 md:px-20">
        <h2 className="text-4xl font-bold text-center mb-14">
          How It <span className="text-yellow-400">Works</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          
          <div className="bg-white text-black p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold">1. Enter Your Topic</h3>
            <p className="text-gray-600 mt-3">
              Simply type your course topic or paste your ideas — AI understands it.
            </p>
          </div>

          <div className="bg-white text-black p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold">2. AI Generates Everything</h3>
            <p className="text-gray-600 mt-3">
              Modules, lessons, quizzes, summaries, resources — all created in minutes.
            </p>
          </div>

          <div className="bg-white text-black p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold">3. Publish or Export</h3>
            <p className="text-gray-600 mt-3">
              Download your content or publish directly to your LMS platform.
            </p>
          </div>

        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 px-6 md:px-20">
        <h2 className="text-4xl font-bold text-center mb-14">
          Meet the <span className="text-yellow-400">Creators</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {[
            { name: "Sukanya", role: "Developer", img: "/public/logo1.png" },
           
          ].map((m, i) => (
            <div key={i} className="bg-white text-black p-6 rounded-2xl shadow-xl text-center">
              <img src={m.img} className="w-28 h-28 rounded-full object-cover mx-auto" />
              <h3 className="mt-4 text-xl font-bold">{m.name}</h3>
              <p className="text-gray-600">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-20">
        <div className="bg-yellow-400 text-black p-10 rounded-3xl max-w-4xl mx-auto text-center shadow-2xl">
          <h2 className="text-3xl font-bold">Start Creating Your AI-Powered Course Today</h2>
          <p className="mt-4 text-lg">
            Join thousands of creators building smarter, faster, and effortlessly.
          </p>
          <Link to="/generate/course">
          <button className="mt-6 bg-black text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-gray-900">
            Generate Your First Course →
          </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
