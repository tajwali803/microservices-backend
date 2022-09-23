const express = require('express')
const cors = require('cors')
const app = express()
const connect = require('./models/db')
const axios = require('axios')

const Comment = require('./models/Comment')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/api/comment/:postId', async (req, res) => {
	const comments = await Comment.find({ post_id: req.params.postId })
	res.json(comments)
})

app.get('/api/comment/delete/:commentId', async (req, res) => {
	const comment = await Comment.findByIdAndDelete(req.params.commentId)
	res.json({ status: true })
})

app.post('/api/comment/create', async (req, res) => {
	const { post_id, user_id, content } = req.body

	/* ---------------------------- validate request ---------------------------- */
	if (!post_id || !user_id || !content) {
		res.status(400).json({ error: 'post_id, user_id and content are required' })
		return
	}
	/* -------------------- moderate comment for banned words ------------------- */

	var status = 'pending'

	// send a POST request with data using fetch to the moderation service

	try {
		const { data } = await axios.post('http://localhost:3004/', {
			content
		})
		status = data.status
	} catch (e) {
		console.log(e)
	}

	try {
		const comment = await Comment.create({
			post_id,
			user_id,
			content,
			status
		})

		res.json(comment)
	} catch (error) {
		console.log(error)
		res.status(400).json({ error: 'Validation Error', errors: error })
	}
})

/* ---------------- variables for port and connection string ---------------- */
const port = process.env.PORT || 3003
const connection_url = 'mongodb+srv://tajwali:Bismillah1@cluster0.yxt59qn.mongodb.net/?retryWrites=true&w=majority'

/* ---------------- mongoose connection ---------------- */
connect(connection_url)

/* ------------------------------ server setup ------------------------------ */
app.listen(port, () => {
	console.log(`Comments service running on port ${port}`)
})
