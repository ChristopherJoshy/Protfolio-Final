import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Project, Certificate, Message } from "@shared/schema";

const Dashboard = () => {
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
  
  const { data: certificates = [] } = useQuery<Certificate[]>({
    queryKey: ['/api/certificates'],
  });
  
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
  });

  // Calculate unread messages
  const unreadMessages = messages.filter(message => !message.read);

  // Mock view data for MVP - would be replaced with actual analytics in production
  const viewData = [
    { name: 'Jan', views: 1340 },
    { name: 'Feb', views: 1800 },
    { name: 'Mar', views: 2200 },
    { name: 'Apr', views: 1850 },
    { name: 'May', views: 2600 },
    { name: 'Jun', views: 3100 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-300">Total Projects</h4>
              <div className="bg-blue-900/30 p-2 rounded-lg text-blue-400">
                <i className="ri-folder-line"></i>
              </div>
            </div>
            <p className="text-2xl font-bold">{projects.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-300">Certificates</h4>
              <div className="bg-green-900/30 p-2 rounded-lg text-green-400">
                <i className="ri-award-line"></i>
              </div>
            </div>
            <p className="text-2xl font-bold">{certificates.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-300">Unread Messages</h4>
              <div className="bg-purple-900/30 p-2 rounded-lg text-purple-400">
                <i className="ri-mail-line"></i>
              </div>
            </div>
            <p className="text-2xl font-bold">{unreadMessages.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Page Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={viewData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                <XAxis dataKey="name" stroke="#999999" />
                <YAxis stroke="#999999" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#374151', 
                    borderColor: '#4B5563',
                    color: '#E5E7EB'
                  }} 
                />
                <Bar dataKey="views" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {messages.slice(0, 3).map((message, index) => (
              <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg transition-colors duration-300">
                <div className="bg-primary-500/20 p-2 rounded-full text-primary-400">
                  <i className="ri-mail-line"></i>
                </div>
                <div>
                  <p className="text-sm">New message from {message.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            
            {projects.slice(0, 2).map((project, index) => (
              <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg transition-colors duration-300">
                <div className="bg-blue-500/20 p-2 rounded-full text-blue-400">
                  <i className="ri-file-list-line"></i>
                </div>
                <div>
                  <p className="text-sm">Project created: {project.title}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            
            {certificates.slice(0, 2).map((cert, index) => (
              <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg transition-colors duration-300">
                <div className="bg-green-500/20 p-2 rounded-full text-green-400">
                  <i className="ri-award-line"></i>
                </div>
                <div>
                  <p className="text-sm">Certificate added: {cert.title}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(cert.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
