"use client";

interface EmbedYouTubeProps {
  videoId: string;
}

export default function EmbedYouTube({ videoId }: EmbedYouTubeProps) {
  return (
    <div className="my-8 aspect-video w-full rounded-lg overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

