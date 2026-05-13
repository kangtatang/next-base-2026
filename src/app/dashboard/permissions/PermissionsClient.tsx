"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import DataTable from '@/components/DataTable';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import {
  getPermissionsPaginated,
  createPermissionAction,
  updatePermissionAction,
  deletePermissionAction,
} from '@/actions/permission.actions';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface PermissionData {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  _count: { roles: number };
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  background: 'var(--background)',
  color: 'var(--foreground)',
  outline: 'none',
  fontSize: '0.95rem',
};

export default function PermissionsClient() {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState<PermissionData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' as 'asc' | 'desc' });

  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<PermissionData | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getPermissionsPaginated({
        page,
        limit: rowsPerPage,
        search,
        sortKey: sortConfig.key,
        sortDir: sortConfig.direction,
      });
      setData(result.data as PermissionData[]);
      setTotalCount(result.totalCount);
    } catch {
      enqueueSnackbar('Gagal memuat data', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, search, sortConfig, enqueueSnackbar]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = (val: string) => { setSearch(val); setPage(0); };
  const handleSort = (key: string, dir: 'asc' | 'desc') => { setSortConfig({ key, direction: dir }); setPage(0); };

  const handleOpenModal = (permission: PermissionData | null = null) => {
    setSelectedPermission(permission);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    if (selectedPermission) fd.append('id', selectedPermission.id);

    const res = selectedPermission
      ? await updatePermissionAction(fd)
      : await createPermissionAction(fd);

    setIsSubmitting(false);
    if (res?.error) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar(selectedPermission ? 'Permission diperbarui' : 'Permission berhasil dibuat', { variant: 'success' });
      setModalOpen(false);
      fetchData();
    }
  };

  const handleDelete = async () => {
    if (!selectedPermission) return;
    const res = await deletePermissionAction(selectedPermission.id);
    if (res?.error) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar('Permission berhasil dihapus', { variant: 'success' });
      setConfirmOpen(false);
      fetchData();
    }
  };

  const columns = [
    { field: 'name', header: 'Nama Permission', sortable: true },
    {
      field: 'description',
      header: 'Deskripsi',
      render: (v: unknown) => <span style={{ opacity: v ? 1 : 0.4 }}>{(v as string) || '—'}</span>,
    },
    {
      field: '_count',
      header: 'Digunakan oleh Role',
      render: (v: unknown) => {
        const count = (v as { roles: number }).roles;
        return (
          <span style={{ background: count > 0 ? 'rgba(16,185,129,0.12)' : 'var(--border)', color: count > 0 ? '#10b981' : 'inherit', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
            {count} Role
          </span>
        );
      },
    },
    {
      field: 'createdAt',
      header: 'Dibuat',
      sortable: true,
      render: (v: unknown) => new Date(v as Date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    },
  ];

  const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
  };
  const modalStyle: React.CSSProperties = {
    background: 'var(--surface)', borderRadius: 'var(--radius-max)', border: '1px solid var(--border)',
    padding: '2rem', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Manajemen Permissions</h1>
          <p style={{ opacity: 0.65, fontSize: '0.9rem', marginTop: '0.25rem' }}>Kelola hak akses yang dapat ditetapkan pada setiap peran.</p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="btn"
          style={{ background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', fontWeight: 600 }}
        >
          <AddIcon fontSize="small" /> Tambah Permission
        </button>
      </div>

      <DataTable<PermissionData>
        columns={columns}
        data={data}
        totalCount={totalCount}
        isLoading={isLoading}
        page={page}
        rowsPerPage={rowsPerPage}
        sortConfig={sortConfig}
        onPageChange={setPage}
        onRowsPerPageChange={(val) => { setRowsPerPage(val); setPage(0); }}
        onSearch={handleSearch}
        onSort={handleSort}
        actions={(row: PermissionData) => (
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => handleOpenModal(row)}
              style={{ background: 'rgba(59,130,246,0.1)', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.4rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center' }}
              title="Edit"
            >
              <EditIcon fontSize="small" />
            </button>
            <button
              onClick={() => { setSelectedPermission(row); setConfirmOpen(true); }}
              style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.4rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center' }}
              title="Hapus"
            >
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        )}
      />

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={overlayStyle} onClick={() => setModalOpen(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              {selectedPermission ? 'Edit Permission' : 'Tambah Permission Baru'}
            </h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 500 }}>Nama Permission</label>
                <input name="name" defaultValue={selectedPermission?.name} placeholder="contoh: manage_reports" required style={inputStyle} />
                <p style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.3rem' }}>Gunakan format snake_case. Spasi akan otomatis diganti underscore (_).</p>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 500 }}>Deskripsi <span style={{ opacity: 0.5 }}>(Opsional)</span></label>
                <input name="description" defaultValue={selectedPermission?.description ?? ''} placeholder="Penjelasan singkat fungsi permission ini" style={inputStyle} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn" style={{ background: 'var(--border)', color: 'var(--foreground)', border: 'none', fontWeight: 600 }}>Batal</button>
                <button type="submit" className="btn" disabled={isSubmitting} style={{ background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 600, opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmationDialog
        open={isConfirmOpen}
        title="Hapus Permission"
        message={`Yakin ingin menghapus permission "${selectedPermission?.name}"? Aksi ini akan melepas permission dari semua role yang menggunakannya.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
