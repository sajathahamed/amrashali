import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Amras Ali</h3>
            <p className="text-sm text-gray-300">
              Social Work Undergraduate dedicated to empowering communities,
              promoting sustainability, and creating positive social change.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-300 hover:text-white transition-colors">
                  Journal
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-300 hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.facebook.com/share/1FNKwbNNqQ/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/amras_ali23?igsh=aWtuMWZhZmN0MGRk&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/amras-ali-6994b1218?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Initiatives</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Little Food Cabinet</li>
              <li>AB Journal</li>
              <li>Sri Lanka Greens</li>
              <li>Jana Sabha</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-light mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; {currentYear} Amras Ali. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
