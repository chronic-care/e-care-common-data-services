import express from 'express'
import Item from '../models/vitalSigns'
import vitalsRepository from '../repositories/vitals-repository'

const vitalsRouter = express.Router()

vitalsRouter.post('/vitals', (req, res) => {
	const item: Item = req.body
	console.log(item);
	vitalsRepository.create(item, (id) => {
		console.log(id);
        if (id) {
            res.status(201).location(`/vitals/${id}`).send()
        } else {
            res.status(400).send("failed")
        }
    })
})

vitalsRouter.get('/vitals', (req, res) => {
	vitalsRepository.getVitals((vitals) => res.json(vitals))
})

vitalsRouter.get('/vitals/:id', (req, res) => {
	const id: number = +req.params.id
	vitalsRepository.getVitalById(id, (item) => {
		if (item) {
			res.json(item)
		} else {
			res.status(404).send()
		}
	})
})



export default vitalsRouter