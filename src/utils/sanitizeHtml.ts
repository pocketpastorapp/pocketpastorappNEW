
import DOMPurify from 'dompurify';

// Sanitize HTML to prevent XSS while preserving required data-* attributes used for verse logic.
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b','i','em','strong','u','sub','sup','br','p','span','div','ul','ol','li','blockquote','mark','a'
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class', 'style', 'data-verse', 'data-verse-number', 'data-highlight-type', 'data-multi-select'],
    ALLOW_DATA_ATTR: true,
    FORBID_ATTR: ['onerror', 'onclick', 'onload'],
    RETURN_TRUSTED_TYPE: false,
  });
};

export default sanitizeHtml;
