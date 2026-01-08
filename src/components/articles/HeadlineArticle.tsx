import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';

interface HeadlineArticleProps {
  article: Article;
}

export function HeadlineArticle({ article }: HeadlineArticleProps) {
  const publishedDate = new Date(article.publishedAt);

  return (
    <article className="text-center">
      {article.category === 'breaking' && (
        <div className="mb-4">
          <Badge breaking />
        </div>
      )}

      <Link href={`/article/${article.slug}`} className="group">
        <h2 className="headline-xl text-4xl md:text-5xl lg:text-6xl mb-4 group-hover:text-[var(--text-secondary)] transition-colors">
          {article.title}
        </h2>
      </Link>

      <div className="flex items-center justify-center gap-4 text-xs text-[var(--text-secondary)] mb-4 font-[family-name:var(--font-sans)]">
        <span>BY {article.author.toUpperCase()}</span>
        <span>•</span>
        <span>{format(publishedDate, 'MMM d, yyyy').toUpperCase()}</span>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <Badge chain={article.chain} />
        {article.valueUSD && (
          <span className="text-xs font-bold text-[var(--accent-gold)] font-[family-name:var(--font-sans)]">
            ${(article.valueUSD / 1_000_000).toFixed(1)}M
          </span>
        )}
      </div>

      {article.image && (
        <div className="relative w-full aspect-[16/9] mb-6 border border-[var(--border-color)]">
          <Image
            src={article.image}
            alt={article.imageAlt || article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <p className="text-lg leading-relaxed max-w-2xl mx-auto text-[var(--text-secondary)]">
        {article.excerpt}
      </p>

      <Link
        href={`/article/${article.slug}`}
        className="inline-block mt-4 text-sm font-bold underline hover:no-underline font-[family-name:var(--font-sans)]"
      >
        READ FULL STORY →
      </Link>
    </article>
  );
}
