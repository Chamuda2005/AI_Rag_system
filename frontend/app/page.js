"use client";

import { useEffect, useRef, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("rag_chat_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("rag_chat_history", JSON.stringify(history));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const uploadPdf = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);

      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      alert(`${data.filename} uploaded successfully. ${data.total_chunks} chunks stored.`);
      setSelectedFile(null);
    } catch (error) {
      alert("Upload failed. Please check if backend is running.");
    } finally {
      setUploading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    const userQuestion = question;
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
          chat_history: history,
        }),
      });

      const data = await res.json();

      setHistory((prev) => [
        ...prev,
        {
          question: userQuestion,
          answer: data.answer || "No answer received.",
          sources: data.sources || [],
        },
      ]);
    } catch (error) {
      setHistory((prev) => [
        ...prev,
        {
          question: userQuestion,
          answer: "Error: Please check if backend is running.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("rag_chat_history");
  };

  return (
    <main className="min-h-screen bg-[#0B1120] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6">
        <header className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <p className="mb-2 text-sm font-semibold text-blue-400">
            AI RAG Assistant
          </p>

          <h1 className="text-3xl font-bold md:text-5xl">
            Chat with your PDF files
          </h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            Upload a PDF from the web interface, store it in ChromaDB, then ask questions from the document.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-[#111827] p-4">
            <p className="mb-3 font-semibold">Upload PDF</p>

            <div className="flex flex-col gap-3 md:flex-row">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="flex-1 rounded-2xl border border-white/10 bg-[#020617] px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white"
              />

              <button
                onClick={uploadPdf}
                disabled={uploading}
                className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold shadow-lg transition hover:bg-blue-500 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload & Ingest"}
              </button>

              <button
                onClick={clearHistory}
                className="rounded-2xl border border-white/10 bg-white/10 px-6 py-3 font-semibold transition hover:bg-white/20"
              >
                Clear Chat
              </button>
            </div>

            {selectedFile && (
              <p className="mt-3 text-sm text-gray-400">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        </header>

        <section className="flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
          <div className="h-[55vh] space-y-5 overflow-y-auto p-5">
            {history.length === 0 && (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/20 text-4xl">
                    📄
                  </div>
                  <h2 className="text-2xl font-bold">Upload a PDF and ask</h2>
                  <p className="mt-2 text-gray-400">
                    Example: Summarize this document.
                  </p>
                </div>
              </div>
            )}

            {history.map((item, index) => (
              <div key={index} className="space-y-4">
                <div className="ml-auto max-w-3xl rounded-3xl bg-blue-600 px-5 py-4 shadow-lg">
                  <p className="font-semibold">You</p>
                  <p className="mt-1 text-blue-50">{item.question}</p>
                </div>

                <div className="max-w-3xl rounded-3xl border border-white/10 bg-[#111827] px-5 py-4 shadow-lg">
                  <p className="font-semibold text-green-400">Assistant</p>
                  <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-200">
                    {item.answer}
                  </p>

                  {item.sources?.length > 0 && (
                    <div className="mt-4 rounded-2xl bg-black/20 p-4">
                      <p className="mb-2 text-sm font-semibold text-gray-300">
                        Sources
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.sources.map((src, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-white/10 px-3 py-1 text-sm text-gray-300"
                          >
                            {src.source || "Unknown source"}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="max-w-3xl rounded-3xl border border-white/10 bg-[#111827] px-5 py-4">
                <p className="font-semibold text-green-400">Assistant</p>
                <p className="mt-2 animate-pulse text-gray-400">Thinking...</p>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="flex gap-3">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    askQuestion();
                  }
                }}
                placeholder="Ask a question from your uploaded PDF..."
                className="min-h-[60px] flex-1 resize-none rounded-2xl border border-white/10 bg-[#020617] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
              />

              <button
                onClick={askQuestion}
                disabled={loading}
                className="rounded-2xl bg-green-600 px-6 py-3 font-bold shadow-lg transition hover:bg-green-500 disabled:opacity-50"
              >
                Send
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-gray-500">
              Backend must run on http://127.0.0.1:8000
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}