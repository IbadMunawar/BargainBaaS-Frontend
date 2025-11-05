import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Rocket, BrainCircuit, Zap, ShoppingCart } from 'lucide-react'; // Icons for Features

// ======================================================================
// MAIN LANDING PAGE COMPONENT
// ======================================================================

const LandingPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>BargainBaaS | AI-Powered Bargaining Chatbot as a Service</title>
        <meta name="description" content="Integrate intelligent, automated price negotiation into your eCommerce platform with our plug-and-play API service." />
      </Head>

      <Navbar />

      <main>
        <HeroSection />
        <FeaturesSummarySection />
        <HowItWorksSection />
      </main>

      <Footer />
    </>
  );
};

export default LandingPage;


// ======================================================================
// HELPER COMPONENTS (Sections)
// ======================================================================

// ----------------------------------------------------------------------
// 1. Hero Section 🚀 (Fixed for high contrast)
// ----------------------------------------------------------------------
const HeroSection: React.FC = () => (
  <section className="pt-20 pb-32 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary-800 mb-4">
        Bargaining as a Service (BaaS)
      </p>
      
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
        Boost Conversions with <br className="hidden md:inline"/>
        <span className="text-primary-800">AI-Powered Price Negotiation</span>
      </h1>
      
      <p className="max-w-3xl mx-auto text-xl text-gray-700 mb-10">
        Integrate our intelligent, plug-and-play chatbot API service to bring the satisfaction of real-time price negotiation to any eCommerce platform.
      </p>
      
      <div className="flex justify-center space-x-4">
        <Link
          href="/auth/signup"
          className="px-8 py-3 text-lg font-bold rounded-xl text-white bg-primary-800 hover:bg-primary-900 transition duration-300 shadow-xl shadow-primary-200/50"
        >
          Get Your API Key Now
        </Link>
        <Link
          href="/pricing"
          className="px-8 py-3 text-lg font-bold rounded-xl text-primary-800 bg-white border-2 border-primary-800 hover:bg-primary-50 transition duration-300"
        >
          View Pricing
        </Link>
      </div>

      {/* Placeholder Image/Illustration */}
      <div className="mt-16 mx-auto w-full max-w-4xl h-72 bg-gray-200 rounded-xl shadow-2xl flex items-center justify-center border-4 border-primary-200">
        <span className="text-gray-500 font-medium text-lg">
          [Illustration: Bargaining Chatbot Interface]
        </span>
      </div>
    </div>
  </section>
);


// ----------------------------------------------------------------------
// 2. Features Summary Section ✨ (Using blue background for high impact)
// ----------------------------------------------------------------------
const features = [
  { 
    title: 'Natural Language Processing', 
    description: 'Understands customer intent and handles unstructured negotiation dialogue smoothly.', 
    icon: BrainCircuit 
  },
  { 
    title: 'Rule-Based Negotiation', 
    description: 'Enforces dynamic pricing rules and pre-set discount limits for guaranteed profit protection.', 
    icon: Zap 
  },
  { 
    title: 'API-First Scalability', 
    description: 'Built as a secure, reusable RESTful API service for seamless integration across all domains.', 
    icon: Rocket 
  },
  { 
    title: 'Real-Time Deal Closure', 
    description: 'Passes the final negotiated price directly back to your platform for instant checkout.', 
    icon: ShoppingCart 
  },
];

const FeaturesSummarySection: React.FC = () => (
  <section className="py-20 bg-primary-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-white text-center mb-16">
        Why BargainBaaS is the Future of eCommerce
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="text-center p-6 bg-white rounded-xl shadow-2xl transition duration-300 transform hover:scale-[1.05] border-b-4 border-primary-400"
          >
            <feature.icon className="h-10 w-10 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);


// ----------------------------------------------------------------------
// 3. How It Works (Hybrid Brain) Section 🧠 (Fixed for high contrast)
// ----------------------------------------------------------------------
const HowItWorksSection: React.FC = () => (
  <section className="py-24 bg-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
        The Hybrid Negotiation Brain
      </h2>

      <div className="relative p-10 bg-white rounded-xl shadow-2xl border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-center">

          {/* Step 1: User Intent */}
          <div className="p-4">
            <div className="text-5xl mb-4 text-primary-500">1</div>
            <h3 className="text-xl font-semibold text-primary-800 mb-2">Step 1: User Input & Intent</h3>
            <p className="text-gray-700">
              Customer types their offer. The NLP engine detects intent and price offer to initiate the negotiation.
            </p>
          </div>
          
          {/* Arrow visual connector */}
          <div className="hidden lg:flex absolute top-[40%] left-[33%] justify-center w-[33%] text-primary-300 pointer-events-none">
            <span className="text-2xl">→</span>
          </div>


          {/* Step 2: Rule Engine */}
          <div className="p-4">
            <div className="text-5xl mb-4 text-primary-500">2</div>
            <h3 className="text-xl font-semibold text-primary-800 mb-2">Step 2: Dynamic Rule Engine Check</h3>
            <p className="text-gray-700">
              Input is checked against seller-defined rules (min price, discount limits) to enforce profit margins.
            </p>
          </div>

          {/* Arrow visual connector */}
          <div className="hidden lg:flex absolute top-[40%] left-[66%] justify-center w-[33%] text-primary-300 pointer-events-none">
            <span className="text-2xl">→</span>
          </div>


          {/* Step 3: Response */}
          <div className="p-4">
            <div className="text-5xl mb-4 text-primary-500">3</div>
            <h3 className="text-xl font-semibold text-primary-800 mb-2">Step 3: Customized Response & Offer</h3>
            <p className="text-gray-700">
              Chatbot generates a human-like counter-offer. If accepted, the final price is API-sent for checkout.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
            <Link
                href="/features"
                className="inline-block px-8 py-3 text-md font-semibold rounded-full text-white bg-primary-800 hover:bg-primary-900 transition duration-300 shadow-lg"
            >
                Read More About Our Technology
            </Link>
        </div>

      </div>
    </div>
  </section>
);
