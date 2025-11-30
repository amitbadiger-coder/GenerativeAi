// lib/placeholderService.ts
export const getPlaceholderImage = (prompt: string): string => {
  // Extract keywords from prompt
  const keywords = prompt
    .split(' ')
    .slice(0, 3)
    .map(word => word.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(word => word.length > 2)
    .join('+');
  
  // Predefined color schemes for different course types
  const colorSchemes: { [key: string]: string } = {
    'programming': '3B82F6', // Blue
    'design': '8B5CF6',      // Purple
    'business': '10B981',    // Green
    'science': 'EF4444',     // Red
    'art': 'F59E0B',         // Orange
    'default': '6B7280'      // Gray
  };
  
  // Determine color based on prompt content
  let color = colorSchemes.default;
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('programming') || lowerPrompt.includes('code') || lowerPrompt.includes('software')) {
    color = colorSchemes.programming;
  } else if (lowerPrompt.includes('design') || lowerPrompt.includes('creative') || lowerPrompt.includes('art')) {
    color = colorSchemes.design;
  } else if (lowerPrompt.includes('business') || lowerPrompt.includes('marketing') || lowerPrompt.includes('management')) {
    color = colorSchemes.business;
  } else if (lowerPrompt.includes('science') || lowerPrompt.includes('math') || lowerPrompt.includes('physics')) {
    color = colorSchemes.science;
  }
  
  return `https://placehold.co/600x400/${color}/FFFFFF?text=${encodeURIComponent(keywords)}&font=montserrat`;
};