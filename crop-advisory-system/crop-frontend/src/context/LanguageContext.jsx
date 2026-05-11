import { createContext, useState, useContext } from 'react'

const LanguageContext = createContext()

const dictionary = {
  'GB English': {
    home: 'HOME', crops: 'CROPS', scan: 'SCAN', weather: 'WEATHER', sim: 'SIM', profile: 'PROFILE',
    greeting: 'Good Morning,', expenses: 'EXPENSES', profit: 'NET PROFIT',
    predict: 'Predict Profit', scanDisease: 'Scan Disease', cropAdvice: 'Crop Advice', 
    marketPrices: 'Market Prices', addExpense: 'Add Expense', quickActions: 'Quick Actions'
  },
  'IN हिंदी': {
    home: 'होम', crops: 'फसलें', scan: 'स्कैन', weather: 'मौसम', sim: 'सिम', profile: 'प्रोफ़ाइल',
    greeting: 'सुप्रभात,', expenses: 'खर्च', profit: 'शुद्ध लाभ',
    predict: 'मुनाफा भविष्यवाणी', scanDisease: 'रोग स्कैन', cropAdvice: 'फसल सलाह', 
    marketPrices: 'बाजार भाव', addExpense: 'खर्च जोड़ें', quickActions: 'त्वरित कार्य'
  },
  'मराठी': {
    home: 'मुख्यपृष्ठ', crops: 'पिके', scan: 'स्कॅन', weather: 'हवामान', sim: 'सिम', profile: 'प्रोफाइल',
    greeting: 'शुभ सकाळ,', expenses: 'खर्च', profit: 'निव्वळ नफा',
    predict: 'नफ्याचा अंदाज', scanDisease: 'रोग स्कॅन', cropAdvice: 'पीक सल्ला', 
    marketPrices: 'बाजारभाव', addExpense: 'खर्च जोडा', quickActions: 'त्वरित क्रिया'
  },
  'தமிழ்': {
    home: 'முகப்பு', crops: 'பயிர்கள்', scan: 'ஸ்கேன்', weather: 'வானிலை', sim: 'சிம்', profile: 'சுயவிவரம்',
    greeting: 'காலை வணக்கம்,', expenses: 'செலவுகள்', profit: 'நிகர லாபம்',
    predict: 'லாப கணிப்பு', scanDisease: 'நோய் ஸ்கேன்', cropAdvice: 'பயிர் ஆலோசனை', 
    marketPrices: 'சந்தை விலைகள்', addExpense: 'செலவைச் சேர்', quickActions: 'விரைவான செயல்கள்'
  },
  'తెలుగు': {
    home: 'హోమ్', crops: 'పంటలు', scan: 'స్కాన్', weather: 'వాతావరణం', sim: 'సిమ్', profile: 'ప్రొఫైల్',
    greeting: 'శుభోదయం,', expenses: 'ఖర్చులు', profit: 'నికర లాభం',
    predict: 'లాభ అంచనా', scanDisease: 'వ్యాధి స్కాన్', cropAdvice: 'పంట సలహా', 
    marketPrices: 'మార్కెట్ ధరలు', addExpense: 'ఖర్చు జోడించండి', quickActions: 'త్వరిత చర్యలు'
  }
}

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('GB English')

  const t = (key) => dictionary[lang]?.[key] || dictionary['GB English'][key] || key

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
