const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get the data from the form and save it to an object.
  const data = new FormData(registerForm);
  const payload = {};

  data.forEach((value, key) => (payload[key] = value));

  // Clear the error message before running validations again
  document.querySelector('.infoMessage').textContent = '';

  // Aditional Validations
  if (!payload.firstName || !payload.lastName || !payload.email || !payload.age || !payload.password || !payload.confirmPassword) {
    document.querySelector('.infoMessage').textContent = 'All fields are required';
    return;
  }

  if (!payload.email.includes('@')) {
    document.querySelector('.infoMessage').textContent = 'Invalid email address';
    return;
  }

  if (payload.age < 18) {
    document.querySelector('.infoMessage').textContent = 'You must be at least 18 years old';
    return;
  }
  if (payload.password.length < 4) {
    document.querySelector('.infoMessage').textContent = 'Password must be at least 4 characters long';
    return;
  }

  if (payload.password !== payload.confirmPassword) {
    document.querySelector('.infoMessage').textContent = 'Passwords do not match';
    return;
  }

  // FETCH
  try {
    const response = await fetch('/api/sessions/register', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      document.querySelector('.infoMessage').textContent = responseData.error || 'An error occurred during registration';
      return;
    }
    document.querySelector('.infoMessage').textContent = 'Successful registration';
    registerForm.reset();
    window.location.replace('/login');
  } catch (error) {
    document.querySelector('.infoMessage').textContent = 'Register error occurred while processing your request.';
  }
});
