const socket = io();

// ul (cardContainer)
const productList = document.getElementById('realtimeproducts');
// form
const formAddProduct = document.getElementById('formAddProduct');


//? Recibo la lista actualizada de productos y la renderizo en el cliente.
socket.on('update-products', products => {
  const productList = document.getElementById('realtimeproducts');
  productList.innerHTML = ''; // Clear the list before adding updated products
  products.forEach(product => {
    const productItem = document.createElement('li');
    productItem.classList.add('product');
    productItem.innerHTML = `
      <h4 class='productTitle'>${product.title}</h4>
      <div class='productDataContainer'>
        <p> <span>id:</span> ${product._id}</p>
        <p> <span>title:</span> ${product.title}</p>
        <p> <span>description:</span> ${product.description}</p>
        <p> <span>price:</span> ${product.price}</p>
        <p> <span>thumbnails:</span><br>
          ${product.thumbnails.map(thumbnail => `<a class='linkThumbnail' href='${thumbnail}' target='_blank'>${thumbnail}</a><br>`).join('')}
        </p>
        <p> <span>code:</span> ${product.code}</p>
        <p> <span>stock:</span> ${product.stock}</p>
        <p> <span>category:</span> ${product.category}</p>
        <p> <span>owner:</span> ${product.owner}</p>
      </div>
      <button class='btnDelete' id="btnDelete${product._id}" data-id='btnDelete'>Delete Product</button>
    `;
    productList.appendChild(productItem);
  });
});



//? SOCKET DELETE BTN
productList.addEventListener('click', async (e) => {
  if (e.target.getAttribute('data-id') === 'btnDelete') {
    const productId = e.target.getAttribute('id').slice(9);
    try {
      const response = await fetch(`/products/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        // If the response is not successful, extract the error message
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.error || 'Unknown error';
        throw new Error(errorMessage);
      }
      // Product object to deleting
      const { payload } = await response.json();
      // Send the product to the server
      socket.emit('delete-product', response);
      Swal.fire({
        color: "#eee",
        position: 'center',
        background: "#222",
        icon: 'success',
        title: 'Success',
        text: 'Product has been deleted',
        showConfirmButton: false,
        timer: 2500,
      });
      // Reload the page to update the product list
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      Swal.fire({
        color: "#eee",
        position: 'center',
        background: "#222",
        icon: 'warning',
        title: 'Oops...',
        text: error.message,
        confirmButtonColor: "#43c09e",
      });
      console.error(`Error: ${error.message}`);
    }
  }
})

//? Adds a product to the database and sends it to all connected customers.
formAddProduct.addEventListener('submit', async (e) => {
  e.preventDefault()

  const newProduct = {};
  const formData = new FormData(formAddProduct)
  formData.forEach((value, key) => {
    newProduct[key] = key === 'thumbnails'
      ? newProduct[key] = Array.from(formData.getAll('thumbnails')).map(thumbnail => thumbnail.name) : newProduct[key] = value.trim();
  });

  try {
    const response = await fetch('/products', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    })

    if (!response.ok) {
      const errorMessage = await response.json();
      // Display error message on form
      document.querySelector('.errorMessage').textContent = errorMessage.error;
      return;
    }
    // Reset the form and remove the error message
    formAddProduct.reset();
    document.querySelector('.errorMessage').textContent = '';
    // Wait for the server to respond with the updated list.
    const { products } = await response.json()
    // Send the updated list to the server.
    Swal.fire({
      color: "#eee",
      position: 'center',
      background: "#222",
      icon: 'success',
      title: 'Success',
      text: 'Product has been created',
      showConfirmButton: false,
      timer: 2000,
    });
    socket.emit('add-product', { newProduct, products });
  } catch (error) {
    console.errors(error)
    document.querySelector('.errorMessage').textContent = errorMessage.error;
  }
})

