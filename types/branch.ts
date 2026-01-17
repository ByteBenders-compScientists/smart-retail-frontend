export type BranchLocation = 'Nairobi' | 'Kisumu' | 'Mombasa' | 'Nakuru' | 'Eldoret';

export interface Branch {
  id: string;
  name: BranchLocation;
  isHeadquarter: boolean;
  address: string;
  phone: string;
  status: 'active' | 'inactive';
}

export const BRANCHES: Branch[] = [
  {
    id: 'branch-nairobi',
    name: 'Nairobi',
    isHeadquarter: true,
    address: 'Nairobi CBD, Kenya',
    phone: '+254 700 000 001',
    status: 'active'
  },
  {
    id: 'branch-kisumu',
    name: 'Kisumu',
    isHeadquarter: false,
    address: 'Kisumu City, Kenya',
    phone: '+254 700 000 002',
    status: 'active'
  },
  {
    id: 'branch-mombasa',
    name: 'Mombasa',
    isHeadquarter: false,
    address: 'Mombasa Road, Kenya',
    phone: '+254 700 000 003',
    status: 'active'
  },
  {
    id: 'branch-nakuru',
    name: 'Nakuru',
    isHeadquarter: false,
    address: 'Nakuru Town, Kenya',
    phone: '+254 700 000 004',
    status: 'active'
  },
  {
    id: 'branch-eldoret',
    name: 'Eldoret',
    isHeadquarter: false,
    address: 'Eldoret Town, Kenya',
    phone: '+254 700 000 005',
    status: 'active'
  }
];