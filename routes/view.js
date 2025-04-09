"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const keluarga_1 = require("../models/keluarga");
const saw_1 = __importDefault(require("../utils/saw"));
exports.router = (0, express_1.Router)();
exports.router.get("/signin", async (req, res) => {
  if (req.session.user) {
    req.flash(
      "notification",
      "Sesi login masih ada, silahkan keluar terlebih dahulu."
    );
    return res.redirect("/");
  }

  const alternativesTitle = [
    "Penghasilan Bulanan",
    "Status Tempat Tinggal",
    "Sumber Mata Pencarian",
    "Jumlah Tanggungan",
    "Jumlah Keluarga Lansia Atau Sakit Menahun/Kronis",
    "Pengeluaran Bulanan",
    "Pendidikan Akhir",
  ];

  const alternativesLabel = [
    [
      "> Rp. 2.000.000",
      "Rp. 1.000.000 - Rp. 2.000.000",
      "Rp. 400.000 - Rp. 1.000.000",
      "Rp. 0 - Rp. 400.000",
      "TIDAK BERPENGHASILAN",
    ],
    [
      "MILIK SENDIRI",
      "MILIK ORANG TUA",
      "KONTRAK",
      "KOS",
      "TIDAK ADA"
    ],
    ["PNS", "KARYAWAN SWASTA", "TUKANG", "PETANI", "TIDAK BEKERJA"],
    ["TIDAK ADA", "1 ORANG", "2 ORANG", "3 ORANG", ">3 ORANG"],
    ["TIDAK ADA", "1 ORANG", "2 ORANG", "3 ORANG", ">3 ORANG"],
    [
      "Rp. 0 - Rp. 400.000",
      "Rp. 400.000 - Rp. 1.000.000",
      "Rp. 1.000.000 - Rp. 2.000.000",
      "Rp. 2.000.000 - Rp. 3.000.000",
      "> Rp. 3.000.000",
    ],
    ["SARJANA", "SMA", "SMP", "SD", "TIDAK SEKOLAH"],
  ];

  const alternativesCount = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];

  const keluarga = await keluarga_1.Keluarga.find();

  const criteria = keluarga.map((data) => data.criteria);

  criteria.forEach((data) => {
    data.forEach((data2, index) => {
      for (let i = 0; i < 5; i++) {
        if (data2 - 1 === i) alternativesCount[index][i] += 1;
      }
    });
  });

  const count = keluarga.length;

  return res.render("signin", {
    layout: "layout",
    notification: req.flash("notification"),
    alternativesTitle,
    alternativesLabel,
    alternativesCount,
    count,
  });
});
exports.router.get("/keluarga", async (req, res) => {
  if (!req.session.user) {
    req.flash("notification", "Harap masuk untuk melanjutkan.");
    return res.redirect("/signin");
  }
  const { query } = req.query;
  const keluarga = await keluarga_1.Keluarga.find({
    name: { $regex: query, $options: "i" },
  });
  return res.render("keluarga", {
    layout: "layout",
    notification: req.flash("notification"),
    keluarga,
    query,
  });
});
exports.router.get("/algoritma", async (req, res) => {
  if (!req.session.user) {
    req.flash("notification", "Harap masuk untuk melanjutkan.");
    return res.redirect("/signin");
  }
  return res.render("algoritma", {
    layout: "layout",
    notification: req.flash("notification"),
  });
});
exports.router.get("/edit", async (req, res) => {
  if (!req.session.user) {
    req.flash("notification", "Harap masuk untuk melanjutkan.");
    return res.redirect("/signin");
  }

  return res.render("edit", {
    layout: "layout",
    notification: req.flash("notification"),
  });
});
exports.router.get("/", async (req, res) => {
  if (!req.session.user) {
    req.flash("notification", "Harap masuk untuk melanjutkan.");
    return res.redirect("/signin");
  }
  const keluarga = await keluarga_1.Keluarga.find();
  const score = (0, saw_1.default)(keluarga).map((data, index) => {
    return { ...data, rank: index + 1 };
  });
  return res.render("home", {
    layout: "layout",
    notification: req.flash("notification"),
    score,
    count: keluarga.length,
    query: "",
  });
});
