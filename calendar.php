<?php

// we have to include the connection.php file to connect to the database
include "connection.php";

$successMsg = "";
$errorMsg = "";
$eventsFromDB = []; // initialize a new array to store the fetched events

# handle add appointment
if ($_SERVER["REQUEST_METHOD"] === "POST" && ($_POST["action"] ?? "") === "add") {
  $course = trim($_POST["course_name"] ?? "");
  $instructor = trim($_POST["instructor_name"] ?? "");
  $start = $_POST["start_date"] ?? "";
  $end = $_POST["end_date"] ?? "";
  $startTime = $_POST["start_time"] ?? "";
  $endTime = $_POST["end_time"] ?? "";

  if ($course && $instructor && $start && $end) {
    $statement = $conn->prepare(
      "INSERT INTO appointments (course_name, instructor_name, start_date, end_date, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)"
    );

    $statement->bind_param("ssssss", $course, $instructor, $start, $end, $startTime, $endTime);

    $statement->execute();

    $statement->close();

    header("Location: " . $_SERVER["PHP_SELF"] . "?success");
    exit;
  } else {
      header("Location: " . $_SERVER["PHP_SELF"] . "?error=1");
      exit;
  }
}

#handle edit appointment
if($_SERVER["REQUEST_METHOD"] === "POST" && ($_POST["action"] ?? "") === "edit") {
  $id = $_POST["event_id"] ?? null;
  $course = trim($_POST["course_name"] ?? "");
  $instructor = trim($_POST["instructor_name"] ?? "");
  $start = $_POST["start_date"] ?? "";
  $end = $_POST["end_date"] ?? "";
  $startTime = $_POST["start_time"] ?? "";
  $endTime = $_POST["end_time"] ?? "";


  if ($id && $course && $instructor && $start && $end) {
    $statement = $conn->prepare(
      "UPDATE appointments SET course_name = ?, instructor_name = ?, start_date = ?, end_date = ?, start_time = ?, end_time = ? WHERE id = ?"
    );

    $statement->bind_param("ssssssi", $course, $instructor, $start, $end, $startTime, $endTime, $id);

    $statement->execute();
    $statement->close();

    header("Location: " . $_SERVER["PHP_SELF"] . "?success=2");
    exit;
  } else {
      header("Location: " . $_SERVER["PHP_SELF"] . "?error=2");
      exit;
  }
}


#handle delete appointment
if ($_SERVER["REQUEST_METHOD"] == "POST" && ($_POST["action"] ?? "") === "delete") {
  $id = $_POST["event_id"] ?? null;

  if ($id) {
    $statement = conn->prepare("DELETE FROM appointments WHERE id = ?");
    $statement->bind_param("i", $id);
    $statement->execute();
    $statement->close();
    header("Location: ". $_SERVER["PHP_SELF"] . "?success=3");
    exit;
  }
}


#success and error messages
if(isset($_GET["success"])) {
  $successMsg = match ($_GET["success"]) {
    "1" => "✅ Appointment added successfully",
    "2" => "✅ Appointment updated successfully",
    "3" => "🗑️ Appointment deleted successfully",
    default => ""
  };
}

if(isset($_GET["errpr"])) {
  $errorMsg = "Error occured. Please check your input";
}

// fetch all appointments and spread over date range
$result = $conn->query("SELECT * FROM appointments");

if($result && $result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $start = new DateTime($row["start_date"]);
    $end = new DateTime($row["end_date"]);

    while($start <= $end) {
      $eventsFromDB[] = [
        "id" => $row["id"],
        "title" => "{$row['course_name']} - {$row['instructor_name']}",
        "date" => $start->format("Y-m-d"),
        "start" => $row["start_date"],
        "end" => $row["end_date"],
        "start_time" => $row["start_time"],
        "end_time" => $row["end_time"]
      ];

      $start->modify("+1 day");
    }
  }
}

$conn->close();

?>