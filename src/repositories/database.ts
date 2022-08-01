import sqlite3 from 'sqlite3'

const DBSOURCE = 'db.sqlite'

const SQL_ITENS_CREATE = `
	CREATE TABLE vitals (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		systolic INTEGER,
		diastolic INTEGER
	)`

const database = new sqlite3.Database(DBSOURCE, (err) => {
	if (err) {
		console.error(err.message)
		throw err
	} else {
		console.log('success.')
		database.run(SQL_ITENS_CREATE, (err) => {
		if (err) {
			// Possivelmente a tabela já foi criada
		} else {
			console.log('failed')
		}
	})
	}
})

export default database