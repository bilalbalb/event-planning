function initEventForm() {
  var form = document.getElementById('event-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    this.classList.add('hidden');
    document.getElementById('confirmation').classList.remove('hidden');
  });
}

function initAuthForm() {
  var form = document.getElementById('auth-form');
  if (!form) return;

  var switchToSignup = document.getElementById('switch-to-signup');
  var switchToLogin = document.getElementById('switch-to-login');

  if (switchToSignup) {
    switchToSignup.addEventListener('click', function (e) {
      e.preventDefault();
      toggleAuthMode(true);
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener('click', function (e) {
      e.preventDefault();
      toggleAuthMode(false);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    window.location.href = 'index.html';
  });

  if (window.location.hash === '#signup') toggleAuthMode(true);
}

function toggleAuthMode(signup) {
  var heading = document.getElementById('auth-heading');
  var submit = document.getElementById('auth-submit');
  var nameFields = document.getElementById('name-fields');
  var phoneField = document.getElementById('phone-field');
  var confirmField = document.getElementById('confirm-field');
  var loginExtras = document.getElementById('login-extras');
  var signupExtras = document.getElementById('signup-extras');
  var firstName = document.getElementById('first-name');
  var lastName = document.getElementById('last-name');
  var confirm = document.getElementById('auth-confirm');

  if (heading) heading.textContent = signup ? 'Create your account' : 'Log in to your account';
  if (submit) submit.textContent = signup ? 'Create Account' : 'Log In';
  if (nameFields) nameFields.classList.toggle('hidden', !signup);
  if (phoneField) phoneField.classList.toggle('hidden', !signup);
  if (confirmField) confirmField.classList.toggle('hidden', !signup);
  if (loginExtras) loginExtras.classList.toggle('hidden', signup);
  if (signupExtras) signupExtras.classList.toggle('hidden', !signup);
  if (firstName) firstName.required = signup;
  if (lastName) lastName.required = signup;
  if (confirm) confirm.required = signup;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

function formatGuestCount(count) {
  if (count <= 0) return 'No guests';
  if (count === 1) return '1 guest';
  return count + ' guests';
}

function formatEventDate(dateStr) {
  var date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initEventForm: initEventForm,
    initAuthForm: initAuthForm,
    toggleAuthMode: toggleAuthMode,
    validateEmail: validateEmail,
    validatePassword: validatePassword,
    formatGuestCount: formatGuestCount,
    formatEventDate: formatEventDate
  };
}

document.addEventListener('DOMContentLoaded', function () {
  initEventForm();
  initAuthForm();
});
