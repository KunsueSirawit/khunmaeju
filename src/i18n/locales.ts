// Shared by Payload (content localization) and next-intl (routing + UI strings).
// To add Chinese later: add 'zh' here and create messages/zh.json.
export const locales = ['th', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'th'
