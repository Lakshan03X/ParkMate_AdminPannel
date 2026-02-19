// useVehicleOwners.js - Custom hook for managing vehicle owners data
import { useState, useEffect, useCallback } from 'react';
import vehicleOwnerService from '../../services/superAdmin/vehicleOwnerService';

export const useVehicleOwners = () => {
  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load owners from DynamoDB
  const loadOwners = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const ownersData = await vehicleOwnerService.getAllOwners();
      setOwners(ownersData);
      setFilteredOwners(ownersData);
      console.log('Owners loaded:', ownersData);
    } catch (err) {
      console.error('Error loading owners:', err);
      setError(err.message || 'Failed to load vehicle owners');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadOwners();
  }, [loadOwners]);

  // Filter owners based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOwners(owners);
      return;
    }

    const searchLower = searchQuery.toLowerCase();
    const filtered = owners.filter(
      (owner) =>
        owner.name.toLowerCase().includes(searchLower) ||
        owner.mobileNumber.includes(searchQuery) ||
        (owner.email && owner.email.toLowerCase().includes(searchLower))
    );

    setFilteredOwners(filtered);
  }, [searchQuery, owners]);

  // Update owner
  const updateOwner = async (ownerId, updates) => {
    try {
      await vehicleOwnerService.updateOwner(ownerId, updates);
      await loadOwners(); // Refresh list
      return { success: true };
    } catch (err) {
      console.error('Error updating owner:', err);
      throw err;
    }
  };

  // Delete owner
  const deleteOwner = async (ownerId) => {
    try {
      await vehicleOwnerService.deleteOwner(ownerId);
      await loadOwners(); // Refresh list
      return { success: true };
    } catch (err) {
      console.error('Error deleting owner:', err);
      throw err;
    }
  };

  return {
    owners,
    filteredOwners,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    loadOwners,
    updateOwner,
    deleteOwner,
  };
};

export default useVehicleOwners;