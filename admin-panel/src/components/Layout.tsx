export const Layout = ({ children }: { title: string; children: any }) => {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex">
                            <div className="">
                                <a href="/">
                                    <span className={`text-md ${location.pathname === '/' ? 'font-bold' : 'font-normal'} text-gray-900`}>
                                        something - admin panel
                                    </span>
                                </a>
                            </div>
                            <nav className="">
                                <a href="/requests" className={`text-gray-gray-700 hover:text-black px-3 py-2 text-md ${location.pathname.startsWith('/request') ? 'font-bold' : 'font-medium'}`}>
                                    type change requests
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>


            {/* Main content */}
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};