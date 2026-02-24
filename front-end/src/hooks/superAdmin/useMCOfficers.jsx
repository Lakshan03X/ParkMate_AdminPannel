// useMCOfficers.js - Custom hook for managing MC officers data
import { useState, useEffect, useCallback } from 'react';
import mcOfficerService from '../../services/superAdmin/mcOfficerService';

export const useMCOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const [filteredOfficers, setFilteredOfficers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load officers from DynamoDB
  const loadOfficers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const officersData = await mcOfficerService.getAllOfficers();
      setOfficers(officersData);
      setFilteredOfficers(officersData);
    } catch (err) {
      console.error('Error loading officers:', err);
      setError(err.message || 'Failed to load MC officers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadOfficers();
  }, [loadOfficers]);

  // Filter officers based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOfficers(officers);
      return;
    }

    const searchLower = searchQuery.toLowerCase();
    const filtered = officers.filter(
      (officer) =>
        officer.name.toLowerCase().includes(searchLower) ||
        officer.mobileNumber.includes(searchQuery) ||
        (officer.email && officer.email.toLowerCase().includes(searchLower)) ||
        (officer.officerId && officer.officerId.toLowerCase().includes(searchLower))
    );

    setFilteredOfficers(filtered);
  }, [searchQuery, officers]);

  // Add officer
  const addOfficer = async (officerData) => {
    try {
      await mcOfficerService.addOfficer(officerData);
      await loadOfficers(); // Refresh list
      return { success: true };
    } catch (err) {
      console.error('Error adding officer:', err);
      throw err;
    }
  };

  // Update officer
  const updateOfficer = async (officerId, updates) => {
    try {
      await mcOfficerService.updateOfficer(officerId, updates);
      await loadOfficers(); // Refresh list
      return { success: true };
    } catch (err) {
      console.error('Error updating officer:', err);
      throw err;
    }
  };

  // Delete officer
  const deleteOfficer = async (officerId) => {
    try {
      await mcOfficerService.deleteOfficer(officerId);
      await loadOfficers(); // Refresh list
      return { success: true };
    } catch (err) {
      console.error('Error deleting officer:', err);
      throw err;
    }
  };

  return {
    officers,
    filteredOfficers,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    loadOfficers,
    addOfficer,
    updateOfficer,
    deleteOfficer,
  };
};

export default useMCOfficers;