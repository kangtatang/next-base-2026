'use client';
import { createRoleAction, updateRoleAction, deleteRoleAction } from '@/actions/role.actions';
import { getRolesPaginated } from '@/actions/role.actions.paginated';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { useState, useEffect, useCallback } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useSnackbar } from 'notistack';

export interface PermissionData {
  id: string;
  name: string;
}

export interface RoleData {
  id: string;
  name: string;
  description: string;
  permissions: PermissionData[];
}

export default function RolesClient({ permissions }: { permissions: PermissionData[] }) {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState<RoleData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' as 'asc'|'desc' });

  const [isModalOpen, setModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);

  // State for MUI MultiSelect
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getRolesPaginated({ page, limit: rowsPerPage, search, sortKey: sortConfig.key, sortDir: sortConfig.direction });
      setData(res.data);
      setTotalCount(res.totalCount);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Gagal mengambil data roles', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, search, sortConfig, enqueueSnackbar]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleSearch = (val: string) => { setSearch(val); setPage(0); };
  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setPage(0);
  };

  const handleOpenModal = (role: RoleData | null = null) => {
    setSelectedRole(role);
    if (role && role.permissions) {
      setSelectedPermissionIds(role.permissions.map((p: PermissionData) => p.id));
    } else {
      setSelectedPermissionIds([]);
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name') as string,
      description: fd.get('description') as string,
      permissionIds: fd.getAll('permissionIds') as string[],
    };

    let res;
    if (selectedRole?.id) {
      res = await updateRoleAction(selectedRole.id, payload);
    } else {
      res = await createRoleAction(payload);
    }

    setIsSubmitting(false);
    if (res.error) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar(`Peran berhasil ${selectedRole?.id ? 'diperbarui' : 'dibuat'}.`, { variant: 'success' });
      setModalOpen(false);
      setSelectedRole(null);
      fetchRoles();
    }
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    const res = await deleteRoleAction(selectedRole.id);
    setIsSubmitting(false);
    setConfirmOpen(false);
    setSelectedRole(null);
    if (res?.error) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar('Data peran berhasil dihapus.', { variant: 'success' });
      fetchRoles();
    }
  };

  const columns = [
    { field: 'name', header: 'Nama Peran' },
    { field: 'description', header: 'Deskripsi' },
    { 
      field: 'permissions', 
      header: 'Hak Akses (Permissions)',
      render: (permissions: unknown) => {
        const typedPermissions = permissions as PermissionData[];
        return (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {typedPermissions.map((p: PermissionData) => (
              <span key={p.id} style={{ background: 'var(--border)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>
                {p.name}
              </span>
            ))}
          </div>
        );
      }
    }
  ];

  return (
    <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-max)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--primary)' }}>🛡️ Manajemen Peran (Roles)</h2>
        <button 
          onClick={() => handleOpenModal(null)}
          className="btn" style={{ background: 'var(--primary)', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <AddIcon fontSize="small" /> Tambah Peran
        </button>
      </div>

      <DataTable 
        columns={columns}
        data={data}
        totalCount={totalCount}
        isLoading={isLoading}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(val: number) => { setRowsPerPage(val); setPage(0); }}
        onSearch={handleSearch}
        onSort={handleSort}
        actions={(row: RoleData) => (
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => { setSelectedRole(row); setViewModalOpen(true); }} 
              style={{ background: 'transparent', color: '#6b7280', border: 'none', cursor: 'pointer' }}
              title="View Detail"
            >
              <VisibilityIcon fontSize="small" />
            </button>
            <button 
              onClick={() => handleOpenModal(row)} 
              style={{ background: 'transparent', color: '#3b82f6', border: 'none', cursor: 'pointer' }}
              title="Edit"
            >
              <EditIcon fontSize="small" />
            </button>
            {row.name !== 'Super Admin' && (
              <button 
                onClick={() => { setSelectedRole(row); setConfirmOpen(true); }} 
                style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}
                title="Hapus"
              >
                <DeleteIcon fontSize="small" />
              </button>
            )}
          </div>
        )}
      />

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={selectedRole ? "Edit Peran" : "Buat Peran Baru"}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input name="name" defaultValue={selectedRole?.name} placeholder="Nama Peran (contoh: Editor)" required style={inputStyle} />
          <input name="description" defaultValue={selectedRole?.description} placeholder="Deskripsi Singkat" style={inputStyle} />
          
          <div style={{ position: 'relative', marginTop: '0.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Pilih Hak Akses (Permissions)</label>
            <div 
              onClick={() => {
                const el = document.getElementById('permission-dropdown');
                if (el) el.style.display = el.style.display === 'none' ? 'flex' : 'none';
              }}
              style={{ ...inputStyle, cursor: 'pointer', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', minHeight: '3rem', alignItems: 'center' }}
            >
              {selectedPermissionIds.length === 0 ? <span style={{ opacity: 0.5 }}>Pilih hak akses... ▾</span> : 
                selectedPermissionIds.map(id => (
                  <span key={id} style={{ background: 'var(--primary)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {permissions?.find(p => p.id === id)?.name || id}
                  </span>
                ))
              }
            </div>
            <div id="permission-dropdown" style={{ display: 'none', position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', zIndex: 50, maxHeight: '200px', overflowY: 'auto', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)' }}>
              {permissions?.length ? permissions.map((p: PermissionData) => (
                <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    name="permissionIds" 
                    value={p.id} 
                    checked={selectedPermissionIds.includes(p.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedPermissionIds([...selectedPermissionIds, p.id]);
                      else setSelectedPermissionIds(selectedPermissionIds.filter(id => id !== p.id));
                    }}
                    style={{ cursor: 'pointer', transform: 'scale(1.1)' }}
                  />
                  {p.name}
                </label>
              )) : <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>Tidak ada hak akses.</span>}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn" style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', fontWeight: 600 }}>Batal</button>
            <button type="submit" className="btn" style={{ background: 'var(--primary)', color: 'white' }} disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Peran'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} title="Detail Peran">
        {selectedRole && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div><strong style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7 }}>Nama Peran</strong>{selectedRole.name}</div>
            <div><strong style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7 }}>Deskripsi</strong>{selectedRole.description || '-'}</div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7 }}>Hak Akses</strong>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                {selectedRole.permissions.map((p: PermissionData) => (
                  <span key={p.id} style={{ background: 'var(--border)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button onClick={() => setViewModalOpen(false)} className="btn" style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', fontWeight: 600 }}>Tutup</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmationDialog 
        isOpen={isConfirmOpen}
        message={`Apakah Anda yakin ingin menghapus peran "${selectedRole?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
        isProcessing={isSubmitting}
      />
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', 
  border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)'
};
