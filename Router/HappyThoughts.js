import express from "express";
import mongoose from 'mongoose'

const router = express.Router();

const messageSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'A message is needed'],
      minlength: 5,
      maxlength: 140
    },
    createdAt: {
      type: Date,
      default: () => new Date()
    },
    likes: {
      type: Number,
      default: 0
    }
  }
)
const Thought = mongoose.model("Thought", messageSchema)

const catchError = (res, err) => {
  return res.status(400).json({ message: "Something went wrong", errors: err.errors })
}

router.post('/thoughts', async (req, res) => {
  const { message } = req.body;
  try {
    const thought = await new Thought({ message }).save()
    res.json(thought)
  } catch (err) {
    catchError(res, err)
  }
})

router.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
    return thoughts.length === 0 ? res.json({ message: "There are no thoughts" }) : res.json(thoughts)
  } catch (err) {
    catchError(res, err)
  }
})

router.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  try {
    const updatedLikes = await Thought.findById(thoughtId).updateOne({ $inc: { likes: 1 } })
    res.json(updatedLikes)
  } catch (err) {
    catchError(res, err)
  }
})

router.delete('/thoughts', async (req, res) => {
  try {
    const deleted = await Thought.deleteMany()
    res.json(deleted)
  } catch (err) {
    catchError(res, err)
  }
})

module.exports = router;