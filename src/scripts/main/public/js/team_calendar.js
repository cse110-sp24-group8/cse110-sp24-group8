document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let notes = {};
  
    /**
     * Displays the calendar for a specific month and year.
     * @param {number} month - The month to display (0-11).
     * @param {number} year - The year to display.
     */
    function displayCalendar(month, year) {
        let firstDay = new Date(year, month, 1);
        let daysInMonth = new Date(year, month + 1, 0).getDate();
        let startingDay = firstDay.getDay();
        let calendarBody = document.getElementById("calendarBody");
        calendarBody.innerHTML = '';
  
        /* Update the month and year display */
        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
        document.getElementById("current_month").textContent = `${monthNames[month]} ${year}`;
        /* Logic to render to correct date format */
        let date = 1;
        for (let i = 0; i < 6; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < 7; j++) {
                let cell = document.createElement("td");
                if (i === 0 && j < startingDay) {
                    row.appendChild(cell);
                } else if (date > daysInMonth) {
                    row.appendChild(cell);
                } else {
                    cell.textContent = date;
                    cell.dataset.date = `${year}-${month + 1}-${date}`;
                    cell.addEventListener("click", function() {
                        let key = this.dataset.date;
                        if (notes[key] !== undefined) {
                            alert(notes[key]);
                        } else {
                            let inputText = prompt("Please enter the text:");
                            if (inputText !== null) {
                                notes[key] = inputText;
                            }
                        }
                    });
                    row.appendChild(cell);
                    date++;
                }
            }
            calendarBody.appendChild(row);
        }
    }
  
    /* Display the calendar for the current month and year when the page loads */
    displayCalendar(currentMonth, currentYear);
  
    /**
     * Displays the previous month when the "prev_month" button is clicked.
     */
    document.getElementById("prev_month").addEventListener("click", function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        displayCalendar(currentMonth, currentYear);
    });
  
    /**
     * Displays the next month when the "next_month" button is clicked.
     */
    document.getElementById("next_month").addEventListener("click", function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        displayCalendar(currentMonth, currentYear);
    });
  });
  