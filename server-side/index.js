const express = require('express')
const bodyParser = require('body-parser')
const app = express()
    // const db = require('./app/queries')
const router = require('./app/routes')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const PORT = process.env.PORT || 8888;


app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express, and Postgre API' })
})
app.use('/todolist/', router)
    // app.get('/todolist', db.getListWork)
    // app.post('/todolist', db.addNewWork)
    // app.put('/todolist/:id', db.updateWork)
    // app.delete('/todolist/:id', db.deleteWork)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})