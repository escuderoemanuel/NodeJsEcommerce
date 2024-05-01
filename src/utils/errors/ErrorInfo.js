const getCreateProductErrorInfo = (product) => {
  return `
  One or more required properties were incomplete or not valid.
  List of required properties:
  - title: expected 'String', received ${product.title},
  - description: expected 'String', received ${product.description},
  - price: expected 'String', received ${product.price},
  - thumbnails: expected 'String', received ${product.thumbnails},
  - code: expected 'String', received ${product.code},
  - stock: expected 'String', received ${product.stock},
  - category: expected 'String', received ${product.category},
  - status: expected 'String', received ${product.status}
  `
}

const getAddProductToCartErrorInfo = (cid, pid) => {
  return `
  One or more required properties were incomplete or not valid.
  List of required properties:
  - cid: expected 'String', received ${cid},
  - pid: expected 'String', received ${pid},
  `
}

const getUserRegisterErrorInfo = (user) => {
  return `
  One or more required properties were incomplete or not valid.
  List of required properties:
  - firstName: expected 'String', received ${user.firstName},
  - lastName: expected 'String', received ${user.lastName},
  - age: expected 'String', received ${user.age},
  - email: expected 'String', received ${user.email},
  - password: expected 'String', received ${user.password},
  `
}

module.exports = {
  getCreateProductErrorInfo,
  getAddProductToCartErrorInfo,
  getUserRegisterErrorInfo
}