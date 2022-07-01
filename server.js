//import express to start server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());
app.use(express.static('./public'));
const fs = require("fs");
const path = require("path");
const { notes } = require("./db/db.json")
const shortid = require('shortid');


//get all notes
app.get("/api/notes", (req, res) => {
    res.json(notes)
})
//add a new note
app.post("/api/notes", (req, res) => {
    req.body.id =  shortid.generate();

    if (!validateNotes(req.body)) {
        res.status(400).send("The note is not properly formatted.");
    } else {
        const note = createNewNote(req.body, notes);
        res.json(note)
    }
})
//give notes unique id then push new notes to db.json array
function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note)
    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify({ notes: notesArray }, null, 2)
    );

    return note;
}
// delete note with matching id and write to file
function deleteNoteById(id) {
  const idx = notes.findIndex((note) => note.id === id);
  notes.splice(idx, 1);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ notes }, null, 2)
  );

  return 200;
}
//make sure notes have both a title and a text field
function validateNotes(note){
    if (!note.title) {
        return false;
    }
    if (!note.text) {
        return false;
    }
    return true;
}
//loads index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})
//load notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})
//delete note based on id
app.delete("/api/notes/:id", (req, res) => {
    const result = deleteNoteById(req.params.id);
    if (result) {
        console.log(result)
        res.json(result);
    } else {
    res.send(404);
}
})
// start server
app.listen(PORT, ()=> {
    console.log(`API server is now on port ${PORT}`);
});

