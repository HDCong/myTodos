const pool = require('../config')

const getListWork = (request, response) => {
    console.log('Get ne')
    pool.query('SELECT * FROM details ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        } else response.status(200).json(results.rows)
    })
}
const addNewWork = (request, response) => {
    contentAdded = request.body.content

    pool.query('INSERT INTO details (content) VALUES ($1) RETURNING id', [contentAdded], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rowCount == 0) response.status(500).send('-1')
        else response.status(201).send(`${results.rows[0].id}`)
    })
}
const updateWork = (request, response) => {

    const id = parseInt(request.params.id)
    const { content, isdone } = request.body
    console.log(request.body)
    pool.query(
        'UPDATE details SET content = $1,isDone =$2 WHERE id = $3', [content, isdone, id],
        (error, results) => {
            if (error) {
                throw error
            }
            if (results.rowCount == 0) response.status(500).send('-1')
            else response.status(200).send(`Modified with ID: ${id}`)
        }
    )
}
const deleteWork = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM details WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rowCount == 0)
            response.status(500).send(`No deleted with ID: ${id}`)
        else response.status(200).send(`deleted with ID: ${id}`)
    })
}

module.exports = {
    getListWork,
    addNewWork,
    updateWork,
    deleteWork
}