'use client';

import { useState } from 'react';
import { MapPin, Check } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  isHeadquarter: boolean;
  address: string;
  phone: string;
}

const BRANCHES: Branch[] = [
  {
    id: 'branch-nairobi',
    name: 'Nairobi',
    isHeadquarter: true,
    address: 'Nairobi CBD, Kenya',
    phone: '+254 700 000 001',
  },
  {
    id: 'branch-kisumu',
    name: 'Kisumu',
    isHeadquarter: false,
    address: 'Kisumu City, Kenya',
    phone: '+254 700 000 002',
  },
  {
    id: 'branch-mombasa',
    name: 'Mombasa',
    isHeadquarter: false,
    address: 'Mombasa Road, Kenya',
    phone: '+254 700 000 003',
  },
  {
    id: 'branch-nakuru',
    name: 'Nakuru',
    isHeadquarter: false,
    address: 'Nakuru Town, Kenya',
    phone: '+254 700 000 004',
  },
  {
    id: 'branch-eldoret',
    name: 'Eldoret',
    isHeadquarter: false,
    address: 'Eldoret Town, Kenya',
    phone: '+254 700 000 005',
  },
];

interface BranchSelectorProps {
  selectedBranch: Branch | null;
  onBranchSelect: (branch: Branch) => void;
  showChangeButton?: boolean;
}

export default function BranchSelector({ 
  selectedBranch, 
  onBranchSelect,
  showChangeButton = true 
}: BranchSelectorProps) {
  const [isSelecting, setIsSelecting] = useState(!selectedBranch);

  const handleSelectBranch = (branch: Branch) => {
    onBranchSelect(branch);
    setIsSelecting(false);
  };

  const handleChangeBranch = () => {
    setIsSelecting(true);
  };

  if (!isSelecting && selectedBranch) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Shopping at</p>
              <p className="font-semibold text-gray-900">
                {selectedBranch.name} {selectedBranch.isHeadquarter && '(HQ)'}
              </p>
            </div>
          </div>
          {showChangeButton && (
            <button
              onClick={handleChangeBranch}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Change Branch
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <MapPin className="h-6 w-6 mr-2 text-blue-600" />
        Select Your Shopping Branch
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BRANCHES.map((branch) => (
          <div
            key={branch.id}
            onClick={() => handleSelectBranch(branch)}
            className="bg-white border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  {branch.name}
                  {branch.isHeadquarter && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                      HQ
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{branch.address}</p>
                <p className="text-sm text-gray-500 mt-1">{branch.phone}</p>
              </div>

              {selectedBranch?.id === branch.id && (
                <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
