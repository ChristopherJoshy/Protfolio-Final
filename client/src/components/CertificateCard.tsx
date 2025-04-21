import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Certificate } from "@shared/schema";

interface CertificateCardProps {
  certificate: Certificate;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  return (
    <Card className="bg-gray-800 hover:shadow-lg hover:shadow-primary-500/10 transform hover:-translate-y-1 transition-all duration-300 border border-gray-700 hover:border-primary-500/50 overflow-hidden group">
      <CardContent className="p-0">
        {/* Certificate Header with Gradient */}
        <div className="h-2 bg-gradient-to-r from-primary-500 to-primary-400"></div>
        
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Certificate Icon with animation */}
            <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <i className="ri-award-line text-2xl"></i>
            </div>
            
            <div className="flex-1">
              {/* Certificate Title */}
              <h3 className="font-bold text-xl mb-2 text-gray-100 group-hover:text-primary-400 transition-colors duration-300">
                {certificate.title}
              </h3>
              
              {/* Issuer and Date Info */}
              <div className="flex items-center text-sm text-gray-400 mb-3 space-x-4">
                <div className="flex items-center">
                  <i className="ri-building-line mr-1.5"></i>
                  <span>{certificate.issuer}</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-calendar-line mr-1.5"></i>
                  <span>{certificate.date}</span>
                </div>
              </div>
              
              {/* Credential Link with Animation */}
              {certificate.credentialUrl && (
                <a 
                  href={certificate.credentialUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 px-3 py-1.5 rounded-md bg-primary-500/10 text-sm text-primary-400 hover:text-primary-300 hover:bg-primary-500/20 transition-all duration-300 group-hover:translate-x-1"
                >
                  <i className="ri-link mr-1.5"></i>
                  View Credential
                  <i className="ri-external-link-line ml-1.5"></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateCard; 