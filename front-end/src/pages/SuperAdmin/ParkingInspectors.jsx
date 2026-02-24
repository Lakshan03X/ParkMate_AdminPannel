// Main parking inspectors management page
import React, { useState } from 'react';
import { RefreshCw, UserPlus } from 'lucide-react';
import useInspectors from '../../hooks/superAdmin/useInspectors';
import SearchBar from '../../components/Subcomponents/SuperAdmin/VehicleOwners/SearchBar';
import InspectorList from '../../components/Subcomponents/SuperAdmin/ParkingInspectors/InspectorList';
import AddInspectorModal from '../../components/Subcomponents/SuperAdmin/ParkingInspectors/AddInspectorModal';
import EditInspectorModal from '../../components/Subcomponents/SuperAdmin/ParkingInspectors/EditInspectorModal';
import DeleteConfirmModal from '../../components/Subcomponents/SuperAdmin/ParkingInspectors/DeleteConfirmModal';

const ParkingInspectors = () => {
  const {
    filteredInspectors,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    loadInspectors,
    addInspector,
    updateInspector,
    deleteInspector,
  } = useInspectors();

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInspector, setSelectedInspector] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle add inspector
  const handleAddInspector = () => {
    setAddModalOpen(true);
  };

  // Handle edit inspector
  const handleEditInspector = (inspector) => {
    setSelectedInspector(inspector);
    setEditModalOpen(true);
  };

  // Handle delete inspector
  const handleDeleteInspector = (inspector) => {
    setSelectedInspector(inspector);
    setDeleteModalOpen(true);
  };

  // Save new inspector
  const handleSaveNewInspector = async (inspectorData) => {
    await addInspector(inspectorData);
  };

  // Save edited inspector
  const handleSaveEdit = async (inspectorId, updates) => {
    await updateInspector(inspectorId, updates);
  };

  // Confirm delete
  const handleConfirmDelete = async (inspectorId) => {
    await deleteInspector(inspectorId);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadInspectors();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Parking Inspectors</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage parking inspector accounts and monitor their assignments
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-100"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleAddInspector}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Inspector</span>
              </button>
            </div>
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

        {/* Inspector List */}
        <InspectorList
          inspectors={filteredInspectors}
          isLoading={isLoading}
          onEdit={handleEditInspector}
          onDelete={handleDeleteInspector}
        />
      </div>

      {/* Add Inspector Modal */}
      <AddInspectorModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveNewInspector}
      />

      {/* Edit Inspector Modal */}
      <EditInspectorModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedInspector(null);
        }}
        inspector={selectedInspector}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedInspector(null);
        }}
        inspector={selectedInspector}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ParkingInspectors;