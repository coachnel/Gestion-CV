
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DataManagerProps {
  clients: any[];
  onDataImport: (data: any[]) => void;
}

const DataManager: React.FC<DataManagerProps> = ({ clients, onDataImport }) => {
  const { toast } = useToast();

  const exportData = () => {
    try {
      const dataToExport = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        clients: clients,
        metadata: {
          totalClients: clients.length,
          exportedBy: "Gestion CV Pro"
        }
      };

      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `gestion-cv-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export réussi",
        description: `${clients.length} clients exportés avec succès`
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive"
      });
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast({
        title: "Format incorrect",
        description: "Veuillez sélectionner un fichier JSON",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        if (!jsonData.clients || !Array.isArray(jsonData.clients)) {
          throw new Error("Format de données invalide");
        }

        // Validation basique de la structure des clients
        const validClients = jsonData.clients.filter((client: any) => 
          client.id && client.name && client.email
        );

        if (validClients.length === 0) {
          throw new Error("Aucun client valide trouvé");
        }

        onDataImport(validClients);

        toast({
          title: "Import réussi",
          description: `${validClients.length} clients importés avec succès`
        });
      } catch (error) {
        toast({
          title: "Erreur d'import",
          description: "Fichier JSON invalide ou corrompu",
          variant: "destructive"
        });
      }
    };

    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={exportData}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          📥 Exporter toutes les données
        </Button>
        
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={importData}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="outline" className="w-full">
            📤 Importer des données
          </Button>
        </div>
      </div>
      
      <p className="text-xs text-gray-500">
        L'export crée un fichier JSON avec toutes vos données. L'import remplace les données actuelles.
      </p>
    </div>
  );
};

export default DataManager;
