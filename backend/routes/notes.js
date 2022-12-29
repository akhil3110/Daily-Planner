const express = require("express")
const router = express.Router();
const fetchuser = require("../middleware/fetchUser");
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');
const { findById } = require("../models/Note");


// Route 1: Get all the Note using GET 'api/Note/fetchallNote' login required 
router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    try {
        const notes = await Note.find({user: req.user.id});
    res.json(notes);
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Internal Server Occured')
    }
    
})


// Route 2: add a newnote using POST 'api/Note/addnote' login required 
router.post('/addnote',fetchuser,[
    body('title',"Enter a valid title").isLength({ min: 3 }),
    body('description',"Description Must be 5 characters").isLength({ min: 5 }),
    body('tag',"Enter a valid tag").isLength({ min: 5 }),
], async (req,res)=>{

    try {
        const {title,description,tag} = req.body;

    // If there are errors,return bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = await new Note({
        title,description,tag,user : req.user.id 
    })

    const savedNote = await note.save()

    res.json(savedNote);
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Internal Server Occured')
    }

    

})

// Route 3: update a note POST 'api/Note/update' login required
router.put('/updatenote/:id',fetchuser, async (req,res)=>{
    const {title,description,tag} = req.body;
    
    try {
        // new note object
    const newNote = {};

    if(title){newNote.title = title;}
    if(title){newNote.description = description;}
    if(title){newNote.tag = tag;}

    //find the note to be updated and update it
    let note = await Note.findById(req.params.id)
    
    if(!note){return res.status(404).send('Not found')}

    if(note.user.toString() !==req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
    res.json({note})
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Internal Server Occured')
    }
})


// Route 4: delete a note DELETE 'api/Note/delete/:id' login required
router.delete('/deletenote/:id',fetchuser, async (req,res)=>{
    
    try {
        //find the note to be deleted and delete it
    let note = await Note.findById(req.params.id)
    
    //alows deletion only is user  owns this note
    if(!note){return res.status(404).send('Not found')}

    if(note.user.toString() !==req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({'success' : 'note has been deleted', note: note})
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Internal Server Occured')
    }
    
})

module.exports = router