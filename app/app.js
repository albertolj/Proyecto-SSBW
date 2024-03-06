// app.js
import express from 'express'
import nunjucks from 'nunjucks'

import * as dotenv from 'dotenv'
dotenv.config()

const IN   = process.env.IN            // 'development' or 'production'
const PORT = process.env.PORT

var app = express()
			
nunjucks.configure('views', {         // directorio 'views' para los templates html
	autoescape: true,
	noCache:    IN == 'development',
	watch:      IN == 'development',
	express: app
})
			
app.set('view engine', 'html')
						
app.get('/', (req, res) => {
	res.render('home.html', { username : 'Mundo'})
})
			
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT} in ${IN} ...`)
})