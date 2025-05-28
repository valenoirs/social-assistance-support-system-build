const filter = (ext) => {
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
    return true
  }

  return false
}

module.exports = filter
