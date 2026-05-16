/**
 * LeadFlowAI — Frontend Application Logic
 * Handles form validation, submission, and UI state management
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('leadForm');
  const formCard = document.getElementById('formCard');
  const successCard = document.getElementById('successCard');
  const errorCard = document.getElementById('errorCard');
  const submitBtn = document.getElementById('submitBtn');

  // Create floating particles
  createParticles();

  // Real-time validation on blur
  const requiredFields = ['fullName', 'email', 'companyName'];
  requiredFields.forEach(fieldId => {
    const input = document.getElementById(fieldId);
    input.addEventListener('blur', () => validateField(fieldId));
    input.addEventListener('input', () => clearError(fieldId));
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    requiredFields.forEach(fieldId => {
      if (!validateField(fieldId)) isValid = false;
    });

    if (!isValid) return;

    // Set loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Collect form data
    const formData = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      companyName: document.getElementById('companyName').value.trim(),
      companyWebsite: document.getElementById('companyWebsite').value.trim(),
      industry: document.getElementById('industry').value,
      companySize: document.getElementById('companySize').value,
      notes: document.getElementById('notes').value.trim(),
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess(data.message);
        animatePipeline();
      } else {
        const errorMsg = data.errors ? data.errors.join('\n') : data.message || 'Something went wrong.';
        showError(errorMsg);
      }
    } catch (err) {
      showError('Network error. Please check your connection and try again.');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  // ── Validation Functions ──
  function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}Error`);
    const value = input.value.trim();
    let error = '';

    switch (fieldId) {
      case 'fullName':
        if (!value) error = 'Full name is required.';
        else if (value.length < 2) error = 'Name must be at least 2 characters.';
        break;
      case 'email':
        if (!value) error = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email.';
        break;
      case 'companyName':
        if (!value) error = 'Company name is required.';
        else if (value.length < 2) error = 'Name must be at least 2 characters.';
        break;
    }

    if (error) {
      input.classList.add('error');
      input.classList.remove('valid');
      if (errorEl) errorEl.textContent = error;
      return false;
    } else {
      input.classList.remove('error');
      if (value) input.classList.add('valid');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}Error`);
    input.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  }

  // ── UI State Functions ──
  function showSuccess(message) {
    formCard.classList.add('hidden');
    errorCard.classList.add('hidden');
    successCard.classList.remove('hidden');
    document.getElementById('successMessage').textContent = message;
    successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function showError(message) {
    formCard.classList.add('hidden');
    successCard.classList.add('hidden');
    errorCard.classList.remove('hidden');
    document.getElementById('errorMessage').textContent = message;
    errorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function animatePipeline() {
    const steps = ['step1', 'step2', 'step3', 'step4'];
    let current = 0;

    const interval = setInterval(() => {
      if (current > 0) {
        document.getElementById(steps[current - 1]).classList.remove('active');
        document.getElementById(steps[current - 1]).classList.add('complete');
      }
      if (current < steps.length) {
        document.getElementById(steps[current]).classList.add('active');
        current++;
      } else {
        clearInterval(interval);
      }
    }, 3000);
  }
});

// ── Global Functions ──
function resetForm() {
  document.getElementById('formCard').classList.remove('hidden');
  document.getElementById('successCard').classList.add('hidden');
  document.getElementById('errorCard').classList.add('hidden');
  document.getElementById('leadForm').reset();

  // Reset validation styles
  document.querySelectorAll('input, select').forEach(el => {
    el.classList.remove('error', 'valid');
  });
  document.querySelectorAll('.form-error').forEach(el => {
    el.textContent = '';
  });

  // Reset pipeline steps
  ['step1', 'step2', 'step3', 'step4'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('active', 'complete');
  });
  document.getElementById('step1').classList.add('active');

  document.getElementById('formCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── Floating Particles ──
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 20;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    particle.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      background: rgba(129, 140, 248, ${Math.random() * 0.3 + 0.1});
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: float ${Math.random() * 20 + 15}s linear infinite;
      animation-delay: ${Math.random() * -20}s;
    `;
    container.appendChild(particle);
  }

  // Add float animation
  if (!document.getElementById('particleStyle')) {
    const style = document.createElement('style');
    style.id = 'particleStyle';
    style.textContent = `
      @keyframes float {
        0% { transform: translate(0, 0) scale(1); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}100px, -100vh) scale(0.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}
