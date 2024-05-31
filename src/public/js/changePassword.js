
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  if (token) {
    document.getElementById('token').value = token;

    // Decode the token to extract the email directly in the frontend
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      document.getElementById('email').value = decoded.email;
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }
});

const passwordChangeForm = document.getElementById('passwordChangeForm');

passwordChangeForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(passwordChangeForm);
  const payload = {};

  data.forEach((value, key) => {
    payload[key] = value;
  });

  document.querySelector('.infoMessage').textContent = '';

  if (payload.password.length < 4) {
    document.querySelector('.infoMessage').textContent = 'Password must be at least 4 characters long';
    return;
  }
  if (payload.password !== payload.confirmPassword) {
    document.querySelector('.infoMessage').textContent = 'Passwords do not match';
    return;
  }

  try {
    const response = await fetch('/api/sessions/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      document.querySelector('.infoMessage').textContent = result.error || 'Unknown error';
      return;
    }

    document.querySelector('.infoMessage').textContent = 'Password changed successfully';

    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);

  } catch (error) {
    console.error('Password reset failed:', error);
    document.querySelector('.infoMessage').textContent = 'Error processing your request. Please try again later.';
  } finally {
    passwordChangeForm.reset();
  }
});

