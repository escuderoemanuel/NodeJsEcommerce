
const loginForm = document.getElementById('loginForm')

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(loginForm);
  const payload = {};

  data.forEach((value, key) => (payload[key] = value));
  // Clean errors before validations
  document.querySelector('.infoMessage').textContent = '';

  // Aditional Validations
  if (!payload.email || !payload.password) {
    document.querySelector('.infoMessage').textContent = 'All fields are required';
    return;
  }

  if (!payload.email.includes('@')) {
    document.querySelector('.infoMessage').textContent = 'Invalid email address';
    return;
  }

  try {
    await fetch('/api/sessions/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (res.status === 200) {
        window.location.replace('/api/products');
      } else {
        document.querySelector('.infoMessage').textContent = 'Error occurred while processing your request ELSE.';
      }
    })
  } catch (error) {
    document.querySelector('.infoMessage').textContent = 'Login error occurred while processing your request.';
  }
});
