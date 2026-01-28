import React from 'react';
import { 
  ArrowRight, 
  Building2, 
  Receipt, 
  Users, 
  PlayCircle, 
  CheckCircle2, 
  Github,
  LayoutDashboard,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Background Grid Pattern - Adds texture to empty space */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
      </div>

      {/* Navbar - Glass Effect */}
      <nav className="fixed w-full z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">OpenLedger</span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/YOUR_USERNAME/open-ledger" 
              target="_blank"
              className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors px-3 py-2 rounded-md hover:bg-indigo-50"
            >
              <Github className="w-4 h-4" />
              <span className="hidden md:inline">Star on GitHub</span>
            </a>
            
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <button className="text-slate-600 hover:text-slate-900 font-medium text-sm px-4 py-2 transition-colors">
              Log In
            </button>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
        
        {/* HERO SECTION */}
        <div className="max-w-7xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v1.0 Public Beta &middot; Open Source
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 leading-[1.1]">
            Property management <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
              without the chaos.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            OpenLedger replaces your spreadsheets with a unified dashboard for <span className="font-semibold text-slate-800">Hostels, PGs, and Apartments</span>. Track dues, automate bills, and manage tenants.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="h-12 px-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
              Start Managing Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="h-12 px-8 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2 w-full sm:w-auto justify-center">
              <PlayCircle className="w-5 h-5 text-indigo-500" />
              Watch Demo
            </button>
          </div>

          {/* VISUAL ANCHOR: CSS Mockup Dashboard */}
          <div className="relative max-w-5xl mx-auto mt-16 perspective-1000">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl blur opacity-20"></div>
            <div className="relative bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
              {/* Mock Browser Header */}
              <div className="bg-slate-50 border-b border-slate-200 h-10 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="mx-auto bg-white border border-slate-200 px-3 py-1 rounded text-xs text-slate-400 font-mono w-64 text-center">
                  app.openledger.com/dashboard
                </div>
              </div>
              
              {/* Mock Dashboard Content (Abstract Representation) */}
              <div className="p-6 grid grid-cols-4 gap-6 bg-slate-50/50">
                {/* Sidebar */}
                <div className="col-span-1 hidden md:block space-y-4">
                  <div className="h-8 w-32 bg-slate-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-slate-200 rounded opacity-60"></div>
                    <div className="h-4 w-3/4 bg-slate-200 rounded opacity-60"></div>
                    <div className="h-4 w-5/6 bg-slate-200 rounded opacity-60"></div>
                  </div>
                </div>
                {/* Main Content */}
                <div className="col-span-4 md:col-span-3 space-y-6">
                  <div className="flex justify-between">
                    <div className="h-8 w-48 bg-slate-200 rounded"></div>
                    <div className="h-8 w-24 bg-indigo-100 rounded"></div>
                  </div>
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-white rounded-lg border border-slate-200 shadow-sm p-4">
                      <div className="h-4 w-12 bg-indigo-100 rounded mb-2"></div>
                      <div className="h-8 w-20 bg-slate-800 rounded"></div>
                    </div>
                    <div className="h-24 bg-white rounded-lg border border-slate-200 shadow-sm p-4">
                       <div className="h-4 w-12 bg-emerald-100 rounded mb-2"></div>
                       <div className="h-8 w-20 bg-slate-800 rounded"></div>
                    </div>
                    <div className="h-24 bg-white rounded-lg border border-slate-200 shadow-sm p-4">
                       <div className="h-4 w-12 bg-amber-100 rounded mb-2"></div>
                       <div className="h-8 w-20 bg-slate-800 rounded"></div>
                    </div>
                  </div>
                  {/* Table Mock */}
                  <div className="h-48 bg-white rounded-lg border border-slate-200 shadow-sm"></div>
                </div>
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -right-4 -bottom-4 bg-white p-4 rounded-lg shadow-xl border border-slate-100 hidden md:block animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Rent Collected</p>
                  <p className="text-sm font-bold text-slate-900">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: DARKER BACKGROUND FOR CONTRAST */}
        <div className="relative py-24 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
          <div className="max-w-5xl mx-auto">
             <div className="text-center mb-16">
              <h2 className="text-base font-bold text-indigo-600 uppercase tracking-widest mb-2">Powerful Features</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Everything you need to run your property.</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<LayoutDashboard />}
                title="Unified Dashboard"
                desc="See occupancy rates, pending dues, and maintenance requests in one high-density view."
              />
              <FeatureCard 
                icon={<Receipt />}
                title="Automated Billing"
                desc="Generate invoices on the 1st of every month. Add electricity readings and send via WhatsApp."
              />
              <FeatureCard 
                icon={<ShieldCheck />}
                title="Role-Based Access"
                desc="Admins get full control. Managers get limited access. Tenants see only their own data."
              />
               <FeatureCard 
                icon={<Building2 />}
                title="Multi-Property"
                desc="Manage a hostel in Pune and an apartment in Mumbai from the same account."
              />
               <FeatureCard 
                icon={<Zap />}
                title="Meter Recording"
                desc="Input start/end meter readings and let the system calculate the bill based on unit rates."
              />
               <FeatureCard 
                icon={<Users />}
                title="Tenant History"
                desc="Keep a permanent digital record of every tenant, their documents, and payment history."
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: HOW IT WORKS */}
        <div className="max-w-5xl mx-auto py-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900">Get setup in minutes</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-0.5 bg-slate-200 -z-10"></div>

            {[
              { step: "1", title: "Create Property", desc: "Define your building & units." },
              { step: "2", title: "Add Tenants", desc: "Invite them via email or link." },
              { step: "3", title: "Collect Rent", desc: "Auto-generate monthly bills." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group cursor-default">
                <div className="w-16 h-16 bg-white border-2 border-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:border-indigo-600 group-hover:scale-110 transition-all duration-300 z-10">
                  <span className="text-2xl font-bold text-indigo-600">{item.step}</span>
                </div>
                <h4 className="font-bold text-lg mb-2 text-slate-900">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed max-w-[250px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">O</span>
              </div>
              <span className="font-bold text-lg text-white">OpenLedger</span>
            </div>
            <p className="text-sm max-w-xs">
              Open source property management for the modern landlord. Built with love by the community.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Features</li>
              <li className="hover:text-white cursor-pointer">Documentation</li>
              <li className="hover:text-white cursor-pointer">Pricing (Free)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
             <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Privacy</li>
              <li className="hover:text-white cursor-pointer">Terms</li>
              <li className="hover:text-white cursor-pointer">GitHub</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 border-t border-slate-800 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} OpenLedger. Released under MIT License.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group">
      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-base mb-2 text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}