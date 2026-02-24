// CouncilOfficers.jsx - Main Municipal Council Officers management page
import React, { useState } from 'react';
import { RefreshCw, UserPlus } from 'lucide-react';
import useMCOfficers from '../../hooks/superAdmin/useMCOfficers';
import SearchBar from '../../components/Subcomponents/SuperAdmin/VehicleOwners/SearchBar';
import OfficerList from '../../components/Subcomponents/SuperAdmin/CouncilOfficers/OfficerList';
import AddOfficerModal from '../../components/Subcomponents/SuperAdmin/CouncilOfficers/AddOfficerModal';
import EditOfficerModal from '../../components/Subcomponents/SuperAdmin/CouncilOfficers/EditOfficerModal';
import DeleteConfirmModal from '../../components/Subcomponents/SuperAdmin/CouncilOfficers/DeleteConfirmModal';

const CouncilOfficers = () => {
  const {
    filteredOfficers,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    loadOfficers,   
    addOfficer,
    updateOfficer,
    deleteOfficer,
  } = useMCOfficers();

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle add officer
  const handleAddOfficer = () => {
    setAddModalOpen(true);
  };

  // Handle edit officer
  const handleEditOfficer = (officer) => {
    setSelectedOfficer(officer);
    setEditModalOpen(true);
  };

  // Handle delete officer
  const handleDeleteOfficer = (officer) => {
    setSelectedOfficer(officer);
    setDeleteModalOpen(true);
  };

  // Save new officer
  const handleSaveAdd = async (officerData) => {
    await addOfficer(officerData);
  };

  // Save edited officer
  const handleSaveEdit = async (officerId, updates) => {
    await updateOfficer(officerId, updates);
  };

  // Confirm delete
  const handleConfirmDelete = async (officerId) => {
    await deleteOfficer(officerId);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadOfficers();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Municipal Council Officers
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and monitor all municipal council officers
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleAddOfficer}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Officer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search by name, officer ID, mobile, or email..."
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Officer List */}
        <OfficerList
          officers={filteredOfficers}
          isLoading={isLoading}
          onEdit={handleEditOfficer}
          onDelete={handleDeleteOfficer}
        />
      </div>

      {/* Add Modal */}
      <AddOfficerModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveAdd}
      />

      {/* Edit Modal */}
      <EditOfficerModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedOfficer(null);
        }}
        officer={selectedOfficer}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedOfficer(null);
        }}
        officer={selectedOfficer}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CouncilOfficers;