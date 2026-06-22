export default function BlockPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md bg-white p-8 rounded-xl shadow text-center">
          <h1 className="text-3xl font-bold mb-4">
            🚫 Out of Focus Credits
          </h1>
  
          <p className="text-gray-600 mb-2">
            Earn your scroll.
          </p>
  
          <p className="font-semibold mb-2">
            You have 0 credits remaining.
          </p>
  
          <p className="text-gray-500">
            Complete a focus session to continue using social media.
          </p>
        </div>
      </div>
    );
  }