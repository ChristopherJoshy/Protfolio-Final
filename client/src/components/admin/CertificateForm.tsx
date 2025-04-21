import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Certificate } from "@shared/schema";

interface CertificateFormProps {
  certificate?: Certificate;
  onSubmit: (certificate: Partial<Certificate>) => void;
  isLoading: boolean;
}

const CertificateForm = ({ certificate, onSubmit, isLoading }: CertificateFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    date: "",
    credentialUrl: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (certificate) {
      setFormData({
        title: certificate.title,
        issuer: certificate.issuer,
        date: certificate.date,
        credentialUrl: certificate.credentialUrl || "",
        imageUrl: certificate.imageUrl || "",
      });
    }
  }, [certificate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Certificate Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issuer">Issuing Organization</Label>
            <Input
              id="issuer"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              placeholder="AWS, Coursera, etc."
              className="bg-gray-700 border-gray-600"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Issue Date</Label>
          <Input
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="March 2023"
            className="bg-gray-700 border-gray-600"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="credentialUrl">Credential URL (Optional)</Label>
          <Input
            id="credentialUrl"
            name="credentialUrl"
            value={formData.credentialUrl}
            onChange={handleChange}
            placeholder="https://example.com/credential"
            className="bg-gray-700 border-gray-600"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL (Optional)</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/certificate.jpg"
            className="bg-gray-700 border-gray-600"
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              <span>{certificate ? "Updating..." : "Creating..."}</span>
            </div>
          ) : (
            <span>{certificate ? "Update Certificate" : "Create Certificate"}</span>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CertificateForm;
