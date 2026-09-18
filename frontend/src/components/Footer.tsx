export default function Footer() {
  return (
    <footer className="relative w-full h-[100vh] min-h-[800px] bg-black overflow-hidden flex flex-col justify-between items-center">
      
      {/* 3D Wave Graphic - Absolutely positioned in the center of the screen */}
      {/* w-full ensures it spans the exact screen width with zero cropping. */}
      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 pointer-events-none">
        {/* Gradients to blend the top and bottom of the image perfectly into the black background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10"></div>
        <img 
          src="/footer_wave.jpg" 
          alt="3D Particle Wave" 
          className="w-full h-auto object-contain opacity-80 mix-blend-screen"
        />
      </div>

      {/* Top Section - Text & Button */}
      {/* Pushed to the top using pt-24, floating above the wave */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-24 md:pt-32 w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-text-primary mb-6">
          <span className="text-xl opacity-70 font-medium">{"</>"}</span>
          <span className="text-lg font-medium tracking-wide">Shreyash Londhe</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-display text-text-primary tracking-tight mb-8 max-w-3xl leading-tight">
          Let's secure your infrastructure & applications together.
        </h2>
        
        <a 
          href="https://linkedin.com/in/shreyashlondhe" 
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Connect on LinkedIn
        </a>
      </div>

      {/* Footer Links & Copyright */}
      {/* Pushed to the very bottom */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-10 pb-8 mt-auto">
        
        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-semibold text-text-primary">Navigate</h4>
            <div className="flex flex-col gap-4 text-xs text-muted font-medium">
              <a href="#home" className="hover:text-text-primary transition-colors w-fit">Home</a>
              <a href="#about" className="hover:text-text-primary transition-colors w-fit">Who I am</a>
              <a href="#work" className="hover:text-text-primary transition-colors w-fit">Projects</a>
              <a href="#skillset" className="hover:text-text-primary transition-colors w-fit">Skills</a>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-semibold text-text-primary">Connect</h4>
            <div className="flex flex-col gap-4 text-xs text-muted font-medium">
              <a href="https://linkedin.com/in/shreyashlondhe" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-text-primary transition-colors w-fit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                LinkedIn
              </a>
              <a href="https://github.com/ShreyashLondhe31" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-text-primary transition-colors w-fit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
              <a href="https://wa.me/919987603016" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-text-primary transition-colors w-fit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.301-.15-1.777-.877-2.052-.977-.275-.1-.476-.15-.677.15-.201.3-.777.977-.952 1.178-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.175.2-.3.3-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.239-.244-.59-.493-.51-.677-.52l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.507 0 1.479 1.078 2.908 1.229 3.109.15.2 2.12 3.238 5.137 4.542.718.31 1.278.496 1.716.635.722.23 1.378.197 1.898.12.58-.087 1.777-.727 2.028-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35zm-5.438 7.424c-1.928 0-3.816-.518-5.467-1.498l-.392-.232-4.062 1.066 1.084-3.959-.255-.407c-1.077-1.714-1.644-3.699-1.644-5.736 0-5.918 4.814-10.733 10.736-10.733 2.868 0 5.563 1.117 7.591 3.146 2.029 2.028 3.146 4.724 3.146 7.591 0 5.92-4.814 10.735-10.737 10.735zm8.974-19.711c-2.398-2.336-5.586-3.622-8.974-3.622-6.993 0-12.684 5.69-12.684 12.684 0 2.235.583 4.417 1.692 6.34l-1.796 6.562 6.714-1.761c1.859 1.014 3.962 1.549 6.074 1.549h.005c6.993 0 12.685-5.69 12.685-12.685 0-3.388-1.32-6.575-3.716-8.973z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="w-full pt-8 border-t border-stroke flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-muted/70">
          <p>© {new Date().getFullYear()} Shreyash Londhe. All rights reserved.</p>
          <p>Created by Shreyash Londhe</p>
        </div>
        
      </div>
    </footer>
  );
}
