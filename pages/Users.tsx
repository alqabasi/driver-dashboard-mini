import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { User, CreateUserRequest } from '../types';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Search, Edit2, Trash2, Power, PowerOff, UserPlus, RefreshCw } from 'lucide-react';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const { addToast } = useToast();

  // Forms
  const [editForm, setEditForm] = useState({ fullName: '', mobilePhone: '' });
  const [addForm, setAddForm] = useState<CreateUserRequest>({ fullName: '', mobilePhone: '', password: '' });

  const fetchUsers = async () => {
    // Only set global loading on initial load or explicit refresh
    if (users.length === 0) setLoading(true);

    try {
      const data = await api.admin.getUsers();
      setUsers(data);
    } catch (error) {
      addToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobilePhone.includes(searchQuery)
    );
  }, [users, searchQuery]);

  // Handlers
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({ fullName: user.fullName, mobilePhone: user.mobilePhone });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleAddClick = () => {
    setAddForm({ fullName: '', mobilePhone: '', password: '' });
    setIsAddModalOpen(true);
  };

  const handleCreateUser = async () => {
    if (!addForm.fullName || !addForm.mobilePhone || !addForm.password) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await api.admin.createUser(addForm);
      addToast('User created successfully', 'success');
      setIsAddModalOpen(false);
      // Refetch to ensure state consistency and avoid crashes from invalid response data
      await fetchUsers();
    } catch (error) {
      addToast('Failed to create user', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    setIsProcessing(true);
    try {
      await api.admin.updateUser(selectedUser.id, editForm);
      addToast('User updated successfully', 'success');
      setIsEditModalOpen(false);
      // Refetch to ensure state consistency
      await fetchUsers();
    } catch (error) {
      addToast('Failed to update user', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setIsProcessing(true);
    try {
      await api.admin.deleteUser(selectedUser.id);
      addToast('User deleted', 'success');
      setIsDeleteModalOpen(false);
      // Refetch to ensure state consistency
      await fetchUsers();
    } catch (error) {
      addToast('Failed to delete user', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleStatus = async (user: User) => {
    try {
      if (user.status === 'active') {
        await api.admin.deactivateUser(user.id);
        addToast(`${user.fullName} deactivated`, 'info');
      } else {
        await api.admin.activateUser(user.id);
        addToast(`${user.fullName} activated`, 'success');
      }
      // Refetch to ensure state consistency
      await fetchUsers();
    } catch (error) {
      addToast('Status update failed', 'error');
    }
  };

  // Helper to force a reload with loading spinner
  const handleRefresh = () => {
    setLoading(true);
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage user accounts and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleRefresh} icon={<RefreshCw className="w-4 h-4" />} title="Refresh List">
            Refresh
          </Button>
          <Button icon={<UserPlus className="w-4 h-4" />} onClick={handleAddClick}>Add User</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name or phone..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Placeholder for future server-side filters */}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Phone</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No users found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-900">{user.fullName}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono">{user.mobilePhone}</td>
                    <td className="px-6 py-4">

                      <Badge variant={user.isActive === 1 ? 'success' : 'neutral'}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${user.status === 'active' ? 'bg-green-600' : 'bg-slate-500'}`} />
                        {user.isActive === 1 ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleStatus(user)}
                          className={`p-2 rounded hover:bg-slate-100 transition-colors ${user.status === 'active' ? 'text-amber-600' : 'text-green-600'}`}
                          title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {user.status === 'active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEditClick(user)}
                          className="p-2 text-slate-600 hover:text-accent hover:bg-slate-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="p-2 text-slate-600 hover:text-danger hover:bg-slate-100 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination placeholder */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredUsers.length} results</span>
          <div className="flex gap-2">
            <button className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-50" disabled>Previous</button>
            <button className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} isLoading={isProcessing}>
              Create User
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={addForm.fullName}
            onChange={e => setAddForm(prev => ({ ...prev, fullName: e.target.value }))}
            placeholder="John Doe"
          />
          <Input
            label="Mobile Phone"
            value={addForm.mobilePhone}
            onChange={e => setAddForm(prev => ({ ...prev, mobilePhone: e.target.value }))}
            placeholder="+1234567890"
          />
          <Input
            label="Password"
            type="password"
            value={addForm.password}
            onChange={e => setAddForm(prev => ({ ...prev, password: e.target.value }))}
            placeholder="••••••••"
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} isLoading={isProcessing}>
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={editForm.fullName}
            onChange={e => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
          />
          <Input
            label="Mobile Phone"
            value={editForm.mobilePhone}
            onChange={e => setEditForm(prev => ({ ...prev, mobilePhone: e.target.value }))}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isProcessing}>
              Delete User
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          <p className="text-slate-600">
            Are you sure you want to delete <span className="font-semibold">{selectedUser?.fullName}</span>?
          </p>
          <p className="text-xs text-slate-500 bg-slate-100 p-2 rounded">
            Note: This performs a soft delete. The data can potentially be recovered by a system administrator.
          </p>
        </div>
      </Modal>
    </div>
  );
};