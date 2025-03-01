'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.router = void 0
const express_1 = require('express')
const keluarga_1 = require('../models/keluarga')
const saw_1 = __importDefault(require('../utils/saw'))
exports.router = (0, express_1.Router)()
exports.router.get('/signin', async (req, res) => {
  if (req.session.user) {
    req.flash(
      'notification',
      'Sesi login masih ada, silahkan keluar terlebih dahulu.'
    )
    return res.redirect('/')
  }
  return res.render('signin', {
    layout: 'layout',
    notification: req.flash('notification'),
  })
})
exports.router.get('/keluarga', async (req, res) => {
  if (!req.session.user) {
    req.flash('notification', 'Harap masuk untuk melanjutkan.')
    return res.redirect('/signin')
  }
  const { query } = req.query
  const keluarga = await keluarga_1.Keluarga.find({
    name: { $regex: query, $options: 'i' },
  })
  return res.render('keluarga', {
    layout: 'layout',
    notification: req.flash('notification'),
    keluarga,
    query,
  })
})
exports.router.get('/edit', async (req, res) => {
  if (!req.session.user) {
    req.flash('notification', 'Harap masuk untuk melanjutkan.')
    return res.redirect('/signin')
  }

  return res.render('edit', {
    layout: 'layout',
    notification: req.flash('notification'),
  })
})
exports.router.get('/', async (req, res) => {
  if (!req.session.user) {
    req.flash('notification', 'Harap masuk untuk melanjutkan.')
    return res.redirect('/signin')
  }
  const keluarga = await keluarga_1.Keluarga.find()
  const score = (0, saw_1.default)(keluarga).map((data, index) => {
    return { ...data, rank: index + 1 }
  })
  return res.render('home', {
    layout: 'layout',
    notification: req.flash('notification'),
    score,
    count: keluarga.length,
    query: '',
  })
})
