"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeText = exports.sanitizeHtml = void 0;
// [sanitizer.ts]: HTML sanitization utilities
const isomorphic_dompurify_1 = __importDefault(require("isomorphic-dompurify"));
// Sanitize HTML content to prevent XSS attacks
const sanitizeHtml = (html) => {
    if (!html || typeof html !== 'string') {
        return '';
    }
    // Configure DOMPurify to allow basic HTML tags for article content
    const cleanHtml = isomorphic_dompurify_1.default.sanitize(html, {
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
exports.sanitizeHtml = sanitizeHtml;
// Sanitize text content (strip all HTML)
const sanitizeText = (text) => {
    if (!text || typeof text !== 'string') {
        return '';
    }
    // Strip all HTML tags and return plain text
    return isomorphic_dompurify_1.default.sanitize(text, { ALLOWED_TAGS: [] });
};
exports.sanitizeText = sanitizeText;
//# sourceMappingURL=sanitizer.js.map