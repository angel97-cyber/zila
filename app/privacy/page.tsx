import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="font-bold text-xl tracking-tight text-slate-900">ZILA</div>
        <Link href="/" className="text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors">
          ← Back to Estimator
        </Link>
      </header>

      <main className="max-w-3xl mx-auto p-8 md:p-12 bg-white mt-8 rounded-2xl shadow-sm border border-slate-100 mb-12">
        <h1 className="text-3xl font-black mb-2 text-slate-900">Privacy Policy</h1>
        <p className="mb-8 text-sm text-slate-500 font-medium">Last Updated: March 2026</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900 border-b pb-2">1. Introduction</h2>
            <p>
              This Privacy Policy applies to <strong>ZILA</strong> — a preliminary construction cost estimator web application developed by Er. Angel Mainali (NEC Registered Civil Engineer, Kathmandu, Nepal). We respect your privacy and are committed to protecting your data. ZILA is a planning tool designed to help Nepali homeowners understand their construction costs before engaging contractors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900 border-b pb-2">2. Data We Collect</h2>

            <h3 className="font-bold text-slate-800 mt-4 mb-2">Project Estimation Data</h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li><strong>Estimation Inputs:</strong> We collect the district, floor count, area, structure type, and finish quality you enter to generate your preliminary cost estimate. This data powers the calculation engine.</li>
              <li><strong>Payment Verification:</strong> If you purchase a detailed Preliminary BOQ Report, we securely collect your name, phone number, and eSewa transaction ID strictly to verify the payment and unlock your document. This information is not used for any other purpose.</li>
            </ul>

            <h3 className="font-bold text-slate-800 mt-4 mb-2">What We Do Not Collect</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>We do not collect your location, browsing history, or device information beyond what is necessary to serve the web application.</li>
              <li>We do not use tracking pixels, third-party advertising scripts, or behavioral analytics.</li>
              <li>We do not sell, trade, or rent your personal information to any third party.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900 border-b pb-2">3. How We Use Your Data</h2>
            <p>
              We use data solely to provide the core functionality of the ZILA web application — generating and delivering your Preliminary BOQ Report. Your phone number is used only for payment verification and, if needed, to contact you regarding your report. <strong>We do not use your data for marketing, profiling, or any purpose beyond your estimate request.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900 border-b pb-2">4. Important Disclaimer</h2>
            <p>
              ZILA generates <strong>Preliminary Cost Estimates</strong> for planning and budgeting purposes only. The estimates are based on current district-level market data and NBC 105:2025 structural guidelines. They are <strong>not certified engineering valuations</strong> and should not be submitted to financial institutions as formal documents. Always engage a licensed professional engineer for final project assessment and municipal approvals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900 border-b pb-2">5. Data Storage & Security</h2>
            <p>
              All data is stored securely using Supabase (enterprise-grade, ISO 27001 compliant backend infrastructure). All communication between your device and our servers is encrypted via HTTPS. Report data is retained for 90 days from the date of generation, after which it is automatically purged from active records.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900 border-b pb-2">6. Contact the Developer</h2>
            <p>
              If you have any questions regarding this policy, wish to request deletion of your data, or have business inquiries, please contact directly at:
              <a href="mailto:er.angel.mainali@gmail.com" className="text-emerald-600 font-bold ml-1 hover:underline">er.angel.mainali@gmail.com</a>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}