import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function TestUpload() {
  return (
    <>
      <Head><title>Test — Mentora AI</title></Head>
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050810" }}>
        <div className="text-center">
          <div className="text-white text-xl mb-4">Use the main page for evaluation</div>
          <Link href="/" className="text-purple-400">Go to Home →</Link>
        </div>
      </div>
    </>
  );
}
