/* ============================================
   AUTH AGENT - Login / Signup / Session
   ============================================ */

function switchAuthTab(tab) {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const tabs = document.querySelectorAll('.auth-tab');
  const indicator = document.querySelector('.auth-tab-indicator');

  if (tab === 'login') {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    tabs.forEach(t => t.dataset.tab === 'login' ? t.classList.add('active') : t.classList.remove('active'));
    if (indicator) indicator.style.transform = 'translateX(0)';
  } else {
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
    tabs.forEach(t => t.dataset.tab === 'signup' ? t.classList.add('active') : t.classList.remove('active'));
    if (indicator) indicator.style.transform = 'translateX(100%)';
  }
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  const user = DB.findUser(username, password);
  if (user) {
    DB.setSession(user);
    showNotification(`Welcome back, ${user.username}!`, 'success');
    updateAuthUI();
    navigateTo('home');
  } else {
    showNotification('Invalid credentials. Please try again.', 'error');
  }
  return false;
}

function handleSignup(e) {
  e.preventDefault();
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;

  if (password !== confirm) {
    showNotification('Passwords do not match!', 'error');
    return false;
  }
  
  const user = DB.addUser({ username, email, password });
  if (user) {
    DB.setSession(user);
    showNotification(`Account created! Welcome, ${username}!`, 'success');
    updateAuthUI();
    navigateTo('home');
  } else {
    showNotification('Username or email already exists.', 'error');
  }
  return false;
}

function handleLogout() {
  DB.clearSession();
  showNotification('You have been logged out.', 'success');
  updateAuthUI();
  navigateTo('home');
}

function updateAuthUI() {
  const session = DB.getSession();
  const loginLink = document.querySelector('.nav-link[data-page="login"]');
  const adminLink = document.querySelector('.nav-link[data-page="admin"]');

  if (session) {
    if (loginLink) {
      loginLink.textContent = 'Logout';
      loginLink.onclick = (e) => { e.preventDefault(); handleLogout(); };
      loginLink.removeAttribute('data-page');
    }
    if (adminLink) {
      adminLink.parentElement.style.display = session.role === 'admin' ? 'block' : 'none';
    }
  } else {
    if (loginLink) {
      loginLink.textContent = 'Login';
      loginLink.onclick = null;
      loginLink.setAttribute('data-page', 'login');
    }
    if (adminLink) {
      adminLink.parentElement.style.display = 'none';
    }
  }
}

function isLoggedIn() {
  return DB.getSession() !== null;
}

function isAdmin() {
  const s = DB.getSession();
  return s && s.role === 'admin';
}
