import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-6xl font-serif font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-serif font-bold text-primary mb-6">
        Page Not Found
      </h2>
      <p className="text-xl text-text mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="btn-primary inline-block">
        Return Home
      </Link>
    </div>
  );
}

