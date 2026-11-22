// The borrowed observatory expects Dreambox's FB helper. Keep its optional
// saved-state hooks local to this birthday site; do not connect to Dreambox.
(function () {
  'use strict'
  var key = 'manuu-observatory-data'
  function load() {
    try { return JSON.parse(localStorage.getItem(key)) || {} } catch (_) { return {} }
  }
  function save(data) {
    try { localStorage.setItem(key, JSON.stringify(data)) } catch (_) {}
  }
  window.FB = {
    init: function () {},
    get: function (store, id) {
      var rows = load()[store] || []
      return Promise.resolve(rows.find(function (row) { return row.id === id || row.key === id }) || null)
    },
    getAll: function (store) { return Promise.resolve(load()[store] || []) },
    put: function (store, item) {
      var data = load()
      var rows = data[store] || []
      var id = item.id || item.key || 'local_' + Date.now()
      var next = Object.assign({}, item, { id: id })
      var index = rows.findIndex(function (row) { return row.id === id || row.key === id })
      if (index < 0) rows.push(next); else rows[index] = next
      data[store] = rows
      save(data)
      return Promise.resolve({ key: id })
    },
    delete: function (store, id) {
      var data = load()
      data[store] = (data[store] || []).filter(function (row) { return row.id !== id && row.key !== id })
      save(data)
      return Promise.resolve()
    },
    clear: function (store) { var data = load(); data[store] = []; save(data); return Promise.resolve() },
    set: function (store, value) { var data = load(); data[store] = value; save(data); return Promise.resolve() },
    on: function () { return function () {} },
    toArray: function (data) { return Array.isArray(data) ? data : [] },
    esc: function (value) { return String(value).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c] }) },
  }
})()
