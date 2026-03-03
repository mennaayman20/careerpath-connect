import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { userProfileService } from "@/services/userService";

export default function ProjectModal({ isOpen, onClose, initialData, onSuccess }) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const payload = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      projectUrl: formData.get("projectUrl") as string,
      startDate: new Date(formData.get("startDate") as string).toISOString(),
      endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string).toISOString() : undefined,
      technologies: formData.get("technologies") as string,
    };

    try {
      if (initialData) {
        await userProfileService.updateUserProject(initialData.id, payload);
      } else {
        await userProfileService.addUserProject(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Save project failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Project" : "Add New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Project Title</Label>
              <Input name="title" defaultValue={initialData?.title} required />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Project URL</Label>
              <Input name="projectUrl" placeholder="https://github.com/..." defaultValue={initialData?.projectUrl} />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input name="startDate" type="date" defaultValue={initialData?.startDate?.split('T')[0]} required />
            </div>
            <div className="space-y-2">
              <Label>End Date (Optional)</Label>
              <Input name="endDate" type="date" defaultValue={initialData?.endDate?.split('T')[0]} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Technologies (Comma separated)</Label>
              <Input name="technologies" placeholder="React, Node.js, Tailwind" defaultValue={initialData?.technologies} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Description</Label>
              <Textarea name="description" defaultValue={initialData?.description} required />
            </div>
          </div>
          <Button type="submit" className="w-full">Save Project</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}