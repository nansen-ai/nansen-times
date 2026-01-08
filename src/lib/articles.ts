import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Article, ArticleFrontmatter, ArticleImportance } from './types';

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

function getAllArticleFiles(dir: string = ARTICLES_DIR): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllArticleFiles(fullPath));
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

export function getArticleBySlug(slug: string): Article | null {
  const files = getAllArticleFiles();

  for (const filePath of files) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const frontmatter = data as ArticleFrontmatter;

    if (frontmatter.slug === slug) {
      return {
        ...frontmatter,
        content,
        filePath,
      };
    }
  }

  return null;
}

export function getAllArticles(): Article[] {
  const files = getAllArticleFiles();

  const articles = files.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const frontmatter = data as ArticleFrontmatter;

    return {
      ...frontmatter,
      content,
      filePath,
    };
  });

  // Sort by publishedAt descending (newest first)
  return articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticlesByImportance(importance: ArticleImportance): Article[] {
  return getAllArticles().filter((article) => article.importance === importance);
}

export function getHeadlineArticle(): Article | null {
  const headlines = getArticlesByImportance('headline');
  return headlines[0] || null;
}

export function getSecondaryArticles(limit: number = 4): Article[] {
  return getArticlesByImportance('secondary').slice(0, limit);
}

export function getMarketBriefs(limit: number = 5): Article[] {
  return getArticlesByImportance('brief').slice(0, limit);
}

export function getRecentArticles(limit: number = 10): Article[] {
  return getAllArticles().slice(0, limit);
}

export function getAllSlugs(): string[] {
  return getAllArticles().map((article) => article.slug);
}
