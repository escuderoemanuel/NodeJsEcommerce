const socket = io();

const btnPurchaseCart = document.getElementById('btnPurchaseCart');


/* PURCHASE */
const purchaseCart = (cid) => {
  fetch(`/carts/${cid}/purchase`, {
    method: "GET"
  }).then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        Swal.fire({
          color: "#eee",
          text: `🔔 Your purchase has been processed successfully! The details have been sent to your email.`,
          toast: true,
          position: 'center',
          background: "#222",
          confirmButtonColor: "#43c09e",
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          color: "#eee",
          position: 'center',
          background: "#222",
          icon: 'warning',
          title: 'Oops...',
          position: 'center',
          text: data.error,
          confirmButtonColor: "#43c09e",
        });
      }
    })
    .catch(error => {
      console.error('Error during purchase:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        confirmButtonColor: "#43c09e",
      });
    });
}

/* DELETE */
const deleteFromCart = (cid, pid) => {
  fetch(`/carts/${cid}/product/${pid}`, {
    method: "DELETE"
  }).then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        window.location.reload();
      } else {
        console.error('Failed to delete product:', data);
      }
    })
    .catch(error => {
      console.error('Error deleting product from cart:', error);
    });
}