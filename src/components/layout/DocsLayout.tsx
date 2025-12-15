import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronRight, FileText } from 'lucide-react';

interface DocsLayoutProps {
    children: React.ReactNode;
    pageTitle: string;
}

const docLinks = [
    { name: 'Introduction & Concepts', slug: 'introduction' },
    { name: 'Authentication & Keys', slug: 'authentication' },
    { name: 'Session Initialization (Push)', slug: 'session-init' },
    { name: 'Success Protocol', slug: 'success-protocol' },
    { name: 'Bot Calling & Widget', slug: 'calling-the-bot' },
];

const DocsLayout: React.FC<DocsLayoutProps> = ({ children, pageTitle }) => {
    const router = useRouter();
    const currentSlug = (router.query.slug as string) || 'introduction';

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 flex-shrink-0">
                <div className="lg:sticky lg:top-8 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary-600" />
                        Developer Guide
                    </h3>
                    <nav className="space-y-1">
                        {docLinks.map((link) => (
                            <Link
                                key={link.slug}
                                href={`/dashboard/documentation/${link.slug}`}
                                className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                                    currentSlug === link.slug
                                        ? 'bg-primary-100 text-primary-800'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {link.name}
                                {currentSlug === link.slug && <ChevronRight className="h-4 w-4 ml-2" />}
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                {/* MOVED TITLE INSIDE THE CARD */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 min-h-[70vh]">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">{pageTitle}</h1>
                    <div className="space-y-1">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DocsLayout;