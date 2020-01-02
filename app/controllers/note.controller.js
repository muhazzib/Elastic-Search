const Note = require('../models/note.model.js');
const Photos = require('../models/photos.model');
const titles = require('../../photos');
const { Client } = require('@elastic/elasticsearch');
var Sentencer = require('sentencer');
const client = new Client({ node: 'http://localhost:9200' });
async function createTitle(createObj) {
    const { response } = await client.create({
        index: 'titles',
        id: createObj.id,
        body: createObj
    });
    console.log(response, '--------res')
    return response
}
// console.log(Sentencer.make("{{ a_noun }} {{ an_adjective }} {{ noun }}"))

// createTitle().catch(console.log);

async function getTitle() {
    const { body } = await client.get({
        index: 'titles',
        id: 11
    });

    console.log(body);
}

// getTitle().catch(console.log);

async function updateTitle() {
    const { response } = await client.update({
        index: 'titles',
        id: 11,
        body: {
            doc: {
                title: 'Awsome title'
            }
        }
    });
}

// updateTitle().catch(console.log);



async function countTitles() {
    const { body } = await client.count({
        index: 'titles'
    });

    console.log(body);
}

countTitles().catch(console.log);

async function searchTitles(searchString) {
    const { body: response } = await client.search({
        index: 'titles',
        body: {
            query: {
                match: {
                    title: searchString
                }
            }
        },
        size: 2000
    });
    return response.hits.hits;
}

// createTitle()
// Create and Save a new Note
exports.create = (req, res) => {

    // Photos.create({ title: req.body.title, id: parseInt(req.body.id) }).then((success) => {
    //     createTitle({ title: req.body.title, id: parseInt(req.body.id), date: new Date() }).then(() => {
    //         res.status(200).send({
    //             message: "Photo created successfully"
    //         });
    //     }).catch((err) => {
    //         console.log(err, 'err------')
    //     })
    // })
    // Save Note in the database
    // note.save()
    //     .then(data => {
    //         res.send(data);
    //     }).catch(err => {
    //         res.status(500).send({
    //             message: err.message || "Some error occurred while creating the Note."
    //         });
    //     });
    Photos.findAll().then((photos) => {
        let id = 925527;
        for (var i = 0; i < 35000; i++) {
            Photos.create({ title: Sentencer.make("{{ a_noun }} {{an_adjective}} {{an_adjective}}"), id: id }).then((success) => {
                console.log('success==')
            })
            id = id + 1;
        }

    })

    // titles.forEach((value, index) => {
    //     console.log(index, 'index===');
    //     Photos.create({ title: value.title, id: id }).then((success) => {
    //         console.log('success==')
    //     })
    //     id = id + 1;
    // })
    // Photos.cr().then((photos)=>{
    //     console.log(photos,'photos===')
    // })
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {


    // createTitles().catch(console.log);
    // Photos.findAll().then((photos) => {
    //     console.log(photos.length,'length==')
    //     let leftSide = photos.splice(0, 100000)
    //     const body = leftSide.flatMap((doc, index) => [
    //         { index: { _index: 'titles', _id: index + 1 } },
    //         doc.dataValues
    //     ]);
    //     async function createTitles() {
    //         // console.log(body,'body===')
    //         const { response } = await client.bulk({ body: body, refresh: true });
    //         console.log(response, 'res')
    //         if (response) {
    //             console.log(response.errors);
    //         }
    //     }
    //     createTitles().catch(console.log);
    // })

};

exports.searchRecord = (req, res) => {
    // createTitles().catch(console.log);
    searchTitles(req.query.search).then((success) => {
        return res.status(200).send(success);
    })
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    Note.findById(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send(note);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + req.params.noteId
            });
        });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    // Find note and update it with the request body
    Note.findByIdAndUpdate(req.params.noteId, {
        title: req.body.title || "Untitled Note",
        content: req.body.content
    }, { new: true })
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send(note);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Error updating note with id " + req.params.noteId
            });
        });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Note.findByIdAndRemove(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send({ message: "Note deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Could not delete note with id " + req.params.noteId
            });
        });
};
