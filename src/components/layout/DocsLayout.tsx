import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronRight, BookOpen } from 'lucide-react';

interface DocsLayoutProps {
    children: React.ReactNode;
    pageTitle: string;
}

const docLinks = [
    { name: 'Introduction & Concepts', slug: 'introduction' },
    { name: 'Authentication & Keys', slug: 'authentication' },
    { name: 'Session Initialization', slug: 'session-init' },
    { name: 'Success Protocol', slug: 'success-protocol' },
    { name: 'Bot Calling & Widget', slug: 'calling-the-bot' },
];

const DocsLayout: React.FC<DocsLayoutProps> = ({ children, pageTitle }) => {
    const router = useRouter();
    const currentSlug = (router.query.slug as string) || 'introduction';

    return (
        <div className="flex flex-col lg:flex-row gap-6">

            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-60 flex-shrink-0">
                <div className="lg:sticky lg:top-8 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5" />
                        Developer Guide
                    </h3>
                    <nav className="space-y-0.5">
                        {docLinks.map((link) => (
                            <Link
                                key={link.slug}
                                href={`/dashboard/documentation/${link.slug}`}
                                className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${
                                    currentSlug === link.slug
                                        ? 'bg-violet-600/20 text-violet-300 border border-violet-500/20'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                                }`}
                            >
                                <span>{link.name}</span>
                                {currentSlug === link.slug && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm min-h-[70vh]">
                    <h1 className="text-2xl font-bold text-white mb-2">{pageTitle}</h1>
                    <div className="w-12 h-0.5 bg-violet-500/60 rounded-full mb-6" />
                    <div className="space-y-1">
                        {children}
                    </div>
                </div>
            </main>

        </div>
    );
};

export default DocsLayout;