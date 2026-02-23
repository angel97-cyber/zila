import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="font-bold text-xl tracking-tight text-slate-900">ZILA & WALLS</div>
        <Link href="/" className="text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors">
          ← Back to App
        </Link>
      </header>

      <main className="max-w-3xl mx-auto p-8 md:p-12 bg-white mt-8 rounded-2xl shadow-sm border border-slate-100 mb-12">
        <h1 className="text-3xl font-black mb-2 text-slate-900">Privacy Policy</h1>
        <p className="mb-8 text-sm text-slate-500 font-medium">Last Updated: February 2026</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900 border-b pb-2">1. Introduction</h2>
            <p>
              This Privacy Policy applies to the software suite developed by Er. Angel Mainali, which currently includes <strong>ZILA</strong> (a construction cost estimator web app) and <strong>WALLS</strong> (a browser chat extension). We respect your privacy and are committed to protecting your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900 border-b pb-2">2. Data We Collect</h2>
            
            <h3 className="font-bold text-slate-800 mt-4 mb-2">A. For ZILA (Web App)</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Project Data:</strong> We collect the district, floor count, and area you input to generate accurate construction estimates.</li>
              <li><strong>Payment Verification:</strong> If you purchase a premium report, we securely collect your phone number and eSewa transaction ID strictly to verify the payment and unlock your document.</li>
            </ul>

            <h3 className="font-bold text-slate-800 mt-6 mb-2">B. For WALLS (Chrome Extension)</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>URL Data:</strong> We detect the hostname of the tab you are visiting to load the correct global chat room.</li>
              <li><strong>User Content:</strong> Messages you send are stored securely in our database.</li>
              <li><strong>Anonymous IDs:</strong> We assign a random anonymous ID (e.g., &quot;Solar Falcon&quot;) to your browser to keep chats anonymous.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900 border-b pb-2">3. How We Use Your Data</h2>
            <p>
              We use this data solely to provide the core functionality of our applications (delivering PDF reports and global chat messages). 
              <strong>We do not sell, trade, or rent your personal identification or phone numbers to third parties.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900 border-b pb-2">4. Data Storage & Security</h2>
            <p>
              All data is stored securely using Supabase (a secure, enterprise-grade backend). 
              All communication between your device and our database is encrypted via modern HTTPS protocols.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900 border-b pb-2">5. Contact the Developer</h2>
            <p>
              If you have any questions regarding this policy, the apps, or business inquiries, please contact me directly at: 
              <a href="mailto:er.angel.mainali@gmail.com" className="text-emerald-600 font-bold ml-1 hover:underline">er.angel.mainali@gmail.com</a>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}