
// ======================================
// KAYE & JOHN WEDDING INVITATION
// COUNTDOWN + RSVP SYSTEM
// ======================================

// SUPABASE CONNECTION
const SUPABASE_URL = "https://xypwetpywwxwnwplvtew.supabase.co";
const SUPABASE_KEY = "sb_publishable_XjxlObz5z3B-X7fH8dkweg_R4C-u51W";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ======================================
// WEDDING COUNTDOWN
// ======================================

const weddingDate = new Date(2035, 6, 23, 0, 0, 0).getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        console.error("Countdown elements not found.");
        return;
    }

    if (distance <= 0) {
        daysElement.textContent = "0";
        hoursElement.textContent = "0";
        minutesElement.textContent = "0";
        secondsElement.textContent = "0";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysElement.textContent = days;
    hoursElement.textContent = hours;
    minutesElement.textContent = minutes;
    secondsElement.textContent = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ======================================
// RSVP SYSTEM
// ======================================

const form = document.getElementById("rsvpForm");
const feedback = document.getElementById("rsvpFeedback");

console.log("Kaye & John RSVP script loaded.");

if (form && feedback) {
    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const name = document.getElementById("guestName").value.trim();
        const attendance = document.getElementById("attendance").value;
        const message = document.getElementById("message").value.trim();

        if (!name || !attendance) {
            feedback.textContent = "Please complete your name and attendance.";
            return;
        }

        feedback.textContent = "Sending RSVP...";

        try {
            const { error } = await supabaseClient
                .from("wedding_rsvps")
                .insert([
                    {
                        guest_name: name,
                        attendance: attendance,
                        message: message
                    }
                ]);

            if (error) {
                throw error;
            }

            feedback.textContent =
                `Thank you, ${name}! Your RSVP has been saved.`;

            form.reset();

        } catch (error) {
            console.error("RSVP ERROR:", error);
            feedback.textContent = "RSVP NOT SAVED: " + error.message;
        }
    });
} else {
    console.error("RSVP form or feedback element missing.");
}
