const { v4: uuidv4 } = require('uuid');

class TicketsService {

  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getById(tid) {
    const ticket = await this.dao.getById(tid);
    if (!ticket) throw { message: `There's no ticket by id ${tid}`, status: 400 }
    return ticket;
  }

  async create(ticket) {
    return await this.dao.create(ticket);
  }

  async update(tid, ticket) {
    return await this.dao.update(tid, ticket);
  }

  async delete(tid) {
    return await this.dao.delete(tid);
  }

  async generate(email, totalAmount) {
    const ticket = await this.dao.create({
      code: uuidv4(),
      purchase_datetime: new Date().toLocaleString(),
      amount: totalAmount,
      purchaser: email
    });
    return ticket;
  }
}

module.exports = TicketsService;