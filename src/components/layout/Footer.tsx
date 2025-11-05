import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 xl:col-span-1">
            <Link href="/" className="text-xl font-bold text-primary-800 tracking-wider">
              Bargain<span className="text-gray-600">BaaS</span>
            </Link>
            <p className="text-gray-500 text-sm">
              The AI-Based Bargaining Chatbot as a Service.
            </p>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Project Team. All rights reserved.
            </p>
          </div>
          
          {/* Column 2 & 3: Navigation Links */}
          <div className="mt-8 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Product</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li><Link href="/features" className="text-base text-gray-500 hover:text-primary-800">Features</Link></li>
                  <li><Link href="/pricing" className="text-base text-gray-500 hover:text-primary-800">Pricing</Link></li>
                                  </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li><Link href="#" className="text-base text-gray-500 hover:text-primary-800">About Us</Link></li>
                  <li><Link href="#" className="text-base text-gray-500 hover:text-primary-800">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;