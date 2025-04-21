import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DialogFooter } from "@/components/ui/dialog";
import { Project } from "@shared/schema";

interface ProjectFormProps {
  project?: Project;
  onSubmit: (project: Partial<Project>) => void;
  isLoading: boolean;
}

const ProjectForm = ({ project, onSubmit, isLoading }: ProjectFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    imageUrl: "",
    demoLink: "",
    githubLink: "",
    featured: false,
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        techStack: project.techStack,
        imageUrl: project.imageUrl || "",
        demoLink: project.demoLink || "",
        githubLink: project.githubLink || "",
        featured: project.featured,
      });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }));
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
            <Label htmlFor="title">Project Title</Label>
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
            <Label htmlFor="techStack">Technologies Used</Label>
            <Input
              id="techStack"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="JavaScript, React, Node.js"
              className="bg-gray-700 border-gray-600"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 min-h-[100px]"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="demoLink">Demo Link (Optional)</Label>
            <Input
              id="demoLink"
              name="demoLink"
              value={formData.demoLink}
              onChange={handleChange}
              placeholder="https://example.com"
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubLink">GitHub Link (Optional)</Label>
            <Input
              id="githubLink"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
              className="bg-gray-700 border-gray-600"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL (Optional)</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="bg-gray-700 border-gray-600"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="featured">Featured Project</Label>
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
              <span>{project ? "Updating..." : "Creating..."}</span>
            </div>
          ) : (
            <span>{project ? "Update Project" : "Create Project"}</span>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProjectForm;
