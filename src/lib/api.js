// API Client for connecting MPA Frontend to Express/Mongoose Backend
import { uploadToImgbb } from './imgbb';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('mpa_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    return { success: false, message: err.message };
  }
}

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  studentLogin: (credentials) => request('/auth/student-login', { method: 'POST', body: JSON.stringify(credentials) }),

  // Students
  getStudents: (params = '') => request(`/students${params ? `?${params}` : ''}`),
  getStudentById: (id) => request(`/students/${id}`),
  createStudent: (data) => request('/students', { method: 'POST', body: JSON.stringify(data) }),
  updateStudent: (id, data) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStudent: (id) => request(`/students/${id}`, { method: 'DELETE' }),

  // Teachers (Full Dynamic & Mongo DB)
  getTeachers: (params = '') => request(`/teachers${params ? `?${params}` : ''}`),
  getTeacherById: (id) => request(`/teachers/${id}`),
  createTeacher: (data) => request('/teachers', { method: 'POST', body: JSON.stringify(data) }),
  updateTeacher: (id, data) => request(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTeacher: (id) => request(`/teachers/${id}`, { method: 'DELETE' }),
  resetTeachers: () => request('/teachers/reset', { method: 'POST' }),

  // Toppers / Merit Board (Full Dynamic & Mongo DB)
  getToppers: (params = '') => request(`/toppers${params ? `?${params}` : ''}`),
  getTopperById: (id) => request(`/toppers/${id}`),
  createTopper: (data) => request('/toppers', { method: 'POST', body: JSON.stringify(data) }),
  updateTopper: (id, data) => request(`/toppers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTopper: (id) => request(`/toppers/${id}`, { method: 'DELETE' }),
  resetToppers: () => request('/toppers/reset', { method: 'POST' }),

  // Exams & Online Result Search (Full Dynamic & Mongo DB)
  searchResult: (cls, roll, exam) => {
    const params = new URLSearchParams();
    if (cls) params.set('cls', cls);
    if (roll) params.set('roll', roll);
    if (exam) params.set('exam', exam);
    return request(`/results/search?${params.toString()}`);
  },
  getResults: (params = '') => request(`/results${params ? `?${params}` : ''}`),
  getResultById: (id) => request(`/results/${id}`),
  saveExamResult: (data) => request('/results', { method: 'POST', body: JSON.stringify(data) }),
  updateExamResult: (id, data) => request(`/results/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExamResult: (id) => request(`/results/${id}`, { method: 'DELETE' }),
  seedResults: () => request('/results/seed', { method: 'POST' }),

  // Events Calendar (Full Dynamic & Mongo DB)
  getEvents: () => request('/events'),
  createEvent: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),
  resetEvents: () => request('/events/reset', { method: 'POST' }),

  // Photo Gallery (Full Dynamic & Mongo DB)
  getGallery: (category = '') => request(`/events/gallery/all${category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''}`),
  createGalleryItem: (data) => request('/events/gallery/item', { method: 'POST', body: JSON.stringify(data) }),
  updateGalleryItem: (id, data) => request(`/events/gallery/item/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGalleryItem: (id) => request(`/events/gallery/item/${id}`, { method: 'DELETE' }),
  resetGallery: () => request('/events/gallery/reset', { method: 'POST' }),

  // Submissions (Online Admission / Contact / SMS Inquiries)
  createSubmission: (type, data) => request('/submissions', { method: 'POST', body: JSON.stringify({ type, ...data }) }),
  getSubmissions: (params = '') => request(`/submissions${params ? `?${params}` : ''}`),
  updateSubmission: (id, patch) => request(`/submissions/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteSubmission: (id) => request(`/submissions/${id}`, { method: 'DELETE' }),

  // School Info & Global Settings
  getSchoolInfo: () => request('/school-info'),
  updateSchoolInfo: (data) => request('/school-info', { method: 'PUT', body: JSON.stringify(data) }),

  // Classes & Sections
  getClasses: () => request('/classes'),
  createClass: (data) => request('/classes', { method: 'POST', body: JSON.stringify(data) }),
  addSection: (classId, sectionName) => request(`/classes/${classId}/sections`, { method: 'POST', body: JSON.stringify({ sectionName }) }),
  deleteSection: (classId, sectionName) => request(`/classes/${classId}/sections/${sectionName}`, { method: 'DELETE' }),

  // Attendance
  getAttendance: (params = '') => request(`/attendance${params ? `?${params}` : ''}`),
  markStudentAttendance: (data) => request('/attendance/mark', { method: 'POST', body: JSON.stringify(data) }),
  markAllAttendance: (data) => request('/attendance/mark-all', { method: 'POST', body: JSON.stringify(data) }),
  getMonthlySummary: (params) => request(`/attendance/student-monthly?${new URLSearchParams(params).toString()}`),

  // Fees & Expenses
  getFeeTransactions: (params = '') => request(`/fees${params ? `?${params}` : ''}`),
  collectFee: (data) => request('/fees', { method: 'POST', body: JSON.stringify(data) }),
  getExpenses: () => request('/expenses'),
  createExpense: (data) => request('/expenses', { method: 'POST', body: JSON.stringify(data) }),

  // Library
  getBooks: () => request('/library/books'),
  createBook: (data) => request('/library/books', { method: 'POST', body: JSON.stringify(data) }),
  getBorrowings: () => request('/library/borrowings'),
  issueBook: (data) => request('/library/borrowings/issue', { method: 'POST', body: JSON.stringify(data) }),
  returnBook: (borrowId) => request(`/library/borrowings/return/${borrowId}`, { method: 'POST' }),

  // Routine
  getRoutine: () => request('/routine'),
  updateRoutine: (data) => request('/routine', { method: 'PUT', body: JSON.stringify(data) }),
  addRoutineItem: (item) => request('/routine/item', { method: 'POST', body: JSON.stringify(item) }),
  updateRoutineItem: (id, item) => request(`/routine/item/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteRoutineItem: (id) => request(`/routine/item/${id}`, { method: 'DELETE' }),
  resetRoutine: () => request('/routine/reset', { method: 'POST' }),

  // Hero Slider
  getSliders: () => request('/sliders'),
  getActiveSliders: () => request('/sliders/active'),
  getSliderById: (id) => request(`/sliders/${id}`),
  createSlider: (data) => request('/sliders', { method: 'POST', body: JSON.stringify(data) }),
  updateSlider: (id, data) => request(`/sliders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSlider: (id) => request(`/sliders/${id}`, { method: 'DELETE' }),
  reorderSliders: (items) => request('/sliders/reorder', { method: 'PUT', body: JSON.stringify({ items }) }),
  seedSliders: () => request('/sliders/seed', { method: 'POST' }),
  uploadImage: (fileOrUrl) => uploadToImgbb(fileOrUrl),

  // Headmaster Section (CMS)
  getHeadmaster: () => request('/headmaster'),
  updateHeadmaster: (data) => request('/headmaster', { method: 'PUT', body: JSON.stringify(data) }),
  resetHeadmaster: () => request('/headmaster/reset', { method: 'POST' }),

  // Academic Groups Section (CMS - Fully Dynamic)
  getAcademicGroups: () => request('/academic-groups'),
  updateAcademicGroups: (data) => request('/academic-groups', { method: 'PUT', body: JSON.stringify(data) }),
  addAcademicGroup: (group) => request('/academic-groups/group', { method: 'POST', body: JSON.stringify(group) }),
  updateAcademicGroupItem: (id, group) => request(`/academic-groups/group/${id}`, { method: 'PUT', body: JSON.stringify(group) }),
  deleteAcademicGroupItem: (id) => request(`/academic-groups/group/${id}`, { method: 'DELETE' }),
  resetAcademicGroups: () => request('/academic-groups/reset', { method: 'POST' }),

  // Modern Facilities & Infrastructure Section (CMS - Word-to-Word Fully Dynamic)
  getFacilities: () => request('/facilities'),
  updateFacilities: (data) => request('/facilities', { method: 'PUT', body: JSON.stringify(data) }),
  addFacilityItem: (item) => request('/facilities/item', { method: 'POST', body: JSON.stringify(item) }),
  updateFacilityItem: (id, item) => request(`/facilities/item/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteFacilityItem: (id) => request(`/facilities/item/${id}`, { method: 'DELETE' }),
  resetFacilities: () => request('/facilities/reset', { method: 'POST' }),

  // Co-Curricular & Student Clubs Section (CMS - Word-to-Word Fully Dynamic)
  getClubs: () => request('/clubs'),
  updateClubs: (data) => request('/clubs', { method: 'PUT', body: JSON.stringify(data) }),
  addClubItem: (item) => request('/clubs/item', { method: 'POST', body: JSON.stringify(item) }),
  updateClubItem: (id, item) => request(`/clubs/item/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteClubItem: (id) => request(`/clubs/item/${id}`, { method: 'DELETE' }),
  resetClubs: () => request('/clubs/reset', { method: 'POST' }),

  // Notice Board & Official School Pad (CMS - Word-to-Word Fully Dynamic)
  getNotices: () => request('/notices'),
  updateNotices: (data) => request('/notices', { method: 'PUT', body: JSON.stringify(data) }),
  updateNoticePadConfig: (data) => request('/notices/pad-config', { method: 'PUT', body: JSON.stringify(data) }),
  addNoticeItem: (item) => request('/notices/item', { method: 'POST', body: JSON.stringify(item) }),
  updateNoticeItem: (id, item) => request(`/notices/item/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteNoticeItem: (id) => request(`/notices/item/${id}`, { method: 'DELETE' }),
  resetNotices: () => request('/notices/reset', { method: 'POST' }),
};

export default api;
