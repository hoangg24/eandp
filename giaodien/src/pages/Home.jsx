import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  BookOpen,
  Brain,
  Trophy,
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { UserContext } from "../store/UserContext";
import { useState } from "react";

const Home = () => {
  const { user } = useContext(UserContext);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample event data for the carousel
  const events = [
    {
      title: "Summer Music Festival",
      description: "Join us for an unforgettable night of music and fun!",
      image: "https://media.femalemag.com.sg/public/2016/07/sziget.jpg",
      cta: "Get Tickets",
      link: "/events/summer-festival",
    },
    {
      title: "Food & Wine Expo",
      description: "Taste the best culinary delights from top chefs",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      cta: "Reserve Your Spot",
      link: "/events/food-expo",
    },
    {
      title: "Tech Conference 2025",
      description: "Discover the future of technology",
      image: "https://turbo360.com/events/integrate-2025/images/og.jpg?ver=3",
      cta: "Register Now",
      link: "/events/tech-conference",
    },
  ];

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const slideVariants = {
    enter: { x: "100%", opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % events.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800">
      {/* Hero Section */}
      <motion.div
        className="container mx-auto px-4 pt-24 pb-32"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="text-center mb-16 space-y-6">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
            variants={itemVariants}
          >
            EVENT AND PARTY
          </motion.h1>
          <motion.p
            className="text-xl max-w-2xl mx-auto text-gray-600"
            variants={itemVariants}
          >
            {user
              ? `Hello ${user.username}, explore your events now.`
              : "Create unforgettable moments with your perfect event."}
          </motion.p>
          {!user && (
            <motion.div
              className="flex justify-center gap-4 mt-8"
              variants={itemVariants}
            >
              <Link
                to="/login"
                className="group flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Sign In
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="group flex items-center px-8 py-3 bg-white text-purple-600 rounded-full hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 shadow-lg border border-purple-200 hover:shadow-xl"
              >
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
          variants={containerVariants}
        >
          {[
            {
              icon: <Brain className="h-6 w-6 text-purple-600" />,
              title: "Personalized Events",
              text: "Customize events to your unique style",
            },
            {
              icon: <Trophy className="h-6 w-6 text-purple-600" />,
              title: "Smart Suggestions",
              text: "Discover unique event ideas",
            },
            {
              icon: <BookOpen className="h-6 w-6 text-purple-600" />,
              title: "Personal Reviews",
              text: "Share your experiences",
            },
            {
              icon: <Users className="h-6 w-6 text-purple-600" />,
              title: "Vibrant Community",
              text: "Connect with event enthusiasts",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-200"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Carousel Section */}
      <div className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Featured Events
          </motion.h2>
          <div className="relative max-w-5xl mx-auto">
            <motion.div
              key={currentSlide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src={events[currentSlide].image}
                alt={events[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {events[currentSlide].title}
                  </h3>
                  <p className="text-gray-200 mb-4">
                    {events[currentSlide].description}
                  </p>
                  <Link
                    to={events[currentSlide].link}
                    className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300"
                  >
                    {events[currentSlide].cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-all"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {events.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index
                      ? "bg-white scale-125"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16 text-white">
        <motion.div
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { end: 1000, suffix: "+", label: "Services" },
              { end: 50000, suffix: "+", label: "Users" },
              { end: 20, suffix: "+", label: "Models" },
              { end: 100000, suffix: "+", label: "Uses" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="space-y-2"
                variants={itemVariants}
              >
                <div className="text-4xl font-bold">
                  <CountUp
                    start={0}
                    end={stat.end}
                    duration={3}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Section */}
      <motion.div
        className="bg-white py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h3
            className="text-2xl font-bold mb-3 text-gray-900"
            variants={itemVariants}
          >
            Why Choose Us?
          </motion.h3>
          <motion.p
            className="text-gray-600 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            We provide the perfect event planning solution by combining
            technology and creativity. Let us be your partner in creating
            amazing experiences!
          </motion.p>
          {user && (
            <motion.div variants={itemVariants} className="mt-6">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
