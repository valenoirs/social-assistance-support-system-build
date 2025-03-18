"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const percent = [25, 20, 15, 15, 10, 10, 5];
function count(arr, namaKeluarga) {
    const hasil = [];
    arr.forEach((element, index) => {
        const min = Math.max(...arr[index]);
        hasil.push(arr[index].map((e) => e / min ));
    });
    const output = [];
    let real = 0;
    for (let i = 0; i < hasil[0].length; i++) {
        real = 0;
        for (let j = 0; j < hasil.length; j++) {
            real = real + hasil[j][i] * percent[j];
        }
        if (real < 0) {
            real = 0;
        }
        output.push({ name: namaKeluarga[i], score: Math.round(real) });
    }
    return output.sort((a, b) => {
        return b.score - a.score;
    });
}
function processArray(arr) {
    const result = [];
    const criteria = [];
    const namaKeluarga = [];
    arr.forEach((petani) => {
        criteria.push(petani.criteria);
        namaKeluarga.push(petani.name);
    });
    if (!criteria.length)
        return [];
    criteria[0].forEach((element, index) => {
        result.push(criteria.map((e, indexMap) => criteria[indexMap][index]));
    });
    const output = count(result, namaKeluarga);
    return output;
}
exports.default = processArray;
