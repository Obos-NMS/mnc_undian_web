import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-base font-semibold text-brand/600">404</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-light/900 sm:text-5xl">Page not found</h1>
                    <p className="mt-4 text-base leading-7 text-gray-light/600">Sorry, we couldn’t find the page you’re looking for.</p>
                    <div className="mt-8 flex items-center justify-center gap-x-6">
                        <Link to="/dashboard" className={`bg-brand/600 text-white text-center shadow-shadows/shadow-xs text-md-semibold px-4 py-2.5 w-full rounded-lg`}>
                            Go back home
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NotFound;