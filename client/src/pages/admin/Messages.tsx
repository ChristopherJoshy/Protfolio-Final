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
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Message } from "@shared/schema";

const Messages = () => {
  const { toast } = useToast();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/messages/${id}/read`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to mark message as read",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/messages/${id}`);
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Message Deleted",
        description: "Message has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      setIsDeleteDialogOpen(false);
      setSelectedMessage(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
    
    if (!message.read) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const handleDeleteMessage = () => {
    if (selectedMessage) {
      deleteMessageMutation.mutate(selectedMessage.id);
    }
  };

  const openDeleteDialog = (message: Message) => {
    setSelectedMessage(message);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Messages</h1>
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
                    <TableHead className="text-gray-300">Sender</TableHead>
                    <TableHead className="text-gray-300">Subject</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id} className={`hover:bg-gray-700 border-gray-700 ${!message.read ? 'bg-gray-700/50' : ''}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400">
                            {message.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div>{message.name}</div>
                            <div className="text-xs text-gray-400">{message.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={`${!message.read ? 'font-medium text-white' : 'text-gray-400'}`}>
                        {message.subject}
                      </TableCell>
                      <TableCell className="text-sm text-gray-400">
                        {formatDate(message.createdAt)}
                      </TableCell>
                      <TableCell>
                        {message.read ? (
                          <Badge variant="outline" className="bg-gray-700 text-gray-400">Read</Badge>
                        ) : (
                          <Badge className="bg-primary-500/20 text-primary-400 border-primary-500">New</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                            onClick={() => handleViewMessage(message)}
                          >
                            <i className="ri-eye-line"></i>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => openDeleteDialog(message)}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {messages.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                        No messages found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-gray-800 text-gray-100 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
            <DialogDescription className="text-gray-400">
              From: {selectedMessage?.name} ({selectedMessage?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 bg-gray-700 p-4 rounded-lg max-h-60 overflow-y-auto">
            <p className="text-gray-200 whitespace-pre-wrap">{selectedMessage?.message}</p>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Received on {selectedMessage?.createdAt && formatDate(selectedMessage.createdAt)}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="border-gray-600"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="default"
              className="bg-primary-600 hover:bg-primary-700"
              onClick={() => {
                window.location.href = `mailto:${selectedMessage?.email}?subject=Re: ${selectedMessage?.subject}`;
              }}
            >
              Reply via Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 text-gray-100 border-gray-700">
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this message? This action cannot be undone.
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
              onClick={handleDeleteMessage}
              disabled={deleteMessageMutation.isPending}
            >
              {deleteMessageMutation.isPending ? (
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

export default Messages;
