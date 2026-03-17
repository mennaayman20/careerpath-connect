import { useState, useEffect } from "react";
import { Code2, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userProfileService } from "@/services/userService";
import { Skill } from "@/types/profile";

export const SkillsSection = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    userProfileService.getUserSkills().then(setSkills);
  }, []);

  const handleAddSkill = async () => {
    if (!inputValue.trim()) return;
    
    try {
      // هنا الـ Logic الذكي:
      // لو عندك قائمة مهارات ثابتة (Master Skills) ممكن تشوفي لو الاسم موجود تاخدي الـ ID
      // حالياً هنفترض إنه بيضيف بالاسم مباشرة حسب الـ Flow البسيط
      const newSkill = await userProfileService.addSkill({ skillName: inputValue });
      
      setSkills([...skills, newSkill]);
      setInputValue("");
    } catch (error) {
      console.error("Failed to add skill");
    }
  };

  const handleDelete = async (id: number) => {
    try {
        await userProfileService.deleteSkill(id);
      setSkills(skills.filter(s => s.skillId !== id));
    } catch (error) {
      console.error("Delete failed");
    }
  };

  return (
    <section className="p-6 border rounded-xl bg-card space-y-4">
      <div className="flex items-center gap-2">
        <Code2 className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Skills</h2>
      </div>

      <div className="flex gap-2">
        <Input 
          placeholder="Add a skill (e.g. React, Node.js)" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
        />
        <Button onClick={handleAddSkill} size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill.skillId} variant="secondary" className="px-3 py-1 gap-2 text-sm">
            {skill.skillName}
            <button 
              onClick={() => handleDelete(skill.skillId)}
              className="hover:text-destructive transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </section>
  );
};