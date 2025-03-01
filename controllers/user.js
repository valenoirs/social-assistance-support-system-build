'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.updateProfile =
  exports.updatePassword =
  exports.signOut =
  exports.signIn =
    void 0
const user_1 = require('../models/user')
const config_1 = __importDefault(require('../config/config'))
const signIn = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await user_1.User.findOne({ username })
    if (!user) {
      req.flash('notification', 'Akun tidak ditemukan.')
      console.log('[SERVER]: Akun not found')
      return res.redirect('back')
    }
    if (password !== user.password) {
      req.flash('notification', 'Password salah.')
      console.log('[SERVER]: Incorrect password')
      return res.redirect('back')
    }
    const { id, name } = user
    const userSession = {
      id,
      name,
      username,
    }
    req.session.user = userSession
    req.flash('notification', `Berhasil masuk sebagai ${name}.`)
    console.log('[SERVER]: User logged in.')
    return res.redirect('/')
  } catch (error) {
    req.flash(
      'notification',
      'Terjadi kesalahan saat mencoba masuk, coba lagi.'
    )
    console.error('[SERVER]: Sign in error.', error)
    return res.redirect('back')
  }
}
exports.signIn = signIn
const signOut = async (req, res) => {
  try {
    if (!req.session.user) {
      req.flash(
        'notification',
        'Terjadi kesalahan saat mencoba keluar, coba lagi.'
      )
      console.log('[SERVER]: No session id provided.')
      return res.redirect('back')
    }
    const { name } = req.session.user
    req.session.destroy((error) => {
      if (error) throw error
      res.clearCookie(config_1.default.SESSION_COLLECTION_NAME)
      console.log(`[SERVER]: ${name} signed out.`)
      return res.redirect('back')
    })
  } catch (error) {
    req.flash(
      'notification',
      'Terjadi kesalahan saat mencoba keluar, coba lagi.'
    )
    console.error('[SERVER]: Sign out error.', error)
    return res.redirect('back')
  }
}
exports.signOut = signOut
const updatePassword = async (req, res) => {
  try {
    const { password, passwordConfirmation, oldPassword } = req.body
    const { id } = req.session.user
    const user = await user_1.User.findById(id)
    if (!user) {
      req.flash('notification', `User tidak ditemukan.`)
      console.log(`[SERVER]: User not found, update password error.`)
      return res.redirect('/edit-profile')
    }
    if (user.password !== oldPassword) {
      req.flash('notification', `Gagal melakukan autentikasi, password salah.`)
      console.log(`[SERVER]: Update password failed, old password incorrect.`)
      return res.redirect('/edit-profile')
    }
    if (password !== passwordConfirmation) {
      req.flash('notification', `Konfirmasi password baru gagal.`)
      console.log(`[SERVER]: New Password confirmation failed.`)
      return res.redirect('/edit-profile')
    }
    await user_1.User.findByIdAndUpdate(id, { $set: { password } })
    req.flash('notification', `Password berhasil diperbarui.`)
    console.log(`[SERVER]: Update password success.`)
    return res.redirect('/')
  } catch (error) {
    req.flash(
      'notification',
      `Terjadi kesalahan saat mencoba memperbarui password, coba lagi.`
    )
    console.log(`[SERVER]: Update password error.`)
    return res.redirect('/edit-profile')
  }
}
exports.updatePassword = updatePassword
const updateProfile = async (req, res) => {
  try {
    const { id } = req.session.user
    const user = await user_1.User.findById(id)
    if (!user) {
      req.flash('notification', `User tidak ditemukan.`)
      console.log(`[SERVER]: User not found, update password error.`)
      return res.redirect('/edit-profile')
    }
    await user_1.User.findByIdAndUpdate(id, { $set: req.body })

    req.session.user.name = req.body.name

    req.flash('notification', `Profil berhasil diperbarui.`)
    console.log(`[SERVER]: Update profil success.`)
    return res.redirect('/')
  } catch (error) {
    req.flash(
      'notification',
      `Terjadi kesalahan saat mencoba memperbarui profil, coba lagi.`
    )
    console.log(`[SERVER]: Update password error.`)
    return res.redirect('/edit-profile')
  }
}
exports.updateProfile = updateProfile
