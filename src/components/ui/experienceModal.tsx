import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { userProfileService } from "@/services/userService";
import { Experience } from "@/types/profile";

// ✅ هنا بنعرف الـ Props اللي كان الـ TypeScript بيدور عليها
interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Experience;
  onSuccess: () => void;
}

export const ExperienceModal = ({ isOpen, onClose, initialData, onSuccess }: ExperienceModalProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get("title") as string,
      organization: formData.get("organization") as string,
      startDate: new Date(formData.get("startDate") as string).toISOString(),
      endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string).toISOString() : undefined,
      description: formData.get("description") as string,
    };

    try {
      if (initialData?.id) {
        await userProfileService.updateUserExperience(initialData.id, data);
      } else {
        await userProfileService.addUserExperience(data);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving experience", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Experience" : "Add Experience"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Job Title</Label><Input name="title" defaultValue={initialData?.title} required /></div>
          <div><Label>Organization</Label><Input name="organization" defaultValue={initialData?.organization} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Start Date</Label><Input name="startDate" type="date" defaultValue={initialData?.startDate?.split('T')[0]} required /></div>
            <div><Label>End Date</Label><Input name="endDate" type="date" defaultValue={initialData?.endDate?.split('T')[0]} /></div>
          </div>
          <div><Label>Description</Label><Textarea name="description" defaultValue={initialData?.description} required /></div>
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};