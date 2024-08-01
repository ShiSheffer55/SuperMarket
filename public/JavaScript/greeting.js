// פונקציה לחישוב הברכה המתאימה לפי השעה
function getGreetingMessage(name) {
    const now = new Date();
    const hours = now.getHours();
    let greeting;

    if (hours >= 0 && hours < 6) {
        greeting = 'לילה טוב';
    } else if (hours >= 6 && hours < 12) {
        greeting = 'בוקר טוב';
    } else if (hours >= 12 && hours < 17) {
        greeting = 'צהריים טובים';
    } else if (hours >= 17 && hours < 19) {
        greeting = 'אחר צהריים טובים';
    } else {
        greeting = 'ערב טוב';
    }

    return `!${greeting}, ${name}`;
}

// הפעלת הפונקציה בעת טעינת הדף
window.onload = function() {
    const userName = 'משתמש'; // שים כאן את השם של המשתמש אם הוא ידוע
    const greetingMessage = getGreetingMessage(userName);
    document.getElementById('greeting').innerText = greetingMessage;
};
