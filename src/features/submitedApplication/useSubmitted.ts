import { useState, useEffect, useCallback } from "react";
import { resumeService } from "../resume/services/resume.service";
import { Application } from "../../features/submitedApplication/submitedInterface";
import { PaginatedApplications } from "./submitedInterface";
import { submitedService } from "./submitedService";


export const useMyApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
    // تأكدي إن الإستيراد فوق لـ submitedService مش resumeService
    const data = await submitedService.getMyApplications();
    console.log("Data checked:", data); // افتحي الـ Console وشوفي دي طبعت إيه
    
    if (data && data.content) {
      setApplications(data.content);
    } else {
      setApplications([]);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setError("Failed to load applications");
  } finally {
    setIsLoading(false);
  }
}, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return { applications, isLoading, error, refetch: fetchApplications };
};