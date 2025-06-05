import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import DocumentManager from '@/components/DocumentManager';
import DataManager from '@/components/DataManager';
import LocalAIAssistant from '@/components/LocalAIAssistant';
import SettingsPanel from '@/components/SettingsPanel';
import { 
  Users, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Menu, 
  Settings, 
  Bell, 
  BarChart3,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowLeft
} from 'lucide-react';

// Declare global interface for TypeScript
declare global {
  interface Window {
    localAI?: {
      generateAutoSuggestion: (action: string, clientData?: any) => void;
    };
  }
}

const Index = () => {
  const { toast } = useToast();
  
  // États globaux
  const [clients, setClients] = useState([]);
  const [currentClient, setCurrentClient] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientFilter, setClientFilter] = useState('');
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Traductions
  const translations = {
    fr: {
      dashboard: 'Tableau de Bord',
      clients: 'Clients',
      notifications: 'Notifications',
      settings: 'Paramètres',
      addClient: 'Ajouter un Client',
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      profession: 'Profession',
      address: 'Adresse',
      notes: 'Notes',
      cvStatus: 'Statut CV',
      paymentStatus: 'Statut Paiement',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      edit: 'Modifier',
      delete: 'Supprimer',
      view: 'Voir',
      revenue: 'Revenus',
      processedCVs: 'CVs Traités',
      finalizedClients: 'Clients Finalisés',
      paidClients: 'Clients Payés'
    },
    en: {
      dashboard: 'Dashboard',
      clients: 'Clients',
      notifications: 'Notifications',
      settings: 'Settings',
      addClient: 'Add Client',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      profession: 'Profession',
      address: 'Address',
      notes: 'Notes',
      cvStatus: 'CV Status',
      paymentStatus: 'Payment Status',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      revenue: 'Revenue',
      processedCVs: 'Processed CVs',
      finalizedClients: 'Finalized Clients',
      paidClients: 'Paid Clients'
    },
    es: {
      dashboard: 'Panel de Control',
      clients: 'Clientes',
      notifications: 'Notificaciones',
      settings: 'Configuración',
      addClient: 'Añadir Cliente',
      name: 'Nombre',
      email: 'Email',
      phone: 'Teléfono',
      profession: 'Profesión',
      address: 'Dirección',
      notes: 'Notas',
      cvStatus: 'Estado CV',
      paymentStatus: 'Estado de Pago',
      save: 'Guardar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Eliminar',
      view: 'Ver',
      revenue: 'Ingresos',
      processedCVs: 'CVs Procesados',
      finalizedClients: 'Clientes Finalizados',
      paidClients: 'Clientes Pagados'
    }
  };

  const t = (key) => translations[currentLanguage][key] || key;

  // Chargement des paramètres sauvegardés
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedLanguage = localStorage.getItem('language');
    const savedClients = localStorage.getItem('clientsData');
    
    if (savedDarkMode) {
      setIsDarkMode(savedDarkMode === 'true');
    }
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    if (savedClients) {
      try {
        const parsedClients = JSON.parse(savedClients);
        setClients(parsedClients);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        loadDemoData();
      }
    } else {
      loadDemoData();
    }
  }, []);

  const loadDemoData = () => {
    const demoClients = [
      {
        id: '1',
        name: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        phone: '+33123456789',
        profession: 'Développeur Web',
        address: '123 Rue de la Paix, Paris',
        dob: '1990-05-15',
        cvStatus: 'Terminé',
        finalized: true,
        paymentStatus: 'Payé',
        amountPaid: 50000,
        recommendations: 5,
        notes: 'Client très satisfait, excellent profil technique',
        createdAt: new Date().toISOString(),
        lastContacted: new Date().toISOString(),
        tags: ['Développeur', 'Senior', 'JavaScript'],
        documents: []
      },
      {
        id: '2',
        name: 'Marie Martin',
        email: 'marie.martin@email.com',
        phone: '+33987654321',
        profession: 'Designer UX/UI',
        address: '456 Avenue des Champs, Lyon',
        dob: '1985-09-22',
        cvStatus: 'En Cours',
        finalized: false,
        paymentStatus: 'Payé Partiellement',
        amountPaid: 25000,
        recommendations: 3,
        notes: 'Portfolio impressionnant, besoin d\'améliorer la section expérience',
        createdAt: new Date().toISOString(),
        lastContacted: new Date().toISOString(),
        tags: ['Design', 'UX', 'Figma'],
        documents: []
      }
    ];
    
    setClients(demoClients);
  };

  // Sauvegarde automatique des données
  useEffect(() => {
    if (clients.length > 0) {
      localStorage.setItem('clientsData', JSON.stringify(clients));
    }
  }, [clients]);

  // Application du mode sombre
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  // Sauvegarde de la langue
  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  // Notification à l'IA lors des actions
  const notifyAI = (action, clientData = null) => {
    if (window.localAI) {
      window.localAI.generateAutoSuggestion(action, clientData);
    }
  };

  // Calcul des métriques du tableau de bord
  const getDashboardMetrics = () => {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const metrics = {
      monthlyRevenue: 0,
      monthlyCVs: 0,
      finalizedClients: clients.filter(c => c.finalized).length,
      paidClients: clients.filter(c => c.paymentStatus === 'Payé').length,
      pendingCVs: clients.filter(c => c.cvStatus === 'En Cours' || c.cvStatus === 'En Attente de Révision').length,
      totalClients: clients.length
    };

    clients.forEach(client => {
      const createdDate = new Date(client.createdAt);
      const amountPaid = client.amountPaid || 0;
      
      if (createdDate >= thisMonth) {
        metrics.monthlyRevenue += amountPaid;
        if (client.cvStatus === 'Terminé') {
          metrics.monthlyCVs++;
        }
      }
    });

    return metrics;
  };

  // Fonction pour changer de vue
  const switchView = (viewId, clientId = null) => {
    setCurrentView(viewId);
    if (viewId === 'client-detail' && clientId) {
      const client = clients.find(c => c.id === clientId);
      setCurrentClient(client);
    }
  };

  // Rendu du tableau de bord avec design amélioré
  const renderDashboard = () => {
    const metrics = getDashboardMetrics();
    
    return (
      <div className="space-y-6 lg:space-y-8">
        {/* Header section with improved spacing */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {t('dashboard')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Gestion avancée de vos clients et projets CV
            </p>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full whitespace-nowrap">
            Dernière mise à jour: {new Date().toLocaleTimeString()}
          </div>
        </div>
        
        {/* Métriques principales avec design moderne */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="p-4 lg:p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 opacity-80" />
                  <h3 className="text-sm lg:text-base font-semibold opacity-90">{t('revenue')}</h3>
                </div>
                <p className="text-2xl lg:text-3xl font-bold">{metrics.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs lg:text-sm opacity-80">FCFA ce mois</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 lg:p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 lg:w-6 lg:h-6 opacity-80" />
                  <h3 className="text-sm lg:text-base font-semibold opacity-90">{t('processedCVs')}</h3>
                </div>
                <p className="text-2xl lg:text-3xl font-bold">{metrics.monthlyCVs}</p>
                <p className="text-xs lg:text-sm opacity-80">Ce mois</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 lg:p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 opacity-80" />
                  <h3 className="text-sm lg:text-base font-semibold opacity-90">{t('finalizedClients')}</h3>
                </div>
                <p className="text-2xl lg:text-3xl font-bold">{metrics.finalizedClients}</p>
                <p className="text-xs lg:text-sm opacity-80">Total</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 lg:p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 opacity-80" />
                  <h3 className="text-sm lg:text-base font-semibold opacity-90">{t('paidClients')}</h3>
                </div>
                <p className="text-2xl lg:text-3xl font-bold">{metrics.paidClients}</p>
                <p className="text-xs lg:text-sm opacity-80">Total</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="p-4 lg:p-6 shadow-lg border-0 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 lg:mb-6 text-gray-800 dark:text-gray-200">Statut des CVs</h3>
            <div className="space-y-3 lg:space-y-4">
              {['Non Démarré', 'En Cours', 'Terminé', 'En Attente de Révision'].map((status, index) => {
                const count = clients.filter(c => c.cvStatus === status).length;
                const percentage = clients.length ? (count / clients.length) * 100 : 0;
                const colors = ['bg-gray-400', 'bg-yellow-400', 'bg-green-500', 'bg-orange-500'];
                return (
                  <div key={status} className="flex items-center space-x-3 lg:space-x-4">
                    <span className="w-24 sm:w-32 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {status}
                    </span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 lg:h-4">
                      <div 
                        className={`${colors[index]} h-3 lg:h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-1 lg:pr-2`}
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      >
                        {count > 0 && (
                          <span className="text-xs font-bold text-white">{count}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 w-8 lg:w-12 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-4 lg:p-6 shadow-lg border-0 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 lg:mb-6 text-gray-800 dark:text-gray-200">Statut des Paiements</h3>
            <div className="space-y-3 lg:space-y-4">
              {['Non Payé', 'Payé Partiellement', 'Payé'].map((status, index) => {
                const amount = clients
                  .filter(c => c.paymentStatus === status)
                  .reduce((sum, c) => sum + (c.amountPaid || 0), 0);
                const total = clients.reduce((sum, c) => sum + (c.amountPaid || 0), 0);
                const percentage = total ? (amount / total) * 100 : 0;
                const colors = ['bg-red-400', 'bg-yellow-400', 'bg-green-500'];
                return (
                  <div key={status} className="flex items-center space-x-3 lg:space-x-4">
                    <span className="w-24 sm:w-32 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {status}
                    </span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 lg:h-4">
                      <div 
                        className={`${colors[index]} h-3 lg:h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-1 lg:pr-2`}
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      >
                        {amount > 0 && (
                          <span className="text-xs font-bold text-white">
                            {(amount / 1000).toFixed(0)}k
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 w-16 lg:w-20 text-right">
                      {amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Gestion des données avec design amélioré */}
        <Card className="p-6 lg:p-8 shadow-xl border-0 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Gestion des Données</h3>
          </div>
          <DataManager 
            clients={clients}
            onDataImport={(importedClients) => {
              setClients(importedClients);
              toast({
                title: "Données importées",
                description: `${importedClients.length} clients importés avec succès`
              });
            }}
          />
        </Card>
      </div>
    );
  };

  // Rendu de la liste des clients
  const renderClientsList = () => {
    const filteredClients = clients.filter(client => {
      if (!clientFilter) return true;
      const tags = clientFilter.split(',').map(tag => tag.trim().toLowerCase());
      return tags.some(tag => 
        client.tags?.some(clientTag => clientTag.toLowerCase().includes(tag)) ||
        client.name.toLowerCase().includes(tag) ||
        client.profession.toLowerCase().includes(tag)
      );
    });

    return (
      <div className="space-y-6">
        {/* Header with improved responsive layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t('clients')}
          </h1>
          <Button 
            onClick={() => setShowClientModal(true)} 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg rounded-xl px-4 py-2 sm:px-6 sm:py-3 flex items-center space-x-2 justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addClient')}</span>
          </Button>
        </div>

        {/* Filter section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Filtrer par tags (séparés par virgules)"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="w-full sm:max-w-md border-gray-300 dark:border-gray-600 rounded-xl"
          />
        </div>

        {/* Clients grid with improved responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {filteredClients.map(client => (
            <Card key={client.id} className="p-4 lg:p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white dark:bg-gray-800 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base lg:text-lg text-gray-800 dark:text-white truncate">
                    {client.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {client.profession}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                    {client.email}
                  </p>
                  
                  {/* Tags section with improved spacing */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {client.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Action buttons with improved layout */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => switchView('client-detail', client.id)}
                      className="border-gray-300 dark:border-gray-600 rounded-lg flex-1 sm:flex-none min-w-0"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">{t('view')}</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setEditingClient(client);
                        setShowClientModal(true);
                      }}
                      className="border-gray-300 dark:border-gray-600 rounded-lg flex-1 sm:flex-none min-w-0"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">{t('edit')}</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => {
                        setClients(prev => prev.filter(c => c.id !== client.id));
                        notifyAI('client_deleted', client);
                        toast({
                          title: "Client supprimé",
                          description: `${client.name} a été supprimé avec succès`
                        });
                      }}
                      className="rounded-lg flex-shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Rendu des détails du client
  const renderClientDetail = () => {
    if (!currentClient) return null;

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => switchView('clients')}
            className="border-gray-300 dark:border-gray-600 self-start"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {currentClient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{currentClient.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{currentClient.profession}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
            <div className="space-y-3">
              <div><strong>Email:</strong> {currentClient.email}</div>
              <div><strong>Téléphone:</strong> {currentClient.phone}</div>
              <div><strong>Adresse:</strong> {currentClient.address}</div>
              <div><strong>Date de naissance:</strong> {currentClient.dob}</div>
              <div><strong>Statut CV:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  currentClient.cvStatus === 'Terminé' ? 'bg-green-100 text-green-800' :
                  currentClient.cvStatus === 'En Cours' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {currentClient.cvStatus}
                </span>
              </div>
              <div><strong>Statut Paiement:</strong>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  currentClient.paymentStatus === 'Payé' ? 'bg-green-100 text-green-800' :
                  currentClient.paymentStatus === 'Payé Partiellement' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentClient.paymentStatus}
                </span>
              </div>
              <div><strong>Montant payé:</strong> {currentClient.amountPaid?.toLocaleString() || 0} FCFA</div>
            </div>
          </Card>

          <DocumentManager 
            clientId={currentClient.id}
            documents={currentClient.documents || []}
            onDocumentsChange={(documents) => {
              const updatedClient = { ...currentClient, documents };
              setCurrentClient(updatedClient);
              setClients(prev => prev.map(c => c.id === currentClient.id ? updatedClient : c));
            }}
          />
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Notes</h3>
          <p className="text-gray-700 dark:text-gray-300">{currentClient.notes}</p>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => {
              setEditingClient(currentClient);
              setShowClientModal(true);
            }}
            className="w-full sm:w-auto"
          >
            {t('edit')}
          </Button>
          <Button 
            variant="destructive"
            onClick={() => {
              setClients(prev => prev.filter(c => c.id !== currentClient.id));
              switchView('clients');
              notifyAI('client_deleted', currentClient);
              toast({
                title: "Client supprimé",
                description: `${currentClient.name} a été supprimé avec succès`
              });
            }}
            className="w-full sm:w-auto"
          >
            {t('delete')}
          </Button>
        </div>
      </div>
    );
  };

  // Modal d'ajout/édition de client
  const ClientModal = () => {
    const [formData, setFormData] = useState(editingClient || {
      name: '',
      email: '',
      phone: '',
      profession: '',
      address: '',
      dob: '',
      cvStatus: 'Non Démarré',
      finalized: false,
      paymentStatus: 'Non Payé',
      amountPaid: 0,
      recommendations: 0,
      notes: '',
      tags: [],
      documents: []
    });

    const [tagInput, setTagInput] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!formData.name || !formData.email) {
        toast({
          title: "Erreur",
          description: "Le nom et l'email sont obligatoires",
          variant: "destructive"
        });
        return;
      }

      const clientData = {
        ...formData,
        id: editingClient ? editingClient.id : Date.now().toString(),
        createdAt: editingClient ? editingClient.createdAt : new Date().toISOString(),
        lastContacted: new Date().toISOString(),
        tags: tagInput.split(',').map(tag => tag.trim()).filter(tag => tag),
        documents: editingClient ? editingClient.documents || [] : []
      };

      if (editingClient) {
        setClients(prev => prev.map(c => c.id === editingClient.id ? clientData : c));
        notifyAI('client_updated', clientData);
        toast({
          title: "Client modifié",
          description: `${clientData.name} a été modifié avec succès`
        });
      } else {
        setClients(prev => [...prev, clientData]);
        notifyAI('client_added', clientData);
        toast({
          title: "Client ajouté",
          description: `${clientData.name} a été ajouté avec succès`
        });
      }

      setShowClientModal(false);
      setEditingClient(null);
    };

    if (!showClientModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">
                {editingClient ? 'Modifier le client' : t('addClient')}
              </h2>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowClientModal(false);
                  setEditingClient(null);
                }}
                className="rounded-lg"
              >
                ×
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    required
                    className="rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                    required
                    className="rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    className="rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Profession</label>
                  <Input
                    value={formData.profession}
                    onChange={(e) => setFormData(prev => ({...prev, profession: e.target.value}))}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Adresse</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                  className="rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Statut CV</label>
                  <select 
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    value={formData.cvStatus}
                    onChange={(e) => setFormData(prev => ({...prev, cvStatus: e.target.value}))}
                  >
                    <option value="Non Démarré">Non Démarré</option>
                    <option value="En Cours">En Cours</option>
                    <option value="Terminé">Terminé</option>
                    <option value="En Attente de Révision">En Attente de Révision</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Statut Paiement</label>
                  <select 
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData(prev => ({...prev, paymentStatus: e.target.value}))}
                  >
                    <option value="Non Payé">Non Payé</option>
                    <option value="Payé Partiellement">Payé Partiellement</option>
                    <option value="Payé">Payé</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Montant payé (FCFA)</label>
                  <Input
                    type="number"
                    value={formData.amountPaid}
                    onChange={(e) => setFormData(prev => ({...prev, amountPaid: parseInt(e.target.value) || 0}))}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags (séparés par virgules)</label>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="ex: Développeur, Senior, JavaScript"
                  className="rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                  rows={4}
                  className="rounded-lg"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowClientModal(false);
                    setEditingClient(null);
                  }}
                  className="rounded-lg w-full sm:w-auto"
                >
                  {t('cancel')}
                </Button>
                <Button type="submit" className="rounded-lg w-full sm:w-auto">
                  {t('save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        {/* Sidebar with improved responsive behavior and perfect icon alignment */}
        <div 
          className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-2xl transition-all duration-300 z-40 border-r border-gray-200 dark:border-gray-700 ${
            sidebarExpanded ? 'w-64 lg:w-80' : 'w-16 lg:w-20'
          } ${sidebarExpanded ? '' : 'lg:hover:w-64'}`}
        >
          <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-3 lg:space-x-4 ${sidebarExpanded ? '' : 'justify-center'}`}>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                  CV
                </div>
                {sidebarExpanded && (
                  <div className="min-w-0">
                    <span className="font-bold text-lg lg:text-xl text-gray-800 dark:text-white block truncate">Gestion CV</span>
                    <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 truncate">Assistant Pro</p>
                  </div>
                )}
              </div>
              {/* Menu toggle button with perfect alignment */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className={`hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:rounded-xl p-2 flex-shrink-0 ${
                  sidebarExpanded ? 'ml-2' : 'w-full flex justify-center'
                }`}
              >
                <Menu className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>
            </div>
          </div>

          <nav className="mt-6 lg:mt-8 px-2 lg:px-4">
            {[
              { id: 'dashboard', icon: BarChart3, label: t('dashboard'), color: 'text-blue-500' },
              { id: 'clients', icon: Users, label: t('clients'), color: 'text-green-500' },
              { id: 'notifications', icon: Bell, label: t('notifications'), color: 'text-yellow-500' },
              { id: 'settings', icon: Settings, label: t('settings'), color: 'text-purple-500' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => switchView(item.id)}
                className={`w-full flex items-center space-x-3 lg:space-x-4 px-3 lg:px-4 py-3 lg:py-4 mb-2 text-left transition-all duration-300 rounded-xl lg:rounded-2xl ${
                  currentView === item.id 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 text-blue-600 dark:text-blue-400 shadow-lg' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
                } ${!sidebarExpanded ? 'justify-center' : ''}`}
              >
                <item.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${currentView === item.id ? 'text-blue-500' : item.color} flex-shrink-0`} />
                {sidebarExpanded && (
                  <span className="font-medium text-sm lg:text-lg truncate">{item.label}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content with improved responsive margins */}
        <div className={`flex-1 transition-all duration-300 ${sidebarExpanded ? 'ml-64 lg:ml-80' : 'ml-16 lg:ml-20'}`}>
          {/* Header with improved responsive design and perfect alignment */}
          <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 lg:p-8 sticky top-0 z-30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                  Gestion Clients & CV
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Plateforme professionnelle avec IA locale
                </p>
              </div>
              
              <div className="flex items-center gap-3 lg:gap-6">
                <div className="flex items-center gap-2 lg:gap-3 px-2 lg:px-4 py-1 lg:py-2 bg-green-50 dark:bg-green-900/30 rounded-xl lg:rounded-2xl border border-green-200 dark:border-green-700">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <span className="text-xs lg:text-sm font-medium text-green-700 dark:text-green-300 whitespace-nowrap">IA Locale Active</span>
                </div>
                
                <select 
                  value={currentLanguage}
                  onChange={(e) => setCurrentLanguage(e.target.value)}
                  className="p-2 lg:p-3 border border-gray-300 dark:border-gray-600 rounded-xl lg:rounded-2xl bg-white dark:bg-gray-700 text-xs lg:text-sm font-medium shadow-sm hover:shadow-md transition-all min-w-0"
                >
                  <option value="fr">🇫🇷 FR</option>
                  <option value="en">🇬🇧 EN</option>
                  <option value="es">🇪🇸 ES</option>
                </select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="border-gray-300 dark:border-gray-600 rounded-xl lg:rounded-2xl px-2 lg:px-4 py-2 lg:py-3 hover:shadow-md transition-all flex-shrink-0"
                >
                  {isDarkMode ? '☀️' : '🌙'}
                </Button>
              </div>
            </div>
          </header>

          {/* Content area with improved padding and responsive design */}
          <main className="p-4 lg:p-8">
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'clients' && renderClientsList()}
            {currentView === 'client-detail' && renderClientDetail()}
            {currentView === 'notifications' && (
              <div className="text-center py-20">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Bell className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-800 dark:text-white">{t('notifications')}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg">Aucune notification pour le moment.</p>
              </div>
            )}
            {currentView === 'settings' && (
              <SettingsPanel 
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                currentLanguage={currentLanguage}
                setCurrentLanguage={setCurrentLanguage}
              />
            )}
          </main>
        </div>

        {/* Client modal */}
        <ClientModal />

        {/* Local AI Assistant */}
        <LocalAIAssistant 
          clients={clients}
          isOpen={isAiChatOpen}
          onToggle={() => setIsAiChatOpen(!isAiChatOpen)}
        />
      </div>
    </div>
  );
};

export default Index;
