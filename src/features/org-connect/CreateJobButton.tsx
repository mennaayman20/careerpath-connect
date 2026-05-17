"use client";

import { useState } from "react";
import { ConnectOrgModal } from "./ConnectOrgModal";

interface CreateJobButtonProps {
  /** Pass the recruiter's current organization ID — null if not connected */
  organizationId: number | null;
  /** Called once the user is connected AND ready to proceed */
  onProceedToJobCreate: () => void;
  className?: string;
}

/**
 * Drop-in "Post a Job" button.
 *
 * - If the user is already connected to an org → calls onProceedToJobCreate directly.
 * - If not → opens the ConnectOrgModal wizard first, then calls onProceedToJobCreate
 *   once the user is verified.
 */
export function CreateJobButton({
  organizationId,
  onProceedToJobCreate,
  className,
}: CreateJobButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (organizationId !== null) {
      // Already connected — go straight to job creation
      onProceedToJobCreate();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={
          className ??
          "inline-flex items-center gap-2 bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-[#0F1642] font-bold text-sm px-5 py-3 rounded-lg transition-all duration-200"
        }
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        Post a Job
      </button>

      {showModal && (
        <ConnectOrgModal
          onConnected={() => {
            setShowModal(false);
            onProceedToJobCreate();
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default CreateJobButton;