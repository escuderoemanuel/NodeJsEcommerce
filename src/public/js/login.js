const loginForm = document.getElementById('loginForm')
const emailError = document.getElementById('emailError')
const passwordError = document.getElementById('passwordError')

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(loginForm);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  try {
    const response = await fetch('/api/sessions/login', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json(); // Aquí esperamos la respuesta JSON
      document.querySelector('.errorMessage').textContent = errorMessage.error;
      return;
    }

    if (response.status == 200) {
      window.location.replace('/api/products');
    }
  } catch (error) {
    console.error('Error:', error);
    document.querySelector('.errorMessage').textContent = 'Error occurred while processing your request.';
  }
});
