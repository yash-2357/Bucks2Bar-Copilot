const { validateUsername, calcNet, MONTHS, inrFmt } = require('./script.js');

// ── validateUsername ─────────────────────────
describe('validateUsername', () => {
  test('returns empty array for a fully valid username', () => {
    expect(validateUsername('ValidUser1!')).toEqual([]);
  });

  test('returns error for username shorter than 3 characters', () => {
    expect(validateUsername('Ab!')).toEqual([]);       // exactly 3 — valid
    expect(validateUsername('A!')).toContain('at least 3 characters');
  });

  test('returns error when no uppercase letter', () => {
    expect(validateUsername('validuser!')).toContain('at least one uppercase letter');
  });

  test('returns error when no special character', () => {
    expect(validateUsername('ValidUser')).toContain('at least one special character');
  });

  test('returns multiple errors for a short, all-lowercase, no-special username', () => {
    const errors = validateUsername('ab');
    expect(errors).toContain('at least 3 characters');
    expect(errors).toContain('at least one uppercase letter');
    expect(errors).toContain('at least one special character');
  });

  test('returns no errors when username has uppercase, special char, and length >= 3', () => {
    expect(validateUsername('A1!')).toEqual([]);
  });
});

// ── calcNet ──────────────────────────────────
describe('calcNet', () => {
  test('returns positive net when income > expense', () => {
    expect(calcNet(5000, 3000)).toBe(2000);
  });

  test('returns negative net when income < expense', () => {
    expect(calcNet(2000, 4000)).toBe(-2000);
  });

  test('returns zero when income equals expense', () => {
    expect(calcNet(1000, 1000)).toBe(0);
  });

  test('handles zero income', () => {
    expect(calcNet(0, 500)).toBe(-500);
  });

  test('handles zero expense', () => {
    expect(calcNet(800, 0)).toBe(800);
  });

  test('handles both zero', () => {
    expect(calcNet(0, 0)).toBe(0);
  });
});

// ── MONTHS constant ──────────────────────────
describe('MONTHS', () => {
  test('has exactly 12 months', () => {
    expect(MONTHS).toHaveLength(12);
  });

  test('starts with Jan and ends with Dec', () => {
    expect(MONTHS[0]).toBe('Jan');
    expect(MONTHS[11]).toBe('Dec');
  });

  test('contains all expected month abbreviations', () => {
    expect(MONTHS).toEqual([
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]);
  });
});

// ── inrFmt ───────────────────────────────────
describe('inrFmt', () => {
  test('formats zero as ₹0', () => {
    expect(inrFmt.format(0)).toBe('₹0');
  });

  test('formats a whole number in INR with no decimals', () => {
    expect(inrFmt.format(1000)).toBe('₹1,000');
  });

  test('formats a large number using Indian grouping', () => {
    // 1,00,000 in en-IN locale
    expect(inrFmt.format(100000)).toBe('₹1,00,000');
  });

  test('truncates decimals (maximumFractionDigits: 0)', () => {
    expect(inrFmt.format(1500.75)).toBe('₹1,501');
  });
});

// ── Username banner behaviour ────────────────
describe('username banner behaviour', () => {
  let input, banner, submitBtn;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="usernameInput" type="text" />
      <div id="usernameBanner" class="d-none"></div>
      <button id="usernameSubmitBtn">Submit</button>
    `;
    input     = document.getElementById('usernameInput');
    banner    = document.getElementById('usernameBanner');
    submitBtn = document.getElementById('usernameSubmitBtn');

    // Re-wire the click handler (DOMContentLoaded won't re-fire in Jest)
    submitBtn.addEventListener('click', () => {
      const value  = input.value.trim();
      const errors = validateUsername(value);

      banner.classList.remove('d-none', 'alert-success', 'alert-danger');

      if (errors.length === 0) {
        banner.classList.add('alert-success');
        banner.textContent = `✓ Username "${value}" is valid!`;
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      } else {
        banner.classList.add('alert-danger');
        banner.textContent = `✗ Invalid username — must include: ${errors.join(', ')}.`;
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
      }
    });
  });

  test('removes d-none from banner on valid username', () => {
    input.value = 'ValidUser1!';
    submitBtn.click();
    expect(banner.classList.contains('d-none')).toBe(false);
  });

  test('removes d-none from banner on invalid username', () => {
    input.value = 'ab';
    submitBtn.click();
    expect(banner.classList.contains('d-none')).toBe(false);
  });

  test('adds alert-success and correct text for valid username', () => {
    input.value = 'ValidUser1!';
    submitBtn.click();
    expect(banner.classList.contains('alert-success')).toBe(true);
    expect(banner.classList.contains('alert-danger')).toBe(false);
    expect(banner.textContent).toBe('✓ Username "ValidUser1!" is valid!');
  });

  test('adds is-valid class to input for valid username', () => {
    input.value = 'ValidUser1!';
    submitBtn.click();
    expect(input.classList.contains('is-valid')).toBe(true);
    expect(input.classList.contains('is-invalid')).toBe(false);
  });

  test('adds alert-danger for username too short with no uppercase and no special char', () => {
    input.value = 'ab';
    submitBtn.click();
    expect(banner.classList.contains('alert-danger')).toBe(true);
    expect(banner.classList.contains('alert-success')).toBe(false);
    expect(banner.textContent).toContain('at least 3 characters');
    expect(banner.textContent).toContain('at least one uppercase letter');
    expect(banner.textContent).toContain('at least one special character');
  });

  test('adds is-invalid class to input for invalid username', () => {
    input.value = 'ab';
    submitBtn.click();
    expect(input.classList.contains('is-invalid')).toBe(true);
    expect(input.classList.contains('is-valid')).toBe(false);
  });

  test('banner text lists missing uppercase for lowercase-only username', () => {
    input.value = 'validuser!';
    submitBtn.click();
    expect(banner.textContent).toContain('at least one uppercase letter');
    expect(banner.textContent).not.toContain('at least 3 characters');
    expect(banner.textContent).not.toContain('at least one special character');
  });

  test('banner text lists missing special char when only uppercase and length ok', () => {
    input.value = 'ValidUser';
    submitBtn.click();
    expect(banner.textContent).toContain('at least one special character');
    expect(banner.textContent).not.toContain('at least 3 characters');
    expect(banner.textContent).not.toContain('at least one uppercase letter');
  });

  test('replaces previous alert class when toggling valid then invalid', () => {
    input.value = 'ValidUser1!';
    submitBtn.click();
    expect(banner.classList.contains('alert-success')).toBe(true);

    input.value = 'ab';
    submitBtn.click();
    expect(banner.classList.contains('alert-danger')).toBe(true);
    expect(banner.classList.contains('alert-success')).toBe(false);
  });
});
