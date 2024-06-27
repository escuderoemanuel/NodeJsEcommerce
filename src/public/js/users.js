const socket = io();

function updateUserRole(uid) {
  const selectElement = document.getElementById(`select-${uid}`);
  const newRole = selectElement.value;

  fetch(`/users/${uid}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: newRole })
  })
    .then(async res => {
      const response = await res.json();
      if (res.status === 200) {
        Swal.fire({
          color: "#eee",
          position: 'center',
          background: "#222",
          icon: 'success',
          title: 'Success!',
          position: 'center',
          text: 'The user role has been updated.',
          showConfirmButton: false,
          timer: 3000
        })

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        Swal.fire({
          color: "#eee",
          position: 'center',
          background: "#222",
          icon: 'warning',
          title: 'Oops...',
          position: 'center',
          text: response.error,
          showConfirmButton: false,
          timer: 3000
        })

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    })
    .catch(error => {
      Swal.fire({
        color: "#eee",
        position: 'center',
        background: "#222",
        icon: 'warning',
        title: 'Oops...',
        position: 'center',
        text: 'An error occurred while updating the user role.',
        showConfirmButton: false,
        timer: 3000
      })
    });
}

function deleteUser(id) {
  const uid = document.getElementById(`select-${id}`).value;
  fetch(`/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(async res => {
    const response = await res.json();
    if (res.status === 200) {
      Swal.fire({
        color: "#eee",
        position: 'center',
        background: "#222",
        icon: 'success',
        title: 'Success!',
        position: 'center',
        text: 'The user has been deleted.',
        showConfirmButton: false,
        timer: 3000
      })

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      Swal.fire({
        color: "#eee",
        position: 'center',
        background: "#222",
        icon: 'warning',
        title: 'Oops...',
        position: 'center',
        text: response.message,
        showConfirmButton: false,
        timer: 3000
      })
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  });
}

function deleteInactiveUsers() {
  fetch('/users', {
    method: 'DELETE'
  }).then(res => {
    if (res.status === 200) {
      Swal.fire({
        color: "#eee",
        position: 'center',
        background: "#222",
        icon: 'success',
        title: 'Success!',
        position: 'center',
        text: 'The inactive users have been deleted.',
        showConfirmButton: false,
        timer: 3000
      })

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      Swal.fire({
        color: "#eee",
        position: 'center',
        background: "#222",
        icon: 'warning',
        title: 'Oops...',
        position: 'center',
        text: response.error,
        showConfirmButton: false,
        timer: 3000
      })

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  });
}