export interface User {
  id: string;
  username: string;
  role: 'admin' | 'warehouse' | 'requester';
}

export interface Part {
  id: string;
  partNumber: string;
  description: string;
  location: string;
  type: 'unit' | 'bulk'; // unit = piezas individuales, bulk = tornillos/consumibles
  items: PartItem[];
}

export interface PartItem {
  id: string;
  serialNumber: string;
  status: 'available' | 'reserved' | 'out';
  entryDate: string;
  pdfUrl?: string;
  pdfName?: string;
  notes?: string;
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
}

export interface HistoryEntry {
  id: string;
  partNumber: string;
  serialNumber?: string;
  action: 'entry' | 'exit' | 'reserved';
  quantity: number;
  user: string;
  date: string;
  notes?: string;
}
