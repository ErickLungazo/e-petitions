"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Building2,
  CheckSquare,
  FileText,
  LogIn,
  MessageCircle,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";

const App = () => {
  return <HomePage />;
};

const HomePage = () => {
  // Kenyan flag colors (more nuanced)
  const kenyanBlack = "#000000";
  const kenyanRed = "#D21C1C"; // A richer red
  const kenyanGreen = "#007A3D"; // A deeper green
  const kenyanWhite = "#FFFFFF";
  const kenyanBlue = "#38A1DB";

  // Animation variants for the main heading
  const headingVariants = {
    initial: { opacity: 0, y: -20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.3, ease: "easeInOut" },
    },
  };

  // Animation variants for the sub-heading
  const subheadingVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.5, ease: "easeInOut" },
    },
  };

  // Animation variants for buttons
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Animation variants for How it works cards
  const howItWorksVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.2, // Staggered delay for each card
        ease: "easeInOut",
      },
    }),
  };

  // Animation variants for Explore More cards
  const exploreMoreVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.15, // Staggered delay
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div
      className="flex flex-col min-h-screen font-sans"
      style={{
        background: `linear-gradient(to bottom, ${kenyanWhite} 0%, ${kenyanGreen} 10%, ${kenyanWhite} 20%, ${kenyanRed} 35%, ${kenyanBlack} 50%, ${kenyanBlue} 65%, ${kenyanWhite} 80%, ${kenyanBlack} 90%, ${kenyanWhite} 100%)`, // Added Kenyan Blue
      }}
    >
      <header className="p-4 shadow-sm bg-white">
        <div className="container mx-auto flex justify-between items-center">
          <div
            className="text-2xl font-bold flex items-center"
            style={{ color: kenyanGreen }}
          >
            <FileText className="mr-2 h-6 w-6" style={{ color: kenyanRed }} />
            E-Petitions Kenya
          </div>
          <nav className="hidden md:flex space-x-6">
            <a
              href="#"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              How it Works
            </a>
          </nav>
          <button className="md:hidden text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.h1
            variants={headingVariants}
            initial="initial"
            animate="animate"
            className="text-4xl md:text-5xl lg:text-6xl font-bold"
            style={{ color: kenyanBlack }}
          >
            Make Your Voice Heard in Parliament
          </motion.h1>
          <motion.p
            variants={subheadingVariants}
            initial="initial"
            animate="animate"
            className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
          >
            Easily create, sign, and track parliamentary petitions online.
            Engage directly with the legislative process and advocate for the
            changes you want to see in Kenya.
          </motion.p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href={"/register"}>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                size="lg"
                className="w-full sm:w-auto px-5 py-3 text-white rounded-lg flex items-center gap-3 shadow-md transition duration-300 ease-in-out transform"
                style={{
                  backgroundColor: kenyanGreen,
                  borderColor: kenyanGreen,
                  "&:hover": { backgroundColor: "#006400" },
                }}
              >
                <UserPlus
                  className="mr-2 h-5 w-5"
                  style={{ color: kenyanWhite }}
                />{" "}
                Create an Account
              </motion.button>
            </Link>

            <Link href={"/login"}>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                size="lg"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 py-3 px-5 sm:w-auto rounded-lg shadow-sm transition duration-300 ease-in-out"
                style={{
                  borderColor: kenyanGreen,
                  color: kenyanGreen,
                  "&:hover": { backgroundColor: "#F0FFF0" },
                }}
              >
                <LogIn
                  className="mr-2 h-5 w-5"
                  style={{ color: kenyanGreen }}
                />{" "}
                Login
              </motion.button>
            </Link>
          </div>
        </div>
      </main>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold" style={{ color: kenyanRed }}>
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              variants={howItWorksVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <FileText
                className="h-12 w-12 mx-auto mb-4"
                style={{ color: kenyanGreen }}
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: kenyanBlack }}
              >
                Create a Petition
              </h3>
              <p className="text-gray-600">
                Clearly state your request and gather initial support.
              </p>
            </motion.div>
            <motion.div
              variants={howItWorksVariants}
              initial="hidden"
              animate="visible"
              custom={1}
              className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Users
                className="h-12 w-12 mx-auto mb-4"
                style={{ color: kenyanRed }}
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: kenyanBlack }}
              >
                Gather Signatures
              </h3>
              <p className="text-gray-600">
                Share your petition widely to reach the required threshold.
              </p>
            </motion.div>
            <motion.div
              variants={howItWorksVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CheckSquare
                className="h-12 w-12 mx-auto mb-4"
                style={{ color: kenyanBlack }}
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: kenyanGreen }}
              >
                Get a Response
              </h3>
              <p className="text-gray-600">
                Successful petitions are reviewed, debated, and receive an
                official response.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Related Content Section */}
      <section className="py-16" style={{ backgroundColor: "#f7f7f7" }}>
        <div className="container mx-auto px-6 text-center">
          <h2
            className="text-3xl font-bold mb-10"
            style={{ color: kenyanBlack }}
          >
            Explore More
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Related Content 1: About Parliament */}
            <motion.div
              variants={exploreMoreVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center"
            >
              <Building2 className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: kenyanBlack }}
              >
                About the Parliament
              </h3>
              <p className="text-gray-600">
                Learn about the structure and functions of the Kenyan
                Parliament.
              </p>
              <Link href="#">
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-800 mt-4"
                >
                  Learn More <span aria-hidden="true">&rarr;</span>
                </Button>
              </Link>
            </motion.div>

            {/* Related Content 2: Legal Framework */}
            <motion.div
              variants={exploreMoreVariants}
              initial="hidden"
              animate="visible"
              custom={1}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center"
            >
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: kenyanBlack }}
              >
                Legal Framework
              </h3>
              <p className="text-gray-600">
                Understand the laws and regulations governing public petitions.
              </p>
              <Link href="#">
                <Button
                  variant="link"
                  className="text-green-600 hover:text-green-800 mt-4"
                >
                  Read More <span aria-hidden="true">&rarr;</span>
                </Button>
              </Link>
            </motion.div>

            {/* Related Content 3: Get Involved */}
            <motion.div
              variants={exploreMoreVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center"
            >
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-purple-500" />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: kenyanBlack }}
              >
                Get Involved
              </h3>
              <p className="text-gray-600">
                Find out how you can participate in the legislative process.
              </p>
              <Link href="#">
                <Button
                  variant="link"
                  className="text-purple-600 hover:text-purple-800 mt-4"
                >
                  Take Action <span aria-hidden="true">&rarr;</span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      <footer
        className="py-6 text-center text-white text-sm"
        style={{ backgroundColor: kenyanBlack }}
      >
        <div className="container mx-auto">
          © {new Date().getFullYear()} E-Petitions Kenya. All rights reserved.
          |
          <a href="#" className="ml-1 text-green-400 hover:underline">
            Privacy Policy
          </a>{" "}
          |
          <a href="#" className="ml-1 text-green-400 hover:underline">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
