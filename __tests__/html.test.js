const fs = require('fs');
const path = require('path');

const htmlFiles = ['index.html', 'login.html', 'portfolio-wedding.html', 'portfolio-gala.html', 'portfolio-babyshower.html'];

describe('HTML files', () => {
  htmlFiles.forEach((file) => {
    const filePath = path.join(__dirname, '..', file);

    test(`${file} exists`, () => {
      expect(fs.existsSync(filePath)).toBe(true);
    });

    test(`${file} starts with DOCTYPE`, () => {
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content.trimStart().toLowerCase()).toMatch(/^<!doctype html>/);
    });

    test(`${file} has a <title> tag`, () => {
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toMatch(/<title>.+<\/title>/);
    });

    test(`${file} has viewport meta tag`, () => {
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toMatch(/meta.*viewport/);
    });

    test(`${file} links to styles.css`, () => {
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toMatch(/href="styles\.css"/);
    });
  });
});

describe('Required assets exist', () => {
  test('styles.css exists and is not empty', () => {
    const filePath = path.join(__dirname, '..', 'styles.css');
    expect(fs.existsSync(filePath)).toBe(true);
    const stat = fs.statSync(filePath);
    expect(stat.size).toBeGreaterThan(0);
  });

  test('app.js exists and is not empty', () => {
    const filePath = path.join(__dirname, '..', 'app.js');
    expect(fs.existsSync(filePath)).toBe(true);
    const stat = fs.statSync(filePath);
    expect(stat.size).toBeGreaterThan(0);
  });

  test('logo.svg exists', () => {
    const filePath = path.join(__dirname, '..', 'logo.svg');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  const pics = ['wedding.svg', 'gala.svg', 'babyshower.svg'];
  pics.forEach((pic) => {
    test(`pic/${pic} exists`, () => {
      const filePath = path.join(__dirname, '..', 'pic', pic);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});

describe('Internal links are valid', () => {
  htmlFiles.forEach((file) => {
    test(`${file} has no broken local file references`, () => {
      const filePath = path.join(__dirname, '..', file);
      const content = fs.readFileSync(filePath, 'utf8');
      const linkPattern = /(?:href|src)="([^"#][^"]*)"/g;
      let match;

      while ((match = linkPattern.exec(content)) !== null) {
        const link = match[1].split('#')[0];
        if (!link || link.startsWith('http') || link.startsWith('mailto')) continue;
        const target = path.join(path.dirname(filePath), link);
        expect(fs.existsSync(target)).toBe(true);
      }
    });
  });
});
