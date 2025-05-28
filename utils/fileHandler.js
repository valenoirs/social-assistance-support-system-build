const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const dir = path.join(__dirname, '../public/upload')

    try {
      mkdirSync(dir)
    } catch (error) {
      console.log('[server] ERR! directory-already-existed')
    }

    callback(null, dir)
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname))
  },
})

const multerOption = {
  fileFilter: function (req, file, callback) {
    // var ext = path.extname(file.originalname)
    // if (
    //   ext !== '.png' &&
    //   ext !== '.jpg' &&
    //   ext !== '.jpeg' &&
    //   ext !== '.webp'
    // ) {
    //   return callback(null, false)
    // }
    callback(null, true)
  },

  storage,
}

const upload = multer(multerOption)

module.exports = upload
