const path = require('path')
const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const NotesService = require('./notes-service.js')

const notesRouter = express.Router()
const bodyParser = express.json()

const serializeNote = note => ({
    id: note.id,
    name: xss(note.name),
    modified: new Date(note.modified),
    content: xss(note.content),
    folderId: note.folderId
});

notesRouter
    .route('/')

    .get((req, res, next) => {
        NotesService.getAllNotes(req.app.get('db'))
        .then(notes => {
            res.json(notes.map(serializeNote));
        })
        .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { name, content, folderId } = req.body
        const newNote = { name, content, folderId }

        for (const field of ['name', 'content', 'folderId']) {
            if (!newNote[field]) {
                logger.error(`${field} is required`)
                return res.status(400).send({
                    error: { message: `${field} is required!` }
                })
            }
        }

    // const error = getBookmarkValidationError(newNote)

    // if (error) return res.status(400).send(error)

    NotesService.insertNote(
        req.app.get('db'),
        newNote
    )
        .then(note => {
            logger.info(`Bookmark with id ${note.id} created.`)
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `${note.id}`))
                .json(serializeNote(note))
        })
        .catch(next)
    })

notesRouter
    .route('/:note_id')

    .all((req, res, next) => {
        const { note_id } = req.params
        NotesService.getById(req.app.get('db'), note_id)
        .then(note => {
            if (!note) {
                logger.error(`Note with id ${note_id} not found`)
                return res.status(404).json({
                    error: { message: `Note Not Found` }
                })
            }

            res.note = note
            next()
        })
        .catch(next)
    })

    .get((req, res) => {
        res.json(serializeNote(res.note))
    })

    .delete((req, res, next) => {
        const { note_id } = req.params
        NotesService.deleteNote(
            req.app.get('db'),
            note_id
        )
            .then(numRowsAffected => {
                logger.info(`Note with id ${note_id} deleted.`)
                res.status(204).end()
            })
            .catch(next)
    })

    .patch(bodyParser, (req, res, next) => {
        const { name, content } = req.body;
        const updateNote = ( name, content )

        const numberOfValues = Object.values(updateNote).filter(Boolean).length
        if (numberOfValues === 0) {
            logger.error(`invalid update without required fields`)
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'name' or 'content'`
                }
            })
        }

        NotesService.updateNote(
            req.app.get('db'),
            req.params.note_id,
            updateNote
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = notesRouter