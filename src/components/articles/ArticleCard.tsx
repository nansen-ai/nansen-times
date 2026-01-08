import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';

interface ArticleCardProps {
  article: Article;
  showImage?: boolean;
}

export function ArticleCard({ article, showImage = true }: ArticleCardProps) {
  return (
    <article className="group">
      {showImage && article.image && (
        <Link href={`/article/${article.slug}`} className="block mb-3">
          <div className="relative w-full aspect-[4/3] border border-[var(--border-color)] overflow-hidden">
            <Image
              src={article.image}
              alt={article.imageAlt || article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      )}

      <div className="flex gap-2 mb-2">
        <Badge category={article.category} />
        <Badge chain={article.chain} />
      </div>

      <Link href={`/article/${article.slug}`}>
        <h3 className="headline-md text-xl mb-2 group-hover:text-[var(--text-secondary)] transition-colors">
          {article.title}
        </h3>
      </Link>

      <p className="text-sm text-[var(--text-secondary)] line-clamp-3">
        {article.excerpt}
      </p>

      {article.valueUSD && (
        <p className="mt-2 text-xs font-bold text-[var(--accent-gold)] font-[family-name:var(--font-sans)]">
          VALUE: ${(article.valueUSD / 1_000_000).toFixed(1)}M
        </p>
      )}
    </article>
  );
}
