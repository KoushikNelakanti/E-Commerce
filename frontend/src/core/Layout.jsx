import React from 'react';
import Menu from './Menu';
import { motion } from 'framer-motion';

const Layout = ({
  title = 'Title',
  description = 'Description',
  className,
  children,
  showHero = true,
}) => (
  <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <Menu />
    
    {showHero && (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative pt-16 pb-20 sm:pb-24 lg:pb-32 bg-gray-50 dark:bg-gray-800 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300"
            >
              {description}
            </motion.p>
          </div>
        </div>
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 dark:bg-blue-400/10 rounded-full blur-3xl transition-colors duration-300"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-300/10 dark:bg-gray-700/20 rounded-full blur-3xl transition-colors duration-300"></div>
        </div>
      </motion.section>
    )}
    
    <main className={`${className} ${showHero ? 'py-16' : 'pt-24 py-16'}`}>
      {children}
    </main>
  </div>
);

export default Layout;