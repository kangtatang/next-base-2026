'use client';
import { createUserAction, updateUserAction, deleteUserAction } from '@/actions/user.actions';
import { getUsersPaginated } from '@/actions/user.actions.paginated';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { useState, useEffect, useCallback } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useSnackbar } from 'notistack';

export interface RoleData {
  id: string;
  name: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  roles: RoleData[];
}

export default function UsersClient({ roles }: { roles: RoleData[] }) {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState<UserData[]>([]);
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
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
  // State for MUI MultiSelect
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getUsersPaginated({ page, limit: rowsPerPage, search, sortKey: sortConfig.key, sortDir: sortConfig.direction });
      setData(res.data);
      setTotalCount(res.totalCount);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Gagal mengambil data', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, search, sortConfig, enqueueSnackbar]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (val: string) => { setSearch(val); setPage(0); };
  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setPage(0);
  };

  const handleOpenModal = (user: UserData | null = null) => {
    setSelectedUser(user);
    if (user && user.roles) {
      setSelectedRoleIds(user.roles.map((r: RoleData) => r.id));
    } else {
      setSelectedRoleIds([]);
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name'),
      email: fd.get('email'),
      roleIds: fd.getAll('roleIds'),
      ...(fd.get('password') ? { password: fd.get('password') } : {})
    };

    let res;
    if (selectedUser?.id) {
      res = await updateUserAction(selectedUser.id, payload);
    } else {
      res = await createUserAction(payload);
    }
    
    setIsSubmitting(false);
    if (res.error) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar(`Pengguna berhasil ${selectedUser?.id ? 'diperbarui' : 'disimpan'}.`, { variant: 'success' });
      setModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    }
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    const res = await deleteUserAction(selectedUser.id);
    setIsSubmitting(false);
    setConfirmOpen(false);
    setSelectedUser(null);
    if (res.error) {
      enqueueSnackbar(res.error, { variant: 'error' });
    } else {
      enqueueSnackbar('Data pengguna berhasil dihapus.', { variant: 'success' });
      fetchUsers();
    }
  };

  const columns = [
    { field: 'name', header: 'Nama' },
    { field: 'email', header: 'Email' },
    { 
      field: 'roles', 
      header: 'Role',
      render: (roles: unknown) => {
        const typedRoles = roles as RoleData[];
        return (
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            {typedRoles.map((r: RoleData) => (
              <span key={r.id} style={{ background: 'var(--border)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                {r.name}
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
        <h2 style={{ color: 'var(--primary)' }}>👥 Manajemen Pengguna</h2>
        <button 
          onClick={() => handleOpenModal(null)}
          className="btn" style={{ background: 'var(--primary)', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <AddIcon fontSize="small" /> Tambah Pengguna
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
        actions={(row: UserData) => (
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => { setSelectedUser(row); setViewModalOpen(true); }} 
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
            <button 
              onClick={() => { setSelectedUser(row); setConfirmOpen(true); }} 
              style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}
              title="Hapus"
            >
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        )}
      />

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={selectedUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input name="name" defaultValue={selectedUser?.name} placeholder="Nama Lengkap" required style={inputStyle} />
          <input name="email" defaultValue={selectedUser?.email} type="email" placeholder="Email" required style={inputStyle} />
          <input name="password" type="password" minLength={6} placeholder={selectedUser ? "Password (kosongkan jika tidak diubah)" : "Password"} required={!selectedUser} style={inputStyle} />
          
          <div style={{ position: 'relative', marginTop: '0.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Pilih Roles</label>
            <div 
              onClick={() => {
                const el = document.getElementById('role-dropdown');
                if (el) el.style.display = el.style.display === 'none' ? 'flex' : 'none';
              }}
              style={{ ...inputStyle, cursor: 'pointer', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', minHeight: '3rem', alignItems: 'center' }}
            >
              {selectedRoleIds.length === 0 ? <span style={{ opacity: 0.5 }}>Pilih roles... ▾</span> : 
                selectedRoleIds.map(id => (
                  <span key={id} style={{ background: 'var(--primary)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {roles?.find(r => r.id === id)?.name || id}
                  </span>
                ))
              }
            </div>
            <div id="role-dropdown" style={{ display: 'none', position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', zIndex: 50, maxHeight: '200px', overflowY: 'auto', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)' }}>
              {roles?.length ? roles.map((r: RoleData) => (
                <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    name="roleIds" 
                    value={r.id} 
                    checked={selectedRoleIds.includes(r.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedRoleIds([...selectedRoleIds, r.id]);
                      else setSelectedRoleIds(selectedRoleIds.filter(id => id !== r.id));
                    }}
                    style={{ cursor: 'pointer', transform: 'scale(1.1)' }}
                  />
                  {r.name}
                </label>
              )) : <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>Tidak ada roles.</span>}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn" style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', fontWeight: 600 }}>Batal</button>
            <button type="submit" className="btn" style={{ background: 'var(--primary)', color: 'white' }} disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} title="Detail Pengguna">
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div><strong style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7 }}>Nama</strong>{selectedUser.name}</div>
            <div><strong style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7 }}>Email</strong>{selectedUser.email}</div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7 }}>Roles</strong>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                {selectedUser.roles.map((r: RoleData) => (
                  <span key={r.id} style={{ background: 'var(--border)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                    {r.name}
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
        message={`Apakah Anda yakin ingin menghapus pengguna "${selectedUser?.name}"? Tindakan ini tidak dapat dibatalkan.`}
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
