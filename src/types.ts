export interface User {
  id: string;
  username: string;
  role: 'admin' | 'warehouse' | 'requester';
}

export interface Part {
  id: string;
  description: string;
  type: 'unit' | 'bulk';
  items: PartItem[];
}

export interface PartItem {
  id: string;
  serialNumber: string;
  partNumber: string;
  location: string;
  status: 'available' | 'reserved' | 'out' | 'overhaul';
  entryDate: string;
  pdfUrl?: string;
  pdfName?: string;
  notes?: string;
  overhaulInfo?: {
    sentDate: string;
    expectedReturn?: string;
    repairShop?: string;
    reason?: string;
    aircraftRemoved?: string;
  };
}

export interface PartRequest {
  id: string;
  partNumber: string;
  serialNumber?: string;
  quantity: number;
  requestedBy: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  approvedBy?: string;
  approvalDate?: string;
  notes?: string;
  requestType: 'exit' | 'overhaul';
  overhaulInfo?: {
    repairShop?: string;
    aircraftRemoved?: string;
    expectedReturn?: string;
    reason?: string;
  };
}

export interface HistoryEntry {
  id: string;
  partNumber: string;
  serialNumber?: string;
  action: 'entry' | 'exit' | 'reserved' | 'overhaul' | 'overhaul_return';
  quantity: number;
  user: string;
  date: string;
  notes?: string;
}
