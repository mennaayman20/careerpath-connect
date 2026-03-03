import { formatDistanceToNow } from 'date-fns';
import { arEG, enUS } from 'date-fns/locale'; // استورد اللغات اللي تحتاجيها

export const getRelativeTime = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  return formatDistanceToNow(date, { 
    addSuffix: true, // عشان يضيف كلمة "ago" أو "منذ"
    // locale: arEG // فكي الكومنت لو حابة التاريخ يطلع بالعربي "منذ يومين"
  });
};