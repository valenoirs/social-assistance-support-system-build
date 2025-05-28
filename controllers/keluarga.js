"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchHome = exports.search = exports.update = exports.remove = exports.add = void 0;
const keluarga_1 = require("../models/keluarga");
const saw_1 = __importDefault(require("../utils/saw"));
const filter = require("../utils/fileFilter")
const path = require("path")
const add = async (req, res) => {
    try {
        const { name } = req.body;
        const keluarga = await keluarga_1.Keluarga.findOne({ name });
        if (keluarga) {
            req.flash('notification', 'Nama keluarga sudah terdaftar.');
            console.log('[SERVER]: Redundant familiy name.');
            return res.redirect('back');
        }

        if (req.file) {
            const validFile = filter(path.extname(req.file.originalname))

            if (validFile) {
                req.flash('notification', 'Format file yang di upload tidak sesuai.')
                console.log('incorrect file format.')
                return res.redirect('back')
            }

            req.body.paycheck = `/upload/${req.file?.filename}`
        }

        await new keluarga_1.Keluarga(req.body).save();
        req.flash('notification', 'Keluarga berhasil ditambahkan.');
        console.log('[SERVER]: New Keluarga added.');
        return res.redirect('/keluarga?query=');
    }
    catch (error) {
        req.flash('notification', 'Terjadi kesalahan saat proses tambah keluarga, coba lagi.');
        console.error('[SERVER]: Keluarga add error.', error);
        return res.redirect('/');
    }
};
exports.add = add;
const remove = async (req, res) => {
    try {
        const { id } = req.body;
        const keluarga = await keluarga_1.Keluarga.findById(id);
        if (!keluarga) {
            req.flash('notification', 'Keluarga tidak ditemukan.');
            console.log('[SERVER]: Keluarga not found.');
            return res.redirect('back');
        }
        await keluarga_1.Keluarga.findByIdAndDelete(id);
        req.flash('notification', 'Keluarga berhasil dihapus.');
        console.log('[SERVER]: Keluarga deleted.');
        return res.redirect('back');
    }
    catch (error) {
        req.flash('notification', 'Terjadi kesalahan saat menghapus keluarga, coba lagi.');
        console.error('[SERVER]: Keluarga delete error.', error);
        return res.redirect('/');
    }
};
exports.remove = remove;
const update = async (req, res) => {
    try {
        const { id } = req.body;
        const keluarga = await keluarga_1.Keluarga.findById(id);
        if (!keluarga) {
            req.flash('notification', 'Keluarga tidak ditemukan.');
            console.log('[SERVER]: Keluarga not found.');
            return res.redirect('back');
        }
        
        if(keluarga.paycheck) {
            req.body.paycheck = keluarga.paycheck;
        }

        if (req.file) {
            req.body.paycheck = `/upload/${req.file?.filename}`;
        }

        await keluarga_1.Keluarga.findByIdAndUpdate(id, { $set: req.body });
        req.flash('notification', 'Keluarga berhasil diperbarui.');
        console.log('[SERVER]: Keluarga edited.');
        return res.redirect('/keluarga?query=');
    }
    catch (error) {
        req.flash('notification', 'Terjadi kesalahan saat memperbarui keluarga, coba lagi.');
        console.error('[SERVER]: Keluarga edit error.', error);
        return res.redirect('/');
    }
};
exports.update = update;
const search = async (req, res) => {
    try {
        const { query } = req.body;
        return res.redirect(`/keluarga?query=${query}`);
    }
    catch (error) {
        req.flash('notification', 'Terjadi kesalahan saat melakukan pencarian, coba lagi.');
        console.error('[SERVER]: Keluarga search error.', error);
        return res.redirect('/');
    }
};
exports.search = search;
const searchHome = async (req, res) => {
    try {
        if (!req.session.user) {
            req.flash('notification', 'Harap masuk untuk melanjutkan.');
            return res.redirect('/signin');
        }
        const { query } = req.body;
        const keluarga = await keluarga_1.Keluarga.find();
        const score = (0, saw_1.default)(keluarga);
        const result = score
            .map((data, index) => {
            return { ...data, rank: index + 1 };
        })
            .filter((data) => data.name.includes(query));
        return res.render('home', {
            layout: 'layout',
            notification: req.flash('notification'),
            score: result,
            count: keluarga.length,
            query,
        });
    }
    catch (error) {
        req.flash('notification', 'Terjadi kesalahan saat melakukan pencarian, coba lagi.');
        console.error('[SERVER]: Keluarga search error.', error);
        return res.redirect('/');
    }
};
exports.searchHome = searchHome;
