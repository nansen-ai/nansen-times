interface WhaleForecastProps {
  forecast?: string;
}

export function WhaleForecast({ forecast }: WhaleForecastProps) {
  const defaultForecast =
    "Bullish winds form in the East. Tech sector turbulence expected mid-day. Regulatory clouds clearing by market close.";

  return (
    <div className="section-border p-4">
      <h3 className="text-xs font-bold tracking-[0.2em] text-center mb-3 font-[family-name:var(--font-sans)] border-b border-[var(--border-color)] pb-2">
        WHALE FORECAST
      </h3>

      <p className="text-sm italic text-center text-[var(--text-secondary)] leading-relaxed">
        {forecast || defaultForecast}
      </p>

      <div className="mt-4 text-center">
        <span className="text-3xl font-bold text-[var(--accent-gold)] headline-xl">
          ACCUMULATE
        </span>
        <p className="text-[10px] mt-1 text-[var(--text-secondary)] font-[family-name:var(--font-sans)]">
          SENTIMENT INDEX: 72/100
        </p>
      </div>
    </div>
  );
}
