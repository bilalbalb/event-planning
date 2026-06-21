const fs = require('fs');
const path = require('path');

const {
  initEventForm,
  initAuthForm,
  validateEmail,
  validatePassword
} = require('../app');

function loadPage(filename) {
  const html = fs.readFileSync(path.join(__dirname, '..', filename), 'utf8');
  document.documentElement.innerHTML = html;
  return html;
}

describe('Landing page integration', () => {
  beforeEach(() => {
    loadPage('index.html');
  });

  test('page has all main sections', () => {
    expect(document.querySelector('.hero')).not.toBeNull();
    expect(document.getElementById('services')).not.toBeNull();
    expect(document.getElementById('portfolio')).not.toBeNull();
    expect(document.getElementById('plan')).not.toBeNull();
    expect(document.getElementById('contact')).not.toBeNull();
  });

  test('navigation has all expected links', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const hrefs = Array.from(navLinks).map(a => a.getAttribute('href'));
    expect(hrefs).toContain('#services');
    expect(hrefs).toContain('#portfolio');
    expect(hrefs).toContain('#plan');
    expect(hrefs).toContain('#contact');
    expect(hrefs).toContain('login.html');
  });

  test('nav has login and signup buttons', () => {
    const loginLink = document.querySelector('.nav-login');
    const signupLink = document.querySelector('.btn-nav');
    expect(loginLink).not.toBeNull();
    expect(loginLink.textContent).toBe('Log In');
    expect(signupLink).not.toBeNull();
    expect(signupLink.textContent).toBe('Sign Up');
  });

  test('hero section has CTA linking to plan section', () => {
    const cta = document.querySelector('.hero .btn');
    expect(cta).not.toBeNull();
    expect(cta.getAttribute('href')).toBe('#plan');
    expect(cta.textContent).toBe('Start Planning');
  });

  test('all 6 service cards are rendered', () => {
    const cards = document.querySelectorAll('.service-card');
    expect(cards.length).toBe(6);
  });

  test('service cards have icons, titles, and descriptions', () => {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
      expect(card.querySelector('.service-icon svg')).not.toBeNull();
      expect(card.querySelector('h3').textContent.length).toBeGreaterThan(0);
      expect(card.querySelector('p').textContent.length).toBeGreaterThan(0);
    });
  });

  test('all 3 portfolio cards are rendered with links', () => {
    const cards = document.querySelectorAll('.portfolio-card');
    expect(cards.length).toBe(3);
    cards.forEach(card => {
      expect(card.getAttribute('onclick')).toMatch(/portfolio-.*\.html/);
      expect(card.querySelector('.portfolio-img')).not.toBeNull();
      expect(card.querySelector('h3')).not.toBeNull();
      expect(card.querySelector('.portfolio-link')).not.toBeNull();
    });
  });

  test('event form has all required fields', () => {
    expect(document.getElementById('client-name')).not.toBeNull();
    expect(document.getElementById('client-email')).not.toBeNull();
    expect(document.getElementById('event-name')).not.toBeNull();
    expect(document.getElementById('event-date')).not.toBeNull();
    expect(document.getElementById('event-guests')).not.toBeNull();
    expect(document.getElementById('event-desc')).not.toBeNull();
  });

  test('event form has all service checkboxes', () => {
    const checkboxes = document.querySelectorAll('.checkbox-row input[type="checkbox"]');
    expect(checkboxes.length).toBe(6);
    const values = Array.from(checkboxes).map(cb => cb.value);
    expect(values).toContain('Decoration');
    expect(values).toContain('Cake');
    expect(values).toContain('Furniture');
    expect(values).toContain('Florals');
    expect(values).toContain('Lighting');
    expect(values).toContain('Full Design');
  });

  test('confirmation is hidden by default', () => {
    const confirmation = document.getElementById('confirmation');
    expect(confirmation.classList.contains('hidden')).toBe(true);
  });

  test('footer contains copyright', () => {
    const footer = document.querySelector('footer');
    expect(footer.textContent).toMatch(/2026/);
    expect(footer.textContent).toMatch(/B&R Events/);
  });

  test('logo links to index.html', () => {
    const logoLink = document.querySelector('.logo a');
    expect(logoLink.getAttribute('href')).toBe('index.html');
  });
});

describe('Event form submission flow', () => {
  beforeEach(() => {
    loadPage('index.html');
    initEventForm();
  });

  test('submitting form hides it and shows confirmation', () => {
    const form = document.getElementById('event-form');
    const confirmation = document.getElementById('confirmation');

    expect(form.classList.contains('hidden')).toBe(false);
    expect(confirmation.classList.contains('hidden')).toBe(true);

    form.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(form.classList.contains('hidden')).toBe(true);
    expect(confirmation.classList.contains('hidden')).toBe(false);
  });

  test('filling form fields and submitting works end-to-end', () => {
    document.getElementById('client-name').value = 'Jane Doe';
    document.getElementById('client-email').value = 'jane@example.com';
    document.getElementById('event-name').value = "Jane's Wedding";
    document.getElementById('event-date').value = '2026-09-15';
    document.getElementById('event-guests').value = '100';
    document.getElementById('event-desc').value = 'Elegant garden ceremony';

    const checkboxes = document.querySelectorAll('.checkbox-row input[type="checkbox"]');
    checkboxes[0].checked = true;
    checkboxes[4].checked = true;

    const form = document.getElementById('event-form');
    form.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(form.classList.contains('hidden')).toBe(true);
    expect(document.getElementById('confirmation').classList.contains('hidden')).toBe(false);
  });

  test('confirmation message has thank you text', () => {
    const form = document.getElementById('event-form');
    form.dispatchEvent(new Event('submit', { cancelable: true }));

    const confirmation = document.getElementById('confirmation');
    expect(confirmation.querySelector('h3').textContent).toBe('Thank you!');
    expect(confirmation.querySelector('p').textContent).toMatch(/design team/i);
  });
});

describe('Login page integration', () => {
  beforeEach(() => {
    loadPage('login.html');
    initAuthForm();
  });

  test('page loads in login mode by default', () => {
    expect(document.getElementById('auth-heading').textContent).toBe('Log in to your account');
    expect(document.getElementById('auth-submit').textContent).toBe('Log In');
    expect(document.getElementById('name-fields').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('phone-field').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('confirm-field').classList.contains('hidden')).toBe(true);
  });

  test('has email and password fields visible', () => {
    const email = document.getElementById('auth-email');
    const password = document.getElementById('auth-password');
    expect(email).not.toBeNull();
    expect(email.type).toBe('email');
    expect(password).not.toBeNull();
    expect(password.type).toBe('password');
  });

  test('clicking sign up link switches to signup mode', () => {
    const switchLink = document.getElementById('switch-to-signup');
    switchLink.click();

    expect(document.getElementById('auth-heading').textContent).toBe('Create your account');
    expect(document.getElementById('auth-submit').textContent).toBe('Create Account');
    expect(document.getElementById('name-fields').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('phone-field').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('confirm-field').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('first-name').required).toBe(true);
    expect(document.getElementById('last-name').required).toBe(true);
    expect(document.getElementById('auth-confirm').required).toBe(true);
  });

  test('clicking log in link switches back to login mode', () => {
    document.getElementById('switch-to-signup').click();
    document.getElementById('switch-to-login').click();

    expect(document.getElementById('auth-heading').textContent).toBe('Log in to your account');
    expect(document.getElementById('auth-submit').textContent).toBe('Log In');
    expect(document.getElementById('name-fields').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('first-name').required).toBe(false);
  });

  test('login extras visible in login mode, hidden in signup mode', () => {
    expect(document.getElementById('login-extras').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('signup-extras').classList.contains('hidden')).toBe(true);

    document.getElementById('switch-to-signup').click();

    expect(document.getElementById('login-extras').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('signup-extras').classList.contains('hidden')).toBe(false);
  });

  test('toggling modes multiple times maintains correct state', () => {
    for (var i = 0; i < 5; i++) {
      document.getElementById('switch-to-signup').click();
      expect(document.getElementById('auth-heading').textContent).toBe('Create your account');

      document.getElementById('switch-to-login').click();
      expect(document.getElementById('auth-heading').textContent).toBe('Log in to your account');
    }
  });

  test('logo links back to landing page', () => {
    const logoLink = document.querySelector('.auth-logo');
    expect(logoLink.getAttribute('href')).toBe('index.html');
  });
});

describe('Login form validation integration', () => {
  beforeEach(() => {
    loadPage('login.html');
    initAuthForm();
  });

  test('valid login credentials pass validation', () => {
    const email = 'user@example.com';
    const password = 'securepass123';

    expect(validateEmail(email)).toBe(true);
    expect(validatePassword(password)).toBe(true);
  });

  test('invalid email fails validation', () => {
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validatePassword('securepass123')).toBe(true);
  });

  test('short password fails validation', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validatePassword('short')).toBe(false);
  });

  test('signup mode requires name fields to be filled', () => {
    document.getElementById('switch-to-signup').click();

    var firstName = document.getElementById('first-name');
    var lastName = document.getElementById('last-name');
    var confirm = document.getElementById('auth-confirm');

    expect(firstName.required).toBe(true);
    expect(lastName.required).toBe(true);
    expect(confirm.required).toBe(true);
  });

  test('login mode does not require name fields', () => {
    var firstName = document.getElementById('first-name');
    var lastName = document.getElementById('last-name');
    var confirm = document.getElementById('auth-confirm');

    expect(firstName.required).toBe(false);
    expect(lastName.required).toBe(false);
    expect(confirm.required).toBe(false);
  });
});

describe('Portfolio detail pages integration', () => {
  var detailPages = [
    { file: 'portfolio-wedding.html', title: 'Rose Garden Wedding', type: 'Outdoor Ceremony' },
    { file: 'portfolio-gala.html', title: 'Golden Anniversary Gala', type: 'Ballroom Celebration' },
    { file: 'portfolio-babyshower.html', title: 'Baby Shower Brunch', type: 'Intimate Brunch' }
  ];

  detailPages.forEach(function (page) {
    describe(page.file, () => {
      beforeEach(() => {
        loadPage(page.file);
      });

      test('has correct title', () => {
        var h1 = document.querySelector('.portfolio-detail h1');
        expect(h1.textContent).toBe(page.title);
      });

      test('has event metadata', () => {
        var meta = document.querySelectorAll('.portfolio-meta span');
        expect(meta.length).toBeGreaterThanOrEqual(3);
        var texts = Array.from(meta).map(s => s.textContent);
        expect(texts.some(t => t.includes(page.type))).toBe(true);
        expect(texts.some(t => t.includes('Guests'))).toBe(true);
        expect(texts.some(t => t.includes('2026'))).toBe(true);
      });

      test('has hero image', () => {
        var img = document.querySelector('.portfolio-hero-img');
        expect(img).not.toBeNull();
        expect(img.getAttribute('src')).toMatch(/^pic\//);
      });

      test('has back link to portfolio', () => {
        var backLink = document.querySelector('.back-link');
        expect(backLink).not.toBeNull();
        expect(backLink.getAttribute('href')).toBe('index.html#portfolio');
      });

      test('has "The Vision" section', () => {
        var headings = Array.from(document.querySelectorAll('.portfolio-body h2'));
        var texts = headings.map(h => h.textContent);
        expect(texts).toContain('The Vision');
      });

      test('has "What We Designed" section with items', () => {
        var items = document.querySelectorAll('.portfolio-list li');
        expect(items.length).toBeGreaterThanOrEqual(4);
        items.forEach(item => {
          expect(item.querySelector('strong')).not.toBeNull();
          expect(item.textContent.length).toBeGreaterThan(20);
        });
      });

      test('has service tags', () => {
        var tags = document.querySelectorAll('.portfolio-tags .tag');
        expect(tags.length).toBeGreaterThanOrEqual(3);
      });

      test('has CTA with link to plan section', () => {
        var cta = document.querySelector('.portfolio-cta');
        expect(cta).not.toBeNull();
        var btn = cta.querySelector('.btn');
        expect(btn.getAttribute('href')).toBe('index.html#plan');
        expect(btn.textContent).toBe('Start Planning');
      });

      test('has consistent nav with login/signup', () => {
        var loginLink = document.querySelector('.nav-login');
        var signupLink = document.querySelector('.btn-nav');
        expect(loginLink).not.toBeNull();
        expect(signupLink).not.toBeNull();
      });

      test('has footer', () => {
        var footer = document.querySelector('footer');
        expect(footer).not.toBeNull();
        expect(footer.textContent).toMatch(/B&R Events/);
      });
    });
  });
});

describe('Cross-page navigation consistency', () => {
  var allPages = ['index.html', 'login.html', 'portfolio-wedding.html', 'portfolio-gala.html', 'portfolio-babyshower.html'];

  allPages.forEach(function (page) {
    test(page + ' references styles.css', () => {
      loadPage(page);
      var link = document.querySelector('link[href="styles.css"]');
      expect(link).not.toBeNull();
    });
  });

  test('all portfolio detail pages have same nav structure', () => {
    var detailPages = ['portfolio-wedding.html', 'portfolio-gala.html', 'portfolio-babyshower.html'];
    var navStructures = detailPages.map(function (page) {
      loadPage(page);
      var links = document.querySelectorAll('.nav-links a');
      return Array.from(links).map(a => a.getAttribute('href'));
    });

    expect(navStructures[0]).toEqual(navStructures[1]);
    expect(navStructures[1]).toEqual(navStructures[2]);
  });

  test('landing page portfolio cards link to existing detail pages', () => {
    loadPage('index.html');
    var cards = document.querySelectorAll('.portfolio-card[onclick]');
    cards.forEach(function (card) {
      var onclick = card.getAttribute('onclick');
      var match = onclick.match(/location\.href='(.+)'/);
      expect(match).not.toBeNull();
      var targetFile = match[1];
      expect(fs.existsSync(path.join(__dirname, '..', targetFile))).toBe(true);
    });
  });
});

describe('CSS class consistency', () => {
  test('landing page uses expected CSS classes', () => {
    loadPage('index.html');
    var expectedClasses = ['hero', 'services', 'service-grid', 'service-card', 'portfolio', 'portfolio-grid', 'portfolio-card', 'plan-event', 'contact', 'hidden'];
    expectedClasses.forEach(function (cls) {
      var el = document.querySelector('.' + cls);
      expect(el).not.toBeNull();
    });
  });

  test('login page uses expected CSS classes', () => {
    loadPage('login.html');
    var expectedClasses = ['auth-page', 'auth-left', 'auth-right', 'auth-card', 'auth-form', 'auth-heading', 'auth-extras', 'auth-divider'];
    expectedClasses.forEach(function (cls) {
      var el = document.querySelector('.' + cls);
      expect(el).not.toBeNull();
    });
  });
});
