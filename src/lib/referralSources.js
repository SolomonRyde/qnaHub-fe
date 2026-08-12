export const REFERRAL_SOURCES = [
  "Friend",
  "Other",
  "Google",
  "Facebook",
  "Instagram",
  "YouTube",
  "LinkedIn",
  // "Word of mouth",
  // "Newspaper/Media",
  // "Employer/HR",
  "Ryde foundation",
];

export const CHANNEL_SOURCES = [
  "Google",
  "Facebook",
  "Instagram",
  "YouTube",
  "LinkedIn",
  "Newspaper/Media",
];

export const isChannelSource = (source) => CHANNEL_SOURCES.includes(source);
