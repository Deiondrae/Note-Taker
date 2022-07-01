const fs = require("fs");
const path = require("path");


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
      path.join(__dirname, "../db/db.json"),
      "utf8",
      function (err, data) {
        if (err) {
          console.log(err);
        } else {
          let { notes } = JSON.parse(data);
          notes = notes.filter((note) => note.id !== id);
          fs.writeFile(
            path.join(__dirname, "../db/db.json"),
            JSON.stringify({ notes }, null, 2),
            function (err) {
              if (err) throw err;
              console.log("Note deleted");
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

function findById(id, notes) {
    const result = notes.filter((note) => note.id === id);
    return result;
  }

module.exports = { createNewNote, validateNotes, deleteNoteById, findById}