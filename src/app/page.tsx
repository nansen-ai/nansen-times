import { Masthead } from '@/components/layout/Masthead';
import { Ticker } from '@/components/layout/Ticker';
import { Footer } from '@/components/layout/Footer';
import { HeadlineArticle } from '@/components/articles/HeadlineArticle';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { MarketBrief } from '@/components/articles/MarketBrief';
import { CryptoPrices } from '@/components/widgets/CryptoPrices';
import { WhaleForecast } from '@/components/widgets/WhaleForecast';
import { SmartMoneyWidget } from '@/components/widgets/SmartMoneyWidget';
import {
  getHeadlineArticle,
  getSecondaryArticles,
  getMarketBriefs,
  getRecentArticles,
} from '@/lib/articles';

export default function HomePage() {
  const headlineArticle = getHeadlineArticle();
  const secondaryArticles = getSecondaryArticles(4);
  const marketBriefs = getMarketBriefs(5);
  const recentArticles = getRecentArticles(10);

  // If no articles exist yet, show a placeholder
  const hasContent = headlineArticle || secondaryArticles.length > 0;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Breaking News Ticker */}
      <Ticker articles={recentArticles} />

      {/* Masthead */}
      <Masthead />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {hasContent ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Market Briefs */}
            <aside className="lg:col-span-2 order-2 lg:order-1">
              <div className="section-border p-4">
                <h3 className="text-xs font-bold tracking-[0.2em] text-center mb-4 font-[family-name:var(--font-sans)] border-b border-[var(--border-color)] pb-2">
                  MARKET BRIEFS
                </h3>
                {marketBriefs.length > 0 ? (
                  <div>
                    {marketBriefs.map((article) => (
                      <MarketBrief key={article.slug} article={article} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--text-secondary)] italic">
                    No briefs available
                  </p>
                )}
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              {/* Headline Article */}
              {headlineArticle && (
                <section className="mb-12 pb-8 border-b-2 border-[var(--border-color)]">
                  <HeadlineArticle article={headlineArticle} />
                </section>
              )}

              {/* Secondary Articles Grid */}
              {secondaryArticles.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold tracking-[0.2em] mb-6 font-[family-name:var(--font-sans)] border-b border-[var(--border-color)] pb-2">
                    MORE STORIES
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {secondaryArticles.map((article) => (
                      <ArticleCard key={article.slug} article={article} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Sidebar - Prices & Forecast */}
            <aside className="lg:col-span-3 order-3 space-y-6">
              <CryptoPrices />
              <SmartMoneyWidget />
              <WhaleForecast />
            </aside>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <h2 className="headline-xl text-4xl mb-4">
              EXTRA! EXTRA!
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
              The presses are warming up! No articles have been generated yet.
              Run the article generation script to populate The Nansen Times with the latest onchain news.
            </p>
            <div className="section-border inline-block p-6 text-left">
              <p className="text-sm font-[family-name:var(--font-sans)] mb-2">
                Generate articles with:
              </p>
              <code className="block bg-gray-100 p-3 rounded text-sm font-mono">
                npm run generate-articles
              </code>
            </div>

            {/* Still show the widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <CryptoPrices />
              <SmartMoneyWidget />
              <WhaleForecast />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
