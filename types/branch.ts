export type BranchLocation = 'Nairobi' | 'Kisumu' | 'Mombasa' | 'Nakuru' | 'Eldoret';

/** GET /api/v1/branches and GET /api/v1/branches/:id */
export interface ApiBranch {
  DeletedAt: string | null;
  ID: string;
  Name: string;
  IsHeadquarter: boolean;
  Address: string;
  Phone: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
}

/** UI-friendly branch */
export interface BranchDisplay {
  id: string;
  name: string;
  isHeadquarter: boolean;
  address: string;
  phone: string;
  status: string;
}

export function mapApiBranchToDisplay(b: ApiBranch): BranchDisplay {
  return {
    id: b.ID,
    name: b.Name,
    isHeadquarter: b.IsHeadquarter,
    address: b.Address,
    phone: b.Phone,
    status: b.Status,
  };
}

/** POST /api/v1/admin/branches */
export interface CreateBranchPayload {
  id: string;
  name: string;
  isHeadquarter: boolean;
  address: string;
  phone: string;
  status: string;
}

/** PUT /api/v1/admin/branches/:id */
export interface UpdateBranchPayload {
  name: string;
  isHeadquarter: boolean;
  address: string;
  phone: string;
  status: string;
}
