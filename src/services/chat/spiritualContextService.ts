import { supabase } from "@/integrations/supabase/client";

interface SpiritualContext {
  hasData: boolean;
  gender?: string | null;
}

export const getSpiritualContext = async (userId: string): Promise<SpiritualContext> => {
  try {
    // Fetch user profile for gender only
    const { data: profile } = await supabase
      .from('profiles')
      .select('gender')
      .eq('id', userId)
      .single();

    return {
      hasData: !!profile?.gender,
      gender: profile?.gender
    };
  } catch (error) {
    console.error('Error fetching spiritual context:', error);
    return {
      hasData: false,
      gender: null
    };
  }
};

export const formatSpiritualContext = (context: SpiritualContext, userName?: string): string => {
  if (!context.hasData || !context.gender) {
    return '';
  }

  // Add gender context for appropriate addressing
  if (context.gender !== 'prefer_not_to_say') {
    const pronoun = context.gender === 'male' ? 'he/him' : 'she/her';
    const title = context.gender === 'male' ? 'brother' : 'sister';
    return `Gender: ${context.gender} (address as ${pronoun}, can refer to as '${title}' in faith context when appropriate).`;
  }

  return '';
};
