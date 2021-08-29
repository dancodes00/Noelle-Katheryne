const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const atarashi = new mongoose.Schema({
  user: {
    id: {
      type: String,
      default: uuidv4()
    }
  },
  discord: {
    id: {
      type: String,
      required: true
    },
    roles: []
  },
  verified: {
    type: Boolean,
    default: true
  },
  banned: {
    type: Boolean,
    default: false
  }
}, { collection: 'server_members' })

module.exports = mongoose.model('AtarashiNakama', atarashi)