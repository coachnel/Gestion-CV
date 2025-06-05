
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface AIMessage {
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

interface AIAssistantProps {
  clients: any[];
  isOpen: boolean;
  onToggle: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ clients, isOpen, onToggle }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const GEMINI_API_KEY = 'AIzaSyCsCEGXP0Q5YUKDeaqreW3_pL7VfBkrNoc';

  useEffect(() => {
    // Message de bienvenue
    if (messages.length === 0) {
      setMessages([{
        type: 'ai',
        message: 'Bonjour ! Je suis votre assistant IA pour la gestion clients. Je peux vous aider avec des analyses, des suggestions de relance, et bien plus encore. Comment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date().toISOString()
      }]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const callGeminiAPI = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 1,
              topP: 1,
              maxOutputTokens: 2048,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Désolé, je n\'ai pas pu générer une réponse.';
    } catch (error) {
      console.error('Erreur API Gemini:', error);
      return 'Désolé, je rencontre actuellement des difficultés techniques. Veuillez réessayer plus tard.';
    }
  };

  const generateContextualPrompt = (userMessage: string): string => {
    const stats = {
      totalClients: clients.length,
      finalizedClients: clients.filter(c => c.finalized).length,
      pendingCVs: clients.filter(c => c.cvStatus === 'En Cours' || c.cvStatus === 'En Attente de Révision').length,
      totalRevenue: clients.reduce((sum, c) => sum + (c.amountPaid || 0), 0),
      unpaidClients: clients.filter(c => c.paymentStatus === 'Non Payé').length
    };

    return `Tu es un assistant IA expert en gestion de clients et de CV. Voici le contexte de l'entreprise:

Statistiques actuelles:
- Total clients: ${stats.totalClients}
- Clients finalisés: ${stats.finalizedClients}
- CVs en cours/en attente: ${stats.pendingCVs}
- Revenus totaux: ${stats.totalRevenue.toLocaleString()} FCFA
- Clients non payés: ${stats.unpaidClients}

Question de l'utilisateur: "${userMessage}"

Réponds de manière professionnelle, concise et utile. Si la question concerne des suggestions business, des stratégies de relance, ou des analyses, utilise les données ci-dessus pour donner des conseils pertinents et personnalisés.`;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isThinking) return;

    const userMessage: AIMessage = {
      type: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsThinking(true);

    try {
      const contextualPrompt = generateContextualPrompt(inputMessage);
      const aiResponse = await callGeminiAPI(contextualPrompt);

      const aiMessage: AIMessage = {
        type: 'ai',
        message: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: AIMessage = {
        type: 'ai',
        message: 'Une erreur s\'est produite. Veuillez réessayer.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Suggestions automatiques basées sur les données
  const generateAutoSuggestion = async (action: string, clientData?: any) => {
    let prompt = '';
    
    switch (action) {
      case 'client_added':
        prompt = `Un nouveau client "${clientData.name}" vient d'être ajouté. Propose UNE suggestion d'action immédiate en 1-2 phrases.`;
        break;
      case 'client_updated':
        prompt = `Le client "${clientData.name}" a été modifié. Propose UNE suggestion de suivi en 1-2 phrases.`;
        break;
      case 'daily_insight':
        const stats = {
          totalClients: clients.length,
          pendingCVs: clients.filter(c => c.cvStatus === 'En Cours').length
        };
        prompt = `Donne UN conseil stratégique du jour basé sur: ${stats.totalClients} clients total, ${stats.pendingCVs} CVs en cours. Maximum 2 phrases.`;
        break;
    }

    if (prompt) {
      try {
        const suggestion = await callGeminiAPI(prompt);
        const aiMessage: AIMessage = {
          type: 'ai',
          message: `💡 Suggestion automatique: ${suggestion}`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Erreur génération suggestion:', error);
      }
    }
  };

  // Exposer la fonction pour utilisation externe
  useEffect(() => {
    (window as any).aiAssistant = { generateAutoSuggestion };
  }, [clients]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          🤖
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Bouton flottant */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          ✕
        </Button>
      </div>

      {/* Fenêtre de chat */}
      <div className="fixed bottom-24 right-6 z-40 w-80 md:w-96 h-96">
        <Card className="w-full h-full flex flex-col shadow-2xl border-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                🤖
              </div>
              <div>
                <h3 className="font-semibold text-sm">Assistant IA</h3>
                <p className="text-xs opacity-80">Gemini Pro</p>
              </div>
            </div>
            <div className={`w-2 h-2 rounded-full ${isThinking ? 'bg-yellow-300 animate-pulse' : 'bg-green-300'}`}></div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  msg.type === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                  <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg rounded-bl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white dark:bg-gray-800 rounded-b-lg">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question..."
                className="flex-1 text-sm"
                disabled={isThinking}
              />
              <Button 
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isThinking}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
              >
                📤
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AIAssistant;
