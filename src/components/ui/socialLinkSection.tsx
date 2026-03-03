// src/components/profile/SocialLinksSection.tsx
import { useState, useEffect } from "react";
import { Link as LinkIcon, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userProfileService } from "@/services/userService";
import { SocialLink } from "@/types/profile";

const PLATFORMS = ["LINKEDIN", "GITHUB", "PORTFOLIO", "BEHANCE"];

export const SocialLinksSection = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    userProfileService.getUserSocialLinks().then(setLinks);
  }, []);

  const addNewLink = async () => {
    try {
      // بنضيف لينك افتراضي للسيرفر عشان ناخد ID
      const newLink = await userProfileService.addUserSocialLink({ socialType: "GITHUB", url: "" });
      setLinks([...links, newLink]);
    } catch (error) { console.error("Add social failed"); }
  };

  const updateLink = async (id: number, field: string, value: string) => {
    const link = links.find(l => l.id === id);
    if (!link) return;
    const updated = { ...link, [field]: value };
    
    // تحديث محلي سريع
    setLinks(links.map(l => l.id === id ? updated : l));

    // تحديث في السيرفر (ممكن يتعمل onBlur لتقليل الـ Requests)
    try {
      await userProfileService.updateUserSocialLink(id, {
        socialType: updated.socialType,
        url: updated.url
      });
    } catch (error) { console.error("Update social failed"); }
  };

  const deleteLink = async (id: number) => {
    try {
      await userProfileService.deleteUserSocialLink(id);
      setLinks(links.filter(l => l.id !== id));
    } catch (error) { console.error("Delete social failed"); }
  };

  return (
    <div className="p-6 border rounded-xl bg-card space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Social Links</h2>
        </div>
        <Button variant="outline" size="sm" onClick={addNewLink}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>

      {links.map((link) => (
        <div key={link.id} className="flex gap-3 items-center">
          <Select value={link.socialType} onValueChange={(v) => updateLink(link.id, "socialType", v)}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input 
            placeholder="URL" 
            value={link.url} 
            onChange={(e) => updateLink(link.id, "url", e.target.value)} 
          />
          <Button variant="ghost" size="icon" onClick={() => deleteLink(link.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
};