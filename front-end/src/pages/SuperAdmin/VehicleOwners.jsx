// VehicleOwners.jsx - Main vehicle owners management page
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import useVehicleOwners from '../../hooks/superAdmin/useVehicleOwners';
import SearchBar from '../../components/Subcomponents/SuperAdmin/VehicleOwners/SearchBar';
import OwnerList from '../../components/Subcomponents/SuperAdmin/VehicleOwners/OwnerList';
import EditOwnerModal from '../../components/Subcomponents/SuperAdmin/VehicleOwners/EditOwnerModal';
import DeleteConfirmModal from '../../components/Subcomponents/SuperAdmin/VehicleOwners/DeleteConfirmModal';

const VehicleOwners = () => {
  const {
    filteredOwners,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    loadOwners,
    updateOwner,
    deleteOwner,
  } = useVehicleOwners();

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle edit owner
  const handleEditOwner = (owner) => {
    setSelectedOwner(owner);
    setEditModalOpen(true);
  };

  // Handle delete owner
  const handleDeleteOwner = (owner) => {
    setSelectedOwner(owner);
    setDeleteModalOpen(true);
  };

  // Save edited owner
  const handleSaveEdit = async (ownerId, updates) => {
    await updateOwner(ownerId, updates);
  };

  // Confirm delete
  const handleConfirmDelete = async (ownerId) => {
    await deleteOwner(ownerId);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadOwners();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vehicle Owners</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and monitor all registered vehicle owners
              </p>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Owner List */}
        <OwnerList
          owners={filteredOwners}
          isLoading={isLoading}
          onEdit={handleEditOwner}
          onDelete={handleDeleteOwner}
        />
      </div>

      {/* Edit Modal */}
      <EditOwnerModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedOwner(null);
        }}
        owner={selectedOwner}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedOwner(null);
        }}
        owner={selectedOwner}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default VehicleOwners;