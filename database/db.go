package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite3", "./community.db")
	if err != nil {
		log.Fatal(err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal(err)
	}

	createTables()
}

func createTables() {
	createUsersTable := `CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL
	);`

	_, err := DB.Exec(createUsersTable)
	if err != nil {
		log.Fatal(err)
	}

	createJobsTable := `CREATE TABLE IF NOT EXISTS jobs (
		id TEXT PRIMARY KEY,
		status TEXT NOT NULL,
		logs TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		username TEXT
	);`

	_, err = DB.Exec(createJobsTable)
	if err != nil {
		log.Fatal(err)
	}

	// Migration for existing table
	_, err = DB.Exec("ALTER TABLE jobs ADD COLUMN username TEXT")
	if err != nil {
		// Ignore error if column already exists or other migration issues for now
		// In a real app check specific error
		log.Println("Migration: username column might already exist", err)
	}
}
