import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Certificate } from "@shared/schema";

interface CertificateCardProps {
  certificate: Certificate;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  return (
    <Card className="bg-gray-800 hover:bg-gray-700 transition-colors duration-300 border-gray-700 overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 flex-shrink-0">
            <i className="ri-award-line text-2xl"></i>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 group-hover:text-primary-400 transition-colors duration-300">
              {certificate.title}
            </h3>
            <div className="flex items-center text-sm text-gray-400 mb-3">
              <i className="ri-building-line mr-1"></i>
              <span>{certificate.issuer}</span>
              <span className="mx-2">•</span>
              <i className="ri-calendar-line mr-1"></i>
              <span>{certificate.date}</span>
            </div>
            
            {certificate.credentialUrl && (
              <a 
                href={certificate.credentialUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-primary-400 hover:text-primary-300 transition-colors duration-300"
              >
                <i className="ri-link mr-1"></i>
                View Credential
                <i className="ri-external-link-line ml-1"></i>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateCard; 