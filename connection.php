<?php

// 1. connect to local mysql server (using xampp or mampp)

$username = "root";
$conn = new mysqli("localhost", $username, "", "course_calendar");
// mysqli( server/database, username, password, database)
$conn->set_charset("utf8mb4");
