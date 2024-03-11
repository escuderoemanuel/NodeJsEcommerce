const socket = io();

// ul (cardContainer)
const productList = document.getElementById('products');
// form
const formAddProduct = document.getElementById('formAddProduct');


//! Recibo la lista actualizada de productos y la renderizo en el cliente.
socket.on('update-products', products => {
  const productList = document.getElementById('products');
  productList.innerHTML = ''; // Limpiar la lista antes de agregar productos actualizados
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
        <p> <span>status:</span> ${product.status}</p>
      </div>
      <button class='btnAddToCart'>Add to Cart</button>
    `;
    productList.appendChild(productItem);
  });
});




//! SOCKET DELETE BTN
productList.addEventListener('click', async (e) => {
  if (e.target.getAttribute('data-id') === 'btnDelete') {
    const productId = e.target.getAttribute('id').slice(9);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })
      // Este es el objeto del producto que estoy eliminando
      const { payload } = await response.json();
      // Aqui paso el producto al server
      socket.emit('delete-product', payload);

    } catch (error) {
      console.log(error);
    }
  }
})

//! Agrego un producto a la base de datos y lo envio a todos los clientes conectados.
formAddProduct.addEventListener('submit', async (e) => {
  e.preventDefault()

  const newProduct = {};
  const formData = new FormData(formAddProduct)
  formData.forEach((value, key) => {
    newProduct[key] = key === 'thumbnails'
      ? newProduct[key] = Array.from(formData.getAll('thumbnails')).map(thumbnail => thumbnail.name) : newProduct[key] = value.trim();
  });

  try {
    const response = await fetch('/api/products', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    })

    if (!response.ok) {
      const errorMessage = await response.json();
      // Mostrar el mensaje de error en el formulario
      document.querySelector('.errorMessage').textContent = errorMessage.error;
      return;
    }

    // Restablecer el formulario y eliminar el mensaje de error
    formAddProduct.reset();
    document.querySelector('.errorMessage').textContent = '';

    // Espera que el server responda con la lista actualizada.
    const { products } = await response.json()

    // Envía la lista actualizada al server.
    socket.emit('add-product', { newProduct, products });
  } catch (error) {
    console.log(error)
    document.querySelector('.errorMessage').textContent = errorMessage.error;
  }
})

