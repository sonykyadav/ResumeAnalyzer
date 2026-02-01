"use client";
import { useState } from "react";

export default function ResumeAnalyzer() {
  const [resume, setResume] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeResume = () => {
    if (!resume) return;
    setIsLoading(true);

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        messages: [
          {
            role: "system",
            content:
              "You are an AI Resume Analyzer.",
          },
          {
            role: "user",
            content: resume,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "resume_analysis",
            schema: {
              type: "object",
              properties: {
                summary: {
                  type: "string",
                  description: "Short professional summary of the resume",
                },
                skills: {
                  type: "array",
                  items: { type: "string" },
                  description: "Extracted skills from resume",
                },
                strengths: {
                  type: "array",
                  items: { type: "string" },
                },
                weaknesses: {
                  type: "array",
                  items: { type: "string" },
                },
                suggestions: {
                  type: "array",
                  items: { type: "string" },
                },
                score: {
                  type: "number",
                  description: "Resume score out of 100",
                },
              },
              required: [
                "summary",
                "skills",
                "strengths",
                "weaknesses",
                "suggestions",
                "score",
              ],
            },
          },
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const parsed = JSON.parse(data.choices[0].message.content);
        setResult(parsed);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-yellow-400 p-8 rounded-2xl w-full max-w-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-cyan-400 mb-4 text-center">
          AI Resume Analyzer
        </h1>

        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Paste your resume text here..."
          className="w-full h-40 p-4 rounded-xl bg-gray-900 text-white mb-4"
        />

        <button
          onClick={analyzeResume}
          className="w-full py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold text-gray-900"
        >
          Analyze Resume
        </button>

        {isLoading && (
          <p className="text-cyan-400 mt-4 text-center animate-pulse">
            Analyzing resume...
          </p>
        )}

        {result && (
          <div className="mt-6 space-y-4 text-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-green-400">Summary</h2>
              <p>{result.summary}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400">Skills</h2>
              <p>{result.skills.join(", ")}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-400">
                Strengths
              </h2>
              <ul className="list-disc ml-6">
                {result.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-red-400">Weaknesses</h2>
              <ul className="list-disc ml-6">
                {result.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-cyan-400">
                Suggestions
              </h2>
              <ul className="list-disc ml-6">
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// "use client";
// import { useState } from "react";

// export default function AIResumeAnalyzer() {
//   const [resumeText, setResumeText] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const analyzeResume = async () => {
//     if (!resumeText) return;
//     setLoading(true);

//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-5-nano",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are an AI Resume Analyzer. Analyze resume and give structured feedback.",
//           },
//           {
//             role: "user",
//             content: resumeText,
//           },
//         ],
//         response_format: {
//           type: "json_schema",
//           json_schema: {
//             name: "resume_analysis",
//             schema: {
//               type: "object",
//               properties: {
//                 skills: { type: "array", items: { type: "string" } },
//                 strengths: { type: "array", items: { type: "string" } },
//                 weaknesses: { type: "array", items: { type: "string" } },
//                 suggestions: { type: "array", items: { type: "string" } },
//                 score: { type: "number" },
//               },
//               required: [
//                 "skills",
//                 "strengths",
//                 "weaknesses",
//                 "suggestions",
//                 "score",
//               ],
//             },
//           },
//         },
//       }),
//     });

//     const data = await response.json();
//     setResult(JSON.parse(data.choices[0].message.content));
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-black text-white p-6">
//       <h1 className="text-3xl font-bold mb-4">AI Resume Analyzer</h1>

//       <textarea
//         className="w-full p-3 bg-gray-900 border border-gray-700 rounded"
//         rows={10}
//         placeholder="Paste your resume text here..."
//         value={resumeText}
//         onChange={(e) => setResumeText(e.target.value)}
//       />

//       <button
//         onClick={analyzeResume}
//         disabled={loading}
//         className="mt-4 px-6 py-2 bg-green-600 rounded hover:bg-green-700"
//       >
//         {loading ? "Analyzing..." : "Analyze Resume"}
//       </button>

//       {result && (
//         <div className="mt-6 space-y-4">
//           <p className="text-xl">Score: {result.score}/10</p>

//           <div>
//             <h2 className="text-green-400">Skills</h2>
//             <ul>
//               {result.skills.map((s, i) => (
//                 <li key={i}>• {s}</li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h2 className="text-blue-400">Strengths</h2>
//             <ul>
//               {result.strengths.map((s, i) => (
//                 <li key={i}>• {s}</li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h2 className="text-red-400">Weaknesses</h2>
//             <ul>
//               {result.weaknesses.map((w, i) => (
//                 <li key={i}>• {w}</li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h2 className="text-yellow-400">Suggestions</h2>
//             <ul>
//               {result.suggestions.map((s, i) => (
//                 <li key={i}>• {s}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
