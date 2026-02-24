// useInspectors.js - Custom hook for managing parking inspectors data
import { useState, useEffect, useCallback } from 'react';
import inspectorService from '../../services/superAdmin/inspectorService';

export const useInspectors = () => {
  const [inspectors, setInspectors] = useState([]);
  const [filteredInspectors, setFilteredInspectors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load inspectors from DynamoDB
  const loadInspectors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const inspectorsData = await inspectorService.getAllInspectors();
      setInspectors(inspectorsData);
      setFilteredInspectors(inspectorsData);
    } catch (err) {
      console.error('Error loading inspectors:', err);
      setError(err.message || 'Failed to load parking inspectors');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadInspectors();
  }, [loadInspectors]);

  // Filter inspectors based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredInspectors(inspectors);
      return;
    }

    const searchLower = searchQuery.toLowerCase();
    const filtered = inspectors.filter(
      (inspector) =>
        inspector.name.toLowerCase().includes(searchLower) ||
        inspector.mobileNumber.includes(searchQuery) ||
        (inspector.email && inspector.email.toLowerCase().includes(searchLower)) ||
        (inspector.inspectorId && inspector.inspectorId.toLowerCase().includes(searchLower))
    );

    setFilteredInspectors(filtered);
  }, [searchQuery, inspectors]);

  // Add new inspector (with hashed password)
  const addInspector = async (inspectorData) => {
    try {
      const result = await inspectorService.addInspector(inspectorData);
      await loadInspectors(); // Refresh list
      return result;
    } catch (err) {
      console.error('Error adding inspector:', err);
      throw err;
    }
  };

  // Update inspector
  const updateInspector = async (inspectorId, updates) => {
    try {
      await inspectorService.updateInspector(inspectorId, updates);
      await loadInspectors(); // Refresh list
      return { success: true };
    } catch (err) {
      console.error('Error updating inspector:', err);
      throw err;
    }
  };

  // Delete inspector
  const deleteInspector = async (inspectorId) => {
    try {
      await inspectorService.deleteInspector(inspectorId);
      await loadInspectors(); // Refresh list
      return { success: true };
    } catch (err) {
      console.error('Error deleting inspector:', err);
      throw err;
    }
  };

  // Update inspector status
  const updateStatus = async (inspectorId, status) => {
    try {
      await inspectorService.updateInspectorStatus(inspectorId, status);
      await loadInspectors(); // Refresh list
      return { success: true };
    } catch (err) {
      console.error('Error updating status:', err);
      throw err;
    }
  };

  return {
    inspectors,
    filteredInspectors,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    loadInspectors,
    addInspector,
    updateInspector,
    deleteInspector,
    updateStatus,
  };
};

export default useInspectors;