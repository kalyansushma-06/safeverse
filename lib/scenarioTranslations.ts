import {
  MISSIONS,
  Mission,
  MissionChoice,
  MissionStep,
  ChoiceReason
} from "@/lib/scenarios";

import { Language } from "@/lib/i18n";

type ChoiceTranslation = {
  label: string;
  headline: string;
  explanation: string;
};

type StepTranslation = {
  prompt: string;
  choices: Record<string, ChoiceTranslation>;
  reasons?: Record<string, string>;
};

type MissionTranslation = {
  title: string;
  description: string;
  badgeName: string;
  steps: Record<string, StepTranslation>;
};

const translations: Record<
  Exclude<Language, "en">,
  Record<string, MissionTranslation>
> = {
  hi: {
    "fire-l1": {
      title: "अग्नि आपातकाल",
      description:
        "उत्पादन क्षेत्र में आग लग गई है। आपके पास सुरक्षित स्थान तक पहुँचने के लिए 90 सेकंड हैं।",
      badgeName: "अग्नि प्रतिक्रिया विशेषज्ञ",

      steps: {
        "fire-l1-s1": {
          prompt:
            "आप एक औद्योगिक क्षेत्र के अंदर हैं। आपातकाल हो गया है। सुरक्षित निकास की पहचान करें।",

          choices: {
            "exit-a": {
              label:
                "निकास A — सबसे पास, लेकिन आग के स्रोत के पास से जाता है",
              headline: "गलत निर्णय।",
              explanation:
                "यह मार्ग आग के स्रोत के बहुत पास से गुजरता है। केवल दूरी कम होना किसी निकास को सुरक्षित नहीं बनाता — दरवाजे तक पहुँचने के रास्ते में क्या है, हमेशा जाँचें।"
            },

            "exit-b": {
              label:
                "निकास B — प्रकाशित सुरक्षा संकेत से चिह्नित, रास्ता साफ है",
              headline: "सही निर्णय।",
              explanation:
                "निकास B चिह्नित आपातकालीन मार्ग का अनुसरण करता है और खतरे वाले क्षेत्र से बचता है। यह थोड़ा दूर होने के बावजूद सही विकल्प है।"
            },

            "exit-c": {
              label:
                "निकास C — मशीनरी क्षेत्र से होकर जाने वाला छोटा रास्ता",
              headline: "गलत निर्णय।",
              explanation:
                "आपातकाल के दौरान मशीनरी क्षेत्र से गुजरने पर फँसने का खतरा हो सकता है और यह अन्य कर्मचारियों के निकासी मार्ग को भी बाधित कर सकता है।"
            }
          },

          reasons: {
            r1: "यह सबसे पास का निकास था",
            r2: "यह सबसे आसानी से दिखाई दे रहा था",
            r3: "मैंने सुरक्षा संकेत का पालन किया",
            r4: "यह रास्ता कम भीड़ वाला लगा",
            r5: "मैंने खतरे पर ध्यान नहीं दिया"
          }
        },

        "fire-l1-s2": {
          prompt:
            "आप असेंबली क्षेत्र तक पहुँच चुके हैं। अलार्म अभी भी सक्रिय हैं। अब आप क्या करेंगे?",

          choices: {
            "report-in": {
              label:
                "असेंबली क्षेत्र में अपनी उपस्थिति दर्ज करें और कर्मचारियों की गिनती पूरी होने की प्रतीक्षा करें",
              headline: "सही निर्णय।",
              explanation:
                "अपनी उपस्थिति दर्ज कराने से पर्यवेक्षक यह सुनिश्चित कर सकते हैं कि सभी लोग सुरक्षित हैं। आधिकारिक अनुमति से पहले इमारत में वापस जाना अतिरिक्त चोट का जोखिम बढ़ा सकता है।"
            },

            "re-enter": {
              label: "अपना सामान लेने के लिए वापस अंदर जाएँ",
              headline: "गलत निर्णय।",
              explanation:
                "व्यक्तिगत सामान लेने के लिए सक्रिय खतरे वाले क्षेत्र में वापस जाना उचित नहीं है और इससे पूरी टीम की गिनती में देरी हो सकती है।"
            }
          }
        }
      }
    },

    "gas-l1": {
      title: "गैस रिसाव",
      description:
        "खतरनाक क्षेत्र की पहचान करें और आगे बढ़ने से पहले आवश्यक PPE चुनें।",
      badgeName: "खतरा पहचान विशेषज्ञ",

      steps: {
        "gas-l1-s1": {
          prompt:
            "पास में गैस डिटेक्टर का अलार्म बज रहा है। फर्श पर खतरनाक क्षेत्र की पहचान करें।",

          choices: {
            "zone-1": {
              label:
                "वेंटिलेशन डक्ट के पास का क्षेत्र (कम हवा वाला कोना)",
              headline: "सही निर्णय।",
              explanation:
                "कम हवा वाले स्थानों में गैस जमा हो सकती है। वेंटिलेशन का कम प्रवाह वाला क्षेत्र वह स्थान है जहाँ खतरे का स्तर बढ़ सकता है।"
            },

            "zone-2": {
              label: "खुले लोडिंग बे के दरवाजे के पास का क्षेत्र",
              headline: "गलत निर्णय।",
              explanation:
                "खुला लोडिंग बे क्षेत्र में हवा का प्रवाह बढ़ा सकता है, इसलिए बंद या कम-वेंटिलेशन वाले स्थानों की तुलना में वहाँ गैस की सांद्रता अलग हो सकती है।"
            }
          },

          reasons: {
            r1: "वहाँ गंध अधिक तेज लगी",
            r2: "डिटेक्टर उसके सबसे पास था",
            r3: "मैंने फर्श के नक्शे के आधार पर अनुमान लगाया",
            r4: "मैंने खतरे पर ध्यान नहीं दिया"
          }
        },

        "gas-l1-s2": {
          prompt:
            "वाल्व बंद करने के लिए चिह्नित क्षेत्र में प्रवेश करने से पहले आवश्यक PPE चुनें।",

          choices: {
            "ppe-full": {
              label:
                "फुल-फेस रेस्पिरेटर + रसायन-रोधी दस्ताने",
              headline: "सही निर्णय।",
              explanation:
                "गैस रिसाव की पुष्टि होने पर प्रवेश से पहले उचित श्वसन सुरक्षा और रसायन-रोधी दस्ताने जैसे निर्धारित PPE का उपयोग करना आवश्यक है।"
            },

            "ppe-dust": {
              label: "सामान्य धूल मास्क + काम के दस्ताने",
              headline: "गलत निर्णय।",
              explanation:
                "धूल मास्क कणों से सुरक्षा के लिए होते हैं और किसी गैस के विरुद्ध आवश्यक सुरक्षा प्रदान नहीं करते।"
            }
          }
        }
      }
    },

    "machinery-l1": {
      title: "औद्योगिक क्षेत्र",
      description:
        "उपकरण की सर्विसिंग से पहले लॉकआउट-टैगआउट सुरक्षा प्रक्रिया पूरी करें।",
      badgeName: "प्रक्रिया विशेषज्ञ",

      steps: {
        "machinery-l1-s1": {
          prompt:
            "आपको कन्वेयर में फँसी वस्तु को हटाना है। मशीन को छूने से पहले पहला कदम क्या होना चाहिए?",

          choices: {
            lockout: {
              label: "पावर स्रोत को लॉकआउट और टैगआउट करें",
              headline: "सही निर्णय।",
              explanation:
                "फँसी हुई मशीन पर किसी भी प्रकार का संपर्क करने से पहले लॉकआउट-टैगआउट प्रक्रिया पूरी करनी चाहिए, चाहे काम छोटा ही क्यों न हो।"
            },

            "quick-fix": {
              label:
                "बेल्ट रुकी हुई है, इसलिए जल्दी से हाथ अंदर डालें",
              headline: "गलत निर्णय।",
              explanation:
                "रुकी हुई बेल्ट का अर्थ यह नहीं है कि मशीन पूरी तरह ऊर्जा-मुक्त है। संग्रहीत ऊर्जा या अचानक मशीन चालू होने से गंभीर चोट हो सकती है।"
            }
          }
        }
      }
    }
  },

  sat: {
    "fire-l1": {
      title: "ᱢᱟᱨᱟᱝ ᱵᱤᱯᱟᱹᱛ",
      description:
        "ᱯᱨᱚᱰᱟᱠᱥᱚᱱ ᱡᱟᱭᱜᱟ ᱨᱮ ᱥᱮᱫ ᱜᱟᱱᱟ। ᱟᱢ 90 ᱥᱮᱠᱮᱱᱰ ᱨᱮ ᱵᱟᱹᱲᱤᱡ ᱡᱟᱭᱜᱟ ᱨᱮ ᱯᱷᱟᱹᱨᱟ ᱞᱟᱹᱜᱤᱫ ᱚᱠᱛᱚ ᱢᱮᱱᱟ।",
      badgeName: "ᱥᱮᱫ ᱨᱮᱥᱯᱚᱱᱰᱟᱨ",

      steps: {
        "fire-l1-s1": {
          prompt:
            "ᱟᱢ ᱢᱤᱫ ᱤᱱᱰᱟᱥᱴᱨᱤᱭᱟᱞ ᱡᱟᱭᱜᱟ ᱨᱮ ᱢᱮᱱᱟᱢᱟ। ᱢᱤᱫ ᱵᱤᱯᱟᱹᱛ ᱦᱩᱭ ᱮᱱᱟ। ᱥᱟᱹᱞᱟᱢ ᱯᱷᱟᱹᱨᱟ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱹᱲᱤᱡ ᱫᱟᱨᱡᱟ ᱵᱟᱪᱷᱟᱣ ᱢᱮ।",

          choices: {
            "exit-a": {
              label:
                "ᱫᱟᱨᱡᱟ A — ᱡᱟᱹᱥᱛᱤ ᱡᱟᱹᱯᱛᱤ, ᱢᱮᱱᱠᱷᱟᱱ ᱥᱮᱫ ᱡᱟᱭᱜᱟ ᱥᱮᱫ ᱛᱮ ᱵᱟᱹᱜᱤ ᱟᱠᱟᱱᱟ",
              headline: "ᱵᱟᱝ ᱥᱩᱦᱤ ᱵᱟᱪᱷᱟᱣ।",
              explanation:
                "ᱱᱚᱣᱟ ᱫᱟᱨᱡᱟ ᱥᱮᱫ ᱡᱟᱭᱜᱟ ᱥᱮᱫ ᱛᱮ ᱥᱟᱢᱟᱱᱟ। ᱫᱟᱨᱡᱟ ᱫᱩᱨ ᱥᱩᱫᱷᱟ ᱥᱟᱨᱟᱜ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ।"
            },

            "exit-b": {
              label:
                "ᱫᱟᱨᱡᱟ B — ᱥᱟᱞᱟᱢ ᱥᱤᱱᱟᱹᱝ ᱛᱮ ᱪᱤᱱᱦᱟᱹᱣᱟᱜ, ᱫᱟᱲᱟᱱ ᱥᱟᱯᱷᱟ",
              headline: "ᱥᱩᱦᱤ ᱵᱟᱪᱷᱟᱣ।",
              explanation:
                "ᱫᱟᱨᱡᱟ B ᱥᱤᱱᱟᱹᱝ ᱮᱢᱟᱜ ᱵᱤᱯᱟᱹᱛ ᱵᱟᱪᱷᱟᱣ ᱫᱟᱲᱟᱱ ᱛᱮ ᱞᱟᱦᱟ ᱮᱫᱟ। ᱱᱚᱣᱟ ᱥᱩᱦᱤ ᱵᱟᱪᱷᱟᱣ।"
            },

            "exit-c": {
              label:
                "ᱫᱟᱨᱡᱟ C — ᱢᱟᱥᱤᱱᱟᱨᱤ ᱡᱟᱭᱜᱟ ᱛᱮ ᱠᱷᱟᱴᱚ ᱫᱟᱲᱟᱱ",
              headline: "ᱵᱟᱝ ᱥᱩᱦᱤ ᱵᱟᱪᱷᱟᱣ।",
              explanation:
                "ᱵᱤᱯᱟᱹᱛ ᱚᱠᱛᱚ ᱢᱟᱥᱤᱱᱟᱨᱤ ᱡᱟᱭᱜᱟ ᱛᱮ ᱫᱟᱲᱟᱱ ᱨᱮ ᱡᱩᱞ ᱥᱮ ᱟᱲᱟᱜ ᱡᱚᱠᱷᱚᱢ ᱦᱩᱭᱩᱜᱼᱟ।"
            }
          },

          reasons: {
            r1: "ᱱᱚᱣᱟ ᱡᱟᱹᱥᱛᱤ ᱡᱟᱹᱯᱛᱤ ᱫᱟᱨᱡᱟ ᱛᱟᱦᱮᱱᱟ",
            r2: "ᱱᱚᱣᱟ ᱥᱚᱦᱚᱡ ᱧᱮᱞ ᱦᱩᱭᱩᱜᱼᱟ",
            r3: "ᱤᱧ ᱥᱤᱱᱟᱹᱝ ᱠᱟᱛᱷᱟ ᱛᱮ ᱞᱟᱦᱟ ᱮᱱᱟ",
            r4: "ᱱᱚᱣᱟ ᱠᱚᱢ ᱵᱷᱤᱲ ᱫᱟᱲᱟᱱ ᱞᱮᱠᱟ ᱧᱮᱞᱚᱜ ᱠᱟᱱᱟ",
            r5: "ᱤᱧ ᱵᱤᱯᱟᱹᱛ ᱵᱟᱝ ᱧᱮᱞ ᱠᱮᱫᱟ"
          }
        },

        "fire-l1-s2": {
          prompt:
            "ᱟᱢ ᱟᱥᱮᱢᱵᱞᱤ ᱡᱟᱭᱜᱟ ᱨᱮ ᱯᱟᱹᱦᱩᱸᱪ ᱮᱱᱟᱢ। ᱥᱟᱞᱟᱢ ᱟᱞᱟᱨᱢ ᱮᱠᱷᱚᱱ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟ। ᱱᱚᱣᱟ ᱛᱟᱭᱚᱢ ᱪᱮᱫ ᱢᱮᱭᱟᱢᱟ?",

          choices: {
            "report-in": {
              label:
                "ᱟᱥᱮᱢᱵᱞᱤ ᱡᱟᱭᱜᱟ ᱨᱮ ᱟᱢᱟᱜ ᱩᱯᱚᱥᱛᱷᱤᱛᱤ ᱨᱤᱯᱚᱨᱴ ᱢᱮ ᱟᱨ ᱜᱚᱱᱚᱝ ᱪᱟᱵᱟ ᱧᱟᱢ ᱯᱟᱹᱨᱦᱟᱹᱣ ᱢᱮ",
              headline: "ᱥᱩᱦᱤ ᱵᱟᱪᱷᱟᱣ।",
              explanation:
                "ᱩᱯᱚᱥᱛᱷᱤᱛᱤ ᱨᱤᱯᱚᱨᱴ ᱠᱟᱛᱮ ᱥᱩᱯᱟᱨᱵᱟᱭᱡᱟᱨ ᱥᱟᱱᱟᱢ ᱠᱚ ᱠᱟᱛᱷᱟ ᱧᱟᱢ ᱮᱢᱟᱭᱟ।"
            },

            "re-enter": {
              label: "ᱟᱢᱟᱜ ᱡᱤᱱᱤᱥ ᱧᱟᱢ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝᱞᱮ ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱫᱚᱦᱲᱟ ᱥᱚᱨ ᱢᱮ",
              headline: "ᱵᱟᱝ ᱥᱩᱦᱤ ᱵᱟᱪᱷᱟᱣ।",
              explanation:
                "ᱡᱤᱱᱤᱥ ᱞᱟᱹᱜᱤᱫ ᱵᱤᱯᱟᱹᱛ ᱡᱟᱭᱜᱟ ᱨᱮ ᱫᱚᱦᱲᱟ ᱥᱚᱨ ᱵᱟᱝ ᱞᱟᱹᱭᱠᱟᱹᱭᱟ।"
            }
          }
        }
      }
    },

    "gas-l1": {
      title: "ᱜᱮᱥ ᱞᱮᱠ",
      description:
        "ᱡᱚᱠᱷᱚᱢ ᱡᱟᱭᱜᱟ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ ᱟᱨ ᱞᱟᱦᱟ ᱮᱞ ᱢᱟᱹᱱᱟᱣ ᱯᱤᱯᱤᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ।",
      badgeName: "ᱡᱚᱠᱷᱚᱢ ᱪᱤᱱᱦᱟᱹᱣ",

      steps: {
        "gas-l1-s1": {
          prompt:
            "ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱟᱹᱛᱩ ᱨᱮ ᱟᱞᱟᱨᱢ ᱮᱢᱚᱜᱼᱟ। ᱡᱟᱭᱜᱟ ᱨᱮ ᱡᱚᱠᱷᱚᱢ ᱮᱞᱟᱠᱟ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ।",

          choices: {
            "zone-1": {
              label:
                "ᱵᱷᱮᱱᱴᱤᱞᱮᱥᱚᱱ ᱰᱟᱠᱴ ᱫᱟᱨᱮ (ᱠᱚᱢ ᱦᱟᱣᱟ ᱠᱚᱱᱟ)",
              headline: "ᱥᱩᱦᱤ ᱵᱟᱪᱷᱟᱣ।",
              explanation:
                "ᱠᱚᱢ ᱦᱟᱣᱟ ᱡᱟᱭᱜᱟ ᱨᱮ ᱜᱮᱥ ᱡᱚᱢᱟ ᱦᱩᱭᱩᱜᱼᱟ।"
            },

            "zone-2": {
              label:
                "ᱵᱚᱸᱫ ᱵᱟᱝ ᱠᱟᱱ ᱞᱳᱰᱤᱝ ᱵᱮ ᱫᱟᱨᱡᱟ ᱫᱟᱨᱮ ᱡᱟᱭᱜᱟ",
              headline: "ᱵᱟᱝ ᱥᱩᱦᱤ ᱵᱟᱪᱷᱟᱣ।",
              explanation:
                "ᱠᱷᱩᱞᱟ ᱞᱳᱰᱤᱝ ᱵᱮ ᱨᱮ ᱦᱟᱣᱟ ᱪᱟᱹᱞᱩ ᱠᱟᱱᱟ।"
            }
          },

          reasons: {
            r1: "ᱱᱚᱸᱰᱮ ᱜᱚᱲᱚ ᱵᱟᱹᱲᱛᱤ ᱧᱮᱞᱮᱱᱟ",
            r2: "ᱰᱤᱴᱮᱠᱴᱚᱨ ᱱᱚᱸᱰᱮ ᱥᱟᱶ ᱨᱮ ᱛᱟᱦᱮᱱᱟ",
            r3: "ᱤᱧ ᱯᱷᱞᱚᱨ ᱯᱞᱟᱱ ᱛᱮ ᱟᱱᱩᱢᱟᱱ ᱠᱮᱫᱟ",
            r4: "ᱤᱧ ᱵᱤᱯᱟᱹᱛ ᱵᱟᱝ ᱧᱮᱞ ᱠᱮᱫᱟ"
          }
        },

        "gas-l1-s2": {
          prompt:
            "ᱵᱟᱞᱵ ᱵᱚᱸᱫ ᱞᱟᱹᱜᱤᱫ ᱪᱤᱱᱦᱟᱹᱣ ᱠᱟᱱ ᱡᱟᱭᱜᱟ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱟᱲᱟᱝ ᱯᱤᱯᱤᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ।",

          choices: {
            "ppe-full": {
              label:
                "ᱯᱷᱩᱞ-ᱯᱷᱮᱥ ᱨᱮᱥᱯᱤᱨᱮᱴᱚᱨ + ᱠᱮᱢᱤᱠᱟᱞ-ᱨᱮᱥᱤᱥᱴᱮᱱᱴ ᱜᱞᱚᱵᱥ",
              headline: "ᱥᱩᱦᱤ ᱵᱟᱪᱷᱟᱣ।",
              explanation:
                "ᱜᱮᱥ ᱞᱮᱠ ᱯᱚᱨᱤᱥᱠᱟᱨ ᱦᱩᱭ ᱞᱮᱱ ᱠᱷᱚᱱ ᱵᱟᱝ ᱫᱩᱞᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱯᱚᱨᱤᱥᱠᱟᱨ ᱥᱟᱶ ᱨᱮ ᱯᱤᱯᱤᱤ ᱫᱟᱹᱨᱠᱟᱨ।"
            },

            "ppe-dust": {
              label:
                "ᱥᱟᱫᱷᱟᱨᱚᱱ ᱰᱟᱥᱴ ᱢᱟᱥᱠ + ᱠᱟᱹᱢᱤ ᱜᱞᱚᱵᱥ",
              headline: "ᱵᱟᱝ ᱥᱩᱦᱤ ᱵᱟᱪᱷᱟᱣ।",
              explanation:
                "ᱰᱟᱥᱴ ᱢᱟᱥᱠ ᱫᱷᱩᱞᱤ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱢᱮᱱᱟ; ᱜᱮᱥ ᱵᱤᱨᱩᱫᱷ ᱨᱮ ᱱᱚᱣᱟ ᱵᱟᱝ ᱥᱩᱨᱠᱷᱟ ᱮᱢᱟ।"
            }
          }
        }
      }
    },

    "machinery-l1": {
      title: "ᱤᱱᱰᱟᱥᱴᱨᱤᱭᱟᱞ ᱯᱷᱞᱚᱨ",
      description:
        "ᱢᱟᱥᱤᱱ ᱥᱟᱨᱵᱤᱥ ᱢᱟᱲᱟᱝ ᱞᱚᱠᱟᱣᱴ-ᱴᱮᱜᱽᱟᱣ ᱥᱟᱞᱟᱢ ᱯᱚᱞᱤᱥᱤ ᱪᱟᱹᱞᱩ ᱢᱮ।",
      badgeName: "ᱯᱚᱞᱤᱥᱤ ᱯᱨᱚ",

      steps: {
        "machinery-l1-s1": {
          prompt:
            "ᱟᱢ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱨᱮ ᱡᱩᱞ ᱛᱟᱦᱮᱱ ᱡᱤᱱᱤᱥ ᱚᱰᱚᱠ ᱢᱮᱭᱟᱢᱟ। ᱢᱟᱥᱤᱱ ᱪᱷᱩᱣᱟ ᱢᱟᱲᱟᱝ ᱯᱩᱭᱞᱩ ᱠᱟᱹᱢᱤ ᱪᱮᱫ?",

          choices: {
            lockout: {
              label: "ᱯᱟᱣᱟᱨ ᱥᱚᱨᱥ ᱞᱚᱠᱟᱣᱴ ᱟᱨ ᱴᱮᱜᱽᱟᱣ ᱢᱮ",
              headline: "ᱥᱩᱦᱤ ᱵᱟᱪᱷᱟᱣ।",
              explanation:
                "ᱡᱩᱞ ᱢᱟᱥᱤᱱ ᱪᱷᱩᱣᱟ ᱢᱟᱲᱟᱝ ᱞᱚᱠᱟᱣᱴ-ᱴᱮᱜᱽᱟᱣ ᱠᱟᱹᱢᱤ ᱦᱩᱭᱩᱜ ᱞᱟᱹᱜᱤᱫ ᱫᱟᱹᱨᱠᱟᱨ।"
            },

            "quick-fix": {
              label:
                "ᱵᱮᱞᱴ ᱫᱷᱟᱹᱣ ᱵᱟᱝ ᱠᱟᱱᱟ, ᱛᱟᱨᱟᱥ ᱛᱮ ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱛᱤ ᱟᱛᱟᱝ ᱢᱮ",
              headline: "ᱵᱟᱝ ᱥᱩᱦᱤ ᱵᱟᱪᱷᱟᱣ।",
              explanation:
                "ᱵᱮᱞᱴ ᱵᱟᱝ ᱫᱷᱟᱹᱣ ᱠᱟᱱᱟ ᱢᱮᱱᱛᱮ ᱢᱟᱥᱤᱱ ᱯᱩᱨᱟᱹ ᱵᱟᱝ ᱵᱚᱸᱫ ᱜᱟᱱᱟ। ᱡᱚᱢᱟ ᱥᱟᱠᱛᱤ ᱥᱮ ᱟᱪᱢᱚᱠᱟ ᱪᱟᱹᱞᱩ ᱠᱟᱛᱮ ᱡᱟᱹᱨᱩᱲ ᱡᱚᱠᱷᱚᱢ ᱦᱩᱭᱩᱜᱼᱟ।"
            }
          }
        }
      }
    }
  }
};

function translateChoice(
  choice: MissionChoice,
  translation?: ChoiceTranslation
): MissionChoice {
  if (!translation) return choice;

  return {
    ...choice,
    label: translation.label,
    feedback: {
      ...choice.feedback,
      headline: translation.headline,
      explanation: translation.explanation
    }
  };
}

function translateReasons(
  reasons: ChoiceReason[] | undefined,
  translatedReasons?: Record<string, string>
): ChoiceReason[] | undefined {
  if (!reasons || !translatedReasons) return reasons;

  return reasons.map((reason) => ({
    ...reason,
    label: translatedReasons[reason.id] ?? reason.label
  }));
}

function translateStep(
  step: MissionStep,
  translation?: StepTranslation
): MissionStep {
  if (!translation) return step;

  return {
    ...step,
    prompt: translation.prompt,
    choices: step.choices.map((choice) =>
      translateChoice(
        choice,
        translation.choices[choice.id]
      )
    ),
    reasonPrompt: translateReasons(
      step.reasonPrompt,
      translation.reasons
    )
  };
}

export function getLocalizedMission(
  mission: Mission,
  language: Language
): Mission {
  if (language === "en") return mission;

  const missionTranslation = translations[language][mission.id];

  if (!missionTranslation) return mission;

  return {
    ...mission,
    title: missionTranslation.title,
    description: missionTranslation.description,
    badge: {
      ...mission.badge,
      name: missionTranslation.badgeName
    },
    steps: mission.steps.map((step) =>
      translateStep(
        step,
        missionTranslation.steps[step.id]
      )
    )
  };
}

export function getLocalizedMissionById(
  id: string,
  language: Language
): Mission | undefined {
  const mission = MISSIONS.find((item) => item.id === id);

  if (!mission) return undefined;

  return getLocalizedMission(mission, language);
}

export function getLocalizedMissions(
  language: Language
): Mission[] {
  return MISSIONS.map((mission) =>
    getLocalizedMission(mission, language)
  );
}