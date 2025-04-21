import { Switch, Route, useLocation, useParams } from "wouter";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";

import Sidebar from "@/components/admin/Sidebar";
import Dashboard from "@/pages/admin/Dashboard";
import Projects from "@/pages/admin/Projects";
import Certificates from "@/pages/admin/Certificates";
import Messages from "@/pages/admin/Messages";
import NotFound from "@/pages/not-found";

const AdminPanel = () => {
  const [location, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const { isAuthenticated, loading } = useAdminAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please log in to access the admin panel",
        variant: "destructive",
      });
      setLocation("/admin");
    }
  }, [isAuthenticated, loading, setLocation, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Switch>
            <Route path="/admin/dashboard" component={Dashboard} />
            <Route path="/admin/projects" component={Projects} />
            <Route path="/admin/certificates" component={Certificates} />
            <Route path="/admin/messages" component={Messages} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
