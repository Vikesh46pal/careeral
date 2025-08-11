// auth.js — simple front-end auth (localStorage)

const STORAGE_USERS = 'careerai_users';
const STORAGE_CURRENT = 'careerai_current_user';

// Get users array
function getUsers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_USERS)) || []; }
  catch { return []; }
}
function setUsers(arr) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(arr));
}
function setCurrentUser(user) {
  localStorage.setItem(STORAGE_CURRENT, JSON.stringify(user));
}
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(STORAGE_CURRENT)); }
  catch { return null; }
}
function clearCurrentUser() {
  localStorage.removeItem(STORAGE_CURRENT);
}

// Signup
function signupUser(name, email, password) {
  const users = getUsers();
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    alert('This email is already registered. Please login.');
    window.location.href = 'login.html';
    return;
  }
  const newUser = { name, email, password };
  users.push(newUser);
  setUsers(users);
  setCurrentUser({ name, email });
  window.location.href = 'index.html'; // go to app
}

// Login
function loginUser(email, password) {
  const users = getUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!found) {
    alert('Invalid credentials. Please try again or sign up.');
    return;
  }
  setCurrentUser({ name: found.name, email: found.email });
  window.location.href = 'index.html';
}

// Guard for protected page (index.html)
function requireAuth() {
  const u = getCurrentUser();
  if (!u) {
    window.location.href = 'login.html';
  }
  return u;
}

// Logout helper (optional)
function logout() {
  clearCurrentUser();
  window.location.href = 'login.html';
}

// Expose for inline usage if needed
window.signupUser = signupUser;
window.loginUser = loginUser;
window.requireAuth = requireAuth;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
