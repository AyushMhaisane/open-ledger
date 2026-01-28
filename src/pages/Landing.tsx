import React from 'react';
import { 
  ArrowRight, 
  Building2, 
  Receipt, 
  Users, 
  PlayCircle, 
  CheckCircle2, 
  Github,
  LayoutDashboard
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-secondary font-sans selection:bg-primary selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-border bg-white/80 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-indigo-200">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">OpenLedger</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/YOUR_USERNAME/open-ledger" 
              target="_blank"
              className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors mr-2"
            >
              <Github className="w-4 h-4" />
              <span className="hidden md:inline">Star on GitHub</span>
            </a>
            
            <button className="text-slate-600 hover:text-primary font-medium text-sm px-4 py-2 transition-colors">
              Sign In
            </button>
            <button className="bg-secondary hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-slate-200 hover:shadow-xl transition-all transform hover:-translate-y-0.5">
              Create Free Account
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16 px-4 sm:px-6">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-primary text-sm font-semibold mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            100% Open Source & Free to Use
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 leading-tight">
            The automated manager for <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">
              Hostels, PGs & Apartments.
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop chasing rent payments on WhatsApp. OpenLedger tracks who lives where, 
            generates invoices automatically, and gives you a professional dashboard.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="h-14 px-8 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-lg shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 flex items-center gap-2 w-full sm:w-auto justify-center">
              Start Managing Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="h-14 px-8 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-lg transition-all shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center group">
              <PlayCircle className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
              See How It Works
            </button>
          </div>
        </div>

        {/* How It Works (New Section) */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="text-center mb-10">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Simple Workflow</h2>
            <h3 className="text-2xl font-bold text-slate-900">From Chaos to Control in 3 Steps</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 -z-10"></div>

            {[
              { 
                step: "01", 
                title: "Add Property", 
                desc: "Define your building layout, from single flats to 100-bed hostels.",
                icon: <Building2 className="w-6 h-6 text-primary" /> 
              },
              { 
                step: "02", 
                title: "Assign Tenants", 
                desc: "Add occupants to units. Set their rent amount and billing cycle.",
                icon: <Users className="w-6 h-6 text-primary" /> 
              },
              { 
                step: "03", 
                title: "Auto-Bill", 
                desc: "The system generates monthly invoices and tracks payment status automatically.",
                icon: <Receipt className="w-6 h-6 text-primary" /> 
              }
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center bg-white p-6 rounded-2xl border border-white hover:border-indigo-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  {item.icon}
                </div>
                <div className="absolute top-6 right-6 text-slate-100 font-black text-4xl -z-10 select-none group-hover:text-indigo-50 transition-colors">
                  {item.step}
                </div>
                <h4 className="font-bold text-lg mb-2 text-slate-800">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Grid (Refined Language) */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<LayoutDashboard />}
              title="One Dashboard, Any Property"
              desc="Whether you run a PG, rent out apartments, or manage a warehouse, customize your units to fit your needs."
            />
            <FeatureCard 
              icon={<Receipt />}
              title="Smart Utility Billing"
              desc="Don't just charge rent. Add electricity meter readings or one-time service charges to any invoice easily."
            />
            <FeatureCard 
              icon={<CheckCircle2 />}
              title="Tenant Portals (Coming Soon)"
              desc="Give your tenants a professional login to view their dues, download receipts, and raise complaints."
            />
          </div>
        </div>
      </main>
      
      {/* Footer Simple */}
      <footer className="border-t border-border mt-12 py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} OpenLedger. Open Source under MIT License.</p>
      </footer>
    </div>
  );
}

// Reusable Component for cleaner code
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 group cursor-default">
      <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}