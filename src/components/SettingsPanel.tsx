
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface SettingsPanelProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  currentLanguage: string;
  setCurrentLanguage: (value: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isDarkMode,
  setIsDarkMode,
  currentLanguage,
  setCurrentLanguage
}) => {
  const { toast } = useToast();
  const [currentFont, setCurrentFont] = useState('Inter');

  const fonts = [
    { name: 'Inter', value: 'Inter, sans-serif', description: 'Police moderne et lisible' },
    { name: 'Roboto', value: 'Roboto, sans-serif', description: 'Police Google élégante' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif', description: 'Police claire et professionnelle' }
  ];

  useEffect(() => {
    // Charger la police sauvegardée
    const savedFont = localStorage.getItem('selectedFont');
    if (savedFont) {
      setCurrentFont(savedFont);
      applyFont(savedFont);
    }
  }, []);

  const applyFont = (fontValue: string) => {
    document.documentElement.style.setProperty('--font-family', fontValue);
    
    // Ajouter le lien Google Fonts si nécessaire
    const fontName = fontValue.split(',')[0];
    if (fontName === 'Roboto' || fontName === 'Open Sans') {
      const linkId = 'google-fonts-link';
      let link = document.getElementById(linkId) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      
      const googleFontUrl = fontName === 'Roboto' 
        ? 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap'
        : 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap';
      
      link.href = googleFontUrl;
    }
  };

  const handleFontChange = (fontValue: string, fontName: string) => {
    setCurrentFont(fontName);
    applyFont(fontValue);
    localStorage.setItem('selectedFont', fontName);
    
    toast({
      title: "Police changée",
      description: `Police ${fontName} appliquée avec succès`
    });
  };

  const handleDarkModeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    
    toast({
      title: "Mode d'affichage",
      description: newMode ? "Mode sombre activé" : "Mode clair activé"
    });
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    
    const languageNames = {
      fr: 'Français',
      en: 'English',
      es: 'Español'
    };
    
    toast({
      title: "Langue changée",
      description: `Interface en ${languageNames[language as keyof typeof languageNames]}`
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Paramètres</h2>
      
      {/* Apparence */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Apparence</h3>
        
        <div className="space-y-4">
          {/* Mode sombre */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <span className="font-medium text-gray-800 dark:text-white">Mode sombre</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">Basculer entre les thèmes clair et sombre</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDarkModeToggle}
              className={isDarkMode ? 'bg-blue-500 text-white border-blue-500' : ''}
            >
              {isDarkMode ? '🌙 Activé' : '☀️ Désactivé'}
            </Button>
          </div>

          {/* Sélection de police */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="font-medium text-gray-800 dark:text-white block mb-2">Police d'écriture</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Choisir la police de l'interface</p>
            
            <div className="grid grid-cols-1 gap-2">
              {fonts.map((font) => (
                <button
                  key={font.name}
                  onClick={() => handleFontChange(font.value, font.name)}
                  className={`p-3 text-left rounded-lg border transition-all ${
                    currentFont === font.name
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  style={{ fontFamily: font.value }}
                >
                  <div className="font-medium">{font.name}</div>
                  <div className="text-sm opacity-70">{font.description}</div>
                  <div className="text-xs mt-1" style={{ fontFamily: font.value }}>
                    Aperçu: Le renard brun saute par-dessus le chien paresseux
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Langue */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Langue</h3>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="font-medium text-gray-800 dark:text-white block mb-2">Langue de l'interface</span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Choisir la langue de l'application</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { code: 'fr', name: 'Français', flag: '🇫🇷' },
              { code: 'en', name: 'English', flag: '🇬🇧' },
              { code: 'es', name: 'Español', flag: '🇪🇸' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-3 text-center rounded-lg border transition-all ${
                  currentLanguage === lang.code
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">{lang.flag}</div>
                <div className="font-medium text-sm">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Informations système */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Informations</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Version:</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">IA intégrée:</span>
            <span className="font-medium text-green-600">Gemini Pro ✓</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Dernière sauvegarde:</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPanel;
