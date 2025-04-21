import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Sidebar = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);

  // Check if current route is active
  const isActive = (path: string) => {
    return location.startsWith(path);
  };

  const handleLogout = () => {
    // Remove admin authentication
    localStorage.removeItem("isAdmin");
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    
    setLocation("/admin");
  };

  return (
    <div 
      className={`bg-gray-800 text-gray-100 h-screen flex flex-col transition-all duration-300 border-r border-gray-700 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="text-xl font-space font-bold tracking-tight flex-1">
            <span className="text-primary-500">C</span>hristopher<span className="text-primary-500">.</span>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-white"
          onClick={() => setCollapsed(!collapsed)}
        >
          <i className={`ri-${collapsed ? 'menu-unfold' : 'menu-fold'}-line text-lg`}></i>
        </Button>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          <li>
            <Link href="/admin/dashboard">
              <a className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
                isActive("/admin/dashboard") 
                  ? "bg-primary-600 text-white" 
                  : "text-gray-300 hover:bg-gray-700"
              }`}>
                <i className="ri-dashboard-line text-lg"></i>
                {!collapsed && <span>Dashboard</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/projects">
              <a className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
                isActive("/admin/projects") 
                  ? "bg-primary-600 text-white" 
                  : "text-gray-300 hover:bg-gray-700"
              }`}>
                <i className="ri-folder-line text-lg"></i>
                {!collapsed && <span>Projects</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/certificates">
              <a className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
                isActive("/admin/certificates") 
                  ? "bg-primary-600 text-white" 
                  : "text-gray-300 hover:bg-gray-700"
              }`}>
                <i className="ri-award-line text-lg"></i>
                {!collapsed && <span>Certificates</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/messages">
              <a className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
                isActive("/admin/messages") 
                  ? "bg-primary-600 text-white" 
                  : "text-gray-300 hover:bg-gray-700"
              }`}>
                <i className="ri-mail-line text-lg"></i>
                {!collapsed && <span>Messages</span>}
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <Button 
          variant="ghost" 
          className={`w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white ${
            collapsed ? "justify-center px-2" : ""
          }`}
          onClick={handleLogout}
        >
          <i className="ri-logout-box-line text-lg mr-2"></i>
          {!collapsed && <span>Logout</span>}
        </Button>
        <Link href="/">
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white mt-2 ${
              collapsed ? "justify-center px-2" : ""
            }`}
          >
            <i className="ri-global-line text-lg mr-2"></i>
            {!collapsed && <span>View Site</span>}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
