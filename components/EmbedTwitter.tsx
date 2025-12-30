"use client";

import { useEffect } from "react";

interface EmbedTwitterProps {
  url: string;
}

export default function EmbedTwitter({ url }: EmbedTwitterProps) {
  // Extract tweet ID from URL
  const tweetId = url.match(/status\/(\d+)/)?.[1] || url.split("/").pop();

  useEffect(() => {
    // Load Twitter widgets script
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector(
        'script[src="https://platform.twitter.com/widgets.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  if (!tweetId) {
    return null;
  }

  return (
    <div className="my-8 flex justify-center">
      <blockquote className="twitter-tweet" data-theme="light">
        <a href={`https://twitter.com/x/status/${tweetId}`}>
          Loading tweet...
        </a>
      </blockquote>
    </div>
  );
}

