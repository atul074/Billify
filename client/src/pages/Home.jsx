import { useState, useEffect, useRef } from "react";
import { FaBars, FaPaintBrush,FaPhone, FaEnvelope, FaGithub, FaLinkedin, FaChartBar, FaShoppingCart, FaBox, FaFileInvoice, FaBell, FaPlay, FaStar, FaLightbulb, FaCrown, FaRocket, FaPrint, FaMapMarked, FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { useNavigate } from 'react-router-dom';

// Screenshot imports
import AnalyticsScreenshot from '../assets/analytics.png';
import InvoiceScreenshot from '../assets/invoice.png';
import Step1Screenshot from '../assets/inventory.png';
import Step2Screenshot from '../assets/transaction.png';
import Step3Screenshot from '../assets/detail.png';

export default function HomePage() {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [activeDemo, setActiveDemo] = useState("analytics");
  const [hoveredStep, setHoveredStep] = useState(null);
  const [isHoveringDemo, setIsHoveringDemo] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const navItems = ['Home', 'Features', 'Demo', 'HowItWorks', 'Contact'];
  useEffect(() => {
    if (showSkeleton) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSkeleton]);
  
  // Enhanced glowing effect with performance fix
  useEffect(() => {
    let animationFrame;
    const glow = document.querySelector('.mouse-glow');
    
    const handleMouseMove = (e) => {
      if (!glow) return;
      
      // Use requestAnimationFrame for smoother performance
      animationFrame = requestAnimationFrame(() => {
        glow.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 font-sans overflow-hidden relative">
      {/* Enhanced Glowing Background Elements */}
      <div className="fixed inset-0 z- overflow-hidden">
        {/* Mouse Follow Glow - Fixed performance */}
        <div className="mouse-glow absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-blue-500/10 blur-[100px] pointer-events-none transform transition-transform duration-100 ease-out"></div>
        
        {/* Floating Particles - Reduced quantity */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400 "
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Floating Light Bulbs - Reduced quantity */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-teal-400"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 15 + 10}px`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, Math.random() * 15 - 7.5, 0],
              opacity: [0.4, 0.8, 0.4],
              rotate: [0, Math.random() * 180],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <FaLightbulb />
          </motion.div>
        ))}
        
        {/* Large Glowing Circles - Reduced intensity */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-500/50 rounded-full blur-[80px]"
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        ></motion.div>
        
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/15 rounded-full blur-[80px]"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        ></motion.div>
      </div>
      
      {/* Header with glass effect */}
      <motion.header 
        className="fixed w-full top-0 z-50 bg-gray-800/20 backdrop-blur-lg border-b border-white/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-5 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <FaCrown className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
              Billify
            </h1>
          </motion.div>
          
          <motion.nav 
            className="hidden md:flex gap-6 text-sm items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {['Home', 'Features', 'Demo', 'HowItWorks', 'Contact'].map((text) => (
              <Link
                key={text}
                to={text.toLowerCase()}
                smooth={true}
                duration={500}
                className="cursor-pointer hover:text-cyan-400 transition-colors"
              >
                {text}
              </Link>
            ))}
            <motion.button
  className="text-sm font-medium hover:text-cyan-400 transition-colors border border-cyan-500/30 px-4 py-2 rounded-lg relative overflow-hidden group"
  onClick={() => navigate('/login')}
  whileHover={{ 
    scale: 1.05,
    borderColor: "rgba(6, 182, 212, 0.5)",
    boxShadow: "0 0 10px rgba(6, 182, 212, 0.3)"
  }}
  whileTap={{ 
    scale: 0.98,
    borderColor: "rgba(6, 182, 212, 0.8)"
  }}
>
  <span className="relative z-10">Login</span>
  
  {/* Animated background elements */}
  <motion.span
    className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-teal-500/5"
    initial={{ opacity: 0 }}
    whileHover={{ opacity: 0.3 }}
    transition={{ duration: 0.3 }}
  />
  
  <motion.span
    className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-teal-400/10"
    animate={{
      x: ["-100%", "100%", "-100%"],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "linear",
    }}
  />
</motion.button>
            <motion.button 
              className="text-sm font-medium px-4 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white shadow-lg hover:shadow-cyan-500/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
            >
              Sign Up
            </motion.button>
          </motion.nav>
          <button 
          className="md:hidden text-white text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FaBars />
        </button>
        </div>

        {isMobileMenuOpen && (
        <motion.nav 
        className="flex flex-col gap-6 px-6 py-8 md:hidden bg-gray-900/90 backdrop-blur-lg rounded-t-2xl border-t border-gray-700/50 shadow-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {navItems.map((text) => (
          <Link
            key={text}
            to={text.toLowerCase()}
            className="text-white/90 hover:text-cyan-300 transition-all py-2 px-4 rounded-lg hover:bg-gray-800/60 hover:scale-[1.02] flex items-center gap-3"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            {text}
          </Link>
        ))}
        
        <div className="border-t border-gray-700/50 pt-4 mt-2">
          <button 
            onClick={() => {
              navigate('/login');
              setIsMobileMenuOpen(false);
            }}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-400/30 text-cyan-300 hover:text-white transition-all hover:shadow-cyan-500/20 hover:shadow-sm"
          >
            Login
          </button>
          
          <button 
            onClick={() => {
              navigate('/register');
              setIsMobileMenuOpen(false);
            }}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-400/90 hover:to-blue-500/90 text-white font-medium mt-4 transition-all hover:shadow-cyan-500/30 hover:shadow-md"
          >
            Sign Up
          </button>
        </div>
      </motion.nav>
      )}
      </motion.header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-16 container mx-auto px-5">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Revolutionize Your <span className="bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">Inventory & Billing</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl">
              Simplify sales, invoices, stock management, and reporting with one unified dashboard designed for modern businesses.
            </p>
            
            <motion.div
              className="flex flex-wrap gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button 
                className="px-6 py-3 bg-cyan-400 backdrop-blur border border-white/10 rounded-full text-white shadow-lg font-medium hover:bg-cyan-600 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
              >
      <FaRocket className="text-sm" /> Get Started
    </motion.button>
              <motion.button 
                className="px-6 py-3 bg-gray-800/30 backdrop-blur border border-white/10 rounded-full text-white shadow-lg font-medium hover:bg-gray-700/50 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlay className="text-sm" /> Watch Demo
              </motion.button>
            </motion.div>
            
            <div className="flex flex-wrap gap-6 mt-10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <FaStar className="text-cyan-400" />
                </div>
                <div>
                  <div className="font-bold">4.9/5</div>
                  <div className="text-sm text-gray-400">Customer Rating</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <FaChartBar className="text-cyan-400" />
                </div>
                <div>
                  <div className="font-bold">10K+</div>
                  <div className="text-sm text-gray-400">Daily Transactions</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-full h-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl blur-xl z-0"></div>
              <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl z-10 relative">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Welcome, t1</h3>
                  <div className="text-sm text-gray-400">Thursday, July 24, 2025</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <GlassCard title="View Analytics For" items={["AI Transactions", "Purchases", "Sales"]} />
                  <GlassCard 
                    title="Inventory Analytics" 
                    stats={[
                      { label: "Transactions", value: "81" },
                      { label: "Products", value: "158" },
                      { label: "Total Amount", value: "₹73,664" }
                    ]} 
                  />
                  <GlassCard title="Tool Transactions" items={["Product Quantity", "Amount (₹)"]} />
                </div>
                
                <div className="h-64 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
                  <img 
                    src={AnalyticsScreenshot} 
                    alt="Analytics Dashboard" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-gray-900/20 to-transparent">
        <div className="container mx-auto px-5 text-center">
          <motion.div
            className="inline-block mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold bg-cyan-500/10 text-cyan-400 px-4 py-1 rounded-full mb-3 inline-block">
              POWERFUL FEATURES
            </span>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              Everything You Need in One Platform
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Billify combines all essential business tools into a single, intuitive interface designed to save you time and money.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <FeatureCard 
              icon={<FaBox className="text-3xl text-cyan-400" />} 
              title="Inventory Management"
              items={[
                "Real-time stock tracking",
                "Low-stock alerts",
                "Batch and expiry tracking",
                "Supplier management"
              ]}
              delay={0.1}
            />
            
            <FeatureCard 
              icon={<FaChartBar className="text-3xl text-cyan-400" />} 
              title="Sales Analytics"
              items={[
                "Interactive dashboards",
                "Customizable reports",
                "Product performance",
                "Customer insights"
              ]}
              delay={0.2}
            />
            
            <FeatureCard 
              icon={<FaFileInvoice className="text-3xl text-cyan-400" />} 
              title="Custom Invoicing"
              items={[
                "Branded templates",
                "Logo integration",
                "Quick setup",
                "Direct printing"
              ]}
              delay={0.3}
            />
            
            <FeatureCard 
              icon={<FaBell className="text-3xl text-cyan-400" />} 
              title="Real-time Alerts"
              items={[
                "Transaction notifications",
                "Stock updates",
                "Promotional alerts",
                "System monitoring"
              ]}
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-gray-900/20 backdrop-blur-lg">
        <div className="container mx-auto px-5">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold mb-4">Experience the Billify Difference</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              See how our intuitive interface makes inventory management and invoicing effortless.
            </p>
          </motion.div>
          
          <div className="max-w-5xl mx-auto">
            {/* Demo Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-800/50 backdrop-blur rounded-full p-1 flex border border-white/10">
                <button 
                  className={`px-6 py-2 rounded-full transition-all ${activeDemo === "analytics" ? "bg-gradient-to-r from-teal-500 to-cyan-500" : "hover:bg-gray-700/50"}`}
                  onClick={() => setActiveDemo("analytics")}
                >
                  Analytics Dashboard
                </button>
                <button 
                  className={`px-6 py-2 rounded-full transition-all ${activeDemo === "invoice" ? "bg-gradient-to-r from-teal-500 to-cyan-500" : "hover:bg-gray-700/50"}`}
                  onClick={() => setActiveDemo("invoice")}
                >
                  Invoicing System
                </button>
              </div>
            </div>
            
            {/* Demo Content */}
            <motion.div 
  className="bg-gray-800/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl overflow-hidden relative"
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
  onMouseEnter={() => setIsHoveringDemo(true)}
  onMouseLeave={() => setIsHoveringDemo(false)}
>
  {!isHoveringDemo ? (
    // Skeleton UI
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-gray-700/30 rounded-xl p-6 h-64 animate-pulse"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700/30 rounded-xl p-4 h-32 animate-pulse"></div>
          <div className="bg-gray-700/30 rounded-xl p-4 h-32 animate-pulse"></div>
          <div className="bg-gray-700/30 rounded-xl p-4 h-32 animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-gray-700/30 rounded-xl p-6 h-48 animate-pulse"></div>
        <div className="bg-gray-700/30 rounded-xl p-6 h-48 animate-pulse"></div>
      </div>
    </div>
  ) : (
    // Actual Content
    activeDemo === "analytics" ? (
      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        {/* Main Image Container */}
        <div className="md:w-1/2 relative group">
          <div className="relative h-[500px] rounded-xl overflow-hidden border border-white/10">
            <img 
              src={AnalyticsScreenshot} 
              alt="Analytics Dashboard" 
              className="w-full h-full object-cover"
            />
            
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/20 p-6 flex flex-col justify-end">
              <div className="space-y-4">
                <div className="bg-cyan-500/10 backdrop-blur px-4 py-2 rounded-full w-max">
                  <h4 className="font-semibold text-lg text-cyan-400">Inventory Dashboard</h4>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <StatCard label="Transactions" value="81" />
                  <StatCard label="Products" value="158" />
                  <StatCard label="Total Amount" value="₹72,300" />
                </div>
                
                <div className="mt-4 text-gray-300 text-sm">
                  <p>Real-time analytics tracking inventory levels, sales performance, and business metrics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Side Content */}
        <div className="md:w-1/2 flex flex-col gap-6">
          <div className="bg-gray-800/30 backdrop-blur rounded-xl border border-white/10 p-6 flex-1">
            <h4 className="font-semibold text-lg mb-4">Key Metrics</h4>
            <div className="space-y-4">
              <MetricItem label="Daily Sales" value="₹42,560" trend="up" />
              <MetricItem label="New Customers" value="24" trend="up" />
              <MetricItem label="Conversion Rate" value="3.2%" trend="down" />
              <MetricItem label="Stock Alerts" value="8" trend="steady" />
            </div>
          </div>
          
          <div className="bg-teal-500/10 backdrop-blur rounded-xl border border-cyan-500/20 p-6 flex-1">
            <h4 className="font-semibold text-lg mb-4">Top Products</h4>
            <div className="space-y-3">
              <ProductItem name="Wireless Headphones" sales="42 units" revenue="₹189,000" />
              <ProductItem name="Smart Watch" sales="38 units" revenue="₹266,000" />
              <ProductItem name="USB-C Charger" sales="56 units" revenue="₹67,200" />
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex flex-col md:flex-row gap-8 items-stretch">
    {/* Main Invoice Template Showcase */}
    <div className="md:w-1/2 relative group">
      <div className="relative h-[500px] rounded-xl overflow-hidden border border-cyan-500/20 shadow-lg">
        <img 
          src={InvoiceScreenshot} 
          alt="Professional Invoice Template" 
          className="w-full h-full object-contain bg-gray-900"
        />
        
        {/* Animated Feature Highlights */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900 to-transparent p-6">
          <div className="flex flex-wrap gap-2">
            <motion.span 
              className="px-3 py-1 bg-cyan-500/10 backdrop-blur rounded-full text-cyan-400 text-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Branded Invoices
            </motion.span>
            <motion.span 
              className="px-3 py-1 bg-purple-500/10 backdrop-blur rounded-full text-purple-400 text-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
            >
              Custom Templates
            </motion.span>
            <motion.span 
              className="px-3 py-1 bg-teal-500/10 backdrop-blur rounded-full text-teal-400 text-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, delay: 0.2 }}
            >
              One-Click Print
            </motion.span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Features Panel */}
    <div className="md:w-1/2 flex flex-col gap-6">
      {/* Branding & Customization */}
      <motion.div 
        className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <FaPaintBrush className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">Branding & Customization</h4>
            <p className="text-gray-400 text-sm">Make invoices uniquely yours</p>
          </div>
        </div>
        <ul className="space-y-3 pl-2">
          <li className="flex items-center gap-2">
            <FaPaintBrush className="h-4 w-4 text-green-400 flex-shrink-0" />
            <span>Add your logo and brand colors</span>
          </li>
          <li className="flex items-center gap-2">
            <FaPaintBrush className="h-4 w-4 text-green-400 flex-shrink-0" />
            <span>Customize layouts and fields</span>
          </li>
          <li className="flex items-center gap-2">
            <FaPaintBrush className="h-4 w-4 text-green-400 flex-shrink-0" />
            <span>Save multiple template versions</span>
          </li>
        </ul>
      </motion.div>

      {/* Template Gallery */}
      <motion.div 
        className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <FaPaintBrush className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">Template Gallery</h4>
            <p className="text-gray-400 text-sm">Professionally designed templates</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {["Modern", "Classic", "Minimal"].map((style, idx) => (
            <motion.div
              key={style}
              className="aspect-[3/4] bg-gray-700/30 rounded-lg border border-white/10 flex items-center justify-center"
              whileHover={{ y: -5 }}
              transition={{ type: "spring" }}
            >
              <div className="text-center p-2">
                <div className="mx-auto bg-gray-600 rounded-full w-8 h-8 mb-2" />
                <span className="text-xs">{style}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Print & Export */}
      <motion.div 
        className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-xl border border-teal-500/20 p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-teal-500/10 rounded-lg">
            <FaPrint className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">Print & Export</h4>
            <p className="text-gray-400 text-sm">Share invoices effortlessly</p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="flex-1 py-2 px-3 bg-gray-700/50 hover:bg-teal-500/10 border border-white/10 rounded-lg text-sm transition-all">
            Print Directly
          </button>
          <button className="flex-1 py-2 px-3 bg-gray-700/50 hover:bg-teal-500/10 border border-white/10 rounded-lg text-sm transition-all">
            Save as PDF
          </button>
          <button className="flex-1 py-2 px-3 bg-gray-700/50 hover:bg-teal-500/10 border border-white/10 rounded-lg text-sm transition-all">
            Email to Client
          </button>
        </div>
      </motion.div>
    </div>
  </div>
    )
  )}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    {!isHoveringDemo && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-cyan-400 text-lg bg-gray-900/80 backdrop-blur px-4 py-2 rounded-full"
      >
        Hover to view demo
      </motion.div>
    )}
  </div>
</motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="howitworks" className="py-20 bg-gradient-to-b from-gray-900/20 to-transparent">
        <div className="container mx-auto px-5">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold bg-cyan-500/10 text-cyan-400 px-4 py-1 rounded-full mb-3 inline-block">
              STEP-BY-STEP GUIDE
            </span>
            <h3 className="text-3xl font-bold mb-4">How Billify Works</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our intuitive workflow makes inventory and billing management effortless
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Add Products",
                description: "Easily add products with details like SKU, price, and stock levels",
                skeleton: (
                  <div className="w-full h-full flex flex-col p-4">
                    <div className="bg-gray-700/50 h-4 w-3/4 mb-2 rounded"></div>
                    <div className="bg-gray-700/50 h-4 w-full mb-4 rounded"></div>
                    <div className="bg-gray-700/50 h-4 w-1/2 mb-2 rounded"></div>
                    <div className="bg-gray-700/50 h-4 w-full mb-4 rounded"></div>
                    <div className="bg-gray-700/50 h-10 w-24 mt-auto rounded"></div>
                  </div>
                ),
                image: Step1Screenshot
              },
              {
                title: "Manage Inventory",
                description: "Track stock levels, set alerts, and manage suppliers",
                skeleton: (
                  <div className="w-full h-full flex flex-col p-4">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-gray-700/50 h-16 rounded"></div>
                      <div className="bg-gray-700/50 h-16 rounded"></div>
                      <div className="bg-gray-700/50 h-16 rounded"></div>
                    </div>
                    <div className="bg-gray-700/50 h-4 w-full mb-2 rounded"></div>
                    <div className="bg-gray-700/50 h-4 w-3/4 rounded"></div>
                  </div>
                ),
                image: Step2Screenshot
              },
              {
                title: "Generate Invoices",
                description: "Create professional invoices in seconds with your branding",
                skeleton: (
                  <div className="w-full h-full flex flex-col p-4">
                    <div className="bg-gray-700/50 h-6 w-1/3 mb-2 rounded"></div>
                    <div className="bg-gray-700/50 h-4 w-5/6 mb-1 rounded"></div>
                    <div className="bg-gray-700/50 h-4 w-4/5 mb-1 rounded"></div>
                    <div className="flex-1 border border-dashed border-gray-600 rounded mt-4"></div>
                    <div className="bg-gray-700/50 h-8 w-full mt-4 rounded"></div>
                  </div>
                ),
                image: Step3Screenshot
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative group h-80"
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`absolute inset-0 bg-gray-800/40 backdrop-blur rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 ${
                  hoveredStep === index ? "opacity-0" : "opacity-100"
                }`}>
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                      <span className="text-cyan-400 font-bold text-xl">{index + 1}</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gray-900/50 flex items-center justify-center">
                    {step.skeleton}
                  </div>
                </div>
                
                <div className={`absolute inset-0 bg-gray-800/40 backdrop-blur rounded-2xl border border-cyan-500/30 overflow-hidden transition-all duration-300 ${
                  hoveredStep === index ? "opacity-100" : "opacity-0"
                }`}>
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                    <p className="text-gray-300 mb-4">{step.description}</p>
                  </div>
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infinity Horizontal Component */}
      <section className="py-16 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
        <div className="container mx-auto px-5 overflow-hidden">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold mb-4">Trusted by Retailers Worldwide</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Join thousands of businesses that trust Billify for their daily operations
            </p>
          </motion.div>
          
          <div className="relative overflow-hidden py-8">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/0 to-gray-900 z-10 pointer-events-none"></div>
            
            <motion.div 
              className="flex gap-12 whitespace-nowrap"
              animate={{ x: ["0%", "-100%"] }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex gap-12">
                  {[
                    "Electronics", "Fashion", "Supermarkets", 
                    "Home Goods", "Pharmacy", "Bookstores", 
                    "Specialty Retail", "Convenience Stores"
                  ].map((category, idx) => (
                    <motion.div 
                      key={idx}
                      className="flex items-center gap-3 bg-gray-800/40 backdrop-blur px-8 py-4 rounded-xl border border-white/10"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                        <FaShoppingCart className="text-cyan-400" />
                      </div>
                      <span className="text-xl font-medium">{category}</span>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-5 text-center">
          <motion.div
            className="max-w-3xl mx-auto bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-2xl border border-white/10 p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Floating elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-cyan-400/10 blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-teal-400/10 blur-xl"></div>
            
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h3>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Join thousands of businesses using Billify to streamline their operations and boost profitability.
            </p>
            
            <motion.button 
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white shadow-lg font-medium text-lg"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(6, 182, 212, 0.6)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="pt-10 pb-10 border-t border-white/10 bg-gradient-to-b from-gray-900/50 to-gray-900">
  <div className="container mx-auto px-5">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-4">
      {/* Brand Column */}
      <div className="md:col-span-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
            <FaCrown className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
            Billify
          </h1>
        </div>
        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
          Revolutionizing inventory management and billing for modern businesses.
        </p>
        <div className="flex gap-4">
          <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-lg">
            <FaGithub />
          </a>
          <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-lg">
            <FaLinkedin />
          </a>
          
        </div>
        <p className="text-gray-400 mt-6 text-sm leading-relaxed">
         Developed By Atul.
        </p>
      </div>
      
      {/* Spacer Column - Maintains grid structure without adding content */}
      <div></div>
      
      {/* Contact Column */}
      <div>
        <h4 className="text-lg font-semibold mb-6 text-white">Contact Us</h4>
        <ul className="space-y-3 text-gray-400">
          <li className="flex items-start gap-3">
            <FaEnvelope className="text-cyan-400 mt-1 flex-shrink-0" />
            <span>atultandan074@gmail.com</span>
          </li>
          <li className="flex items-start gap-3">
            <FaPhone className="text-cyan-400 mt-1 flex-shrink-0" />
            <span>+91-6205798429</span>
          </li>
          <li className="flex items-start gap-3">
            <FaMapMarked className="text-cyan-400 mt-1 flex-shrink-0" />
            <span>MANIT, Bhopal</span>
          </li>
        </ul>
        
        {/* Newsletter Signup - Added within existing column */}
        <div className="mt-8">
          <h5 className="text-sm font-medium text-white mb-3">Stay updated</h5>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-gray-800/50 border border-white/10 text-white text-sm rounded-l-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 rounded-r-lg text-sm font-medium hover:opacity-90 transition-opacity">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          © 2025 Billify. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}

// Reusable Components
const GlassCard = ({ title, items, stats }) => {
  return (
    <motion.div 
      className="bg-gray-800/30 backdrop-blur rounded-xl p-4 border border-white/10"
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      <h4 className="font-medium mb-3 text-cyan-400 text-sm">{title}</h4>
      
      {items && (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="text-xs flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
              {item}
            </li>
          ))}
        </ul>
      )}
      
      {stats && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-bold text-lg text-cyan-400">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, items, delay }) => {
  return (
    <motion.div 
      className="bg-gray-800/30 backdrop-blur rounded-xl p-6 border border-white/10 text-left h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      <div className="mb-4">
        {icon}
      </div>
      <h4 className="text-xl font-semibold mb-4">{title}</h4>
      
      <ul className="text-gray-300 space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="mt-1.5 w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"></div>
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};



const StatCard = ({ label, value }) => (
  <div className="bg-gray-800/30 backdrop-blur rounded-lg p-4 text-center border border-white/5">
    <div className="text-2xl font-bold text-cyan-400">{value}</div>
    <div className="text-sm text-gray-400 mt-1">{label}</div>
  </div>
);

const MetricItem = ({ label, value, trend }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/5">
    <div>{label}</div>
    <div className="flex items-center gap-2">
      <span className="font-semibold">{value}</span>
      {trend === "up" && <span className="text-green-400">↑</span>}
      {trend === "down" && <span className="text-red-400">↓</span>}
      {trend === "steady" && <span className="text-yellow-400">→</span>}
    </div>
  </div>
);

const ProductItem = ({ name, sales, revenue }) => (
  <div className="flex justify-between items-center py-2">
    <div className="font-medium">{name}</div>
    <div className="text-right">
      <div>{sales}</div>
      <div className="text-cyan-400 text-sm">{revenue}</div>
    </div>
  </div>
);

