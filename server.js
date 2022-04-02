import express from 'express'
import cachettl from './routers/cachettl.js'
import coins from './routers/coins.js'

const app = express();
const port = 3000

app.use(express.json())
app.use("/cachettl", cachettl)

app.use("/coins", coins)

// Server start listen
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});