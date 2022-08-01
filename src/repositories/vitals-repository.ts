import Item from '../models/vitalSigns'
import database from './database'

const itensRepository = {
	create: (vital: Item, callback: (id?: number) => void) => {

		
		const sql = 'INSERT INTO vitals (systolic, diastolic) VALUES (?, ?)'
		const params = [vital.systolic, vital.diastolic]
		database.run(sql, params, function(_err) {
			callback(this?.lastID)
		})
	},

	getVitals: (callback: (vitals: Item[]) => void) => {
		const sql = 'SELECT * FROM vitals'
		const params: any[] = []
		database.all(sql, params, (_err, rows) => callback(rows))
	},

	getVitalById: (id: number, callback: (item?: Item) => void) => {
		const sql = 'SELECT * FROM vitals WHERE id = ?'
		const params = [id]
		database.get(sql, params, (_err, row) => callback(row))
	},

}

export default itensRepository