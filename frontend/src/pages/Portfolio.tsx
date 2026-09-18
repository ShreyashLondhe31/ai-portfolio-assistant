import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '../components/LoadingScreen';
import Hero from '../components/Hero';
import About from '../components/About';
import SelectedWorks from '../components/SelectedWorks';
import HowIWork from '../components/HowIWork';
import Skillset from '../components/Skillset';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import AiChatSidebar from '../components/AiChatSidebar';

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | null>(null);

  const handleAskAI = (contextTitle: string) => {
    setChatContext(contextTitle);
    setIsChatOpen(true);
  };

  return (
    <main className="w-full min-h-screen bg-bg text-text-primary relative overflow-hidden selection:bg-text-primary selection:text-bg flex">
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      
      {!isLoading && (
        <>
          {/* Main Content Wrapper - shrinks when chat is open */}
          <div 
            className={`w-full transition-all duration-700 ease-smooth-curve ${
              isChatOpen ? 'md:w-[calc(100%-400px)] md:pr-0' : 'w-full'
            }`}
          >
            <Hero />
            <About />
            <SelectedWorks onAskAI={handleAskAI} />
            <HowIWork />
            <Skillset />
            <FAQ />
            <Footer />
          </div>

          {/* AI Sidebar Component */}
          <AiChatSidebar 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
            contextTitle={chatContext} 
          />
        </>
      )}
    </main>
  );
}
