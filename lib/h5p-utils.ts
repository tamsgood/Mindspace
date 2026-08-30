/**
 * H5P Utilities
 * Helper functions untuk H5P content
 */

/**
 * Validate apakah URL adalah H5P content yang valid
 */
export function isValidH5PUrl(url: string): boolean {
  if (!url) return false;
  
  // Check if it's H5P.org embed URL
  if (url.includes('h5p.org/h5p/embed/')) return true;
  
  // Check if it's H5P.com content
  if (url.includes('h5p.com') && url.includes('/content/')) return true;
  
  // Check if it's local H5P JSON file
  if (url.endsWith('h5p.json') || url.includes('/h5p/')) return true;
  
  return false;
}

/**
 * Convert H5P share URL to embed URL
 */
export function convertToH5PEmbedUrl(url: string): string {
  // H5P.org: https://h5p.org/node/617 -> https://h5p.org/h5p/embed/617
  if (url.includes('h5p.org/node/')) {
    const nodeId = url.match(/node\/(\d+)/)?.[1];
    if (nodeId) {
      return `https://h5p.org/h5p/embed/${nodeId}`;
    }
  }
  
  // Already embed URL or local path
  return url;
}

/**
 * Detect H5P content type dari URL
 */
export function getH5PContentType(url: string): string {
  if (url.includes('interactive-video') || url.includes('InteractiveVideo')) {
    return 'Interactive Video';
  }
  if (url.includes('course-presentation') || url.includes('CoursePresentation')) {
    return 'Course Presentation';
  }
  if (url.includes('question-set') || url.includes('QuestionSet')) {
    return 'Quiz / Question Set';
  }
  
  return 'H5P Content';
}

/**
 * Sample H5P URLs untuk testing
 */
export const SAMPLE_H5P_URLS = {
  interactiveVideo: 'https://h5p.org/h5p/embed/617',
  coursePresentation: 'https://h5p.org/h5p/embed/1045',
  quiz: 'https://h5p.org/h5p/embed/712',
  timeline: 'https://h5p.org/h5p/embed/120',
  memoryGame: 'https://h5p.org/h5p/embed/54',
};
