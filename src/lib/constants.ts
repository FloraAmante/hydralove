// HydraLove Configuration & Personalization Constants

export const CONFIG = {
  GIRLFRIEND_NAME: "Malar",
  BOYFRIEND_NAME: "Hirthik",
  APP_NAME: "HydraLove 💧",
  SUBTITLE: "A little sip of love, all day long.",
  DEFAULT_GOAL_ML: 2500,
  DEFAULT_QUICK_SIZES: [100, 200, 250, 350, 500],
  DEFAULT_DRINK_SIZE: 250,
  GOAL_OPTIONS: [2000, 2250, 2500, 2750, 3000],
};

export const ROTATING_REMINDER_MESSAGES = {
  cute: [
    "Hey love, tiny sip break? 💧❤️",
    "Your water is waiting for you 👀💧",
    "One sip for me? 🥺💙",
    "Hydration check, pretty girl 💧",
    "Drink some water, sleepyhead 🌸",
    "Water break! You've got this ✨💧",
    "A quick sip for bright energy today 💧✨",
  ],
  romantic: [
    "Someone who loves you wants you to take care of yourself. ❤️",
    "A little reminder from me: please drink some water. 💧",
    "I can't hand you a glass right now, so let this remind you. ❤️",
    "Take a sip, love. Your future self will thank you. 💙",
    "Sending you a warm hug and a cold glass of water. 💧🥰",
    "You look adorable today, now go get hydrated! 💙🌸",
  ],
  playful: [
    "Ma'am, this is your official hydration summons. 💧",
    "Water first. Everything else can wait for two minutes. 😌",
    "Your body filed a complaint. It wants water. 😂💧",
    "Emergency meeting: you + a glass of water. Now. 😤❤️",
    "Warning: Low hydration levels detected in my favorite person! 🚨💧",
    "Drink water or I'm coming over to hand it to you! 🏃‍♂️💧",
  ],
};

export const BOYFRIEND_PERSONAL_MESSAGES = [
  "Please take care of yourself for me. ❤️",
  "You don't have to do everything at once. Just take a sip. 😌",
  "I'm always rooting for you. 🌟",
  "Drink some water, then come back and tell me you did. ❤️",
  "Your happiness and health mean the world to me. 💙",
  "Remember to breathe, smile, and stay hydrated today. 🌸",
  "Even on busy days, don't forget you're cherished. 💧✨",
];

export const DAILY_LOVE_MESSAGES = [
  "Whatever today brings, remember to be gentle with yourself. Now drink some water. 😌💧",
  "You brighten up my world every single day. Make sure you stay refreshed! 🌟💙",
  "Taking care of your health is a gift to both of us. A little sip of love for you! 💧❤️",
  "You are doing amazing. Take a moment to reset and enjoy a glass of water. 🌸",
  "No matter how far apart we are, my care for you is always right here. 💧🥰",
];

export const SPECIAL_LOVE_PAGE_NOTE = {
  title: "For you ❤️",
  content: `I know I can't be beside you every second of the day.

So here's one tiny thing I can remind you about:

Take care of yourself.
Drink some water.
Rest when you're tired.
And remember that you're loved.`,
  sign: "— Hirthik",
};

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedIf: (stats: { totalSips: number; currentStreak: number; goalReachedToday: boolean; maxStreak: number }) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_sip",
    title: "First Sip 💧",
    description: "Logged your first drink of water.",
    icon: "💧",
    unlockedIf: ({ totalSips }) => totalSips >= 1,
  },
  {
    id: "hydration_hero",
    title: "Hydration Hero 🌊",
    description: "Reached your daily hydration goal.",
    icon: "🌊",
    unlockedIf: ({ goalReachedToday }) => goalReachedToday,
  },
  {
    id: "three_days",
    title: "Three Days Strong 🔥",
    description: "Reached your goal for 3 consecutive days.",
    icon: "🔥",
    unlockedIf: ({ maxStreak }) => maxStreak >= 3,
  },
  {
    id: "one_week",
    title: "One Week 💙",
    description: "Stayed hydrated for 7 days in a row.",
    icon: "💙",
    unlockedIf: ({ maxStreak }) => maxStreak >= 7,
  },
  {
    id: "consistency_queen",
    title: "Consistency Queen 👑",
    description: "Reached your goal for 14 days in a row.",
    icon: "👑",
    unlockedIf: ({ maxStreak }) => maxStreak >= 14,
  },
];

export const STORAGE_KEYS = {
  HYDRATION_DATA: "hydralove_daily_records_v1",
  USER_SETTINGS: "hydralove_user_settings_v1",
  REMINDER_SETTINGS: "hydralove_reminder_settings_v1",
  FIRST_TIME_DONE: "hydralove_onboarding_completed_v1",
  DAILY_LOVE_LAST_SHOWN: "hydralove_daily_love_last_shown_date",
  CUSTOM_ADMIN_MESSAGE: "hydralove_custom_boyfriend_message",
};
