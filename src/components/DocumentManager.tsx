
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  type: string;
  content: string;
  uploadDate: string;
}

interface DocumentManagerProps {
  clientId: string;
  documents: Document[];
  onDocumentsChange: (documents: Document[]) => void;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  clientId,
  documents,
  onDocumentsChange
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Type de fichier non supporté",
        description: "Seuls les fichiers PDF, DOCX et PPTX sont acceptés",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale autorisée est de 10MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newDocument: Document = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type,
          content: content.split(',')[1], // Remove data:type;base64, prefix
          uploadDate: new Date().toISOString()
        };

        const updatedDocuments = [...documents, newDocument];
        onDocumentsChange(updatedDocuments);

        toast({
          title: "Document ajouté",
          description: `${file.name} a été ajouté avec succès`
        });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'ajouter le document",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadDocument = (doc: Document) => {
    try {
      const link = document.createElement('a');
      link.href = `data:${doc.type};base64,${doc.content}`;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    }
  };

  const deleteDocument = (docId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== docId);
    onDocumentsChange(updatedDocuments);
    toast({
      title: "Document supprimé",
      description: "Le document a été supprimé avec succès"
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Documents</h3>
      
      <div className="mb-4">
        <Input
          type="file"
          accept=".pdf,.docx,.pptx"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="mb-2"
        />
        <p className="text-xs text-gray-500">
          Formats acceptés: PDF, DOCX, PPTX (max 10MB)
        </p>
      </div>

      {documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">{doc.name}</p>
                <p className="text-xs text-gray-500">
                  Ajouté le {new Date(doc.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadDocument(doc)}
                >
                  📥 Télécharger
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteDocument(doc.id)}
                >
                  🗑️
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          Aucun document ajouté
        </p>
      )}
    </Card>
  );
};

export default DocumentManager;
