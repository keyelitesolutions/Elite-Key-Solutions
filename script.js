document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("bookingForm");
const status = document.getElementById("formStatus");
const dateInput = form.elements.date;

// Prevent selecting dates in the past.
const today = new Date();
const isoToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
dateInput.min = isoToday;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const subject = `Bokningsförfrågan – ${data.get("brand")} ${data.get("model")} – ${data.get("date")}`;
  const body = [
    "NY BOKNINGSFÖRFRÅGAN – ELITE KEY SOLUTIONS",
    "",
    `Namn: ${data.get("name")}`,
    `Telefon: ${data.get("phone")}`,
    `E-post: ${data.get("email") || "Ej angiven"}`,
    `Bilmärke: ${data.get("brand")}`,
    `Modell: ${data.get("model")}`,
    `Årsmodell: ${data.get("year") || "Ej angiven"}`,
    `Tjänst: ${data.get("service")}`,
    `Önskat datum: ${data.get("date")}`,
    `Önskad tid: ${data.get("time")}`,
    `Mötesplats: ${data.get("location")}`,
    "",
    "Övrig information:",
    data.get("message") || "Ingen extra information.",
    "",
    "OBS: Kunden har informerats om att tiden måste bekräftas manuellt."
  ].join("\n");

  const mailto = `mailto:keyelitesoultions@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;

  status.textContent = "Din e-postapp öppnas med bokningsförfrågan. Skicka meddelandet så kontaktar vi dig för bekräftelse.";
});
