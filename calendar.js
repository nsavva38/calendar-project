const calendarEL = document.querySelector("#calendar");
const monthYearEL = document.querySelector("#monthYear");
const modalEL = document.querySelector("#eventModal");
let currentDate = new Date();

const renderCalendar = (date = new Date()) => {
  calendarEL.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();

  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // display month and year
  monthYearEL.textContent = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekDays.forEach(day => {
    const dayEL = document.createElement("div");
    dayEL.className = "day-name";
    dayEL.textContent = day;
    calendarEL.appendChild(dayEL);
  });

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarEL.appendChild(document.createElement("div"));
  }

  // loop through days
  for (let day = 1; day <= totalDays; day++) {
    const dateString = `${year}-${String(month+1).padStart(2, "0")}-${String(day).padStart(2, "0")}}`;

    const cell = document.createElement("div");
    cell.className = "day";

    if (day === today.getDate() && month === today.getMonth() && year ===today.getFullYear()) {
      cell.classList.add("today");
    }

    const dateEL = document.createElement("div");

    dateEL.className = "date-number";
    dateEL.textContent = day;
    cell.appendChild(dateEL);

    const eventToday = events.filter(e => e.date === dateString);
    const eventBox = document.createElement("div");
    eventBox.className = "events";

    // render events
    eventToday.forEach(event => {
      const ev = document.createElement("div");
      ev.className = "event";

      const courseEL = document.createElement("div");
      courseEL.className = "course";
      courseEL.textContent = event.title.split(" - ")[0];

      const instructorEL = document.createElement("div");

      instructorEL.className = "instructor";
      instructorEL.textContent = "🧑🏼‍🏫" + event.title.split(" - ")[1];

      const timeEL = document.createElement("div");
      timeEL.className = "time";
      timeEL.textContent = "⏰" + event.start_time + " - " + event.end_time;

      ev.appendChild(courseEL);
      ev.appendChild(instructorEL);
      ev.appendChild(timeEL);
      eventBox.appendChild(ev);
    });

    // overlay buttons
    const overlay = document.createElement("div");
    overlay.className = "day-overlay";

    const addBtn = document.createElement("button");
    addBtn.className = "overlay-btn";
    addBtn.textContent = "+ Add";
    addBtn.onclick = event => {
      event.stopPropagation();
      openModalForAdd(dateString);
    };

    overlay.appendChild(addBtn);

    if (eventToday.length > 0) {
      const editBtn = document.createElement("button");
      editBtn.className = "overlay-btn";
      editBtn.textContent = "Edit";
      editBtn.onclick = event => {
        event.stopPropagation();
        openModalForEdit(eventToday);
      };

      overlay.appendChild(editBtn);
    }

    cell.appendChild(overlay);
    cell.appendChild(eventBox);
    calendarEL.appendChild(cell);
  }
}


// add event modal

const openModalForAdd = (dateString) => {
  document.querySelector("#formAction").value = "add";
  document.querySelector("#eventID").value = "";
  document.querySelector("#deleteEventID").value = "";
  document.querySelector("#courseName").value = "";
  document.querySelector("#instructorName").value = "";
  document.querySelector("#startDate").value = dateString;
  document.querySelector("#endDate").value = dateString;
  document.querySelector("#startTime").value = "09:00";
  document.querySelector("#endTime").value = "10:00";


  const selector = document.querySelector("#eventSelector");
  const wrapper = document.querySelector("#eventSelectorWrapper");

  if(selector && wrapper) {
    selector.innerHTML = "";
    wrapper.style.display = "none";
  }

  modalEL.style.display = "flex";

}


// edit event modal

const openModalForEdit = (eventsOnDate) => {
  document.querySelector("#formAction").value = "edit";
  modalEL.style.display = "flex";

  const selector = document.querySelector("#eventSelector");
  const wrapper = document.querySelector("#eventSelectorWrapper");
  selector.innerHTML = "<option disabled selected>Choose event../</option>";

  eventsOnDate.forEach(event => {
    const option = document.createElement("option");
    option.value = JSON.stringify(event);
    option.textContent = `${event.title} (${event.start} ➡️ ${event.end})`;
    selector.appendChild(option);
  });


  if(eventsOnDate.length > 1) {
    wrapper.style.display = "block";
  } else {
    wrapper.style.display = "none";
  }

  handleEventSelection(JSON.stringify(eventsOnDate[0])); 
}

// populate form from selected event
const handleEventSelection = (eventJSON) => {
  const event = JSON.parse(eventJSON);
  
  document.querySelector("#eventID").value = event.id;
  document.querySelector("#deleteEventID").value = event.id;

  const [course, instructor] = event.title.split(" - ").map(ev => ev.trim());
  document.querySelector("#courseName").value = course || "";
  document.querySelector("#instructorName").value = instructor || "";
  document.querySelector("#startDate").value = event.start || "";
  document.querySelector("#endDate").value = event.end || "";
  document.querySelector("#startTime").value = event.start_time || "";
  document.querySelector("#endTime").value = event.end_time || "";


}

const closeModal = () => {
  modalEL.style.display = "none";
}

// month navigation
const changeMonth = (offset) => {
  currentDate.setMonth(currentDate.getMonth() + offset);
  renderCalendar(currentDate);
}

// live digital clock

const updateClock = () => {
  const now = new Date();
  const clock = document.querySelector("#clock");
  clock.textContent = [
    now.getHours().toString().padStart(2, "0"),
    now.getMinutes().toString().padStart(2, "0"),
    now.getSeconds().toString().padStart(2, "0")
  ].join(":");
}

// initialize
renderCalendar(currentDate);
updateClock(); // invoke function update clock
setInterval(updateClock, 1000);