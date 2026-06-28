function Hero() {
  return (
    <div className="text-center py-16 px-4">

      {/* Tag pill */}
      <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
        Powered by 4 AI Agents
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
        Turn your idea into a{" "}
        <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
          full software blueprint
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
        Describe your startup idea and let AI agents generate the requirements,
        architecture, backend design, and QA report — in seconds.
      </p>

    </div>
  );
}

export default Hero;
