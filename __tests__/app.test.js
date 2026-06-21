const {
  validateEmail,
  validatePassword,
  formatGuestCount,
  formatEventDate,
  initEventForm,
  toggleAuthMode
} = require('../app');

describe('validateEmail', () => {
  test('accepts valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  test('accepts email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBe(true);
  });

  test('rejects email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  test('rejects email without domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  test('rejects empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  test('rejects email with spaces', () => {
    expect(validateEmail('user @example.com')).toBe(false);
  });
});

describe('validatePassword', () => {
  test('accepts password with 8+ characters', () => {
    expect(validatePassword('password123')).toBe(true);
  });

  test('accepts exactly 8 characters', () => {
    expect(validatePassword('12345678')).toBe(true);
  });

  test('rejects password with 7 characters', () => {
    expect(validatePassword('1234567')).toBe(false);
  });

  test('rejects empty password', () => {
    expect(validatePassword('')).toBe(false);
  });
});

describe('formatGuestCount', () => {
  test('formats zero guests', () => {
    expect(formatGuestCount(0)).toBe('No guests');
  });

  test('formats single guest', () => {
    expect(formatGuestCount(1)).toBe('1 guest');
  });

  test('formats multiple guests', () => {
    expect(formatGuestCount(50)).toBe('50 guests');
  });

  test('formats large numbers', () => {
    expect(formatGuestCount(500)).toBe('500 guests');
  });

  test('handles negative numbers', () => {
    expect(formatGuestCount(-1)).toBe('No guests');
  });
});

describe('formatEventDate', () => {
  test('formats date string correctly', () => {
    const result = formatEventDate('2026-07-15');
    expect(result).toMatch(/Jul/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2026/);
  });

  test('formats another date', () => {
    const result = formatEventDate('2026-12-25');
    expect(result).toMatch(/Dec/);
    expect(result).toMatch(/25/);
    expect(result).toMatch(/2026/);
  });
});

describe('initEventForm', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="event-form">
        <button type="submit">Submit</button>
      </form>
      <div id="confirmation" class="hidden"></div>
    `;
  });

  test('hides form and shows confirmation on submit', () => {
    initEventForm();

    const form = document.getElementById('event-form');
    const confirmation = document.getElementById('confirmation');

    form.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(form.classList.contains('hidden')).toBe(true);
    expect(confirmation.classList.contains('hidden')).toBe(false);
  });

  test('does not throw when form is missing', () => {
    document.body.innerHTML = '';
    expect(() => initEventForm()).not.toThrow();
  });
});

describe('toggleAuthMode', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <h2 id="auth-heading">Log in to your account</h2>
      <button id="auth-submit">Log In</button>
      <div id="name-fields" class="hidden"></div>
      <div id="phone-field" class="hidden"></div>
      <div id="confirm-field" class="hidden"></div>
      <div id="login-extras"></div>
      <div id="signup-extras" class="hidden"></div>
      <input id="first-name">
      <input id="last-name">
      <input id="auth-confirm">
    `;
  });

  test('switches to signup mode', () => {
    toggleAuthMode(true);

    expect(document.getElementById('auth-heading').textContent).toBe('Create your account');
    expect(document.getElementById('auth-submit').textContent).toBe('Create Account');
    expect(document.getElementById('name-fields').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('phone-field').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('confirm-field').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('login-extras').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('signup-extras').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('first-name').required).toBe(true);
    expect(document.getElementById('last-name').required).toBe(true);
    expect(document.getElementById('auth-confirm').required).toBe(true);
  });

  test('switches back to login mode', () => {
    toggleAuthMode(true);
    toggleAuthMode(false);

    expect(document.getElementById('auth-heading').textContent).toBe('Log in to your account');
    expect(document.getElementById('auth-submit').textContent).toBe('Log In');
    expect(document.getElementById('name-fields').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('login-extras').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('signup-extras').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('first-name').required).toBe(false);
  });
});
