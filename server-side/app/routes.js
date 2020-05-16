const express = require('express')
const router = express.Router()
const {
    getListWork,
    addNewWork,
    updateWork,
    deleteWork
} = require('./queries')

router.get('/', getListWork)
router.post('/', addNewWork)
router.put('/:id', updateWork)
router.delete('/:id', deleteWork)

module.exports = router