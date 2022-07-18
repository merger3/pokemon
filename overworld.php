<?php
// const UP = 0;
// const DOWN = 1;
// const LEFT = 2;
// const RIGHT = 3;

	session_start();
	if (isset($_REQUEST['init']) and !isset($_SESSION['initialized'])) {
		$_SESSION['map'] = array();
		$file = 'assets/map.tmj';
		$data = file_get_contents($file);
		$arr = json_decode($data, true);
		for ($i = 0; $i < 20; $i++) {
			for ($j = 0; $j < 30; $j++) {
				$_SESSION['map'][$i][$j] = 0;
			}
		}
		foreach ($arr["layers"] as $value) {
			if ($value['name'] == "Objects" or $value['name'] == "Hitboxes") {
				foreach ($value['objects'] as $obj) {
					for ($i = 0; $i < $obj['height'] / 16; $i++) {
						$_SESSION['map'][($obj['y'] / 16) + $i][$obj['x'] / 16] = 1;
					}
					for ($i = 0; $i < $obj['width'] / 16; $i++) {
						$_SESSION['map'][($obj['y'] / 16) + $i][($obj['x'] / 16) + $i] = 1;
					}
				}
			}
		}
		$_SESSION['initialized'] = 1;
		print_r($_SESSION['map']);
	} else if (isset($_REQUEST['checkMovement'])) {
		$dir = $_REQUEST['checkMovement']['direction'];
		$x = $_REQUEST['checkMovement']['x'];
		$y = $_REQUEST['checkMovement']['y'];
		if ($dir == 0) { // UP
			if ($y - 1 <= 0) {
				print(0);
			} else if (($_SESSION['map'][$y - 1][$x] == 1) or ($_SESSION['map'][$y - 1][$x + 1] == 1)) {
				print(0);
			} else {
				print(1);
			}
		} else if ($dir == 1) { // DOWN
			if ($y + 1 > 19) {
				print(0);
			} else if (($_SESSION['map'][$y + 1][$x] == 1) or ($_SESSION['map'][$y + 1][$x + 1] == 1)) {
				print(0);
			} else {
				print(1);
			}
		} else if ($dir == 2) { // LEFT
			if ($x - 1 <= 0) {
				print(0);
			} else if ($_SESSION['map'][$y][$x - 1] == 1) {
				print(0);
			} else {
				print(1);
			}
		} else if ($dir == 3) { // RIGHT
			if ($x + 1 > 29) {
				print(0);
			} else if ($_SESSION['map'][$y][$x + 1] == 1) {
				print(0);
			} else {
				print(1);
			}
		} else { // UNDEFINED
			print("Error State");
		}
		//print($_REQUEST['checkMovement']['direction']);
		// print($_REQUEST['checkMovement']["x"].' '.$_REQUEST['checkMovement']["y"]);
	} else if (isset($_REQUEST['printArray'])) {
		for ($i = 0; $i < 20; $i++) {
			for ($j = 0; $j < 30; $j++) {
				if ($i == $_REQUEST['printArray']['y'] and $j == $_REQUEST['printArray']['x']) {
					print("2");
				} else {
					print($_SESSION['map'][$i][$j]);
				}
			}
			print("<br>");
		}
	}
?>