import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  WashingMachine, 
  Package, 
  Clock, 
  ShieldCheck, 
  Banknote,
  Search,
  Shirt,
  Sparkles,
  Droplets,
  Wind,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Users,
  Star,
  Plus
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCTA = () => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 overflow-x-hidden selection:bg-primary/20 selection:text-primary transition-colors duration-200">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-200">
        {/* Background Gradients & Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 rounded-[100%] blur-3xl -z-10"></div>
        <div className="absolute top-20 right-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Hero Text */}
            <div className="max-w-2xl animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20">
                <Sparkles size={16} /> The #1 Laundry Service for Students
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
                Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Laundry</span> Service
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 font-medium mb-4 leading-relaxed">
                Fast, reliable, and hassle-free laundry management for students.
              </p>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-lg">
                Our laundry management system helps you schedule pickups, track your laundry progress, and receive clean clothes without any hassle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleCTA} className="px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
                  Schedule Laundry 
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={handleCTA} className="px-8 py-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-lg hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                  <Search size={20} className="text-primary" /> Track My Orders
                </button>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative flex items-center justify-center lg:justify-end animate-fade-in lg:animate-fade-in-right">
              <div className="relative w-full max-w-lg aspect-square">
                {/* Main Machine Container */}
                <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 p-8 flex flex-col items-center justify-center relative overflow-hidden group transition-colors duration-200">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] z-0"></div>
                  
                  {/* Decorative Bubbles */}
                  <div className="absolute right-12 top-12 w-4 h-4 rounded-full bg-secondary/40 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute left-16 top-24 w-6 h-6 rounded-full bg-primary/30 animate-bounce" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute right-24 bottom-20 w-8 h-8 rounded-full bg-sky-200/50 animate-bounce" style={{animationDelay: '0.8s'}}></div>
                  
                  <WashingMachine size={180} className="text-primary z-10 drop-shadow-lg group-hover:scale-105 transition-transform duration-500" strokeWidth={1} />
                  
                  {/* Internal spinning clothes abstraction */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-24 h-24  flex items-center justify-center z-20">
                    <Shirt size={48} className="text-secondary animate-pulse absolute" />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -left-8 top-12 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center gap-4 animate-float">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Order Ready</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Just now</p>
                  </div>
                </div>

                <div className="absolute -right-8 bottom-12 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col gap-2 animate-float" style={{animationDelay: '1.5s'}}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Package className="text-primary" size={20} />
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">Basket</div>
                  </div>
                  <div className="flex gap-1 justify-center mt-1">
                    <Shirt size={16} className="text-slate-400" />
                    <Shirt size={16} className="text-slate-500" />
                    <Shirt size={16} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE OUR LAUNDRY */}
      <section className="py-24 bg-white dark:bg-slate-900 relative transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-2">Features</h2>
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Why Choose Our Laundry</h3>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Experience premium garment care with our student-focused features designed for ultimate convenience.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Fast Pickup', desc: 'Schedule your laundry pickup in seconds directly from your dorm.', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-100' },
              { title: 'Live Tracking', desc: 'Track your laundry status from washing to delivery in real-time.', icon: Search, color: 'text-blue-600', bg: 'bg-blue-100' },
              { title: 'Affordable Pricing', desc: 'Student-friendly laundry services that won\'t break the bank.', icon: Banknote, color: 'text-green-600', bg: 'bg-green-100' },
              { title: 'Secure & Reliable', desc: 'Safe handling of delicate clothes and guaranteed on-time delivery.', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} dark:bg-opacity-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={feature.color} size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-secondary font-semibold tracking-wide uppercase text-sm mb-2">Process</h2>
            <h3 className="text-4xl font-bold tracking-tight mb-4">How It Works</h3>
            <p className="text-lg text-slate-400">Five simple steps to fresh, clean clothes.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-0.5 bg-slate-800 z-0">
              <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-primary to-secondary opacity-50"></div>
            </div>

            {[
              { step: 1, title: 'Place Request', icon: Package },
              { step: 2, title: 'Pickup', icon: Clock },
              { step: 3, title: 'Wash & Dry', icon: WashingMachine },
              { step: 4, title: 'Ready', icon: CheckCircle },
              { step: 5, title: 'Collect', icon: Shirt }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300 relative shadow-xl">
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-white font-bold flex items-center justify-center border-4 border-slate-900 text-sm">
                    {item.step}
                  </div>
                  <item.icon size={40} className="text-slate-300 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-bold text-slate-100">{item.title}</h4>
                <p className="text-sm text-slate-400 mt-2 px-2">Step {item.step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LAUNDRY SERVICES */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 relative transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-2">Our Offerings</h2>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">Premium Laundry Services</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                We handle every garment with care, using professional-grade machines and eco-friendly detergents to ensure the best results.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: 'Regular Wash', icon: Droplets, desc: 'Everyday clothes washed and neatly folded.' },
                  { title: 'Dry Cleaning', icon: Sparkles, desc: 'Professional care for delicate garments & suits.' },
                  { title: 'Ironing Service', icon: Wind, desc: 'Crisp, wrinkle-free pressing for your clothes.' },
                  { title: 'Express Laundry', icon: Clock, desc: 'Same-day turnaround for urgent requirements.' }
                ].map((service, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <service.icon className="text-primary" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">{service.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl origin-center group">
               {/* Abstract background representation of services */}
               <div className="absolute inset-0 bg-gradient-to-tr from-primary to-sky-400"></div>
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/10 backdrop-blur-md border-t border-white/20"></div>
               
               {/* Decorative floating icons */}
               <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-float">
                  <Shirt size={64} className="text-white" />
               </div>
               <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-float" style={{animationDelay: '1s'}}>
                  <Droplets size={48} className="text-white" />
               </div>
               <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-float" style={{animationDelay: '2s'}}>
                  <Wind size={32} className="text-white" />
               </div>
               
               {/* Glass UI Card inside */}
               <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/50 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-bold text-primary mb-1">Service Quality</p>
                      <h4 className="text-xl font-extrabold text-slate-900">100% Guaranteed</h4>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <ShieldCheck size={24} className="text-green-600" />
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-secondary h-full w-[100%]"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STATISTICS SECTION */}
      <section className="py-20 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Orders Processed', value: '500+', icon: TrendingUp },
              { label: 'Happy Students', value: '300+', icon: Users },
              { label: 'Service Time', value: '24hr', icon: Clock },
              { label: 'Satisfaction Rate', value: '99%', icon: Star }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-4 text-secondary dark:text-sky-400">
                  <stat.icon size={24} />
                </div>
                <h4 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{stat.value}</h4>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary dark:bg-primary/50 z-0 transition-colors duration-200"></div>
        {/* Subtle patterned background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent bg-[length:24px_24px] z-0"></div>
        
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-8">
            Ready to Schedule Your Laundry?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium">
            Join hundreds of students who have already simplified their laundry routine. Create an account and place your first order today.
          </p>
          <button onClick={handleCTA} className="px-10 py-5 rounded-2xl bg-white dark:bg-slate-800 text-primary dark:text-white font-extrabold text-lg shadow-2xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mx-auto">
            <Plus size={24} strokeWidth={3} /> Add New Laundry Request
          </button>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-900 pt-16 pb-8 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 text-white mb-6">
                <div className="bg-primary p-2 rounded-lg">
                  <WashingMachine size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight">ASAP Laundry</span>
              </div>
              <p className="mb-6 max-w-sm leading-relaxed">
                Smart, reliable, and efficient laundry management designed exclusively for students. We take the hassle out of laundry.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Quick Links</h4>
              <ul className="space-y-4 font-medium">
                <li><button onClick={handleCTA} className="hover:text-primary transition-colors">Dashboard</button></li>
                <li><button onClick={handleCTA} className="hover:text-primary transition-colors">Track Orders</button></li>
                <li><button onClick={handleCTA} className="hover:text-primary transition-colors">Pricing</button></li>
                <li><button onClick={handleCTA} className="hover:text-primary transition-colors">Support</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Contact</h4>
              <ul className="space-y-4 font-medium">
                <li>hello@asaplaundry.com</li>
                <li>+1 (555) 123-4567</li>
                <li>Student Union Building, Rm 104</li>
              </ul>
            </div>
            
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© {new Date().getFullYear()} ASAP Laundry. All rights reserved.</p>
            <div className="flex gap-6 text-sm font-medium">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
