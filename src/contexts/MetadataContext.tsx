import React, { createContext, useContext, ReactNode } from "react";
import { useGlossaryData, ParsedGlossaryData, ParsedDictionaryData } from "@/hooks/useGlossaryData";
import { usePolicyData, ParsedPolicyData } from "@/hooks/usePolicyData";

interface MetadataContextType {
  glossaryData: ParsedGlossaryData | null;
  dictionaryData: ParsedDictionaryData | null;
  policyData: ParsedPolicyData | null;
  isLoading: boolean;
  handleGlossaryUpload: (file: File) => Promise<ParsedGlossaryData>;
  handleDictionaryUpload: (file: File) => Promise<ParsedDictionaryData>;
  handlePolicyUpload: (file: File) => Promise<ParsedPolicyData>;
  clearGlossaryData: () => void;
  clearDictionaryData: () => void;
  clearPolicyData: () => void;
}

const MetadataContext = createContext<MetadataContextType | undefined>(undefined);

export const MetadataProvider = ({ children }: { children: ReactNode }) => {
  const {
    glossaryData,
    dictionaryData,
    isLoading: glossaryLoading,
    handleGlossaryUpload,
    handleDictionaryUpload,
    clearGlossaryData,
    clearDictionaryData,
  } = useGlossaryData();

  const {
    policyData,
    isLoading: policyLoading,
    handlePolicyUpload,
    clearPolicyData,
  } = usePolicyData();

  return (
    <MetadataContext.Provider
      value={{
        glossaryData,
        dictionaryData,
        policyData,
        isLoading: glossaryLoading || policyLoading,
        handleGlossaryUpload,
        handleDictionaryUpload,
        handlePolicyUpload,
        clearGlossaryData,
        clearDictionaryData,
        clearPolicyData,
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
