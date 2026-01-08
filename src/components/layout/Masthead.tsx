import { format } from 'date-fns';

export function Masthead() {
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy").toUpperCase();
  const volumeNumber = Math.floor((today.getTime() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <header className="border-b-2 border-[var(--border-color)]">
      {/* Top info bar */}
      <div className="flex justify-between items-center px-4 py-2 text-xs font-[family-name:var(--font-sans)] border-b border-[var(--border-color)]">
        <span>VOL. I... No. {volumeNumber}</span>
        <span>{formattedDate}</span>
        <span>PRICE: FREE</span>
      </div>

      {/* Main masthead */}
      <div className="text-center py-6 px-4">
        <p className="text-[10px] tracking-[0.3em] text-[var(--text-secondary)] mb-2 font-[family-name:var(--font-sans)]">
          WHEN WHALES MOVE, WE PRINT
        </p>

        <h1 className="headline-xl text-5xl md:text-7xl lg:text-8xl tracking-tight mb-2">
          The Nansen Times
        </h1>

        <div className="ornament-divider max-w-2xl mx-auto text-xs tracking-[0.2em] text-[var(--text-secondary)] font-[family-name:var(--font-sans)]">
          <span>LATE CHAIN EDITION</span>
          <span className="mx-2">•</span>
          <span>UPDATED {format(today, 'h:mm a')} UTC</span>
        </div>
      </div>
    </header>
  );
}
