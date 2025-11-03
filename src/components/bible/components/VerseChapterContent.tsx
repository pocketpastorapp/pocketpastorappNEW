
import React from 'react';
import sanitizeHtml from '@/utils/sanitizeHtml';

interface VerseChapterContentProps {
  processedChapterText: string;
  chapterText: string;
}

const VerseChapterContent = ({
  processedChapterText,
  chapterText
}: VerseChapterContentProps) => {
  return (
    <div dir="auto" dangerouslySetInnerHTML={{ __html: sanitizeHtml(processedChapterText || chapterText) }} />
  );
};

export default VerseChapterContent;
