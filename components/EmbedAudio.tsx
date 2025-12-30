"use client";

interface EmbedAudioProps {
  url: string;
}

export default function EmbedAudio({ url }: EmbedAudioProps) {
  return (
    <div className="my-8 bg-background rounded-lg p-6">
      <audio controls className="w-full" src={url}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

