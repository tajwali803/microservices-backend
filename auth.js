const express = require('express')
const cors = require('cors')

const bcrypt = require('bcrypt')
const app = express()

const User = require('./models/User')
const connect = require('./models/db')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/api/login', async (req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({ email })

	if (!user) res.status(404).json({ error: 'user not found' })

	bcrypt.compare(password, user.password, (err, result) => {
		if (result) res.send(user)
		else res.status(401).json({ error: 'incorrect password' })
	})
})

app.get('/', (req, res) => {
	res.json({ title: 'working' })
})

app.post('/api/signup', async (req, res) => {
	const { name, email, password } = req.body

	// check for existing email
	const user = await User.findOne({ email })
	if (user) {
		res.status(400).json({ error: 'email already exists' })
		return
	}

	try {
		const salt = bcrypt.genSaltSync(10)
		const hash = bcrypt.hashSync(password, salt)

		const newUser = await User.create({
			email,
			password: hash,
			name
		})
		res.json(newUser)
	} catch (error) {
		res.status(400).json({ error: 'Validation Error', errors: error })
	}
})

/* ---------------- variables for port and connection string ---------------- */
const port = process.env.PORT || 3001
const connection_url = 'mongodb+srv://tajwali:Bismillah1@cluster0.yxt59qn.mongodb.net/?retryWrites=true&w=majority'

/* ---------------- mongoose connection ---------------- */
connect(connection_url)

/* ------------------------------ server setup ------------------------------ */
app.listen(port, () => {
	console.log(`Authentication service running on port ${port}`)
})
