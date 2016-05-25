<?php
	$z = 10;
	function sum($x, $y, $z) {
		return $x + $y + $z;
	}
	$a = sum(5, 110, $z);
	echo $a;

	echo '<br><br>';

	$x = range(0, 12, 2);
	foreach ($x as $key=>$entry) {
		echo $key . ' : ' . $entry . '<br>';
	}

	echo '<br><br>';

	$x = range(0, 12, 2);
	foreach ($x as $entry) {
		echo $entry . '<br>';
	}
?>
