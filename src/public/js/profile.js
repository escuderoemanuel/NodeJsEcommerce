document.addEventListener('DOMContentLoaded', () => {
  const userDocsForm = document.querySelector('.userDocs');

  userDocsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(userDocsForm);
    const actionUrl = userDocsForm.action;

    try {
      const response = await fetch(actionUrl, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const result = await response.json();
        console.log(result.error);
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
    }
  });
});


