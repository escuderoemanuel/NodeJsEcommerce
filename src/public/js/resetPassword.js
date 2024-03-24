const passwordResetForm = document.getElementById('passwordResetForm');

passwordResetForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(passwordResetForm);
  const payload = {};

  const password = passwordResetForm.password.value;
  const passwordConfirm = passwordResetForm.passwordConfirm.value;

  if (password !== passwordConfirm) {
    // Mostrar error si las contraseñas no coinciden
    document.querySelector('.errorMessage').textContent = 'Passwords do not match.';
    return;
  }

  // Limpiar cualquier error previo
  document.querySelector('.errorMessage').textContent = '';

  // Construir el payload
  data.forEach((value, key) => {
    payload[key] = value;
  });


  try {
    fetch('/api/sessions/resetPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then((response) => {

      if (!response.ok) {
        const errorMessage = response.json(); // Aquí esperamos la respuesta JSON
        document.querySelector('.errorMessage').textContent = errorMessage.error;
        return;
      }

      if (response.status === 200) {
        console.log('Password reset successful.');
        document.querySelector('.errorMessage').textContent = 'Password reset successful...';

        // Redirigir al usuario a la página de inicio de sesión después de un tiempo
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    })


  } catch (error) {
    console.error('Password reset failed:', error);
    document.querySelector('.errorMessage').textContent = 'Error processing your request. Please try again later.';
  } finally {
    // Restablecer el formulario, independientemente del resultado
    passwordResetForm.reset();
  }
});
