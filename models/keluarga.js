"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keluarga = void 0;
const mongoose_1 = require("mongoose");
const KeluargaSchema = new mongoose_1.Schema(
  {
    name: { type: String, required: true, unique: true },
    origin: { type: String, required: false },
    criteria: { type: [Number], default: [1, 1, 1, 1, 1, 1, 1] },
  },
  {
    timestamps: true,
  }
);
exports.Keluarga = (0, mongoose_1.model)("Keluarga", KeluargaSchema);
