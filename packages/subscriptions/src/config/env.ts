export const isProduction = process.env.NODE_ENV = "production";
export const trialDays = Number(process.env.TRIAL_DAYS ?? 14);
export const supportEmail = process.env.SUPPORT_EMAIL ?? "support@example.com";
