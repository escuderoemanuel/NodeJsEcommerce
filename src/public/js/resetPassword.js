
const passwordResetForm = document.getElementById('passwordResetForm');

passwordResetForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(passwordResetForm);
  const payload = {};

  data.forEach((value, key) => {
    payload[key] = value;
  });

  // Limpiar cualquier error previo
  document.querySelector('.infoMessage').textContent = '';

  try {
    fetch('/api/sessions/resetPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(response => {
      if (!response.ok) {
        return response.json().then(errorMessage => {
          document.querySelector('.infoMessage').textContent = errorMessage.error;
        });
      }

      document.querySelector('.infoMessage').textContent = 'Password reset email sent';
      setTimeout(() => {
        window.close();
      }, 1000);
    })
  } catch (error) {
    console.error('Password reset failed:', error);
    document.querySelector('.infoMessage').textContent = 'Error processing your request. Please try again later.';
  } finally {
    // Restablecer el formulario, independientemente del resultado
    passwordResetForm.reset();
  }
});