const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = {
    //get all thoughts
  async getThoughts(req, res) {
    try{
        const thoughts = await Thought.find()
        res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //get a single thought
  async getSingleThought(req, res) {
    try{
        const thought = await Thought.findOne({ _id: req.params.thoughtId })

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
          }
    
          res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
  },

  //create a thought
  async createThought(req, res) {
    try{
        const thought= await Thought.create(req.body);

      // Update the user document by pushing the thought ID to the user's thoughts array
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );

      // Check if user was found and updated
      if (!user) {
        return res.status(404).json({ message: 'No user with this id!' });
      }
      // Return the updated user document
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //Update a thought
  async updateThought(req, res) {
    try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    );
     // Check if the thought was found and updated
     if (!thought) {
      return res.status(404).json({ message: 'No thought with this id!' });
    }
   // Return the updated thought
   res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
},

  //delete a thought 
   async deleteThought(req, res) {
    try{
    const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });
     // Check if the thought was found and removed
     if (!thought) {
      return res.status(404).json({ message: 'No thought with this id!' });
    }

    // Find the user that had this thought and remove the thought ID from their thoughts array
    await User.findOneAndUpdate(
      { thoughts: req.params.thoughtId },
      { $pull: { thoughts: req.params.thoughtId } },
      { new: true }
    );

    // Return a success message
    res.json({ message: 'Thought deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
},

  //add a reaction
  async addReaction(req, res) {
    try{
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true }
    );
   // Check if the thought was found and updated
   if (!thought) {
    return res.status(404).json({ message: 'No thought with this id!' });
  }

  // Return the updated thought
  res.json(thought);
} catch (err) {
  res.status(500).json(err);
}
},

  //remove a reaction
  async removeReaction(req, res) {
    try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );
  // Check if the thought was found and updated
  if (!thought) {
    return res.status(404).json({ message: 'No thought with this id!' });
  }

  // Return the updated thought
  res.json(thought);
} catch (err) {
  res.status(500).json(err);
}
},
};