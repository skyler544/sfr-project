package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func InitMySQLSchema(dsn string) (*sql.DB, error) {
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to MySQL: %w", err)
	}

	_, err = db.Exec(`CREATE DATABASE IF NOT EXISTS seismic`)
	if err != nil {
		return nil, fmt.Errorf("failed to create database: %w", err)
	}

	_, err = db.Exec(`USE seismic`)
	if err != nil {
		return nil, fmt.Errorf("failed to use seismic database: %w", err)
	}

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS sensors (
			sensor VARCHAR(255) PRIMARY KEY
		)
	`)
	if err != nil {
		return nil, fmt.Errorf("failed to create sensors table: %w", err)
	}

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS sensor_data (
			uuid CHAR(36) PRIMARY KEY,
			sensor VARCHAR(255),
			latitude VARCHAR(64),
			longitude VARCHAR(64),
			depth DOUBLE,
			energy DOUBLE,
			FOREIGN KEY (sensor) REFERENCES sensors(sensor)
		)
	`)
	if err != nil {
		return nil, fmt.Errorf("failed to create sensor_data table: %w", err)
	}

	log.Println("✅ MySQL schema initialized")
	return db, nil
}
