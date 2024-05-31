const TicketModel = require("../models/tickets.model")

class TicketsDao {

  async getAll() {
    return await TicketModel.find().lean()
  }

  async getById(id) {
    return await TicketModel.findOne({ _id: id }).populate('items.item').lean()
  }

  async create(item) {
    return await TicketModel.create(item)
  }

  async update(id, item) {
    return await TicketModel.updateOne({ _id: id }, item)
  }

  async delete(id) {
    return await TicketModel.deleteOne({ _id: id })
  }
}

module.exports = TicketsDao;