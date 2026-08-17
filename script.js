document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("bookingForm");
const status = document.getElementById("formStatus");
const dateInput = form?.elements.date;
const submitButton = form?.querySelector('button[type="submit"]');

// Prevent selecting dates in the past.
if (dateInput) {
  const today = new Date();
  const isoToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  dateInput.min = isoToday;
}

function setStatus(message, type = "info") {
  status.textContent = message;
  status.dataset.type = type;
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Honeypot: silently ignore obvious bot submissions.
    if (form.elements._honey.value) return;

    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    payload._subject = `Bokningsförfrågan – ${payload.brand} ${payload.model} – ${payload.date}`;
    payload._template = "table";
    payload._captcha = "true";
    payload._url = window.location.href;
    payload._replyto = payload.email;
    payload._honey = "";

    submitButton.disabled = true;
    submitButton.textContent = "Skickar…";
    setStatus("Skickar din bokningsförfrågan…", "loading");

    try {
      const response = await fetch("https://formsubmit.co/ajax/keyelitesoultions@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Kunde inte skicka bokningen.");
      }

      form.reset();
      if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);
      setStatus("Tack! Din bokningsförfrågan är skickad. Vi kontaktar dig för att bekräfta tid och plats.", "success");
    } catch (error) {
      console.error(error);
      setStatus("Det gick inte att skicka just nu. Kontrollera din internetanslutning eller ring 070-088 55 28 så hjälper vi dig direkt.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Skicka bokningsförfrågan";
    }
  });
}
