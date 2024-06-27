const { faker } = require('@faker-js/faker');

const generateFakerProducts = () => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnails: [
      faker.image.url(),
      faker.image.url()
    ],
    code: faker.string.alphanumeric(8),
    stock: faker.number.int({ min: 1, max: 10 }),
    category: faker.commerce.department(),
    owner: faker.helpers.arrayElement([
      'admin@admin.com',
      'premium@premium.com',
      'emanuelescudero.dev@gmail.com'
    ]),
  }
}
module.exports = generateFakerProducts; 