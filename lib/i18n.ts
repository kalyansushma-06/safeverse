export type Language = "en" | "hi" | "sat";

export const translations = {
  en: {
    chooseLanguage: "Choose your language",
    languageSubtitle: "Select the language you want to use",
    english: "English",
    hindi: "हिन्दी (Hindi)",
    santali: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)",

    login: "Worker Login",
    employeeCode: "Employee Code",
    password: "Password",
    loginButton: "Login",

    dashboard: "Compliance Dashboard",
    sites: "Sites",
    overview: "Overview",
    attentionRequired: "Attention Required",

    emergencyControl: "Emergency Control",
    emergencyAlert: "Emergency Alert",
    sosActive: "SOS ACTIVE",
    activateSOS: "ACTIVATE EMERGENCY SOS",
    resolveEmergency: "RESOLVE EMERGENCY",
    acknowledgeAlert: "ACKNOWLEDGE ALERT"
  },

  hi: {
    chooseLanguage: "अपनी भाषा चुनें",
    languageSubtitle: "वह भाषा चुनें जिसमें आप SafeVerse का उपयोग करना चाहते हैं",
    english: "English",
    hindi: "हिन्दी (Hindi)",
    santali: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)",

    login: "वर्कर लॉगिन",
    employeeCode: "कर्मचारी कोड",
    password: "पासवर्ड",
    loginButton: "लॉगिन",

    dashboard: "अनुपालन डैशबोर्ड",
    sites: "साइट्स",
    overview: "अवलोकन",
    attentionRequired: "ध्यान आवश्यक है",

    emergencyControl: "आपातकालीन नियंत्रण",
    emergencyAlert: "आपातकालीन चेतावनी",
    sosActive: "SOS सक्रिय",
    activateSOS: "आपातकालीन SOS सक्रिय करें",
    resolveEmergency: "आपातकाल समाप्त करें",
    acknowledgeAlert: "चेतावनी स्वीकार करें"
  },

  sat: {
    chooseLanguage: "ᱟᱢᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ",
    languageSubtitle: "SafeVerse ᱵᱟᱵᱚᱛ ᱞᱟᱹᱜᱤᱫ ᱟᱢ ᱟᱢᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ",
    english: "English",
    hindi: "हिन्दी (Hindi)",
    santali: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)",

    login: "ᱵᱟᱹᱲᱤᱡ ᱞᱚᱜᱤᱱ",
    employeeCode: "ᱠᱟᱹᱢᱤ ᱠᱳᱰ",
    password: "ᱯᱟᱥᱣᱟᱨᱰ",
    loginButton: "ᱞᱚᱜᱤᱱ",

    dashboard: "ᱠᱟᱢᱯᱞᱟᱭᱟᱱᱥ ᱰᱟᱥᱵᱳᱨᱰ",
    sites: "ᱥᱟᱭᱤᱴ",
    overview: "ᱡᱚᱛᱚ",
    attentionRequired: "ᱧᱮᱞ ᱫᱟᱹᱨᱠᱟᱨ",

    emergencyControl: "ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱠᱚᱱᱴᱨᱳᱞ",
    emergencyAlert: "ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱥᱟᱹᱢᱟᱹᱪ",
    sosActive: "SOS ᱟᱠᱛᱤᱵ",
    activateSOS: "ᱟᱯᱟᱛᱠᱟᱞᱤᱱ SOS ᱟᱠᱛᱤᱵ ᱢᱮ",
    resolveEmergency: "ᱟᱯᱟᱛᱠᱟᱞ ᱥᱟᱹᱯᱷᱟ ᱢᱮ",
    acknowledgeAlert: "ᱥᱟᱹᱢᱟᱹᱪ ᱥᱤᱠᱟᱹᱨ ᱢᱮ"
  }
};

export function getTranslations(language: string) {
  const lang: Language =
    language === "hi" || language === "sat" ? language : "en";

  return translations[lang];
}