export interface Field {
  id: number;
  name: string;
  sportType: string;
  pricePerHour: number;
  status: string;
}

export interface Booking {
  id: number;
  userId: string;
  fieldId: number;
  date: string;
  startTime: string;
  endTime: string;
  customerName: string;
  status: 'BOOKED' | 'CANCELLED' | 'COMPLETED';
}

// Data lapangan
export const fields: Field[] = [
  {
    id: 1,
    name: 'Lapangan Futsal A',
    sportType: 'Futsal',
    pricePerHour: 100000,
    status: 'ACTIVE',
  },
  {
    id: 2,
    name: 'Lapangan Badminton A',
    sportType: 'Badminton',
    pricePerHour: 50000,
    status: 'ACTIVE',
  },
  {
    id: 3,
    name: 'Lapangan Basket A',
    sportType: 'Basket',
    pricePerHour: 120000,
    status: 'ACTIVE',
  },
];

// Data reservasi
export const bookings: Booking[] = [];