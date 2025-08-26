// [sanitizer.ts]: HTML sanitization utilities
import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML content to prevent XSS attacks
export const sanitizeHtml = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Configure DOMPurify to allow basic HTML tags for article content
  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'target', 'rel'
    ],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover']
  });

  return cleanHtml;
};

// Sanitize text content (strip all HTML)
export const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Strip all HTML tags and return plain text
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
};