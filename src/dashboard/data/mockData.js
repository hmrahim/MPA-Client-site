// Moom24 Dark Theme ERP Mock Data for Mirashani Academy High School (100% English)

export const initialSchoolInfo = {
  name: 'Mirashani Academy High School',
  eiin: '108420',
  estd: '2005',
  board: 'Sylhet Education Board',
  code: 'SCH-7842',
  address: 'Mirashani, Madhabpur, Habiganj, Sylhet',
  phone: '+880 1711-234567',
  email: 'admin@mirashani-academy.edu.bd',
  website: 'https://mirashani-academy.edu.bd',
  principalName: 'Md. Rafiqul Islam (M.A, B.Ed)',
  currentSession: '2026',
  currentTerm: 'Half-Yearly Examination 2026'
};

export const classesList = [
  { id: 'c6', name: 'Class 6', sections: ['A (Padma)', 'B (Meghna)'], capacity: 120, enrolled: 112 },
  { id: 'c7', name: 'Class 7', sections: ['A (Jamuna)', 'B (Surma)'], capacity: 120, enrolled: 108 },
  { id: 'c8', name: 'Class 8', sections: ['A (Karnaphuli)', 'B (Teesta)'], capacity: 120, enrolled: 115 },
  { id: 'c9', name: 'Class 9', sections: ['Science', 'Business Studies', 'Humanities'], capacity: 150, enrolled: 142 },
  { id: 'c10', name: 'Class 10', sections: ['Science', 'Business Studies', 'Humanities'], capacity: 150, enrolled: 138 }
];

export const initialStudents = [

  // ══ CLASS 6 — Section A ══
  { id: 'STU-6A01', roll: '01', name: 'Arif Hossain Rafi',       classId: 'ac6', className: 'Class 6', section: 'A', gender: 'Male',   bloodGroup: 'A+',  dob: '2014-03-12', fatherName: 'Md. Abul Hossain',     motherName: 'Rehana Begum',    guardianPhone: '01711-611001', address: 'Mirashani, Madhabpur',    admissionDate: '2026-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 97, gpa: '5.00' },
  { id: 'STU-6A02', roll: '02', name: 'Sumaiya Akter Momo',      classId: 'ac6', className: 'Class 6', section: 'A', gender: 'Female', bloodGroup: 'B+',  dob: '2014-07-22', fatherName: 'Md. Nazrul Islam',     motherName: 'Sufia Begum',     guardianPhone: '01712-611002', address: 'Andiura, Madhabpur',      admissionDate: '2026-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',  feeDue: 400,  attendanceRate: 94, gpa: '4.90' },
  { id: 'STU-6A03', roll: '03', name: 'Tasnim Jahan Tisha',      classId: 'ac6', className: 'Class 6', section: 'A', gender: 'Female', bloodGroup: 'O+',  dob: '2014-01-05', fatherName: 'Md. Khairul Alam',     motherName: 'Morjina Begum',   guardianPhone: '01713-611003', address: 'Shahjibazar, Madhabpur',  admissionDate: '2026-01-11', status: 'Active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 92, gpa: '4.75' },
  { id: 'STU-6A04', roll: '04', name: 'Rahat Khan Ripon',        classId: 'ac6', className: 'Class 6', section: 'A', gender: 'Male',   bloodGroup: 'AB+', dob: '2014-09-18', fatherName: 'Md. Jalal Uddin',      motherName: 'Amena Khatun',    guardianPhone: '01714-611004', address: 'Mirashani Bazar',         admissionDate: '2026-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',  feeDue: 600,  attendanceRate: 89, gpa: '4.50' },
  { id: 'STU-6A05', roll: '05', name: 'Nafisa Islam Nitu',       classId: 'ac6', className: 'Class 6', section: 'A', gender: 'Female', bloodGroup: 'A-',  dob: '2014-05-30', fatherName: 'Md. Shamsul Haque',    motherName: 'Nasrin Akter',    guardianPhone: '01715-611005', address: 'Harashpur, Mirashani',    admissionDate: '2026-01-12', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 95, gpa: '4.80' },

  // ══ CLASS 6 — Section B ══
  { id: 'STU-6B01', roll: '01', name: 'Fahim Ahmed Shawon',      classId: 'ac6', className: 'Class 6', section: 'B', gender: 'Male',   bloodGroup: 'B-',  dob: '2014-02-14', fatherName: 'Md. Faruk Ahmed',      motherName: 'Bilkis Begum',    guardianPhone: '01716-611006', address: 'Teliapara, Madhabpur',    admissionDate: '2026-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 96, gpa: '4.95' },
  { id: 'STU-6B02', roll: '02', name: 'Lamia Tabassum Liya',     classId: 'ac6', className: 'Class 6', section: 'B', gender: 'Female', bloodGroup: 'O-',  dob: '2014-11-08', fatherName: 'Md. Lutfor Rahman',    motherName: 'Roksana Begum',   guardianPhone: '01717-611007', address: 'Dharmaghar, Madhabpur',   admissionDate: '2026-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',  feeDue: 500,  attendanceRate: 91, gpa: '4.70' },
  { id: 'STU-6B03', roll: '03', name: 'Imran Hossain Joy',       classId: 'ac6', className: 'Class 6', section: 'B', gender: 'Male',   bloodGroup: 'A+',  dob: '2014-06-25', fatherName: 'Md. Kamal Hossain',    motherName: 'Kohinoor Begum',  guardianPhone: '01718-611008', address: 'Jagadishpur, Habiganj',   admissionDate: '2026-01-11', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 98, gpa: '5.00' },
  { id: 'STU-6B04', roll: '04', name: 'Nusrat Fatema Nila',      classId: 'ac6', className: 'Class 6', section: 'B', gender: 'Female', bloodGroup: 'B+',  dob: '2014-04-17', fatherName: 'Md. Nurul Islam',      motherName: 'Halima Khatun',   guardianPhone: '01719-611009', address: 'Mirashani, Madhabpur',    admissionDate: '2026-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',  feeDue: 800,  attendanceRate: 87, gpa: '4.40' },
  { id: 'STU-6B05', roll: '05', name: 'Sojib Ahmed Sabbir',      classId: 'ac6', className: 'Class 6', section: 'B', gender: 'Male',   bloodGroup: 'O+',  dob: '2014-08-03', fatherName: 'Md. Saidur Rahman',    motherName: 'Fatema Begum',    guardianPhone: '01720-611010', address: 'Choumuhani, Madhabpur',   admissionDate: '2026-01-12', status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 93, gpa: '4.60' },

  // ══ CLASS 7 — Section A ══
  { id: 'STU-7A01', roll: '01', name: 'Rezaul Karim Reza',       classId: 'ac7', className: 'Class 7', section: 'A', gender: 'Male',   bloodGroup: 'A+',  dob: '2013-01-20', fatherName: 'Md. Rezaur Rahman',    motherName: 'Jesmin Akter',    guardianPhone: '01721-711001', address: 'Mirashani, Madhabpur',    admissionDate: '2025-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 96, gpa: '4.90' },
  { id: 'STU-7A02', roll: '02', name: 'Ayasha Siddiqa Asha',     classId: 'ac7', className: 'Class 7', section: 'A', gender: 'Female', bloodGroup: 'B+',  dob: '2013-05-14', fatherName: 'Md. Akbar Ali',        motherName: 'Shahida Begum',   guardianPhone: '01722-711002', address: 'Andiura, Madhabpur',      admissionDate: '2025-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',  feeDue: 400,  attendanceRate: 93, gpa: '4.75' },
  { id: 'STU-7A03', roll: '03', name: 'Sabbir Hossain Sunny',    classId: 'ac7', className: 'Class 7', section: 'A', gender: 'Male',   bloodGroup: 'O+',  dob: '2013-09-28', fatherName: 'Md. Sabbir Uddin',     motherName: 'Rahima Begum',    guardianPhone: '01723-711003', address: 'Teliapara, Madhabpur',    admissionDate: '2025-01-11', status: 'Active', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 90, gpa: '4.55' },
  { id: 'STU-7A04', roll: '04', name: 'Maliha Jannat Mimi',      classId: 'ac7', className: 'Class 7', section: 'A', gender: 'Female', bloodGroup: 'AB+', dob: '2013-03-07', fatherName: 'Md. Mainul Islam',     motherName: 'Parveen Akter',   guardianPhone: '01724-711004', address: 'Shahjibazar, Madhabpur',  admissionDate: '2025-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',  feeDue: 700,  attendanceRate: 88, gpa: '4.40' },
  { id: 'STU-7A05', roll: '05', name: 'Tanvir Ahmed Tuhin',      classId: 'ac7', className: 'Class 7', section: 'A', gender: 'Male',   bloodGroup: 'A-',  dob: '2013-11-15', fatherName: 'Md. Tanvir Hossain',   motherName: 'Nasima Khatun',   guardianPhone: '01725-711005', address: 'Harashpur, Mirashani',    admissionDate: '2025-01-12', status: 'Active', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 97, gpa: '5.00' },

  // ══ CLASS 7 — Section B ══
  { id: 'STU-7B01', roll: '01', name: 'Saiful Islam Saimon',     classId: 'ac7', className: 'Class 7', section: 'B', gender: 'Male',   bloodGroup: 'B-',  dob: '2013-02-11', fatherName: 'Md. Saifuddin Ahmed',  motherName: 'Minara Begum',    guardianPhone: '01726-711006', address: 'Dharmaghar, Madhabpur',   admissionDate: '2025-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 95, gpa: '4.85' },
  { id: 'STU-7B02', roll: '02', name: 'Fariha Tasnim Farha',     classId: 'ac7', className: 'Class 7', section: 'B', gender: 'Female', bloodGroup: 'O-',  dob: '2013-07-19', fatherName: 'Md. Farhat Hossain',   motherName: 'Shirin Akter',    guardianPhone: '01727-711007', address: 'Choumuhani, Madhabpur',   admissionDate: '2025-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',  feeDue: 500,  attendanceRate: 91, gpa: '4.65' },
  { id: 'STU-7B03', roll: '03', name: 'Arafat Hossain Arif',     classId: 'ac7', className: 'Class 7', section: 'B', gender: 'Male',   bloodGroup: 'A+',  dob: '2013-04-25', fatherName: 'Md. Arafat Ullah',     motherName: 'Jamila Begum',    guardianPhone: '01728-711008', address: 'Jagadishpur, Habiganj',   admissionDate: '2025-01-11', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 94, gpa: '4.80' },
  { id: 'STU-7B04', roll: '04', name: 'Sharmin Akter Shorna',    classId: 'ac7', className: 'Class 7', section: 'B', gender: 'Female', bloodGroup: 'B+',  dob: '2013-10-08', fatherName: 'Md. Shahadat Hossain', motherName: 'Saleha Begum',    guardianPhone: '01729-711009', address: 'Mirashani, Madhabpur',    admissionDate: '2025-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',  feeDue: 900,  attendanceRate: 86, gpa: '4.35' },
  { id: 'STU-7B05', roll: '05', name: 'Milon Hossain Miraz',     classId: 'ac7', className: 'Class 7', section: 'B', gender: 'Male',   bloodGroup: 'O+',  dob: '2013-06-30', fatherName: 'Md. Milon Ahmed',      motherName: 'Kohinoor Akter',  guardianPhone: '01730-711010', address: 'Andiura, Madhabpur',      admissionDate: '2025-01-12', status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 92, gpa: '4.60' },

  // ══ CLASS 8 — Section A ══
  { id: 'STU-8A01', roll: '01', name: 'Rajib Hasan Roni',        classId: 'ac8', className: 'Class 8', section: 'A', gender: 'Male',   bloodGroup: 'A+',  dob: '2012-01-15', fatherName: 'Md. Rajibul Haque',    motherName: 'Taslima Begum',   guardianPhone: '01731-811001', address: 'Mirashani, Madhabpur',    admissionDate: '2024-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 98, gpa: '5.00' },
  { id: 'STU-8A02', roll: '02', name: 'Tahmina Akter Tania',     classId: 'ac8', className: 'Class 8', section: 'A', gender: 'Female', bloodGroup: 'B+',  dob: '2012-06-22', fatherName: 'Md. Tahmidul Islam',   motherName: 'Rozina Begum',    guardianPhone: '01732-811002', address: 'Teliapara, Madhabpur',    admissionDate: '2024-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',  feeDue: 300,  attendanceRate: 95, gpa: '4.85' },
  { id: 'STU-8A03', roll: '03', name: 'Hasib Uddin Hasan',       classId: 'ac8', className: 'Class 8', section: 'A', gender: 'Male',   bloodGroup: 'O-',  dob: '2012-09-10', fatherName: 'Md. Hasibur Rahman',   motherName: 'Nurunnahar Begum', guardianPhone: '01733-811003', address: 'Shahjibazar, Madhabpur',  admissionDate: '2024-01-11', status: 'Active', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 89, gpa: '4.50' },
  { id: 'STU-8A04', roll: '04', name: 'Jannatul Ferdous Jui',    classId: 'ac8', className: 'Class 8', section: 'A', gender: 'Female', bloodGroup: 'AB+', dob: '2012-03-28', fatherName: 'Md. Jalaluddin',       motherName: 'Meherunnesa',     guardianPhone: '01734-811004', address: 'Harashpur, Mirashani',    admissionDate: '2024-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',  feeDue: 600,  attendanceRate: 91, gpa: '4.65' },
  { id: 'STU-8A05', roll: '05', name: 'Rifat Hossain Rifad',     classId: 'ac8', className: 'Class 8', section: 'A', gender: 'Male',   bloodGroup: 'A-',  dob: '2012-11-05', fatherName: 'Md. Rifatuddin',       motherName: 'Sumaiya Khatun',  guardianPhone: '01735-811005', address: 'Choumuhani, Madhabpur',   admissionDate: '2024-01-12', status: 'Active', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 97, gpa: '4.95' },

  // ══ CLASS 8 — Section B ══
  { id: 'STU-8B01', roll: '01', name: 'Zahirul Islam Zahir',     classId: 'ac8', className: 'Class 8', section: 'B', gender: 'Male',   bloodGroup: 'B+',  dob: '2012-04-16', fatherName: 'Md. Zahirul Haque',    motherName: 'Shamsunnahar',    guardianPhone: '01736-811006', address: 'Dharmaghar, Madhabpur',   admissionDate: '2024-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 94, gpa: '4.80' },
  { id: 'STU-8B02', roll: '02', name: 'Sumaiya Khanam Sumi',     classId: 'ac8', className: 'Class 8', section: 'B', gender: 'Female', bloodGroup: 'O+',  dob: '2012-08-07', fatherName: 'Md. Siddiqur Rahman',  motherName: 'Hosne Ara',       guardianPhone: '01737-811007', address: 'Jagadishpur, Habiganj',   admissionDate: '2024-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',  feeDue: 400,  attendanceRate: 88, gpa: '4.45' },
  { id: 'STU-8B03', roll: '03', name: 'Arman Hossain Arif',      classId: 'ac8', className: 'Class 8', section: 'B', gender: 'Male',   bloodGroup: 'A+',  dob: '2012-12-19', fatherName: 'Md. Arman Ullah',      motherName: 'Feroza Begum',    guardianPhone: '01738-811008', address: 'Mirashani, Madhabpur',    admissionDate: '2024-01-11', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 96, gpa: '4.90' },
  { id: 'STU-8B04', roll: '04', name: 'Mahfuza Akter Mitu',      classId: 'ac8', className: 'Class 8', section: 'B', gender: 'Female', bloodGroup: 'B-',  dob: '2012-02-23', fatherName: 'Md. Mahfuzur Rahman',  motherName: 'Romena Begum',    guardianPhone: '01739-811009', address: 'Andiura, Madhabpur',      admissionDate: '2024-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',  feeDue: 700,  attendanceRate: 85, gpa: '4.30' },
  { id: 'STU-8B05', roll: '05', name: 'Shakil Ahmed Shihab',     classId: 'ac8', className: 'Class 8', section: 'B', gender: 'Male',   bloodGroup: 'AB-', dob: '2012-07-11', fatherName: 'Md. Shakilur Ahmed',   motherName: 'Lovely Akter',    guardianPhone: '01740-811010', address: 'Teliapara, Madhabpur',    admissionDate: '2024-01-12', status: 'Active', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 90, gpa: '4.60' },

  // ══ CLASS 9 — Science ══
  { id: 'STU-9S01', roll: '01', name: 'Mehedi Hasan Riyad',      classId: 'ac9', className: 'Class 9', section: 'Science', gender: 'Male',   bloodGroup: 'O-',  dob: '2011-06-17', fatherName: 'Md. Sirajul Haque',    motherName: 'Monowara Begum',  guardianPhone: '01718-445566', address: 'Teliapara, Madhabpur',    admissionDate: '2023-01-15', status: 'Active', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 97, gpa: '4.95' },
  { id: 'STU-9S02', roll: '02', name: 'Nusrat Jahan Mim',        classId: 'ac9', className: 'Class 9', section: 'Science', gender: 'Female', bloodGroup: 'A+',  dob: '2011-03-30', fatherName: 'Md. Enamul Kabir',     motherName: 'Najma Akter',     guardianPhone: '01923-887766', address: 'Dharmaghar, Madhabpur',   admissionDate: '2023-01-15', status: 'Active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',  feeDue: 900,  attendanceRate: 93, gpa: '4.80' },
  { id: 'STU-9S03', roll: '03', name: 'Rakib Hasan Rony',        classId: 'ac9', className: 'Class 9', section: 'Science', gender: 'Male',   bloodGroup: 'B+',  dob: '2011-09-12', fatherName: 'Md. Rakibul Islam',    motherName: 'Kulsum Begum',    guardianPhone: '01741-911003', address: 'Mirashani, Madhabpur',    admissionDate: '2023-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 95, gpa: '4.85' },
  { id: 'STU-9S04', roll: '04', name: 'Jannatul Naim Joti',      classId: 'ac9', className: 'Class 9', section: 'Science', gender: 'Female', bloodGroup: 'O+',  dob: '2011-01-25', fatherName: 'Md. Naimuddin',        motherName: 'Nargis Begum',    guardianPhone: '01742-911004', address: 'Shahjibazar, Madhabpur',  admissionDate: '2023-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',  feeDue: 500,  attendanceRate: 91, gpa: '4.70' },
  { id: 'STU-9S05', roll: '05', name: 'Arif Billah Arfan',       classId: 'ac9', className: 'Class 9', section: 'Science', gender: 'Male',   bloodGroup: 'AB+', dob: '2011-07-08', fatherName: 'Md. Billal Hossain',   motherName: 'Mahmuda Akter',   guardianPhone: '01743-911005', address: 'Harashpur, Mirashani',    admissionDate: '2023-01-12', status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 98, gpa: '5.00' },

  // ══ CLASS 9 — Business ══
  { id: 'STU-9BU01', roll: '01', name: 'Tawhid Islam Tony',      classId: 'ac9', className: 'Class 9', section: 'Business', gender: 'Male',   bloodGroup: 'A+',  dob: '2011-04-03', fatherName: 'Md. Tawhidul Alam',   motherName: 'Laila Begum',     guardianPhone: '01744-911006', address: 'Mirashani, Madhabpur',    admissionDate: '2023-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 90, gpa: '4.55' },
  { id: 'STU-9BU02', roll: '02', name: 'Sonia Akter Shorna',     classId: 'ac9', className: 'Class 9', section: 'Business', gender: 'Female', bloodGroup: 'B-',  dob: '2011-10-16', fatherName: 'Md. Soniar Uddin',    motherName: 'Shirina Begum',   guardianPhone: '01745-911007', address: 'Andiura, Madhabpur',      admissionDate: '2023-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',  feeDue: 600,  attendanceRate: 87, gpa: '4.40' },
  { id: 'STU-9BU03', roll: '03', name: 'Raihan Uddin Rabbi',     classId: 'ac9', className: 'Class 9', section: 'Business', gender: 'Male',   bloodGroup: 'O+',  dob: '2011-02-28', fatherName: 'Md. Raihanul Islam',  motherName: 'Kamrunnessa',     guardianPhone: '01746-911008', address: 'Choumuhani, Madhabpur',   admissionDate: '2023-01-11', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 94, gpa: '4.75' },
  { id: 'STU-9BU04', roll: '04', name: 'Sumaya Islam Sumi',      classId: 'ac9', className: 'Class 9', section: 'Business', gender: 'Female', bloodGroup: 'A-',  dob: '2011-08-20', fatherName: 'Md. Sumaiyur Rahman', motherName: 'Reba Begum',      guardianPhone: '01747-911009', address: 'Dharmaghar, Madhabpur',   admissionDate: '2023-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',  feeDue: 800,  attendanceRate: 85, gpa: '4.30' },
  { id: 'STU-9BU05', roll: '05', name: 'Shihab Uddin Shahin',    classId: 'ac9', className: 'Class 9', section: 'Business', gender: 'Male',   bloodGroup: 'B+',  dob: '2011-12-05', fatherName: 'Md. Shihabuddin',     motherName: 'Selina Akter',    guardianPhone: '01748-911010', address: 'Jagadishpur, Habiganj',   admissionDate: '2023-01-12', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 96, gpa: '4.88' },

  // ══ CLASS 9 — Humanities ══
  { id: 'STU-9HU01', roll: '01', name: 'Masud Rana Masud',       classId: 'ac9', className: 'Class 9', section: 'Humanities', gender: 'Male',   bloodGroup: 'O+',  dob: '2011-03-14', fatherName: 'Md. Masudur Rahman',  motherName: 'Asma Begum',      guardianPhone: '01749-911011', address: 'Mirashani, Madhabpur',    admissionDate: '2023-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 89, gpa: '4.45' },
  { id: 'STU-9HU02', roll: '02', name: 'Rina Akter Ritu',        classId: 'ac9', className: 'Class 9', section: 'Humanities', gender: 'Female', bloodGroup: 'B+',  dob: '2011-07-27', fatherName: 'Md. Rintu Mia',       motherName: 'Rekha Begum',     guardianPhone: '01750-911012', address: 'Teliapara, Madhabpur',    admissionDate: '2023-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',  feeDue: 450,  attendanceRate: 92, gpa: '4.60' },
  { id: 'STU-9HU03', roll: '03', name: 'Farhan Ahmed Faisal',    classId: 'ac9', className: 'Class 9', section: 'Humanities', gender: 'Male',   bloodGroup: 'A+',  dob: '2011-11-02', fatherName: 'Md. Farhad Hossain',  motherName: 'Farida Khatun',   guardianPhone: '01751-911013', address: 'Shahjibazar, Madhabpur',  admissionDate: '2023-01-11', status: 'Active', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 93, gpa: '4.70' },
  { id: 'STU-9HU04', roll: '04', name: 'Israt Jahan Isha',       classId: 'ac9', className: 'Class 9', section: 'Humanities', gender: 'Female', bloodGroup: 'AB-', dob: '2011-05-18', fatherName: 'Md. Israfil Hossain', motherName: 'Ira Begum',       guardianPhone: '01752-911014', address: 'Harashpur, Mirashani',    admissionDate: '2023-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',  feeDue: 700,  attendanceRate: 86, gpa: '4.35' },
  { id: 'STU-9HU05', roll: '05', name: 'Naim Uddin Nayan',       classId: 'ac9', className: 'Class 9', section: 'Humanities', gender: 'Male',   bloodGroup: 'O-',  dob: '2011-09-22', fatherName: 'Md. Naimuddin Ahmed', motherName: 'Nazia Akter',     guardianPhone: '01753-911015', address: 'Andiura, Madhabpur',      admissionDate: '2023-01-12', status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 95, gpa: '4.82' },

  // ══ CLASS 10 — Science ══
  { id: 'STU-1001', roll: '01', name: 'Abdullah Al Noman',       classId: 'ac10', className: 'Class 10', section: 'Science', gender: 'Male',   bloodGroup: 'A+',  dob: '2010-04-12', fatherName: 'Md. Harunur Rashid',  motherName: 'Nasima Begum',    guardianPhone: '01712-345678', address: 'Mirashani, Madhabpur, Habiganj',  admissionDate: '2021-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 98, gpa: '5.00' },
  { id: 'STU-1002', roll: '02', name: 'Ayesha Siddika',          classId: 'ac10', className: 'Class 10', section: 'Science', gender: 'Female', bloodGroup: 'B+',  dob: '2010-08-25', fatherName: 'Dr. Abul Kashem',     motherName: 'Sultana Parveen', guardianPhone: '01819-876543', address: 'Aulia Nagar, Madhabpur',          admissionDate: '2021-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',  feeDue: 800,  attendanceRate: 96, gpa: '5.00' },
  { id: 'STU-1003', roll: '03', name: 'Tanvir Hasan Mahir',      classId: 'ac10', className: 'Class 10', section: 'Science', gender: 'Male',   bloodGroup: 'O+',  dob: '2010-02-18', fatherName: 'Md. Zahirul Islam',   motherName: 'Rehana Akter',    guardianPhone: '01733-112233', address: 'Mirashani Bazar Road',            admissionDate: '2021-01-12', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',  feeDue: 1500, attendanceRate: 92, gpa: '4.85' },
  { id: 'STU-1004', roll: '04', name: 'Fatima Tuj Zohra',        classId: 'ac10', className: 'Class 10', section: 'Science', gender: 'Female', bloodGroup: 'AB+', dob: '2010-11-05', fatherName: 'Md. Kamrul Huda',     motherName: 'Rokeya Zaman',    guardianPhone: '01911-556677', address: 'Jagadishpur Tea Estate Road',     admissionDate: '2021-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 95, gpa: '4.90' },
  { id: 'STU-10S05', roll: '05', name: 'Shahriar Ahmed Shanto',  classId: 'ac10', className: 'Class 10', section: 'Science', gender: 'Male',   bloodGroup: 'A-',  dob: '2010-07-14', fatherName: 'Md. Shahriarul Islam', motherName: 'Begum Sadia',    guardianPhone: '01754-1001005', address: 'Mirashani, Madhabpur',           admissionDate: '2021-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 97, gpa: '4.92' },

  // ══ CLASS 10 — Business ══
  { id: 'STU-1005', roll: '01', name: 'Sadia Islam Sneha',       classId: 'ac10', className: 'Class 10', section: 'Business', gender: 'Female', bloodGroup: 'A-',  dob: '2010-09-14', fatherName: 'Md. Shafiqul Alam',  motherName: 'Farhana Sultana', guardianPhone: '01715-998877', address: 'Shahjibazar, Madhabpur',          admissionDate: '2021-01-11', status: 'Active', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',  feeDue: 600,  attendanceRate: 94, gpa: '4.75' },
  { id: 'STU-1006', roll: '02', name: 'Rakibul Hasan Shanto',    classId: 'ac10', className: 'Class 10', section: 'Business', gender: 'Male',   bloodGroup: 'B-',  dob: '2010-01-20', fatherName: 'Md. Golam Mostafa',  motherName: 'Rabeya Begum',    guardianPhone: '01822-334455', address: 'Harashpur Road, Mirashani',       admissionDate: '2021-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',  feeDue: 2200, attendanceRate: 88, gpa: '4.50' },
  { id: 'STU-10BU03', roll: '03', name: 'Roksana Islam Rima',    classId: 'ac10', className: 'Class 10', section: 'Business', gender: 'Female', bloodGroup: 'O+', dob: '2010-05-09', fatherName: 'Md. Roksanul Islam', motherName: 'Halima Begum',    guardianPhone: '01755-1001008', address: 'Dharmaghar, Madhabpur',          admissionDate: '2021-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 91, gpa: '4.60' },
  { id: 'STU-10BU04', roll: '04', name: 'Kawsar Ahmed Kafi',     classId: 'ac10', className: 'Class 10', section: 'Business', gender: 'Male',   bloodGroup: 'B+', dob: '2010-12-31', fatherName: 'Md. Kawsarul Haque', motherName: 'Aleya Begum',     guardianPhone: '01756-1001009', address: 'Choumuhani, Madhabpur',          admissionDate: '2021-01-11', status: 'Active', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',  feeDue: 1100, attendanceRate: 84, gpa: '4.25' },
  { id: 'STU-10BU05', roll: '05', name: 'Puja Rani Mondol',      classId: 'ac10', className: 'Class 10', section: 'Business', gender: 'Female', bloodGroup: 'A+', dob: '2010-03-18', fatherName: 'Ratan Mondol',       motherName: 'Anita Mondol',    guardianPhone: '01757-1001010', address: 'Teliapara, Madhabpur',           admissionDate: '2021-01-12', status: 'Active', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 96, gpa: '4.80' },

  // ══ CLASS 10 — Humanities ══
  { id: 'STU-10HU01', roll: '01', name: 'Jakir Hossain Jakir',   classId: 'ac10', className: 'Class 10', section: 'Humanities', gender: 'Male',   bloodGroup: 'O-', dob: '2010-06-22', fatherName: 'Md. Zakirul Islam',   motherName: 'Jahanara Begum',  guardianPhone: '01758-1001011', address: 'Mirashani, Madhabpur',          admissionDate: '2021-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 93, gpa: '4.65' },
  { id: 'STU-10HU02', roll: '02', name: 'Moriom Akter Mou',      classId: 'ac10', className: 'Class 10', section: 'Humanities', gender: 'Female', bloodGroup: 'B+', dob: '2010-10-11', fatherName: 'Md. Morium Uddin',    motherName: 'Nazma Akter',     guardianPhone: '01759-1001012', address: 'Andiura, Madhabpur',            admissionDate: '2021-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',  feeDue: 550,  attendanceRate: 89, gpa: '4.50' },
  { id: 'STU-10HU03', roll: '03', name: 'Prodip Kumar Das',       classId: 'ac10', className: 'Class 10', section: 'Humanities', gender: 'Male',   bloodGroup: 'A+', dob: '2010-02-07', fatherName: 'Ajit Kumar Das',      motherName: 'Mina Das',        guardianPhone: '01760-1001013', address: 'Shahjibazar, Madhabpur',        admissionDate: '2021-01-11', status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 91, gpa: '4.55' },
  { id: 'STU-10HU04', roll: '04', name: 'Shamima Akter Shami',   classId: 'ac10', className: 'Class 10', section: 'Humanities', gender: 'Female', bloodGroup: 'AB+', dob: '2010-08-15', fatherName: 'Md. Shamimul Haque', motherName: 'Shirina Begum',   guardianPhone: '01761-1001014', address: 'Harashpur, Mirashani',          admissionDate: '2021-01-10', status: 'Active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',  feeDue: 900,  attendanceRate: 87, gpa: '4.40' },
  { id: 'STU-10HU05', roll: '05', name: 'Masum Billah Masum',    classId: 'ac10', className: 'Class 10', section: 'Humanities', gender: 'Male',   bloodGroup: 'O+', dob: '2010-04-28', fatherName: 'Md. Masumul Haque',   motherName: 'Mahmuda Khatun',  guardianPhone: '01762-1001015', address: 'Choumuhani, Madhabpur',         admissionDate: '2021-01-12', status: 'Active', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',  feeDue: 0,    attendanceRate: 94, gpa: '4.72' },

];

export const initialTeachers = [
  {
    id: 'TCH-01',
    name: 'Md. Rafiqul Islam',
    designation: 'Headmaster & Principal',
    department: 'Administration & Bangla',
    qualification: 'M.A, B.Ed (University of Dhaka)',
    phone: '+880 1711-234567',
    email: 'headmaster@mirashani-academy.edu.bd',
    joinDate: '2005-02-01',
    salary: 58000,
    subjects: ['Bangla 1st Paper', 'Bangla 2nd Paper'],
    assignedClass: 'Administration',
    status: 'Present',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'TCH-02',
    name: 'Prof. Dr. Shahinur Rahman',
    designation: 'Asst. Headmaster',
    department: 'Mathematics & Higher Math',
    qualification: 'M.Sc, M.Ed (SUST)',
    phone: '+880 1712-987654',
    email: 'shahinur@mirashani-academy.edu.bd',
    joinDate: '2008-04-15',
    salary: 49000,
    subjects: ['General Mathematics', 'Higher Mathematics'],
    assignedClass: 'Class 10 - Science',
    status: 'Present',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'TCH-03',
    name: 'Sultana Razia',
    designation: 'Senior Teacher',
    department: 'English Language & Lit',
    qualification: 'M.A in English (CU)',
    phone: '+880 1819-445566',
    email: 'razia@mirashani-academy.edu.bd',
    joinDate: '2010-06-01',
    salary: 42000,
    subjects: ['English 1st Paper', 'English 2nd Paper'],
    assignedClass: 'Class 9 - Science',
    status: 'Present',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'TCH-04',
    name: 'Mostafa Kamal',
    designation: 'Lecturer & ICT Coordinator',
    department: 'Computer Science & ICT',
    qualification: 'B.Sc in CSE',
    phone: '+880 1722-113355',
    email: 'kamal.ict@mirashani-academy.edu.bd',
    joinDate: '2016-03-10',
    salary: 35000,
    subjects: ['ICT & Digital Literacy', 'Physics'],
    assignedClass: 'Class 8 - Karnaphuli',
    status: 'Present',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'TCH-05',
    name: 'Mst. Parvin Akter',
    designation: 'Assistant Teacher',
    department: 'Biological Sciences',
    qualification: 'M.Sc in Botany',
    phone: '+880 1912-778899',
    email: 'parvin.bio@mirashani-academy.edu.bd',
    joinDate: '2018-09-01',
    salary: 34000,
    subjects: ['Biology', 'Chemistry'],
    assignedClass: 'Class 7 - Jamuna',
    status: 'On Leave',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'TCH-06',
    name: 'Md. Anwar Hossain',
    designation: 'Assistant Teacher',
    department: 'Business Studies',
    qualification: 'M.B.A (Accounting)',
    phone: '+880 1716-664422',
    email: 'anwar.com@mirashani-academy.edu.bd',
    joinDate: '2015-01-12',
    salary: 37000,
    subjects: ['Accounting', 'Business Entrepreneurship'],
    assignedClass: 'Class 10 - Business Studies',
    status: 'Present',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
];

// Pre-populated realistic attendance records across multiple dates for all classes & sections
export const initialAttendanceStore = (() => {
  const store = {};
  const dates = [
    // September 2026 school days
    '2026-09-01', '2026-09-02', '2026-09-03', '2026-09-06', '2026-09-07',
    '2026-09-08', '2026-09-09', '2026-09-10', '2026-09-13', '2026-09-14',
    '2026-09-15', '2026-09-16', '2026-09-17', '2026-09-20', '2026-09-21',
    '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-27', '2026-09-28',
    '2026-09-29', '2026-09-30',
    // October 2026 current school days
    '2026-10-01', '2026-10-02', '2026-10-03'
  ];

  dates.forEach((date, dIdx) => {
    initialStudents.forEach((student, sIdx) => {
      const key = `${date}__${student.classId}__${student.section}`;
      if (!store[key]) store[key] = { records: {} };

      // Varied distribution: mostly present, but distinct absences and lates for realistic analysis
      const rollNum = parseInt(student.roll, 10) || 1;
      const seed = (sIdx * 13 + dIdx * 19 + rollNum * 7) % 100;
      let status = 'present';
      if (seed > 88) status = 'absent';
      else if (seed > 80) status = 'late';
      else if (seed > 75) status = 'leave';

      store[key].records[student.id] = status;
    });
  });

  return store;
})();


export const initialFeesTransactions = [
  {
    id: 'TRX-98201',
    voucherNo: 'VR-2026-084',
    studentId: 'STU-1001',
    studentName: 'Abdullah Al Noman',
    class: 'Class 10 (Science)',
    roll: '01',
    month: 'October 2026',
    feeType: 'Tuition Fee & ICT Lab',
    amount: 1200,
    paymentMethod: 'bKash Online',
    txId: 'BK-998822A',
    date: '2026-10-03',
    time: '09:45 AM',
    status: 'Paid',
    receivedBy: 'Accounts Branch'
  },
  {
    id: 'TRX-98202',
    voucherNo: 'VR-2026-085',
    studentId: 'STU-1004',
    studentName: 'Fatima Tuj Zohra',
    class: 'Class 10 (Science)',
    roll: '04',
    month: 'October 2026',
    feeType: 'Half-Yearly Exam Fee',
    amount: 1500,
    paymentMethod: 'Cash Counter',
    txId: 'CSH-0085',
    date: '2026-10-03',
    time: '10:15 AM',
    status: 'Paid',
    receivedBy: 'Senior Cashier'
  },
  {
    id: 'TRX-98203',
    voucherNo: 'VR-2026-086',
    studentId: 'STU-1005',
    studentName: 'Sadia Islam Sneha',
    class: 'Class 10 (Commerce)',
    roll: '05',
    month: 'October 2026',
    feeType: 'Monthly Tuition & Transport',
    amount: 1400,
    paymentMethod: 'Nagad Gateway',
    txId: 'NGD-554411',
    date: '2026-10-02',
    time: '11:30 AM',
    status: 'Paid',
    receivedBy: 'Accounts Branch'
  },
  {
    id: 'TRX-98204',
    voucherNo: 'VR-2026-087',
    studentId: 'STU-1007',
    studentName: 'Mehedi Hasan Riyad',
    class: 'Class 9 (Science)',
    roll: '07',
    month: 'October 2026',
    feeType: 'Session Development Charge',
    amount: 2500,
    paymentMethod: 'Sonali Bank Ltd',
    txId: 'SB-8877112',
    date: '2026-10-01',
    time: '02:20 PM',
    status: 'Paid',
    receivedBy: 'Bank Transfer'
  }
];

export const initialWeeklyRoutine = {
  Sunday: [
    { period: 1, time: '09:00 - 09:45 AM', subject: 'Bangla 1st Paper', teacher: 'Md. Rafiqul Islam', room: 'Room 101' },
    { period: 2, time: '09:45 - 10:30 AM', subject: 'English 1st Paper', teacher: 'Sultana Razia', room: 'Room 101' },
    { period: 3, time: '10:30 - 11:15 AM', subject: 'General Mathematics', teacher: 'Dr. Shahinur Rahman', room: 'Room 101' },
    { period: 4, time: '11:15 - 12:00 PM', subject: 'Physics (Theory)', teacher: 'Mostafa Kamal', room: 'Lab 1' },
    { period: 5, time: '12:30 - 01:15 PM', subject: 'Chemistry (Practical)', teacher: 'Mst. Parvin Akter', room: 'Lab 2' },
    { period: 6, time: '01:15 - 02:00 PM', subject: 'Higher Mathematics', teacher: 'Dr. Shahinur Rahman', room: 'Room 101' },
    { period: 7, time: '02:00 - 02:45 PM', subject: 'ICT Computer Lab', teacher: 'Mostafa Kamal', room: 'Computer Lab' }
  ],
  Monday: [
    { period: 1, time: '09:00 - 09:45 AM', subject: 'General Mathematics', teacher: 'Dr. Shahinur Rahman', room: 'Room 101' },
    { period: 2, time: '09:45 - 10:30 AM', subject: 'Bangla 2nd Paper', teacher: 'Md. Rafiqul Islam', room: 'Room 101' },
    { period: 3, time: '10:30 - 11:15 AM', subject: 'English 2nd Paper', teacher: 'Sultana Razia', room: 'Room 101' },
    { period: 4, time: '11:15 - 12:00 PM', subject: 'Biology', teacher: 'Mst. Parvin Akter', room: 'Lab 2' },
    { period: 5, time: '12:30 - 01:15 PM', subject: 'Bangladesh & Global Studies', teacher: 'Md. Anwar Hossain', room: 'Room 101' },
    { period: 6, time: '01:15 - 02:00 PM', subject: 'Religion & Moral Edu', teacher: 'Faculty Staff', room: 'Room 101' },
    { period: 7, time: '02:00 - 02:45 PM', subject: 'Library Session', teacher: 'Farzana Yasmin', room: 'Central Library' }
  ],
  Tuesday: [
    { period: 1, time: '09:00 - 09:45 AM', subject: 'English 1st Paper', teacher: 'Sultana Razia', room: 'Room 101' },
    { period: 2, time: '09:45 - 10:30 AM', subject: 'Physics', teacher: 'Mostafa Kamal', room: 'Lab 1' },
    { period: 3, time: '10:30 - 11:15 AM', subject: 'Higher Mathematics', teacher: 'Dr. Shahinur Rahman', room: 'Room 101' },
    { period: 4, time: '11:15 - 12:00 PM', subject: 'Chemistry Lab', teacher: 'Mst. Parvin Akter', room: 'Lab 2' },
    { period: 5, time: '12:30 - 01:15 PM', subject: 'Bangla 1st Paper', teacher: 'Md. Rafiqul Islam', room: 'Room 101' },
    { period: 6, time: '01:15 - 02:00 PM', subject: 'General Science', teacher: 'Mostafa Kamal', room: 'Room 101' },
    { period: 7, time: '02:00 - 02:45 PM', subject: 'Sports & Athletics', teacher: 'Physical Trainer', room: 'Playground' }
  ],
  Wednesday: [
    { period: 1, time: '09:00 - 09:45 AM', subject: 'General Mathematics', teacher: 'Dr. Shahinur Rahman', room: 'Room 101' },
    { period: 2, time: '09:45 - 10:30 AM', subject: 'English 2nd Paper', teacher: 'Sultana Razia', room: 'Room 101' },
    { period: 3, time: '10:30 - 11:15 AM', subject: 'ICT Theory', teacher: 'Mostafa Kamal', room: 'Room 101' },
    { period: 4, time: '11:15 - 12:00 PM', subject: 'Biology Lab', teacher: 'Mst. Parvin Akter', room: 'Lab 2' },
    { period: 5, time: '12:30 - 01:15 PM', subject: 'Religion & Ethics', teacher: 'Faculty Staff', room: 'Room 101' },
    { period: 6, time: '01:15 - 02:00 PM', subject: 'Bangla 2nd Paper', teacher: 'Md. Rafiqul Islam', room: 'Room 101' },
    { period: 7, time: '02:00 - 02:45 PM', subject: 'Debate Club Activity', teacher: 'Sultana Razia', room: 'Auditorium' }
  ],
  Thursday: [
    { period: 1, time: '09:00 - 09:45 AM', subject: 'Higher Mathematics', teacher: 'Dr. Shahinur Rahman', room: 'Room 101' },
    { period: 2, time: '09:45 - 10:30 AM', subject: 'Chemistry', teacher: 'Mst. Parvin Akter', room: 'Lab 2' },
    { period: 3, time: '10:30 - 11:15 AM', subject: 'Physics', teacher: 'Mostafa Kamal', room: 'Lab 1' },
    { period: 4, time: '11:15 - 12:00 PM', subject: 'Bangladesh Studies', teacher: 'Md. Anwar Hossain', room: 'Room 101' },
    { period: 5, time: '12:30 - 01:15 PM', subject: 'English 1st Paper', teacher: 'Sultana Razia', room: 'Room 101' },
    { period: 6, time: '01:15 - 02:00 PM', subject: 'Weekly Assessment Quiz', teacher: 'Class Teacher', room: 'Room 101' },
    { period: 7, time: '02:00 - 02:45 PM', subject: 'Campus Maintenance & Clubs', teacher: 'All Staff', room: 'Campus' }
  ]
};

export const initialExamResults = [
  {
    studentId: 'STU-1001',
    studentName: 'Abdullah Al Noman',
    roll: '01',
    exam: 'Half-Yearly Examination 2026',
    class: 'Class 10',
    section: 'Science',
    subjects: [
      { code: '101', name: 'Bangla 1st Paper', written: 65, mcq: 28, practical: 0, total: 93, grade: 'A+', gpa: 5.0 },
      { code: '102', name: 'Bangla 2nd Paper', written: 63, mcq: 27, practical: 0, total: 90, grade: 'A+', gpa: 5.0 },
      { code: '107', name: 'English 1st Paper', written: 88, mcq: 0, practical: 0, total: 88, grade: 'A+', gpa: 5.0 },
      { code: '108', name: 'English 2nd Paper', written: 85, mcq: 0, practical: 0, total: 85, grade: 'A+', gpa: 5.0 },
      { code: '109', name: 'General Mathematics', written: 68, mcq: 30, practical: 0, total: 98, grade: 'A+', gpa: 5.0 },
      { code: '136', name: 'Physics', written: 48, mcq: 24, practical: 25, total: 97, grade: 'A+', gpa: 5.0 },
      { code: '137', name: 'Chemistry', written: 46, mcq: 23, practical: 24, total: 93, grade: 'A+', gpa: 5.0 },
      { code: '138', name: 'Biology', written: 47, mcq: 22, practical: 25, total: 94, grade: 'A+', gpa: 5.0 },
      { code: '126', name: 'Higher Mathematics', written: 49, mcq: 24, practical: 24, total: 97, grade: 'A+', gpa: 5.0 },
      { code: '154', name: 'ICT (Digital Tech)', written: 0, mcq: 24, practical: 25, total: 49, grade: 'A+', gpa: 5.0 }
    ],
    totalMarks: 884,
    gpa: '5.00',
    grade: 'A+',
    meritPosition: 1,
    remarks: 'Outstanding academic excellence and leadership qualities.'
  }
];

export const initialBooks = [
  {
    id: 'BK-101',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Physics & Cosmology',
    isbn: '978-055-33-8016-3',
    totalCopies: 15,
    availableCopies: 11,
    shelf: 'A-3',
    issuedCount: 4
  },
  {
    id: 'BK-102',
    title: 'Higher Math Olympiad Problem Solving',
    author: 'Dr. Muhammed Zafar Iqbal',
    category: 'Mathematics',
    isbn: '978-984-70-1234-8',
    totalCopies: 20,
    availableCopies: 14,
    shelf: 'B-1',
    issuedCount: 6
  },
  {
    id: 'BK-103',
    title: 'Oxford Advanced Learner\'s Dictionary',
    author: 'A.S. Hornby',
    category: 'English Lexicon',
    isbn: '978-019-47-9900-3',
    totalCopies: 12,
    availableCopies: 10,
    shelf: 'C-2',
    issuedCount: 2
  },
  {
    id: 'BK-104',
    title: 'The Unfinished Memoirs',
    author: 'Sheikh Mujibur Rahman',
    category: 'History & Biography',
    isbn: '978-984-05-1845-6',
    totalCopies: 25,
    availableCopies: 18,
    shelf: 'D-1',
    issuedCount: 7
  }
];

export const initialBorrowings = [
  {
    id: 'BOR-501',
    bookId: 'BK-101',
    bookTitle: 'A Brief History of Time',
    studentId: 'STU-1002',
    studentName: 'Ayesha Siddika',
    class: 'Class 10 (Science)',
    roll: '02',
    issueDate: '2026-09-25',
    dueDate: '2026-10-05',
    status: 'borrowed'
  },
  {
    id: 'BOR-502',
    bookId: 'BK-102',
    bookTitle: 'Higher Math Olympiad Problem Solving',
    studentId: 'STU-1001',
    studentName: 'Abdullah Al Noman',
    class: 'Class 10 (Science)',
    roll: '01',
    issueDate: '2026-09-20',
    dueDate: '2026-09-30',
    status: 'overdue'
  }
];

export const initialTransportRoutes = [
  {
    id: 'BUS-01',
    name: 'Route 1: Madhabpur Town to Campus',
    vehicleNo: 'Dhaka Metro-CHA 54-1289',
    driverName: 'Md. Babul Mia',
    driverPhone: '01715-443322',
    capacity: 45,
    enrolledStudents: 42,
    fare: 650,
    stops: ['Madhabpur Bus Stand', 'Choumuhani Bazar', 'Andiura', 'Academy Main Gate']
  },
  {
    id: 'BUS-02',
    name: 'Route 2: Harashpur & Teliapara to Campus',
    vehicleNo: 'Dhaka Metro-CHA 33-8765',
    driverName: 'Abdur Rahim',
    driverPhone: '01814-776655',
    capacity: 40,
    enrolledStudents: 38,
    fare: 700,
    stops: ['Harashpur Rail Station', 'Dharmaghar Corner', 'Shahjibazar', 'School North Gate']
  }
];

export const initialHostelRooms = [
  { id: 'RM-101', building: 'Boys Residence Hall', roomNo: '101', capacity: 4, occupied: 4, tutor: 'Mostafa Kamal' },
  { id: 'RM-102', building: 'Boys Residence Hall', roomNo: '102', capacity: 4, occupied: 3, tutor: 'Mostafa Kamal' },
  { id: 'RM-201', building: 'Girls Residence Hall', roomNo: '201', capacity: 4, occupied: 4, tutor: 'Mst. Parvin Akter' },
  { id: 'RM-202', building: 'Girls Residence Hall', roomNo: '202', capacity: 4, occupied: 2, tutor: 'Mst. Parvin Akter' }
];

export const initialSmsLogs = [
  {
    id: 'SMS-8801',
    recipientGroup: 'All Class 10 Parents',
    count: 138,
    date: 'Oct 02, 2026 08:30 PM',
    message: 'Dear Guardian, Class 10 Pre-Test examinations will commence from Oct 15. Please ensure regular attendance. - Mirashani Academy',
    status: 'Delivered'
  },
  {
    id: 'SMS-8802',
    recipientGroup: 'Absent Student Guardians',
    count: 14,
    date: 'Oct 03, 2026 10:15 AM',
    message: 'Dear Parent, your child is marked absent today. Please inform the administration if there is an emergency.',
    status: 'Delivered'
  }
];

export const initialExpenses = [
  { id: 'EXP-101', title: 'Monthly Teacher & Staff Salaries (September)', category: 'Payroll', amount: 385000, date: '2026-10-01', paidTo: 'Faculty & Administrative Staff', method: 'Bank Transfer' },
  { id: 'EXP-102', title: 'Campus Fiber Internet & Electricity Utility Bills', category: 'Utilities', amount: 14500, date: '2026-10-02', paidTo: 'PDB & BTCL', method: 'bKash Merchant' },
  { id: 'EXP-103', title: 'Science & Computer Lab Hardware Equipment', category: 'Laboratory', amount: 32000, date: '2026-09-28', paidTo: 'Scientific World Dhaka', method: 'Bank Cheque #44882' },
  { id: 'EXP-104', title: 'Annual Inter-School Sports & Debate Competition', category: 'Extracurricular', amount: 18500, date: '2026-09-25', paidTo: 'Sports Committee', method: 'Cash' }
];
