import { useState, useRef } from 'react';
import { Upload, Download, Plus, Trash2, Edit2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import '../styles/Academics.css';

interface CellData {
  value: string | number;
  isEditing: boolean;
}

export default function Academics() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CellData[][]>([]);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Backend API placeholder functions
  const uploadToBackend = async (data: any) => {
    // TODO: Implement backend API call
    console.log('Upload to backend:', data);
    // Example: await fetch('/api/upload-excel', { method: 'POST', body: JSON.stringify(data) });
  };

  const saveToBackend = async (data: any) => {
    // TODO: Implement backend API call
    console.log('Save to backend:', data);
    // Example: await fetch('/api/save-excel', { method: 'POST', body: JSON.stringify(data) });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        if (jsonData.length > 0) {
          const headerRow = jsonData[0].map(h => String(h || ''));
          setHeaders(headerRow);

          const dataRows = jsonData.slice(1).map(row => 
            row.map(cell => ({ value: cell ?? '', isEditing: false }))
          );
          setRows(dataRows);

          // Upload to backend (placeholder)
          uploadToBackend({ headers: headerRow, rows: dataRows });
        }
      } catch (error) {
        console.error('Error reading file:', error);
        alert('Error reading file. Please upload a valid Excel file.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCellEdit = (rowIndex: number, colIndex: number, newValue: string) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex].value = newValue;
    setRows(newRows);
  };

  const toggleEditMode = (rowIndex: number, colIndex: number) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex].isEditing = !newRows[rowIndex][colIndex].isEditing;
    setRows(newRows);
  };

  const addColumn = () => {
    const columnName = prompt('Enter column name:');
    if (!columnName) return;

    setHeaders([...headers, columnName]);
    const newRows = rows.map(row => [...row, { value: '', isEditing: false }]);
    setRows(newRows);
  };

  const deleteColumn = (colIndex: number) => {
    if (!window.confirm('Are you sure you want to delete this column?')) return;

    setHeaders(headers.filter((_, i) => i !== colIndex));
    setRows(rows.map(row => row.filter((_, i) => i !== colIndex)));
  };

  const addRow = () => {
    const newRow = headers.map(() => ({ value: '', isEditing: false }));
    setRows([...rows, newRow]);
  };

  const deleteRow = (rowIndex: number) => {
    if (!window.confirm('Are you sure you want to delete this row?')) return;
    setRows(rows.filter((_, i) => i !== rowIndex));
  };

  const handleExport = () => {
    try {
      const exportData = [headers, ...rows.map(row => row.map(cell => cell.value))];
      const ws = XLSX.utils.aoa_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      
      const exportFileName = fileName.replace(/\.[^/.]+$/, '') + '_edited.xlsx';
      XLSX.writeFile(wb, exportFileName);

      // Save to backend (placeholder)
      saveToBackend({ headers, rows });
    } catch (error) {
      console.error('Error exporting file:', error);
      alert('Error exporting file.');
    }
  };

  return (
    <div className="academics-container">
      <div className="academics-header">
        <div>
          <h2 className="academics-title" data-testid="academics-title">Academics</h2>
          <p className="academics-subtitle">Upload and manage Excel data</p>
        </div>
        
        {rows.length > 0 && (
          <div className="action-buttons-group">
            <button 
              className="action-btn-primary"
              onClick={addColumn}
              data-testid="add-column-button"
            >
              <Plus size={18} />
              Add Column
            </button>
            <button 
              className="action-btn-primary"
              onClick={addRow}
              data-testid="add-row-button"
            >
              <Plus size={18} />
              Add Row
            </button>
            <button 
              className="action-btn-export"
              onClick={handleExport}
              data-testid="export-button"
            >
              <Download size={18} />
              Export
            </button>
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="upload-section" data-testid="upload-section">
          <div className="upload-card">
            <div className="upload-icon">📄</div>
            <h3>Upload Excel Sheet</h3>
            <p>Upload and preview Excel file to manage and edit data</p>
            
            <button 
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
              data-testid="upload-button"
            >
              <Upload size={18} />
              Drag & drop your raw Excel sheet, or Click to browse
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              data-testid="file-input"
            />
            
            <p className="file-info">Supports also terms only</p>
          </div>
        </div>
      ) : (
        <div className="excel-viewer">
          <div className="viewer-header">
            <span className="file-name" data-testid="uploaded-file-name">📄 {fileName}</span>
            <button 
              className="change-file-btn"
              onClick={() => fileInputRef.current?.click()}
              data-testid="change-file-button"
            >
              Change File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>

          <div className="table-container-excel">
            <div className="table-scroll-excel">
              <table className="excel-table" data-testid="excel-table">
                <thead>
                  <tr>
                    <th className="row-number-header">#</th>
                    {headers.map((header, index) => (
                      <th key={index}>
                        <div className="header-cell">
                          <span>{header}</span>
                          <button
                            className="delete-col-btn"
                            onClick={() => deleteColumn(index)}
                            title="Delete column"
                            data-testid={`delete-column-${index}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </th>
                    ))}
                    <th className="action-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex} data-testid={`excel-row-${rowIndex}`}>
                      <td className="row-number">{rowIndex + 1}</td>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex}>
                          {cell.isEditing ? (
                            <input
                              className="cell-input"
                              value={cell.value}
                              onChange={(e) => handleCellEdit(rowIndex, colIndex, e.target.value)}
                              onBlur={() => toggleEditMode(rowIndex, colIndex)}
                              autoFocus
                              data-testid={`cell-input-${rowIndex}-${colIndex}`}
                            />
                          ) : (
                            <div 
                              className="cell-content"
                              onClick={() => toggleEditMode(rowIndex, colIndex)}
                              data-testid={`cell-${rowIndex}-${colIndex}`}
                            >
                              {cell.value || '-'}
                              <Edit2 size={12} className="edit-icon" />
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="action-cell">
                        <button
                          className="delete-row-btn"
                          onClick={() => deleteRow(rowIndex)}
                          title="Delete row"
                          data-testid={`delete-row-${rowIndex}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
