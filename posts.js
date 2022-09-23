const express = require('express')
const cors = require('cors')
const app = express()

const connect = require('./models/db')

const Post = require('./models/Post')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/api/posts', async (req, res) => {
	const posts = await Post.find({})
	res.json(posts)
})

app.post('/api/posts/create', async (req, res) => {
	const { title, user_id } = req.body

	// validate request
	if (!title || !user_id) {
		res.status(400).json({ error: 'title and user_id are required' })
		return
	}

	try {
		const post = await Post.create({
			title,
			user_id
		})

		res.json(post)
	} catch (e) {
		console.log(e)
		res.status(400).json({ error: 'Validation Error', errors: e })
	}
})

app.post('/api/posts/delete/:id', async (req, res) => {
	const { id } = req.params

	const post = await Post.findByIdAndDelete(id)
	res.json({ status: true })
})

/* ---------------- variables for port and connection string ---------------- */
const port = process.env.PORT || 3002
const connection_url = 'mongodb://127.0.0.1:27017/Posts'

/* ---------------- mongoose connection ---------------- */
connect(connection_url)

/* ------------------------------ server setup ------------------------------ */
app.listen(port, () => {
	console.log(`Posts service running on port ${port}`)
})
