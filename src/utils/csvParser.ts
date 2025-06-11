import Papa from "papaparse";

export interface ParsedCSVRow {
  [key: string]: string | number;
}

export const parseCSV = async (filePath: string): Promise<ParsedCSVRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data as ParsedCSVRow[]),
      error: (error) => reject(error),
    });
  });
};
