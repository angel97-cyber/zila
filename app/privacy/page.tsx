export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy for WALLS</h1>
      <p className="mb-4 text-sm text-gray-500">Last Updated: February 2026</p>

      <h2 className="text-xl font-bold mt-6 mb-2">1. Introduction</h2>
      <p className="mb-4">
        WALLS ("we", "our", or "us") operates as a browser extension allowing users to chat on specific URLs. 
        We respect your privacy and are committed to protecting your personal data.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-2">2. Data We Collect</h2>
      <p className="mb-2">We collect and store the following data to make the service function:</p>
      <ul className="list-disc pl-5 mb-4">
        <li><strong>URL Data:</strong> We detect the hostname (e.g., google.com) of the tab you are visiting to load the correct chat room.</li>
        <li><strong>User Generated Content:</strong> Messages you type and send are stored in our database.</li>
        <li><strong>Generated IDs:</strong> We assign a random anonymous ID (e.g., "Solar Falcon") to your browser local storage.</li>
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-2">3. How We Use Data</h2>
      <p className="mb-4">
        We use this data solely to display chat messages to other users on the same URL. 
        <strong>We do not sell, trade, or rent your personal identification information to others.</strong>
      </p>

      <h2 className="text-xl font-bold mt-6 mb-2">4. Data Storage</h2>
      <p className="mb-4">
        Data is stored securely using Supabase (a secure backend-as-a-service). 
        All communication between the extension and our database is encrypted via HTTPS.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-2">5. Contact</h2>
      <p className="mb-4">
        If you have questions about this policy, please contact us at: er.angel.mainali@gmail.com
      </p>
    </div>
  );
}