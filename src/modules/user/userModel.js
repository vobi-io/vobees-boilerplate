const bcrypt = require('bcryptjs')

const { mongoose } = require('app/dbConnect')
const { defaultConfig } = require('app/modules/common/schemaMongoose')

const { Schema } = mongoose

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      description: 'მომხმარებლის ელ.ფოსტა'
    },
    password: { type: String, description: 'მომხმარებლის პაროლი' },
    firstName: { type: String, description: 'მომხმარებლის სახელი', maxlength: 200 },
    lastName: { type: String, description: 'მომხმარებლის გვარი', maxlength: 200 },
    locale: { type: String, description: 'საიტის ენა' },
    account: {
      verification: {
        verified: {
          type: Boolean,
          default: false,
          description: 'არის თუ არა მომხმარებელი ვერიფიცირებული'
        },
        token: { type: String, description: 'ვერიფიკაციის ტოკენი' },
        expireIn: { type: Date, description: 'ვერიფიკაციის ტოკენის ვადა' }
      },
      resetPassword: {
        token: { type: String, description: 'პაროლის აღდგენის ტოკენი' },
        expireIn: { type: Date, description: 'პაროლის აღდგენის ტოკენის ვადა' }
      }
    },
    isSuperAdmin: { type: Boolean, default: false },
    deletedAt: { type: Date, description: 'წაშლის თარიღი' }
  },
  { ...defaultConfig }
)

userSchema.statics.emailExist = function(email) {
  return this.findOne({ email })
}

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User
