
const passwordChangeForm = document.getElementById('passwordChangeForm');

passwordChangeForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(passwordChangeForm);
  const payload = {};

  data.forEach((value, key) => {
    payload[key] = value;
  });

  // Limpiar cualquier error previo
  document.querySelector('.infoMessage').textContent = '';

  try {
    fetch('/api/sessions/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then((response) => {

      if (response.status === 400) {
        document.querySelector('.infoMessage').textContent = 'The new password cannot be the same as the previous one';
        return;
      }

      if (!response.ok) {
        const errorMessage = response.json(); // Aquí esperamos la respuesta JSON
        document.querySelector('.infoMessage').textContent = errorMessage.error;
        return;
      }

      if (response.status === 200) {
        document.querySelector('.infoMessage').textContent = 'Password changed succesfully';

        // Redirigir al usuario a la página de inicio de sesión después de un tiempo
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    })


  } catch (error) {
    console.error('Password reset failed:', error);
    document.querySelector('.infoMessage').textContent = 'Error processing your request. Please try again later.';
  } finally {
    // Restablecer el formulario, independientemente del resultado
    passwordResetForm.reset();
  }
});