
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { X, MessageCircle, Send, Bot, User, Lightbulb } from 'lucide-react';

interface AIMessage {
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

interface LocalAIAssistantProps {
  clients: any[];
  isOpen: boolean;
  onToggle: () => void;
}

const LocalAIAssistant: React.FC<LocalAIAssistantProps> = ({ clients, isOpen, onToggle }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        type: 'ai',
        message: 'Bonjour ! Je suis votre assistant local pour la gestion clients. Je peux vous aider avec des analyses, des suggestions de relance, et des recommandations basées sur vos données. Comment puis-je vous aider ?',
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

  // Assistant IA local simple basé sur l'analyse des données
  const generateLocalResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const stats = {
      totalClients: clients.length,
      finalizedClients: clients.filter(c => c.finalized).length,
      pendingCVs: clients.filter(c => c.cvStatus === 'En Cours' || c.cvStatus === 'En Attente de Révision').length,
      totalRevenue: clients.reduce((sum, c) => sum + (c.amountPaid || 0), 0),
      unpaidClients: clients.filter(c => c.paymentStatus === 'Non Payé').length,
      paidClients: clients.filter(c => c.paymentStatus === 'Payé').length
    };

    // Analyse du message et génération de réponse appropriée
    if (lowerMessage.includes('analyse') || lowerMessage.includes('statistique') || lowerMessage.includes('résumé')) {
      return `📊 **Analyse de votre portefeuille clients :**

• **${stats.totalClients}** clients au total
• **${stats.finalizedClients}** clients finalisés (${((stats.finalizedClients / stats.totalClients) * 100).toFixed(1)}%)
• **${stats.pendingCVs}** CVs en cours de traitement
• **${stats.totalRevenue.toLocaleString()} FCFA** de revenus totaux
• **${stats.unpaidClients}** clients non payés à relancer

${stats.unpaidClients > 0 ? '⚠️ **Recommandation :** Priorisez la relance des clients non payés.' : '✅ **Excellent :** Tous vos clients sont à jour dans leurs paiements !'}`;
    }

    if (lowerMessage.includes('relance') || lowerMessage.includes('impayé') || lowerMessage.includes('paiement')) {
      const unpaidClients = clients.filter(c => c.paymentStatus === 'Non Payé');
      if (unpaidClients.length === 0) {
        return "✅ **Parfait !** Aucun client n'a de paiement en attente. Votre gestion financière est excellente !";
      }
      
      const clientNames = unpaidClients.slice(0, 3).map(c => c.name).join(', ');
      return `💰 **Relances recommandées :**

**${unpaidClients.length}** clients à relancer :
${clientNames}${unpaidClients.length > 3 ? ` et ${unpaidClients.length - 3} autres...` : ''}

**Message type :** "Bonjour [Nom], j'espère que tout va bien. Pourriez-vous me confirmer le statut du paiement pour votre CV ? N'hésitez pas si vous avez des questions. Cordialement."`;
    }

    if (lowerMessage.includes('recommandation') || lowerMessage.includes('conseil') || lowerMessage.includes('améliorer')) {
      const completionRate = (stats.finalizedClients / stats.totalClients) * 100;
      const paymentRate = (stats.paidClients / stats.totalClients) * 100;

      return `💡 **Recommandations personnalisées :**

${completionRate < 70 ? '🔄 **Productivité :** Accélérez le traitement des CVs en cours pour améliorer la satisfaction client.' : ''}
${stats.pendingCVs > 5 ? '⏰ **Urgence :** Plus de 5 CVs en attente - considérez déléguer ou prioriser.' : ''}
${paymentRate < 80 ? '💳 **Finances :** Améliorez votre processus de facturation (acomptes, rappels automatiques).' : ''}
${stats.totalClients < 10 ? '📈 **Croissance :** Développez votre réseau et vos canaux d\'acquisition client.' : ''}

**Action prioritaire :** ${stats.unpaidClients > 0 ? 'Relancez les impayés' : stats.pendingCVs > 0 ? 'Finalisez les CVs en cours' : 'Prospectez de nouveaux clients'}`;
    }

    if (lowerMessage.includes('objectif') || lowerMessage.includes('but') || lowerMessage.includes('croissance')) {
      const monthlyTarget = Math.max(100000, stats.totalRevenue * 1.2);
      return `🎯 **Objectifs suggérés :**

**Objectif mensuel :** ${monthlyTarget.toLocaleString()} FCFA
**Clients cibles :** ${Math.ceil(monthlyTarget / 50000)} nouveaux clients
**Taux de conversion :** Maintenir 85%+ de satisfaction

**Plan d'action :**
1. Finaliser tous les CVs en cours
2. Relancer les impayés sous 48h
3. Prospecter 3-5 nouveaux clients/semaine
4. Optimiser vos processus de livraison`;
    }

    // Réponse par défaut avec des conseils généraux
    return `🤖 **Assistant local activé !**

Je peux vous aider avec :
• **"analyse"** - Statistiques détaillées
• **"relance"** - Gestion des impayés  
• **"recommandations"** - Conseils d'amélioration
• **"objectifs"** - Planification de croissance

Ou posez-moi une question spécifique sur vos clients !

**État actuel :** ${stats.totalClients} clients, ${stats.finalizedClients} finalisés, ${stats.totalRevenue.toLocaleString()} FCFA de revenus.`;
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

    // Simulation d'un délai de traitement pour l'effet "réflexion"
    setTimeout(() => {
      const aiResponse = generateLocalResponse(inputMessage);
      const aiMessage: AIMessage = {
        type: 'ai',
        message: aiResponse,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsThinking(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Génération automatique de suggestions
  const generateAutoSuggestion = async (action: string, clientData?: any) => {
    let suggestion = '';
    
    switch (action) {
      case 'client_added':
        suggestion = `🎉 Nouveau client "${clientData.name}" ajouté ! Pensez à planifier un premier contact dans les 24h pour optimiser l'engagement.`;
        break;
      case 'client_updated':
        suggestion = `✏️ Client "${clientData.name}" modifié. Assurez-vous que tous les documents et paiements sont à jour.`;
        break;
      case 'client_deleted':
        suggestion = `🗑️ Client supprimé. N'oubliez pas de sauvegarder vos données importantes avant suppression définitive.`;
        break;
      case 'daily_insight':
        const pendingCount = clients.filter(c => c.cvStatus === 'En Cours').length;
        if (pendingCount > 0) {
          suggestion = `📋 Rappel quotidien : ${pendingCount} CV(s) en cours à finaliser. Productivité optimale = 2-3 CVs/jour.`;
        }
        break;
    }

    if (suggestion) {
      const aiMessage: AIMessage = {
        type: 'ai',
        message: `💡 ${suggestion}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  // Exposer la fonction pour utilisation externe
  useEffect(() => {
    (window as any).localAI = { generateAutoSuggestion };
  }, [clients]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="fixed bottom-24 right-6 z-40 w-80 md:w-96 h-[500px]">
        <Card className="w-full h-full flex flex-col shadow-2xl border-0 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Assistant Local IA</h3>
                <p className="text-xs opacity-80">Analyse & Recommandations</p>
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${isThinking ? 'bg-yellow-300 animate-pulse' : 'bg-green-300'}`}></div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                  msg.type === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-md' 
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md shadow-md'
                }`}>
                  <div className="flex items-start space-x-2">
                    {msg.type === 'ai' && <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />}
                    {msg.type === 'user' && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                      <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl rounded-bl-md shadow-md">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-white dark:bg-gray-800">
            <div className="flex space-x-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Demandez une analyse, des conseils..."
                className="flex-1 text-sm rounded-xl border-gray-200 dark:border-gray-600"
                disabled={isThinking}
              />
              <Button 
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isThinking}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 rounded-xl px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default LocalAIAssistant;
