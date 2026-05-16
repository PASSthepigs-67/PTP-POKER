const date = new Date();
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let daycount = date.getDate();
let day = days[date.getDay()];
let month = months[date.getMonth()];
let year = date.getFullYear();
let dateDisplay = document.querySelector('.displayDate');

function displayDate(){
    dateDisplay.innerHTML = `${day}, ${daycount} ${month}, ${year}`;
};

function displayTime(){

    const hrs = date.getHours().toString().padStart(2, 0);
    const mins = date.getMinutes().toString().padStart(2, 0);
    const secs = date.getSeconds().toString().padStart(2, 0);
    const timeString = `${hrs} : ${mins} : ${secs}`;
    document.getElementById('clock').textContent = timeString;
};

displayTime();
displayDate();

