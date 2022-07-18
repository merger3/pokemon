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
	sprite TEXT,
	posX INT,
	posY INT,
	facing INT
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


	$file = 'json/trainers.json';
	$data = file_get_contents($file);
	$arr = json_decode($data, true);
	$stmt = $conn->prepare("INSERT INTO trainers (name, sprite, posX, posY, facing) VALUES (?, ?, ?, ?, ?)");
	$stmt->bind_param("ssiii", $name, $sprite, $posX, $posY, $facing);
	$select = $conn->prepare("SELECT COUNT(1) AS count FROM trainers WHERE name = ?;");
	$select->bind_param("s", $name);
	foreach ($arr["trainers"] as $trainer) {
		$name = $trainer["name"];
		$sprite = $trainer["sprite"];
		$posX = $trainer["posX"];
		$posY = $trainer["posY"];
		$facing = $trainer["facing"];
		$select->execute();
		$result = $select->get_result(); // get the mysqli result
		$exists = $result->fetch_assoc();
		if ($exists["count"] == 0) {
			echo("inserting trainer<br>");
			$stmt->execute();
		} else {
			echo("trainer exists<br>");
		}
	}


	$file = 'json/moves.json';
	$data = file_get_contents($file);
	$arr = json_decode($data, true);
	$stmt = $conn->prepare("INSERT INTO moves (id, MoveName, MoveType, PowerPoints, MovePower, Accuracy, Inflicts, InflictChance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
	$stmt->bind_param("issiiisi", $id, $MoveName, $MoveType, $PowerPoints, $MovePower, $Accuracy, $Inflicts, $InflictChance);
	$select = $conn->prepare("SELECT COUNT(1) AS count FROM moves WHERE id = ?;");
	$select->bind_param("i", $id);
	foreach ($arr["moves"] as $move) {
		$id = $move["id"];
		$MoveName = $move["MoveName"];
		$MoveType = $move["MoveType"];
		$PowerPoints = $move["PowerPoints"];
		$MovePower = $move["MovePower"];
		$Accuracy = $move["Accuracy"];
		$Inflicts = $move["Inflicts"];
		$InflictChance = $move["InflictChance"];

		$select->execute();
		$result = $select->get_result(); // get the mysqli result
		$exists = $result->fetch_assoc();
		if ($exists["count"] == 0) {
			echo("inserting move<br>");
			$stmt->execute();
		} else {
			echo("move exists<br>");
		}
	}

$conn->close();
?>
