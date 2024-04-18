const registerForm = document.getElementById('registerForm')

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Obtengo los datos del formulario y los guardo en un objeto.
  const data = new FormData(registerForm);
  const payload = {};

  data.forEach((value, key) => (payload[key] = value));

  //! Verifications
  // Limpiar el mensaje de error antes de hacer las validaciones nuevamente
  document.querySelector('.infoMessage').textContent = '';

  // Validaciones adicionales
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
    }).then(res => res.json()).then(
    );

    registerForm.reset();
    window.location.replace('/login');

  } catch (error) {
    console.error('Error:', error.message);
    document.querySelector('.infoMessage').textContent = 'Register error occurred while processing your request.';
  }
});