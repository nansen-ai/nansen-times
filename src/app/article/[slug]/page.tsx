import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Masthead } from '@/components/layout/Masthead';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { CryptoPrices } from '@/components/widgets/CryptoPrices';
import { getArticleBySlug, getAllSlugs, getRecentArticles } from '@/lib/articles';
import { ArticleCard } from '@/components/articles/ArticleCard';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | The Nansen Times',
    };
  }

  return {
    title: `${article.title} | The Nansen Times`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      images: article.image ? [article.image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const publishedDate = new Date(article.publishedAt);
  const relatedArticles = getRecentArticles(3).filter((a) => a.slug !== slug);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Masthead */}
      <Masthead />

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-block mb-8 text-sm font-[family-name:var(--font-sans)] hover:underline"
        >
          ← Back to Front Page
        </Link>

        <article>
          {/* Article Header */}
          <header className="text-center mb-8 pb-8 border-b-2 border-[var(--border-color)]">
            <div className="flex justify-center gap-2 mb-4">
              <Badge category={article.category} />
              <Badge chain={article.chain} />
            </div>

            <h1 className="headline-xl text-4xl md:text-5xl lg:text-6xl mb-6">
              {article.title}
            </h1>

            <div className="flex items-center justify-center gap-4 text-sm text-[var(--text-secondary)] font-[family-name:var(--font-sans)]">
              <span>BY {article.author.toUpperCase()}</span>
              <span>•</span>
              <time dateTime={article.publishedAt}>
                {format(publishedDate, 'MMMM d, yyyy').toUpperCase()}
              </time>
              <span>•</span>
              <time dateTime={article.publishedAt}>
                {format(publishedDate, 'h:mm a')} UTC
              </time>
            </div>

            {article.valueUSD && (
              <p className="mt-4 text-lg font-bold text-[var(--accent-gold)] font-[family-name:var(--font-sans)]">
                TRANSACTION VALUE: ${(article.valueUSD / 1_000_000).toFixed(1)}M
              </p>
            )}
          </header>

          {/* Featured Image */}
          {article.image && (
            <div className="relative w-full aspect-[16/9] mb-8 border border-[var(--border-color)]">
              <Image
                src={article.image}
                alt={article.imageAlt || article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-lg max-w-none drop-cap">
            <MDXRemote source={article.content} />
          </div>

          {/* Transaction Details */}
          {(article.transactionHash || article.relatedAddresses) && (
            <aside className="mt-8 p-6 section-border bg-gray-50">
              <h3 className="text-xs font-bold tracking-[0.2em] mb-4 font-[family-name:var(--font-sans)]">
                ONCHAIN DETAILS
              </h3>

              {article.transactionHash && (
                <p className="text-sm mb-2 font-mono break-all">
                  <strong>Transaction:</strong> {article.transactionHash}
                </p>
              )}

              {article.relatedAddresses && article.relatedAddresses.length > 0 && (
                <div className="text-sm">
                  <strong>Related Addresses:</strong>
                  <ul className="mt-2 space-y-1 font-mono">
                    {article.relatedAddresses.map((address, i) => (
                      <li key={i} className="break-all text-[var(--text-secondary)]">
                        {address}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
              <span className="text-xs font-bold tracking-[0.2em] font-[family-name:var(--font-sans)] mr-4">
                TAGS:
              </span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block mr-2 mb-2 px-3 py-1 text-xs bg-gray-100 font-[family-name:var(--font-sans)]"
                >
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-12 pt-8 border-t-2 border-[var(--border-color)]">
            <h2 className="text-xs font-bold tracking-[0.2em] mb-6 font-[family-name:var(--font-sans)]">
              MORE FROM THE NANSEN TIMES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.slug} article={related} showImage={false} />
              ))}
            </div>
          </section>
        )}

        {/* Price Widget */}
        <aside className="mt-12 max-w-xs mx-auto">
          <CryptoPrices />
        </aside>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
