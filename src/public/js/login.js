
const loginForm = document.getElementById('loginForm')

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(loginForm);
  const payload = {};

  data.forEach((value, key) => (payload[key] = value));
  // Limpiar el mensaje de error antes de hacer las validaciones nuevamente
  document.querySelector('.infoMessage').textContent = '';

  // Validaciones adicionales
  if (!payload.email || !payload.password) {
    document.querySelector('.infoMessage').textContent = 'All fields are required';
    return;
  }

  if (!payload.email.includes('@')) {
    document.querySelector('.infoMessage').textContent = 'Invalid email address';
    return;
  }

  try {
    fetch('/api/sessions/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (res.status === 200) {
        window.location.replace('/api/products');
      } else {
        message.textContent = 'Error occurred while processing your request ELSE.';
      }
      return res.json();
    })
  } catch (error) {
    document.querySelector('.infoMessage').textContent = 'Error occurred while processing your request.';
  }


});


/* 
if (!response.ok) {
      const errorMessage = await response.json(); // Aquí esperamos la respuesta JSON
      message.textContent = errorMessage.error;
      return;
    }

    if (response.status == 200) {
      // Limpiar errores previos
      loginForm.reset();
      message.textContent = 'Logging in...';

      window.location.replace('/api/products');
    } */