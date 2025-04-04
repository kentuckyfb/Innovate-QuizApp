// src/components/ErrorFallback.tsx

export function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Connection Error
        </h1>
        <p className="mb-4">
          Unable to connect to the backend service. Please check your connection
          settings.
        </p>
        <div className="bg-gray-100 p-4 rounded mb-4">
          <p className="text-sm font-mono">
            Make sure the <code>.env</code> file exists in the project root
            with:
          </p>
          <pre className="bg-gray-800 text-white p-2 rounded mt-2 overflow-x-auto text-xs">
            VITE_SUPABASE_URL=https://your-project-id.supabase.co
            <br />
            VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
          </pre>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}
