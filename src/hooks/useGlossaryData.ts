import { useState, useCallback } from "react";
import * as XLSX from "xlsx";

export interface GlossaryField {
  fieldName: string;
  tableName: string;
  glossaryDefinition: string;
}

export interface DictionaryField {
  fieldName: string;
  tableName: string;
  dictionaryDefinition: string;
  dataType: string;
  sensitivity: string;
  sheetName?: string;
}

export interface ParsedGlossaryData {
  fields: GlossaryField[];
  fileName: string;
  sheetCount?: number;
  sheetsProcessed?: string[];
}

export interface ParsedDictionaryData {
  fields: DictionaryField[];
  fileName: string;
  sheetCount: number;
  sheetsProcessed: string[];
}

export const useGlossaryData = () => {
  const [glossaryData, setGlossaryData] = useState<ParsedGlossaryData | null>(null);
  const [dictionaryData, setDictionaryData] = useState<ParsedDictionaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const parseGlossaryFile = useCallback(async (file: File): Promise<ParsedGlossaryData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          
          const allFields: GlossaryField[] = [];
          const sheetsProcessed: string[] = [];
          
          // Process ALL sheets in the workbook
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            if (jsonData.length > 0) {
              sheetsProcessed.push(sheetName);
              
              const fields: GlossaryField[] = jsonData.map((row: any) => ({
                fieldName: row.field_name || row.fieldName || row.Field || row.field || row["Field Name"] || row["Column Name"] || "",
                tableName: row.table_name || row.tableName || row.Table || row.table || row["Table Name"] || sheetName,
                glossaryDefinition: row.definition || row.Definition || row.description || row.Description || row["Business Definition"] || "",
              })).filter(f => f.fieldName && f.glossaryDefinition);
              
              allFields.push(...fields);
            }
          });

          resolve({
            fields: allFields,
            fileName: file.name,
            sheetCount: workbook.SheetNames.length,
            sheetsProcessed
          });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsBinaryString(file);
    });
  }, []);

  const parseDictionaryFile = useCallback(async (file: File): Promise<ParsedDictionaryData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          
          const allFields: DictionaryField[] = [];
          const sheetsProcessed: string[] = [];
          
          // Process ALL sheets in the workbook
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            if (jsonData.length > 0) {
              sheetsProcessed.push(sheetName);
              
              const fields: DictionaryField[] = jsonData.map((row: any) => ({
                fieldName: row.field_name || row.fieldName || row.Field || row.field || row["Field Name"] || row["Column Name"] || row["column_name"] || "",
                tableName: row.table_name || row.tableName || row.Table || row.table || row["Table Name"] || sheetName,
                dictionaryDefinition: row.definition || row.Definition || row.description || row.Description || row["Technical Definition"] || row.Specification || "",
                dataType: row.data_type || row.dataType || row.Type || row.type || row["Data Type"] || row["DataType"] || "",
                sensitivity: row.sensitivity || row.Sensitivity || row.classification || row.Classification || row["Data Classification"] || "Internal",
                sheetName: sheetName
              })).filter(f => f.fieldName);
              
              allFields.push(...fields);
            }
          });

          resolve({
            fields: allFields,
            fileName: file.name,
            sheetCount: workbook.SheetNames.length,
            sheetsProcessed
          });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsBinaryString(file);
    });
  }, []);

  const handleGlossaryUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const parsed = await parseGlossaryFile(file);
      setGlossaryData(parsed);
      return parsed;
    } catch (error) {
      console.error("Error parsing glossary file:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [parseGlossaryFile]);

  const handleDictionaryUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const parsed = await parseDictionaryFile(file);
      setDictionaryData(parsed);
      return parsed;
    } catch (error) {
      console.error("Error parsing dictionary file:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [parseDictionaryFile]);

  const clearGlossaryData = useCallback(() => {
    setGlossaryData(null);
  }, []);

  const clearDictionaryData = useCallback(() => {
    setDictionaryData(null);
  }, []);

  return {
    glossaryData,
    dictionaryData,
    isLoading,
    handleGlossaryUpload,
    handleDictionaryUpload,
    clearGlossaryData,
    clearDictionaryData,
  };
};
