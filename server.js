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



app.get("/api/notes", (req, res) => {
    res.json(notes)
})

app.post("/api/notes", (req, res) => {
    req.body.id =  notes.length.toString();

    if (!validateNotes(req.body)) {
        res.status(400).send("The note is not properly formatted.");
    } else {
        const note = createNewNote(req.body, notes);
        res.json(note)
    }
})

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note)
    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify({ notes: notesArray }, null, 2)
    );

    return note;
}

function deleteNoteById(id) {
    fs.readFile(
      path.join(__dirname, "./db/db.json"),
      "utf8",
      function (err, data) {
        if (err) {
          console.log(err);
        } else {
          let { notes } = JSON.parse(data);
          notes = notes.filter((note) => note.id !== id);
          fs.writeFile(
            path.join(__dirname, "./db/db.json"),
            JSON.stringify({ notes }, null, 2),
            function (err) {
              if (err) throw err;
              console.log("Note deleted")
            }
          );
        }
      }
    );
    return 200;
    
}
function validateNotes(note){
    if (!note.title) {
        return false;
    }
    if (!note.text) {
        return false;
    }
    return true;
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

app.delete("/api/notes/:id", (req, res) => {
    const result = deleteNoteById(req.params.id);
    if (result) {
        console.log(result)
        res.json(result);
    } else {
    res.send(404);
}
})

app.listen(PORT, ()=> {
    console.log(`API server is now on port ${PORT}`);
});

