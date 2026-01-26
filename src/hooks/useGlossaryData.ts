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
          
          console.log("Parsing glossary file:", file.name);
          console.log("Sheets found:", workbook.SheetNames);
          
          // Process ALL sheets in the workbook
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            console.log(`Sheet "${sheetName}" has ${jsonData.length} rows`);
            if (jsonData.length > 0) {
              console.log("Sample row keys:", Object.keys(jsonData[0] as object));
              console.log("Sample row:", jsonData[0]);
            }
            
            if (jsonData.length > 0) {
              sheetsProcessed.push(sheetName);
              
              const fields: GlossaryField[] = jsonData.map((row: any) => {
                // Get all keys from the row to find the best matches
                const keys = Object.keys(row);
                
                // Find field name column (flexible matching)
                const fieldNameKey = keys.find(k => 
                  /field|column|name|attribute|term/i.test(k) && !/table|schema|type|def/i.test(k)
                ) || keys[0];
                
                // Find table name column
                const tableNameKey = keys.find(k => 
                  /table|entity|schema|domain/i.test(k)
                );
                
                // Find definition column
                const definitionKey = keys.find(k => 
                  /def|desc|meaning|comment|note|business/i.test(k)
                );
                
                return {
                  fieldName: fieldNameKey ? String(row[fieldNameKey] || "") : "",
                  tableName: tableNameKey ? String(row[tableNameKey] || sheetName) : sheetName,
                  glossaryDefinition: definitionKey ? String(row[definitionKey] || "") : String(row[keys[1]] || ""),
                };
              }).filter(f => f.fieldName && f.fieldName.trim() !== "");
              
              console.log(`Parsed ${fields.length} valid fields from sheet "${sheetName}"`);
              allFields.push(...fields);
            }
          });

          console.log(`Total fields parsed: ${allFields.length}`);
          resolve({
            fields: allFields,
            fileName: file.name,
            sheetCount: workbook.SheetNames.length,
            sheetsProcessed
          });
        } catch (error) {
          console.error("Error parsing glossary file:", error);
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
          
          console.log("Parsing dictionary file:", file.name);
          console.log("Sheets found:", workbook.SheetNames);
          
          // Process ALL sheets in the workbook
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            console.log(`Sheet "${sheetName}" has ${jsonData.length} rows`);
            if (jsonData.length > 0) {
              console.log("Sample row keys:", Object.keys(jsonData[0] as object));
              console.log("Sample row:", jsonData[0]);
            }
            
            if (jsonData.length > 0) {
              sheetsProcessed.push(sheetName);
              
              const fields: DictionaryField[] = jsonData.map((row: any) => {
                // Get all keys from the row to find the best matches
                const keys = Object.keys(row);
                
                // Find field name column (flexible matching)
                const fieldNameKey = keys.find(k => 
                  /field|column|name|attribute/i.test(k) && !/table|schema|type|def/i.test(k)
                ) || keys[0];
                
                // Find table name column
                const tableNameKey = keys.find(k => 
                  /table|entity|schema/i.test(k)
                );
                
                // Find definition column
                const definitionKey = keys.find(k => 
                  /def|desc|spec|comment|note|meaning/i.test(k)
                );
                
                // Find data type column
                const dataTypeKey = keys.find(k => 
                  /type|dtype|datatype|format/i.test(k) && !/table/i.test(k)
                );
                
                // Find sensitivity column
                const sensitivityKey = keys.find(k => 
                  /sensit|class|confid|security|pii/i.test(k)
                );
                
                return {
                  fieldName: fieldNameKey ? String(row[fieldNameKey] || "") : "",
                  tableName: tableNameKey ? String(row[tableNameKey] || sheetName) : sheetName,
                  dictionaryDefinition: definitionKey ? String(row[definitionKey] || "") : "",
                  dataType: dataTypeKey ? String(row[dataTypeKey] || "") : "",
                  sensitivity: sensitivityKey ? String(row[sensitivityKey] || "Internal") : "Internal",
                  sheetName: sheetName
                };
              }).filter(f => f.fieldName && f.fieldName.trim() !== "");
              
              console.log(`Parsed ${fields.length} valid fields from sheet "${sheetName}"`);
              allFields.push(...fields);
            }
          });

          console.log(`Total fields parsed: ${allFields.length}`);
          resolve({
            fields: allFields,
            fileName: file.name,
            sheetCount: workbook.SheetNames.length,
            sheetsProcessed
          });
        } catch (error) {
          console.error("Error parsing dictionary file:", error);
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
