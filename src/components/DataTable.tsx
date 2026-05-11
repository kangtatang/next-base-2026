import React, { useState, useEffect } from 'react';

export interface ColumnDef<T> {
  field: Extract<keyof T, string>;
  header: string;
  render?: (val: unknown, row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  totalCount: number;
  isLoading?: boolean;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onSearch?: (search: string) => void;
  onSort?: (key: string) => void;
  actions?: (row: T) => React.ReactNode;
}

export default function DataTable<T extends Record<string, any>>({
  columns, data, totalCount, isLoading,
  page, rowsPerPage, onPageChange, onRowsPerPageChange,
  onSearch, onSort, actions
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (onSearch) onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  const totalPages = Math.ceil(totalCount / rowsPerPage) || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Cari data..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)', background: 'var(--background)',
            color: 'var(--foreground)', minWidth: '250px'
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem' }}>
          <span>Total: {totalCount} data</span>
          <select 
            value={rowsPerPage} 
            onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
            style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
          >
            {[10, 25, 50, 100].map(val => (
              <option key={val} value={val}>{val} per halaman</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ background: 'var(--background)' }}>
              {columns.map((col) => (
                <th 
                  key={col.field}
                  style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)', cursor: onSort ? 'pointer' : 'default', fontWeight: 600, color: 'var(--foreground)', fontSize: '0.9rem' }}
                  onClick={() => onSort && onSort(col.field)}
                >
                  {col.header} ↕
                </th>
              ))}
              {actions && <th style={{ textAlign: 'right', padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 600, color: 'var(--foreground)', fontSize: '0.9rem' }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: rowsPerPage }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', animation: 'pulse 1.5s infinite' }}>
                  {columns.map((c, j) => (
                    <td key={`skel-td-${j}`} style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ height: '20px', background: 'var(--border)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                    </td>
                  ))}
                  {actions && (
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                      <div style={{ height: '28px', width: '60px', background: 'var(--border)', borderRadius: 'var(--radius-sm)', animation: 'pulse 1.5s infinite', display: 'inline-block' }} />
                    </td>
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} style={{ padding: '3rem', textAlign: 'center', opacity: 0.5 }}>
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            ) : (
              data.map((row: any, i: number) => (
                <tr key={row.id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                  {columns.map((col: any) => (
                    <td key={col.field} style={{ padding: '1rem' }}>
                      {col.render ? col.render(row[col.field], row) : row[col.field]}
                    </td>
                  ))}
                  {actions && (
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.9rem' }}>
        <button 
          onClick={() => onPageChange?.(page - 1)} 
          disabled={page === 0 || isLoading}
          className="btn" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)', opacity: (page === 0 || isLoading) ? 0.5 : 1 }}
        >
          Previous
        </button>
        <span>Halaman {page + 1} dari {totalPages}</span>
        <button 
          onClick={() => onPageChange?.(page + 1)} 
          disabled={page >= totalPages - 1 || isLoading}
          className="btn" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)', opacity: (page >= totalPages - 1 || isLoading) ? 0.5 : 1 }}
        >
          Next
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 0.3; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
