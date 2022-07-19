<?php
ob_start();
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
echo "Connected successfully<br>";


$sql = "CREATE DATABASE IF NOT EXISTS pokemon";
if ($conn->query($sql) === TRUE) {
  echo "Database created successfully<br>";
} else {
  echo "Error creating database: " . $conn->error;
}


$queries = array(
	"CREATE TABLE IF NOT EXISTS trainers (
	name VARCHAR(30) PRIMARY KEY,
	sprite TEXT,
	posX INT,
	posY INT,
	facing INT
	)",

	"CREATE TABLE IF NOT EXISTS dialogue (
	textOrder INT,
	trainerName VARCHAR(30),
	lineNum INT,
	value TEXT,
	PRIMARY KEY(textOrder, lineNum, trainerName),
	CONSTRAINT trainer_fk FOREIGN KEY (trainerName) REFERENCES trainers(name)
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
	ownerName VARCHAR(30),
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
	CONSTRAINT owner_fk FOREIGN KEY (ownerName) REFERENCES trainers(name)
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
		  echo "Table created successfully<br>";
		} else {
		  echo "Error creating table: " . $conn->error;
		}
		echo "<br>";
	}


	// textOrder INT,
	// trainerID INT UNSIGNED,
	// lineNum INT,
	// value TEXT,

	$file = 'json/trainers.json';
	$data = file_get_contents($file);
	$arr = json_decode($data, true);

	$stmt = $conn->prepare("INSERT INTO trainers (name, sprite, posX, posY, facing) VALUES (?, ?, ?, ?, ?)");
	$stmt->bind_param("ssiii", $name, $sprite, $posX, $posY, $facing);
	
	$select = $conn->prepare("SELECT COUNT(1) AS count FROM trainers WHERE name = ?;");
	$select->bind_param("s", $name);
	$sql = "DELETE FROM dialogue;";
	$conn->query($sql);
	foreach ($arr["trainers"] as $trainer) {
		$name = $trainer["name"];
		$sprite = $trainer["sprite"];
		$posX = $trainer["posX"];
		$posY = $trainer["posY"];
		$facing = $trainer["facing"];
		$select->execute();
		$result = $select->get_result();
		$exists = $result->fetch_assoc();
		if ($exists["count"] == 0) {
			echo("inserting trainer<br>");
			$stmt->execute();
		} else {
			echo("trainer exists<br>");
		}
		

		$stmt2 = $conn->prepare("INSERT INTO dialogue (textOrder, trainerName, lineNum, value) VALUES (?, ?, ?, ?)");
		$stmt2->bind_param("isis", $textOrder, $trainerName, $lineNum, $value);
	
		$i = 0;
		foreach ($trainer["dialogue"] as $dialogue) {
			$textOrder = $i;
			$trainerName = $trainer["name"];
			$lineNum = 0;
			$value = $dialogue['line1'];
			$stmt2->execute();
			echo("Line1 added<br>");
			$textOrder = $i;
			$trainerName = $trainer["name"];
			$lineNum = 1;
			$value = $dialogue['line2'];
			$stmt2->execute();
			echo("Line2 added<br>");
			$i++;
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
		$result = $select->get_result();
		$exists = $result->fetch_assoc();
		if ($exists["count"] == 0) {
			echo("inserting move<br>");
			$stmt->execute();
		} else {
			echo("move exists<br>");
		}
	}

	$file = 'json/pokedex.json';
	$data = file_get_contents($file);
	$arr = json_decode($data, true);
	$stmt = $conn->prepare("INSERT INTO pokemonDefs (id, name, primaryType, secondaryType, hp, attack, defense, special, speed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
	$stmt->bind_param("isssiiiii", $id, $name, $primaryType, $secondaryType, $hp, $attack, $defense, $special, $speed);
	$select = $conn->prepare("SELECT COUNT(1) AS count FROM pokemonDefs WHERE id = ?;");
	$select->bind_param("i", $id);
	foreach ($arr["pokemon"] as $pokemon) {
		$id = $pokemon["id"];
		$name = $pokemon["name"];
		$primaryType = $pokemon["primaryType"];
		$secondaryType = $pokemon["secondaryType"];
		$hp = $pokemon["hp"];
		$attack = $pokemon["attack"];
		$defense = $pokemon["defense"];
		$special = $pokemon["special"];
		$speed = $pokemon["speed"];

		$select->execute();
		$result = $select->get_result();
		$exists = $result->fetch_assoc();
		if ($exists["count"] == 0) {
			echo("inserting pokemon<br>");
			$stmt->execute();
		} else {
			echo("pokemon exists<br>");
		}
	}

$conn->close();
header( 'Location: http://localhost/pokemon/overworld.html' );
exit;
?>
