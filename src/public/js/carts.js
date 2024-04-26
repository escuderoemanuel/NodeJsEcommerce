const socket = io();

const btnPurchaseCart = document.getElementById('btnPurchaseCart');

/* PURCHASE */
const purchaseCart = (cid) => {

  fetch(`/api/carts/${cid}/purchase`, {
    method: "GET"
  }).then(res => {
    if (res.status == 200) {
      window.location.reload();
    }
  })
}

/* DELETE */
const deleteFromCart = (cid, pid) => {
  try {
    fetch(`/api/carts/${cid}/product/${pid}`, {
      method: "DELETE"
    }).then(res => {
      if (res.status == 200) {
        window.location.reload();
      }
    })
  } catch (error) {
    console.log(error)
  }
}

