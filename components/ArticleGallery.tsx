"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ArticleGalleryProps {
  images: string[];
  articleTitle: string;
}

export default function ArticleGallery({
  images,
  articleTitle,
}: ArticleGalleryProps) {
  return (
    <div className="mt-12">
      <h3 className="text-2xl font-serif font-bold text-primary mb-6">
        Gallery
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative h-64 rounded-lg overflow-hidden"
          >
            <Image
              src={image}
              alt={`${articleTitle} - Image ${index + 2}`}
              fill
              className="object-cover hover:scale-110 transition-transform duration-500"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}




