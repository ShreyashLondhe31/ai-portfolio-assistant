export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center text-center px-6">
            <div className="space-y-4">

                <h1 className="text-7xl font-bold">404</h1>

                <p className="text-gray-400">
                    The page you're looking for doesn’t exist.
                </p>

                <a
                    href="/"
                    className="inline-block mt-4 bg-white text-black px-6 py-3 rounded-lg font-medium hover:scale-105 transition"
                >
                    Back to Portfolio
                </a>

            </div>
        </div>
    );
}