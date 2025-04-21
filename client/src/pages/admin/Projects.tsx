import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Project } from "@shared/schema";
import ProjectForm from "@/components/admin/ProjectForm";

const Projects = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Add project mutation
  const addProjectMutation = useMutation({
    mutationFn: async (project: Omit<Project, "id" | "createdAt">) => {
      const res = await apiRequest("POST", "/api/projects", project);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Project Added",
        description: "Project has been added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  // Edit project mutation
  const editProjectMutation = useMutation({
    mutationFn: async ({ id, project }: { id: number, project: Partial<Project> }) => {
      const res = await apiRequest("PUT", `/api/projects/${id}`, project);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Project Updated",
        description: "Project has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setIsEditDialogOpen(false);
      setSelectedProject(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  const handleAddProject = (project: Omit<Project, "id" | "createdAt">) => {
    addProjectMutation.mutate(project);
  };

  const handleEditProject = (project: Partial<Project>) => {
    if (selectedProject) {
      editProjectMutation.mutate({ id: selectedProject.id, project });
    }
  };

  const handleDeleteProject = () => {
    if (selectedProject) {
      deleteProjectMutation.mutate(selectedProject.id);
    }
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button 
          className="bg-primary-600 hover:bg-primary-700"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <i className="ri-add-line mr-2"></i>
          Add Project
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
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Tech Stack</TableHead>
                    <TableHead className="text-gray-300">Featured</TableHead>
                    <TableHead className="text-gray-300">Created At</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-gray-700 border-gray-700">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            project.title.toLowerCase().includes('ai') || project.title.toLowerCase().includes('mind')
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            <i className={project.title.toLowerCase().includes('ai') ? 'ri-brain-line' : 'ri-book-open-line'}></i>
                          </div>
                          <span>{project.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.split(',').slice(0, 2).map((tech, i) => (
                            <Badge key={i} variant="outline" className="bg-gray-700 text-gray-300">
                              {tech.trim()}
                            </Badge>
                          ))}
                          {project.techStack.split(',').length > 2 && (
                            <Badge variant="outline" className="bg-gray-700 text-gray-300">
                              +{project.techStack.split(',').length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {project.featured ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500">Yes</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-700 text-gray-400">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(project.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                            onClick={() => openEditDialog(project)}
                          >
                            <i className="ri-edit-line"></i>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => openDeleteDialog(project)}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {projects.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                        No projects found. Add your first project!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Project Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-800 text-gray-100 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill in the details to add a new project to your portfolio.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm 
            onSubmit={handleAddProject} 
            isLoading={addProjectMutation.isPending} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 text-gray-100 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update the project details.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <ProjectForm 
              project={selectedProject} 
              onSubmit={handleEditProject} 
              isLoading={editProjectMutation.isPending} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 text-gray-100 border-gray-700">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this project? This action cannot be undone.
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
              onClick={handleDeleteProject}
              disabled={deleteProjectMutation.isPending}
            >
              {deleteProjectMutation.isPending ? (
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

export default Projects;
