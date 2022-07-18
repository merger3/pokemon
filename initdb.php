<?php
$servername = "localhost";
$username = "user";
$password = "pass";
$database = "pokemon";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";


$sql = "CREATE DATABASE IF NOT EXISTS pokemon";
if ($conn->query($sql) === TRUE) {
  echo "Database created successfully";
} else {
  echo "Error creating database: " . $conn->error;
}


$queries = array(
	"CREATE TABLE IF NOT EXISTS trainers (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(30),
	sprite LONGBLOB,
	posX INT,
	posY INT
	)",

	"CREATE TABLE IF NOT EXISTS pokemonDefs (
	id INT PRIMARY KEY,
	name VARCHAR(30),
	primaryType VARCHAR(30),
	secondaryType VARCHAR(30),
	hp INT,
	attack INT,
	defense INT,
	special INT,
	speed INT
	)",


	"CREATE TABLE IF NOT EXISTS captured (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	pokemonID INT,
	ownerID INT UNSIGNED,
	currentHP INT,
	status TEXT,
	level INT,
	experience INT,
	hp INT,
	attack INT,
	defense INT,
	special INT,
	speed INT,
	CONSTRAINT pokemon_fk FOREIGN KEY (pokemonID) REFERENCES pokemonDefs(id),
	CONSTRAINT owner_fk FOREIGN KEY (ownerID) REFERENCES trainers(id)
	)",

	"CREATE TABLE IF NOT EXISTS moves (
	id INT PRIMARY KEY,
	MoveName TEXT,
	MoveType VARCHAR(30),
	PowerPoints INT,
	MovePower INT,
	Accuracy INT,
	Inflicts TEXT,
	InflictChance INT
	)",	

	"CREATE TABLE IF NOT EXISTS learned (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	capturedID INT UNSIGNED,
	moveID INT,
	currentPP INT,
	CONSTRAINT captured_fk FOREIGN KEY (capturedID) REFERENCES captured(id),
	CONSTRAINT move_fk FOREIGN KEY (moveID) REFERENCES moves(id)
	)"
	);
	
	foreach ($queries as $query) {
		if ($conn->query($query) === TRUE) {
		  echo "Table created successfully";
		} else {
		  echo "Error creating table: " . $conn->error;
		}
		echo "<br>";
	}

$conn->close();
?>
