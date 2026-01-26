import React, { createContext, useContext, ReactNode } from "react";
import { useGlossaryData, ParsedGlossaryData, ParsedDictionaryData } from "@/hooks/useGlossaryData";

interface MetadataContextType {
  glossaryData: ParsedGlossaryData | null;
  dictionaryData: ParsedDictionaryData | null;
  isLoading: boolean;
  handleGlossaryUpload: (file: File) => Promise<ParsedGlossaryData>;
  handleDictionaryUpload: (file: File) => Promise<ParsedDictionaryData>;
  clearGlossaryData: () => void;
  clearDictionaryData: () => void;
}

const MetadataContext = createContext<MetadataContextType | undefined>(undefined);

export const MetadataProvider = ({ children }: { children: ReactNode }) => {
  const {
    glossaryData,
    dictionaryData,
    isLoading,
    handleGlossaryUpload,
    handleDictionaryUpload,
    clearGlossaryData,
    clearDictionaryData,
  } = useGlossaryData();

  return (
    <MetadataContext.Provider
      value={{
        glossaryData,
        dictionaryData,
        isLoading,
        handleGlossaryUpload,
        handleDictionaryUpload,
        clearGlossaryData,
        clearDictionaryData,
      }}
    >
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (context === undefined) {
    throw new Error("useMetadata must be used within a MetadataProvider");
  }
  return context;
};
