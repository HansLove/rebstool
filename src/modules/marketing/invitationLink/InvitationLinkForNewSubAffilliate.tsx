/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { IFormData } from "@/interfaces/interface";
import { createSubAffiliateService } from "@/services/api";
import { useParams } from "react-router-dom";

import { 
  MdGroups, 
  MdAnalytics,
  MdVerified
} from "react-icons/md";
import { 
  IoMdMegaphone
} from "react-icons/io";
import { 
  FaEye, 
  FaEyeSlash, 
  FaUsers, 
  FaTools,
  FaRocket,
  FaShieldAlt,
  FaChartLine,
  FaLightbulb,
  FaHandshake
} from "react-icons/fa";
import Loading from "@/components/loaders/loading1/Loading";

export default function InvitationLinkForNewSubAffilliate() {
  const { code } = useParams<{ code: string }>();

  const [form, setFormData] = useState<IFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    code: code || "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Top Performer",
      content: "The tools and support provided helped me scale from $0 to $50k+ monthly revenue in just 3 months!",
      avatar: "👩‍💼"
    },
    {
      name: "Marcus Johnson",
      role: "Marketing Expert",
      content: "The marketing materials and community support are incredible. I've never felt more supported in my business journey.",
      avatar: "👨‍💻"
    },
    {
      name: "Elena Rodriguez",
      role: "Network Builder",
      content: "The training and mentorship program transformed how I approach affiliate marketing. Highly recommended!",
      avatar: "👩‍🎓"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (form.password !== form.confirmPassword) {
      setMessageType('error');
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form };
      const res = await createSubAffiliateService(payload);
      if (res.success) {
        setMessageType('success');
        setMessage(res.message);
      } else {
        setMessageType('error');
        setMessage(res.message || "Failed to create account.");
      }
    } catch (err: any) {
      console.error(err);
      setMessageType('error');
      setMessage(err|| "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-90"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
          <div className={`text-center text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <MdVerified className="text-yellow-400 mr-2" />
              <span className="text-sm font-medium">Exclusive Invitation</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                {code === 'swi' ? "Switzy's" : "Elite"} Network
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Unlock your potential with our comprehensive partner program. We provide everything you need to succeed.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                <FaRocket className="mr-2 text-yellow-400" />
                <span>Proven Tools</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                <FaUsers className="mr-2 text-green-400" />
                <span>Expert Community</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                <FaChartLine className="mr-2 text-blue-400" />
                <span>Real Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We don't just invite you to join - we provide complete support for your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <FaLightbulb className="text-4xl" />,
                title: "Expert Know-How",
                description: "Access to proven strategies, training materials, and insider knowledge from top performers",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: <FaTools className="text-4xl" />,
                title: "Professional Tools",
                description: "Complete suite of marketing tools, analytics dashboards, and automation systems",
                color: "from-blue-400 to-blue-600"
              },
              {
                icon: <IoMdMegaphone className="text-4xl" />,
                title: "Marketing Support",
                description: "Ready-to-use campaigns, creative assets, and ongoing marketing guidance",
                color: "from-purple-400 to-purple-600"
              },
              {
                icon: <MdGroups className="text-4xl" />,
                title: "Exclusive Groups",
                description: "Join private communities of successful partners and get direct access to mentors",
                color: "from-green-400 to-green-600"
              },
              {
                icon: <MdAnalytics className="text-4xl" />,
                title: "Performance Tracking",
                description: "Real-time analytics and reporting to optimize your strategies and maximize earnings",
                color: "from-indigo-400 to-indigo-600"
              },
              {
                icon: <FaHandshake className="text-4xl" />,
                title: "Personal Mentorship",
                description: "One-on-one guidance from experienced partners to accelerate your growth",
                color: "from-pink-400 to-pink-600"
              }
            ].map((benefit, idx) => (
              <div 
                key={idx} 
                className={`group p-8 rounded-2xl bg-gradient-to-br ${benefit.color} text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              >
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-white/90 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">Hear from our successful partners</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="text-center">
                <div className="text-6xl mb-4">{testimonials[currentTestimonial].avatar}</div>
                <blockquote className="text-xl md:text-2xl text-gray-700 mb-6 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div>
                  <div className="font-bold text-lg text-gray-900">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands of successful partners and start your journey today
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-xl">
              {message && (
                <div
                  className={`p-4 rounded-xl mb-6 ${
                    messageType === 'error' 
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : 'bg-green-100 text-green-700 border border-green-200'
                  }`}
                >
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-11 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute top-11 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loading />
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={form.password.length < 4 || form.password !== form.confirmPassword}
                    className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 ${
                      form.password.length < 4 || form.password !== form.confirmPassword
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                    } text-white`}
                  >
                    <span className="flex items-center justify-center">
                      <FaRocket className="mr-2" />
                      Join the Network
                    </span>
                  </button>
                )}

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    <FaShieldAlt className="inline mr-1" />
                    Your data is secure and protected by enterprise-grade security
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Don't Miss This Opportunity
          </h3>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Limited spots available. Join now and start your journey to financial freedom with our complete support system.
          </p>
        </div>
      </div>
    </div>
  );
}



// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { IFormData } from "@/interfaces/interface";
// import { createSubAffiliateService } from "@/services/api";
// // import Loading from "../../components/loaders/loading1/Loading";
// import { useParams } from "react-router-dom";

// import { MdPayment } from "react-icons/md";
// import { IoMdDocument } from "react-icons/io";
// import { GiTeamUpgrade } from "react-icons/gi";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import Loading from "@/components/loaders/loading1/Loading";

// export default function InvitationLinkForNewSubAffilliate() {
//   const { code } = useParams<{ code: string }>();

//   const [form, setFormData] = useState<IFormData>({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     code: code || "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const [messageType, setMessageType] = useState<'error' | 'success'>('error');

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage(null);

//     if (form.password !== form.confirmPassword) {
//       setMessageType('error');
//       setMessage("Passwords do not match");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = { ...form };
//       const res = await createSubAffiliateService(payload);
//       if (res.success) {
//         setMessageType('success');
//         setMessage(res.message);
//       } else {
//         setMessageType('error');
//         setMessage(res.message || "Failed to create account.");
//       }
//     } catch (err: any) {
//       console.error(err);
//       setMessageType('error');
//       setMessage(err|| "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">
//       {/* Left Panel */}
//       <div className="relative md:w-1/2 text-white p-8 flex items-center overflow-hidden">
//         <div
//           className="absolute inset-0 bg-cover bg-center bg-black"
//           // style={{ backgroundImage: "url('/assets/images/calltoaction.webp')" }}
//           style={{ backgroundImage: code=='swi'?"url('https://switzyman.com/images/whoimg.webp')":code=='aman-n'?"url('https://amannatt.com/_next/image?url=%2Fimg%2Fnatt.png&w=1920&q=75')":"url('/assets/images/calltoaction.webp')" }}
//           />
//         <div className="absolute inset-0 bg-slate-800/50" />
//         <div className="relative z-10 max-w-md mx-auto">
//           <h1 className="text-3xl md:text-4xl font-bold mb-4">
//             You're joining {code=='swi'?"Switzy's exclusive community":'an exclusive community'}
//           </h1>
//           <p className="text-lg mb-6">
//             Earn weekly crypto rewards by participating, sharing, and growing the network.
//           </p>
//           <div className="grid gap-8 lg:grid-cols-3">
//             {[
//               { icon: <MdPayment />, label: 'Weekly Payments' },
//               { icon: <IoMdDocument />, label: 'Smart Contracts' },
//               { icon: <GiTeamUpgrade />, label: 'Growing Community' }
//             ].map((item, idx) => (
//               <div key={idx} className="sm:text-center">
//                 <div className={`flex items-center justify-center w-24 h-24 mb-4 text-5xl rounded-full ${code=='swi'?"bg-blue-600":"bg-purple-500"}  sm:mx-auto`}>
//                   {item.icon}
//                 </div>
//                 <h6 className="mb-2 font-semibold leading-5">{item.label}</h6>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right Panel - Form */}
//       <div className="md:w-1/2 bg-white p-8 flex items-center">
//         <div className="max-w-md mx-auto w-full">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">Create your account</h2>
//           {message && (
//             <div
//               className={`p-3 rounded mb-4 ${messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
//             >
//               {message}
//             </div>
//           )}
//           <form onSubmit={handleSubmit} className="space-y-6 relative">
//             {/* Full Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your full name"
//                 className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             {/* Email Address */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 required
//                 placeholder="you@example.com"
//                 className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Password */}
//             <div className="relative">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your password"
//                 className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
//               />
//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute top-10 right-3 cursor-pointer text-gray-500"
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>

//             {/* Confirm Password */}
//             <div className="relative">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//               <input
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 name="confirmPassword"
//                 value={form.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 placeholder="Confirm your password"
//                 className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
//               />
//               <span
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute top-10 right-3 cursor-pointer text-gray-500"
//               >
//                 {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>

//             {loading? <Loading/>
//             :<button
//               type="submit"
//               disabled={form.password.length < 4&&form.password!=form.confirmPassword }
//               className={`w-full ${(form.password.length < 4||form.password!=form.confirmPassword )? 'bg-slate-500' : 'bg-blue-600'} hover:opacity-90 text-white py-3 rounded-lg font-semibold transition`}
//             >
//               Create Account
//             </button>}

//             <p className="text-xs text-gray-500 text-center mt-4">
//               Your data is secure and payments are handled via smart contracts.
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
