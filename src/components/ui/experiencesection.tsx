import { useState, useEffect } from "react";
import { Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userProfileService } from "@/services/userService";
import { ExperienceModal } from "./experienceModal"; // ✅ استيراد المودال

export const ExperienceSection = () => { // ✅ مبيخدش Props عشان كدا مش هيطلع Error في Profile.tsx
  const [experiences, setExperiences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState(undefined);

  const loadData = async () => {
    console.log("Loading experiences...");
    const data = await userProfileService.getUserExperiences();
    setExperiences(data);
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="p-6 border rounded-xl bg-card space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Experiences</h2>
        </div>
        <Button onClick={() => { setSelectedExp(undefined); setIsModalOpen(true); }} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      {/* عرض قائمة الخبرات هنا */}
      {/* ... Mapping through experiences ... */}

      {/* ✅ المودال مستخبي هنا وبيفتح لما تدوسي على الزرار */}
      <ExperienceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={selectedExp}
        onSuccess={loadData}
      />
    </div>
  );
};