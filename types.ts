export interface CenterPrice {
  centerName: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  accredited: boolean;
  tat: string; // Turnaround Time
  location?: string;
}

export interface TestItem {
  id: string;
  name: string;
  type: 'test' | 'scan' | 'package' | 'doctor';
  category: string;
  description: string;
  shortDescription?: string;
  preparation?: string; // Optional for doctors/tests
  sampleType?: string; // Optional for doctors/tests
  reportTime?: string; // Optional for doctors/tests
  parametersCount?: number;
  imageUrl?: string;
  centers: CenterPrice[];
  isNabl?: boolean;
  tags?: string[];
  
  // Doctor specific
  specialty?: string;
  experience?: string;
  about?: string;

  // Search/Filter metadata
  organ?: string;
  condition?: string;
  risk_factor?: string;
}

export interface CartItem extends TestItem {
  cartId: string; // Unique ID for the cart entry
  selectedCenter: CenterPrice;
  appointmentDate?: string; 
  appointmentSlot?: string;
}

export interface Patient {
  id: string;
  fullName: string;
  age: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
}

export interface UserDetails extends Omit<Patient, 'id'> {
  serviceType: 'home' | 'lab';
  timeSlot: 'morning' | 'afternoon' | 'evening';
  doctorName?: string;
  prescriptionAttached?: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  userDetails: UserDetails;
}

export interface Coupon {
  code: string;
  discountType: 'flat' | 'percent';
  value: number;
  minOrderValue: number;
}

export interface B2BUser {
  id: string; // WP User ID
  name: string; // WP Display Name
  email: string; // WP User Email
  token: string; // JWT Token
  role: 'partner' | 'customer';
  organization?: string;
}