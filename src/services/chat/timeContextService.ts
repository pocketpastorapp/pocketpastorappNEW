interface TimeContext {
  timeOfDay: string;
  dayOfWeek: string;
  greeting: string;
  specialOccasion: string | null;
  isWeekend: boolean;
  isSunday: boolean;
}

export const getTimeContext = (): TimeContext => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  const month = now.getMonth();
  const date = now.getDate();

  // Determine time of day
  let timeOfDay: string;
  let greeting: string;
  
  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning';
    greeting = 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon';
    greeting = 'Good afternoon';
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = 'evening';
    greeting = 'Good evening';
  } else {
    timeOfDay = 'night';
    greeting = 'Hello';
  }

  // Day of week context
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = days[day];
  const isWeekend = day === 0 || day === 6;
  const isSunday = day === 0;

  // Detect Christian holidays and seasons
  let specialOccasion: string | null = null;

  // Christmas season (Dec 24-26)
  if (month === 11 && date >= 24 && date <= 26) {
    if (date === 24) specialOccasion = "It's Christmas Eve - what a holy night as we prepare to celebrate Jesus's birth.";
    else if (date === 25) specialOccasion = "It's Christmas Day - celebrating the birth of our Savior!";
    else specialOccasion = "We're still in the joy of Christmas, celebrating Jesus's birth.";
  }
  // Christmas season extended (Dec 1-23)
  else if (month === 11 && date < 24) {
    specialOccasion = "We're in the beautiful season of Advent, preparing our hearts for Christmas.";
  }
  // New Year's (Dec 31 - Jan 1)
  else if ((month === 11 && date === 31) || (month === 0 && date === 1)) {
    specialOccasion = "As we step into a new year, what a perfect time to seek God's guidance and renewal.";
  }
  // Easter season (approximate - early April)
  else if (month === 3 && date >= 1 && date <= 20) {
    specialOccasion = "During this Easter season, we celebrate Christ's resurrection and victory over death.";
  }
  // Lent season (approximate - Feb-March)
  else if ((month === 1 && date >= 14) || (month === 2)) {
    specialOccasion = "We're in the season of Lent - a time for reflection, repentance, and drawing closer to God.";
  }
  // Thanksgiving season (late November)
  else if (month === 10 && date >= 20) {
    specialOccasion = "In this season of Thanksgiving, what a beautiful time to reflect on God's blessings.";
  }

  return {
    timeOfDay,
    dayOfWeek,
    greeting,
    specialOccasion,
    isWeekend,
    isSunday
  };
};

export const getTimeBasedContext = (): string => {
  const context = getTimeContext();
  
  let contextString = `Current time: ${context.timeOfDay} on ${context.dayOfWeek}.`;
  
  if (context.specialOccasion) {
    contextString += ` ${context.specialOccasion}`;
  }
  
  if (context.isSunday && !context.specialOccasion) {
    contextString += ` Many believers are gathering for worship today.`;
  } else if (context.dayOfWeek === 'Monday' && context.timeOfDay === 'morning') {
    contextString += ` Starting a new week.`;
  } else if (context.dayOfWeek === 'Friday' && context.timeOfDay === 'evening') {
    contextString += ` The week is coming to a close.`;
  }
  
  return contextString;
};
