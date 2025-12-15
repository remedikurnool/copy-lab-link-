import { TestItem, Coupon } from './types';

export const MOCK_TESTS: TestItem[] = [
  {
    id: 't1',
    name: 'Complete Blood Count (CBC)',
    type: 'test',
    category: 'General Health',
    description: 'A complete blood count (CBC) is a blood test used to evaluate your overall health and detect a wide range of disorders, including anemia, infection and leukemia.',
    shortDescription: 'Also known as: Hemogram, CBC with ESR',
    preparation: 'No Fasting',
    sampleType: 'Blood (EDTA)',
    reportTime: '24 Hours',
    imageUrl: 'https://picsum.photos/400/200',
    tags: ['Popular'],
    isNabl: true,
    centers: [
      { centerName: 'Vijaya Diagnostics', price: 350, mrp: 450, rating: 4.8, reviews: 2000, accredited: true, tat: '24 Hours', location: 'Kurnool' },
      { centerName: 'Lucid Diagnostics', price: 300, mrp: 400, rating: 4.6, reviews: 850, accredited: true, tat: '24 Hours', location: 'Kurnool' },
      { centerName: 'Apollo Medical Centre', price: 450, mrp: 550, rating: 4.9, reviews: 1200, accredited: true, tat: '12 Hours', location: 'Kurnool' }
    ]
  },
  {
    id: 't2',
    name: 'HbA1c',
    type: 'test',
    category: 'Diabetes',
    description: 'The HbA1c test measures the amount of blood sugar (glucose) attached to hemoglobin over the last 3 months.',
    shortDescription: 'Glycosylated Hemoglobin',
    preparation: 'No Fasting',
    sampleType: 'Blood',
    reportTime: '12 Hours',
    tags: ['Gold Standard'],
    isNabl: true,
    centers: [
      { centerName: 'Thyrocare', price: 400, mrp: 550, rating: 4.7, reviews: 3000, accredited: true, tat: '24 Hours', location: 'Kurnool' },
      { centerName: 'Vijaya Diagnostics', price: 450, mrp: 600, rating: 4.8, reviews: 2500, accredited: true, tat: '12 Hours', location: 'Kurnool' }
    ]
  },
  {
    id: 't3',
    name: 'Lipid Profile',
    type: 'test',
    category: 'Heart',
    description: 'A cholesterol test is a blood test that measures the amount of cholesterol and triglycerides in your blood.',
    shortDescription: 'Cholesterol, Triglycerides & HDL/LDL',
    preparation: '10-12 Hrs Fasting',
    sampleType: 'Blood',
    reportTime: '24 Hours',
    parametersCount: 8,
    isNabl: true,
    centers: [
      { centerName: 'Lucid Diagnostics', price: 600, mrp: 800, rating: 4.5, reviews: 500, accredited: true, tat: '24 Hours', location: 'Kurnool' },
      { centerName: 'Apollo Medical Centre', price: 850, mrp: 1100, rating: 4.9, reviews: 1500, accredited: true, tat: '24 Hours', location: 'Kurnool' }
    ]
  },
  {
    id: 'p1',
    name: 'Full Body Checkup',
    type: 'package',
    category: 'Full Body',
    description: 'Comprehensive health screening covering all vital organs including Liver, Kidney, Heart, and Thyroid.',
    shortDescription: '60+ Tests: Liver, Kidney, Lipid & more',
    preparation: '12 Hrs Fasting',
    sampleType: 'Blood & Urine',
    reportTime: '48 Hours',
    parametersCount: 60,
    imageUrl: 'https://picsum.photos/400/200?random=2',
    tags: ['Safe', 'Popular'],
    isNabl: true,
    centers: [
      { centerName: 'Thyrocare', price: 1500, mrp: 3000, rating: 4.6, reviews: 5000, accredited: true, tat: '48 Hours', location: 'Kurnool' },
      { centerName: 'Vijaya Diagnostics', price: 2500, mrp: 4000, rating: 4.8, reviews: 2100, accredited: true, tat: '36 Hours', location: 'Kurnool' }
    ]
  },
   {
    id: 't4',
    name: 'Thyroid Profile (Total)',
    type: 'test',
    category: 'Thyroid',
    description: 'Thyroid function tests are a series of blood tests used to measure how well your thyroid gland is working.',
    shortDescription: 'T3, T4, TSH',
    preparation: 'No Fasting',
    sampleType: 'Blood',
    reportTime: '24 Hours',
    parametersCount: 3,
    isNabl: true,
    centers: [
      { centerName: 'Lucid Diagnostics', price: 500, mrp: 700, rating: 4.5, reviews: 900, accredited: true, tat: '24 Hours', location: 'Kurnool' },
      { centerName: 'Thyrocare', price: 450, mrp: 600, rating: 4.7, reviews: 4000, accredited: true, tat: '24 Hours', location: 'Kurnool' }
    ]
  },
   {
    id: 't5',
    name: 'Vitamin D Total',
    type: 'test',
    category: 'Vitamins',
    description: 'Checks for Vitamin D deficiency which can lead to bone disorders.',
    shortDescription: '25-Hydroxy Vitamin D',
    preparation: 'No Fasting',
    sampleType: 'Blood',
    reportTime: '24 Hours',
    isNabl: true,
    centers: [
      { centerName: 'Apollo Medical Centre', price: 1800, mrp: 2500, rating: 4.9, reviews: 1000, accredited: true, tat: '24 Hours', location: 'Kurnool' },
      { centerName: 'Vijaya Diagnostics', price: 1500, mrp: 2000, rating: 4.8, reviews: 1500, accredited: true, tat: '24 Hours', location: 'Kurnool' }
    ]
  },
  // --- SCANS ---
  {
    id: 's1',
    name: 'CT Brain Plain',
    type: 'scan',
    category: 'CT Scan',
    description: 'Computed tomography (CT) of the head uses special x-ray equipment to help assess head injuries, severe headaches, dizziness, and other symptoms of aneurysm, bleeding, stroke and brain tumors.',
    shortDescription: 'Non-Contrast CT Head',
    preparation: 'No specific preparation',
    sampleType: 'N/A',
    reportTime: '2 Hours',
    tags: ['Most Booked'],
    imageUrl: 'https://picsum.photos/400/200?random=30',
    centers: [
        { centerName: 'Vijaya Diagnostics', price: 2500, mrp: 3000, rating: 4.8, reviews: 120, accredited: true, tat: '2 Hours', location: 'Kurnool' },
        { centerName: 'Lucid Diagnostics', price: 2200, mrp: 2800, rating: 4.6, reviews: 80, accredited: true, tat: '3 Hours', location: 'Kurnool' }
    ]
  },
  {
    id: 's2',
    name: 'USG Abdomen & Pelvis',
    type: 'scan',
    category: 'Ultrasound',
    description: 'Ultrasound imaging of the abdomen and pelvis uses sound waves to produce pictures of the structures within the upper abdomen and pelvis.',
    shortDescription: 'Whole Abdomen Ultrasound',
    preparation: 'Fasting 4-6 Hours, Full Bladder',
    sampleType: 'N/A',
    reportTime: '1 Hour',
    tags: ['Most Booked'],
    imageUrl: 'https://picsum.photos/400/200?random=31',
    centers: [
        { centerName: 'Apollo Diagnostics', price: 1200, mrp: 1500, rating: 4.7, reviews: 200, accredited: true, tat: '1 Hour', location: 'Kurnool' },
        { centerName: 'Vijaya Diagnostics', price: 1300, mrp: 1600, rating: 4.8, reviews: 150, accredited: true, tat: '1 Hour', location: 'Kurnool' }
    ]
  },
  {
    id: 's3',
    name: '2D Echo & ECG',
    type: 'scan',
    category: 'Cardiology',
    description: '2D Echo is a non-invasive test used to visualize the heart structures. ECG records the electrical signal from the heart.',
    shortDescription: 'Echocardiogram + Electrocardiogram',
    preparation: 'No specific preparation',
    sampleType: 'N/A',
    reportTime: 'Immediate',
    tags: ['Most Booked'],
    imageUrl: 'https://picsum.photos/400/200?random=32',
    centers: [
        { centerName: 'KIMS Hospitals', price: 2000, mrp: 2500, rating: 4.9, reviews: 300, accredited: true, tat: '30 Mins', location: 'Kurnool' }
    ]
  },
  {
    id: 's4',
    name: 'MRI Brain Plain',
    type: 'scan',
    category: 'MRI',
    description: 'MRI of the head uses a powerful magnetic field, radio waves and a computer to produce detailed pictures of the brain and other cranial structures.',
    shortDescription: 'Magnetic Resonance Imaging',
    preparation: 'Remove metal objects',
    sampleType: 'N/A',
    reportTime: '4 Hours',
    tags: ['Most Booked'],
    imageUrl: 'https://picsum.photos/400/200?random=33',
    centers: [
        { centerName: 'Vijaya Diagnostics', price: 5500, mrp: 7000, rating: 4.8, reviews: 90, accredited: true, tat: '4 Hours', location: 'Kurnool' },
        { centerName: 'Lucid Diagnostics', price: 5000, mrp: 6500, rating: 4.7, reviews: 60, accredited: true, tat: '6 Hours', location: 'Kurnool' }
    ]
  },
  {
    id: 's5',
    name: 'CHEST X RAY PA VIEW',
    type: 'scan',
    category: 'X-Ray',
    description: 'A chest X-ray produces images of the heart, lungs, airways, blood vessels and the bones of the spine and chest.',
    shortDescription: 'Digital X-Ray Chest',
    preparation: 'Remove jewellery',
    sampleType: 'N/A',
    reportTime: '30 Mins',
    tags: ['Most Booked'],
    imageUrl: 'https://picsum.photos/400/200?random=34',
    centers: [
        { centerName: 'City X-Ray', price: 400, mrp: 500, rating: 4.5, reviews: 1000, accredited: true, tat: '30 Mins', location: 'Kurnool' },
        { centerName: 'Vijaya Diagnostics', price: 500, mrp: 600, rating: 4.8, reviews: 200, accredited: true, tat: '1 Hour', location: 'Kurnool' }
    ]
  }
];

export const MOCK_DOCTORS: TestItem[] = [
    {
        id: 'd1',
        name: 'Dr. T Karthik',
        type: 'doctor',
        category: 'General Physician',
        specialty: 'Physician & Diabetologist',
        experience: '6 Years',
        description: 'MBBS, MD - Consultant Physician and Diabetes Specialist.',
        about: 'Dr. T Karthik is a dedicated Consultant Physician and Diabetes Specialist with 6 years of experience. He specializes in managing diabetes, hypertension, and infectious diseases with a patient-centric approach.',
        imageUrl: 'https://picsum.photos/400/400?random=20',
        tags: ['Diabetes Specialist', 'Available'],
        centers: [
            { centerName: 'Karthik Clinic', price: 400, mrp: 400, rating: 4.8, reviews: 150, accredited: true, tat: 'N/A', location: 'Kurnool' }
        ]
    },
    {
        id: 'd2',
        name: 'Dr. K Ramya',
        type: 'doctor',
        category: 'Dermatologist',
        specialty: 'Dermatologist & Cosmetologist',
        experience: '3 Years',
        description: 'MBBS, MD - Dermatologist and Cosmetologist.',
        about: 'Dr. K Ramya is an expert in clinical dermatology and cosmetology. She provides comprehensive care for acne, pigmentation, hair loss, and anti-aging treatments.',
        imageUrl: 'https://picsum.photos/400/400?random=21',
        tags: ['Skin Care', 'Hair Treatment'],
        centers: [
            { centerName: 'Ramya Skin Care', price: 500, mrp: 500, rating: 4.7, reviews: 95, accredited: true, tat: 'N/A', location: 'Kurnool' }
        ]
    },
    {
        id: 'd3',
        name: 'Dr. D V Subba Reddy',
        type: 'doctor',
        category: 'Orthopedics',
        specialty: 'Orthopaedic Surgeon',
        experience: '10 Years',
        description: 'MBBS, MS - Orthopaedic Surgeon.',
        about: 'Dr. D V Subba Reddy is a senior Orthopaedic Surgeon with 10 years of experience. He specializes in trauma, joint replacement, and arthroscopy.',
        imageUrl: 'https://picsum.photos/400/400?random=22',
        tags: ['Bone Specialist', 'Surgeon'],
        centers: [
             { centerName: 'Ortho Care Hospital', price: 600, mrp: 600, rating: 4.9, reviews: 320, accredited: true, tat: 'N/A', location: 'Kurnool' }
        ]
    }
];

export const MOCK_COUPONS: Coupon[] = [
  { code: 'FIRST50', discountType: 'percent', value: 50, minOrderValue: 500 },
  { code: 'HEALTH100', discountType: 'flat', value: 100, minOrderValue: 999 }
];