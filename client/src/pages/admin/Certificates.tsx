import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Certificate } from "@shared/schema";
import CertificateForm from "@/components/admin/CertificateForm";

const Certificates = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Fetch certificates
  const { data: certificates = [], isLoading } = useQuery<Certificate[]>({
    queryKey: ['/api/certificates'],
  });

  // Add certificate mutation
  const addCertificateMutation = useMutation({
    mutationFn: async (certificate: Omit<Certificate, "id" | "createdAt">) => {
      const res = await apiRequest("POST", "/api/certificates", certificate);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Certificate Added",
        description: "Certificate has been added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/certificates'] });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add certificate",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  // Edit certificate mutation
  const editCertificateMutation = useMutation({
    mutationFn: async ({ id, certificate }: { id: number, certificate: Partial<Certificate> }) => {
      const res = await apiRequest("PUT", `/api/certificates/${id}`, certificate);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Certificate Updated",
        description: "Certificate has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/certificates'] });
      setIsEditDialogOpen(false);
      setSelectedCertificate(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update certificate",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  // Delete certificate mutation
  const deleteCertificateMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/certificates/${id}`);
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Certificate Deleted",
        description: "Certificate has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/certificates'] });
      setIsDeleteDialogOpen(false);
      setSelectedCertificate(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete certificate",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  const handleAddCertificate = (certificate: Omit<Certificate, "id" | "createdAt">) => {
    addCertificateMutation.mutate(certificate);
  };

  const handleEditCertificate = (certificate: Partial<Certificate>) => {
    if (selectedCertificate) {
      editCertificateMutation.mutate({ id: selectedCertificate.id, certificate });
    }
  };

  const handleDeleteCertificate = () => {
    if (selectedCertificate) {
      deleteCertificateMutation.mutate(selectedCertificate.id);
    }
  };

  const openEditDialog = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Certificates</h1>
        <Button 
          className="bg-primary-600 hover:bg-primary-700"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <i className="ri-add-line mr-2"></i>
          Add Certificate
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="h-60 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-gray-800 border-gray-700">
                    <TableHead className="text-gray-300">Title</TableHead>
                    <TableHead className="text-gray-300">Issuer</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((certificate) => (
                    <TableRow key={certificate.id} className="hover:bg-gray-700 border-gray-700">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400">
                            <i className="ri-award-line"></i>
                          </div>
                          <span>{certificate.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{certificate.issuer}</TableCell>
                      <TableCell>{certificate.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                            onClick={() => openEditDialog(certificate)}
                          >
                            <i className="ri-edit-line"></i>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => openDeleteDialog(certificate)}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {certificates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-gray-400">
                        No certificates found. Add your first certificate!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Certificate Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-800 text-gray-100 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Certificate</DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill in the details to add a new certificate to your portfolio.
            </DialogDescription>
          </DialogHeader>
          <CertificateForm 
            onSubmit={handleAddCertificate} 
            isLoading={addCertificateMutation.isPending} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Certificate Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 text-gray-100 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Certificate</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update the certificate details.
            </DialogDescription>
          </DialogHeader>
          {selectedCertificate && (
            <CertificateForm 
              certificate={selectedCertificate} 
              onSubmit={handleEditCertificate} 
              isLoading={editCertificateMutation.isPending} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 text-gray-100 border-gray-700">
          <DialogHeader>
            <DialogTitle>Delete Certificate</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this certificate? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="border-gray-600"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCertificate}
              disabled={deleteCertificateMutation.isPending}
            >
              {deleteCertificateMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Certificates;
