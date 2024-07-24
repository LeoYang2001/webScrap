// ExcelPreview.js
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelPreview = ({ data }) => {
  const [excelData, setExcelData] = useState([]);

  useEffect(() => {
    const readExcel = () => {
      if (data) {
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setExcelData(jsonData);
      }
    };

    readExcel();
  }, [data]);

  return (
    <div className="excel-preview">
      <h2>Excel Data Preview</h2>
      <table>
        <tbody>
          {excelData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelPreview;
