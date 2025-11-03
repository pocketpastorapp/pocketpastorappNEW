interface EmotionalContext {
  tone: 'neutral' | 'distressed' | 'joyful' | 'confused' | 'grateful' | 'urgent';
  urgency: 'low' | 'medium' | 'high';
  messageLength: 'short' | 'medium' | 'long';
  formality: 'casual' | 'formal';
  hasExcessivePunctuation: boolean;
  isAllCaps: boolean;
  responseStyle: string;
}

export const analyzeEmotionalContext = (message: string): EmotionalContext => {
  const lowerMessage = message.toLowerCase();
  const wordCount = message.trim().split(/\s+/).length;
  
  // Check for ALL CAPS (at least 70% uppercase)
  const uppercaseRatio = (message.match(/[A-Z]/g) || []).length / (message.match(/[a-zA-Z]/g) || []).length;
  const isAllCaps = uppercaseRatio > 0.7 && message.length > 10;
  
  // Check for excessive punctuation
  const punctuationCount = (message.match(/[!?]{2,}/g) || []).length;
  const hasExcessivePunctuation = punctuationCount > 0;
  
  // Determine urgency
  const urgentWords = ['help', 'urgent', 'emergency', 'crisis', 'desperate', 'scared', 'terrified', 'dying', 'suicide', 'hurt'];
  const hasUrgentWords = urgentWords.some(word => lowerMessage.includes(word));
  
  let urgency: 'low' | 'medium' | 'high' = 'low';
  if (hasUrgentWords || isAllCaps || hasExcessivePunctuation) {
    urgency = 'high';
  } else if (lowerMessage.includes('need') || lowerMessage.includes('struggling') || lowerMessage.includes('difficult')) {
    urgency = 'medium';
  }
  
  // Determine emotional tone
  let tone: EmotionalContext['tone'] = 'neutral';
  
  const distressWords = ['scared', 'afraid', 'anxious', 'worried', 'depressed', 'sad', 'hurt', 'pain', 'suffering', 'struggling', 'lost', 'alone', 'desperate'];
  const joyWords = ['blessed', 'thankful', 'grateful', 'praise', 'amazing', 'wonderful', 'happy', 'joy', 'excited', 'celebrate'];
  const confusedWords = ['confused', 'don\'t understand', 'unclear', 'what does', 'what is', 'explain', 'help me understand'];
  const gratefulWords = ['thank', 'grateful', 'appreciate', 'bless'];
  
  if (distressWords.some(word => lowerMessage.includes(word))) {
    tone = 'distressed';
  } else if (joyWords.some(word => lowerMessage.includes(word))) {
    tone = 'joyful';
  } else if (confusedWords.some(word => lowerMessage.includes(word))) {
    tone = 'confused';
  } else if (gratefulWords.some(word => lowerMessage.includes(word))) {
    tone = 'grateful';
  }
  
  if (hasUrgentWords) {
    tone = 'urgent';
  }
  
  // Determine message length preference
  let messageLength: 'short' | 'medium' | 'long' = 'medium';
  if (wordCount < 10) {
    messageLength = 'short';
  } else if (wordCount > 30) {
    messageLength = 'long';
  }
  
  // Determine formality
  const informalWords = ['hey', 'yeah', 'gonna', 'wanna', 'lol', 'tbh', 'idk'];
  const hasInformalWords = informalWords.some(word => lowerMessage.includes(word));
  const formality: 'casual' | 'formal' = hasInformalWords ? 'casual' : 'formal';
  
  // Determine response style
  let responseStyle = '';
  switch (tone) {
    case 'urgent':
    case 'distressed':
      responseStyle = 'compassionate, immediate, and focused. Acknowledge their pain quickly and offer specific comfort.';
      break;
    case 'joyful':
      responseStyle = 'celebratory and warm. Share in their joy authentically.';
      break;
    case 'confused':
      responseStyle = 'clear, patient, and teaching-focused. Break down concepts simply.';
      break;
    case 'grateful':
      responseStyle = 'affirming and encouraging. Acknowledge their gratitude warmly.';
      break;
    default:
      responseStyle = 'warm and conversational. Match their tone naturally.';
  }
  
  if (messageLength === 'short') {
    responseStyle += ' Keep your response concise.';
  } else if (messageLength === 'long') {
    responseStyle += ' Feel free to provide a more detailed response.';
  }
  
  return {
    tone,
    urgency,
    messageLength,
    formality,
    hasExcessivePunctuation,
    isAllCaps,
    responseStyle
  };
};

export const formatEmotionalContext = (context: EmotionalContext): string => {
  const parts: string[] = [];
  
  if (context.urgency === 'high') {
    parts.push('⚠️ HIGH URGENCY - User needs immediate pastoral care and support.');
  }
  
  parts.push(`Emotional tone: ${context.tone}.`);
  parts.push(`Response should be: ${context.responseStyle}`);
  
  if (context.isAllCaps) {
    parts.push('User is using all caps - indicates heightened emotion or distress.');
  }
  
  if (context.formality === 'casual') {
    parts.push('Use a warm, conversational tone - avoid being overly formal.');
  }
  
  return parts.join(' ');
};
