// OwnerList.jsx - Grid/List view of all vehicle owners
import React from 'react';
import OwnerCard from './OwnerCard';
import { Users } from 'lucide-react';

const OwnerList = ({ owners, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading vehicle owners...</p>
      </div>
    );
  }

  if (owners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <Users className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No vehicle owners found
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          No vehicle owners match your search criteria. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{owners.length}</span>{' '}
          {owners.length === 1 ? 'owner' : 'owners'}
        </p>
      </div>

      {/* Owner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {owners.map((owner) => (
          <OwnerCard
            key={owner.id || owner.userId}
            owner={owner}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default OwnerList;