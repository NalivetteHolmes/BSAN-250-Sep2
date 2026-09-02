const students = [
  ['Maria Chen', 'maria.chen@example.com', 'On track', 'MC'],
  ['Marcus Thompson', 'marcus.t@example.com', 'On track', 'MT'],
  ['Jordan Miller', 'jordan.m@example.com', 'Needs attention', 'JM'],
  ['Priya Shah', 'priya.shah@example.com', 'On track', 'PS'],
  ['Kai Wong', 'kai.wong@example.com', 'Needs attention', 'KW'],
  ['Elena Rodriguez', 'elena.r@example.com', 'On track', 'ER'],
  ['Sam Okafor', 'sam.okafor@example.com', 'On track', 'SO'],
  ['Noah Williams', 'noah.w@example.com', 'On track', 'NW']
];

const studentList = document.querySelector('#studentsList');
const toast = document.querySelector('#toast');
const modal = document.querySelector('#modalBackdrop');
const assignmentModal = document.querySelector('#assignmentModal');
const parents = [
  ['Linda Chen', 'Maria Chen', 'linda.chen@example.com', '(555) 014-2088', 'Connected'],
  ['Robert Thompson', 'Marcus Thompson', 'robert.t@example.com', '(555) 014-9221', 'Connected'],
  ['Aisha Miller', 'Jordan Miller', 'aisha.miller@example.com', '(555) 014-7014', 'Follow up'],
  ['Sanjay Shah', 'Priya Shah', 'sanjay.shah@example.com', '(555) 014-3156', 'Connected'],
  ['Wendy Wong', 'Kai Wong', 'wendy.wong@example.com', '(555) 014-4482', 'Follow up']
];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function renderStudents(query = '') {
  const filtered = students.filter(([name, email]) => `${name} ${email}`.toLowerCase().includes(query.toLowerCase()));
  studentList.innerHTML = filtered.map(([name, email, status, initials]) => `
    <div class="student-row">
      <div class="avatar ${status === 'Needs attention' ? 'coral' : 'professor'}">${initials}</div>
      <div style="margin-left:11px"><strong>${name}</strong><small>${email}</small></div>
      <span class="status-pill ${status === 'Needs attention' ? 'due' : 'submitted'}">${status}</span>
    </div>`).join('') || '<p class="subheading">No students match that search.</p>';
}

function renderParents(query = '') {
  const filtered = parents.filter(([parent, student, email]) => `${parent} ${student} ${email}`.toLowerCase().includes(query.toLowerCase()));
  document.querySelector('#parentList').innerHTML = filtered.map(([parent, student, email, phone, status]) => `
    <div class="parent-row"><div class="avatar professor">${parent.split(' ').map(part => part[0]).join('').slice(0, 2)}</div><div class="parent-person"><strong>${parent}</strong><small>Parent of ${student}</small></div><div class="parent-details"><a href="mailto:${email}">${email}</a><small>${phone}</small></div><span class="status-pill ${status === 'Follow up' ? 'due' : 'submitted'}">${status}</span><div class="parent-actions"><a href="mailto:${email}" aria-label="Email parent">✉</a><a href="tel:${phone}" aria-label="Call parent">⌕</a></div></div>`).join('') || '<p class="subheading">No contacts match that search.</p>';
}

function selectView(view) {
  document.querySelectorAll('.view-panel').forEach(panel => panel.classList.add('hidden'));
  document.querySelector(`#${view}View`).classList.remove('hidden');
  document.querySelectorAll('.nav-item[data-view]').forEach(item => item.classList.toggle('active', item.dataset.view === view));
  const titles = { overview: 'Good morning, Avery', students: 'Your students', assignments: 'Class assignments', planner: 'Plan your class', parents: 'Parent contacts', attendance: 'Attendance', gradebook: 'Gradebook', announcements: 'Announcements' };
  document.querySelector('#pageTitle').innerHTML = `${titles[view] || titles.overview} <span>✦</span>`;
  if (view === 'students') renderStudents();
  if (view === 'parents') renderParents();
  document.querySelector('#sidebar').classList.remove('open');
}

document.querySelectorAll('[data-view]').forEach(item => item.addEventListener('click', () => selectView(item.dataset.view)));
document.querySelector('#studentSearch').addEventListener('input', event => renderStudents(event.target.value));
document.querySelector('#menuToggle').addEventListener('click', () => document.querySelector('#sidebar').classList.toggle('open'));
document.querySelector('#quickAction').addEventListener('click', () => selectView('assignments'));
document.querySelector('#newAssignment').addEventListener('click', () => { assignmentModal.classList.remove('hidden'); document.querySelector('#assignmentTitle').focus(); });
document.querySelector('#assignmentModalClose').addEventListener('click', () => assignmentModal.classList.add('hidden'));
assignmentModal.addEventListener('click', event => { if (event.target === assignmentModal) assignmentModal.classList.add('hidden'); });
document.querySelector('#assignmentForm').addEventListener('submit', event => { event.preventDefault(); const title = document.querySelector('#assignmentTitle').value.trim(); assignmentModal.classList.add('hidden'); event.target.reset(); showToast(`${title} was added to your planner`); });
document.querySelector('#plannerAction').addEventListener('click', () => showToast('Due item draft created'));
document.querySelector('#addStudent').addEventListener('click', () => { modal.classList.remove('hidden'); document.querySelector('#studentName').focus(); });
document.querySelector('#modalClose').addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', event => { if (event.target === modal) modal.classList.add('hidden'); });
document.querySelector('#studentForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.querySelector('#studentName').value.trim();
  const initials = name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  students.unshift([name, 'New class member', 'On track', initials]);
  modal.classList.add('hidden');
  event.target.reset();
  selectView('students');
  showToast(`${name} was added to the class`);
});
document.querySelector('#parentSearch').addEventListener('input', event => renderParents(event.target.value));
document.querySelector('#addParent').addEventListener('click', () => showToast('Parent contact form ready'));
