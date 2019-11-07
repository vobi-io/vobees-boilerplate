'use strict'

const { mongoose } = require('app/dbConnect')
const { defaultSchema, defaultConfig } = require('app/modules/common/schemaMongoose')

const schema = new mongoose.Schema(
  {
    movementId: { type: String },
    paymentId: { type: String },
    externalPaymentId: { type: String },
    debitCredit: { type: String },
    valueDate: { type: Date },
    description: { type: String },
    amount: {
      amount: { type: String },
      currency: { type: String }
    },
    accountNumber: { type: String },
    accountName: { type: String },
    additionalInformation: { type: String },
    documentDate: { type: Date },
    documentNumber: { type: String },
    partnerAccountNumber: { type: String },
    partnerName: { type: String },
    partnerBankCode: { type: String },
    partnerBank: { type: String },
    taxpayerCode: { type: String },
    taxpayerName: { type: String },
    operationCode: { type: String },
    partnerDocumentType: { type: String },
    statusCode: { type: String },
    transactionType: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    ...defaultSchema
  },
  { ...defaultConfig }
)

module.exports = mongoose.model('Transaction', schema)
