import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define the type for your modal context
interface ModalContextType {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

// Create the modal context with an undefined default value
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Define the modal provider component
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  // Function to open the modal with specific content
  const openModal = (content: ReactNode) => {
    setModalContent(content);
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleEscKey);
    // Optionally set focus to the modal when it opens
    setTimeout(() => {
      const modal = document.getElementById("modal-content");
      if (modal) modal.focus();
    }, 0);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalContent(null);
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleEscKey);
  };

  // Handle Escape key press to close the modal
  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  useEffect(() => {
    // Cleanup function to remove the class and event listeners when the component unmounts
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalContent && (
        <div
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          aria-modal="true"
          className="fixed inset-0 z-[999] grid place-content-center backdrop-blur-sm bg-black/30"
          onClick={closeModal}
        >
          <div
            id="modal-content"
            className="relative w-[720px] min-h-[360px] bg-black/80 border border-white/20 p-4"
            onClick={(e) => e.stopPropagation()} // Prevents clicks inside modal from closing it
            tabIndex={-1} // Allows focus management within modal
            role="document"
          >
            {modalContent}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

// Custom hook to access the modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
