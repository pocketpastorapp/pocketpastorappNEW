import { getTimeContext, getTimeBasedContext } from './timeContextService';
import { getSpiritualContext, formatSpiritualContext } from './spiritualContextService';
import { analyzeEmotionalContext, formatEmotionalContext } from './emotionalContextService';

interface UserProfile {
  name?: string;
}

export interface AggregatedContext {
  timeContext: string;
  spiritualContext: string;
  emotionalContext: string;
  greeting: string;
}

export const aggregateContexts = async (
  userId: string | undefined,
  message: string,
  userProfile?: UserProfile
): Promise<AggregatedContext> => {
  // Get time context
  const timeData = getTimeContext();
  const timeContext = getTimeBasedContext();
  
  // Get greeting with user's name if available
  const greeting = userProfile?.name 
    ? `${timeData.greeting}, ${userProfile.name}`
    : timeData.greeting;
  
  // Get spiritual context if user is logged in
  let spiritualContext = '';
  if (userId) {
    const spiritualData = await getSpiritualContext(userId);
    spiritualContext = formatSpiritualContext(spiritualData, userProfile?.name);
  }
  
  // Analyze emotional context from the message
  const emotionalData = analyzeEmotionalContext(message);
  const emotionalContext = formatEmotionalContext(emotionalData);
  
  return {
    timeContext,
    spiritualContext,
    emotionalContext,
    greeting
  };
};
