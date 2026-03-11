import { useState, useEffect } from 'react';
import { userProfileService } from '../services/userService'; // حسب مسار ملفك
import { profile } from 'console';
import { toast } from './use-toast';

export const useProfileManager = () => {
  const [personal, setPersonal] = useState({
    id: 0,
    firstName: '',
    lastName: '',
    university: ''
  });
  const [loading, setLoading] = useState(true);

  // جلب البيانات عند فتح الصفحة
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await userProfileService.getUserProfile();
        // بنملى الـ State بالبيانات اللي رجعت من السيرفر
        setPersonal({
          id: data.id || 0,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          university: data.university || ''
        });
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // دالة الحفظ (Update)
  const handleSave = async () => {
    try {
      await userProfileService.updateUserProfile(personal);
      toast({ title: "Personal  Info Updated Successfully" });
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: "Failed to update personal info." });
    }
  };

  return { personal, setPersonal, loading, handleSave };
};