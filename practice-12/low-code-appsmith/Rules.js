// Appsmith JSObject "Rules" (low-code track, Practice #12)
// Formatted copy of the code that runs in Appsmith. In the Appsmith editor it was typed on one line.
// Same fictional data and same rule order as the code-based src/lib/availability.ts.
export default {
  NOW: 540, // fixed "now" = 09:00 (minutes after midnight)
  MAX: 120,
  rooms: [
    { id: "401", name: "Room 401 - AI Research Lab", blocked: false, bookings: [{ start: 540, end: 600 }] },
    { id: "402", name: "Room 402 - Conference Hall", blocked: false, bookings: [{ start: 600, end: 660 }] },
    { id: "403", name: "Room 403 - Study Pod", blocked: false, bookings: [{ start: 700, end: 760 }] },
    { id: "404", name: "Room 404 - Server Maintenance Hub", blocked: true, bookings: [] }
  ],
  parseTime (t) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(t || "").trim());
    if (!m) return NaN;
    const h = Number(m[1]); const mi = Number(m[2]);
    if (h > 23 || mi > 59) return NaN;
    return h * 60 + mi;
  },
  fmt (x) {
    return String(Math.floor(x / 60)).padStart(2, "0") + ":" + String(x % 60).padStart(2, "0");
  },
  check (roomId, startText, durationText) {
    const room = this.rooms.find(r => r.id === roomId);
    const start = this.parseTime(startText);
    const dStr = String(durationText ?? "").trim();
    const duration = Number(dStr);
    if (!room || isNaN(start) || dStr === "" || !Number.isInteger(duration))
      return { available: false, reasonCode: "INVALID_INPUT", message: "Choose a room, enter start as HH:MM and duration as whole minutes." }; // AC6
    if (start <= this.NOW)
      return { available: false, reasonCode: "PAST_START", message: "Start time must be later than now (" + this.fmt(this.NOW) + ")." }; // AC1
    if (duration <= 0)
      return { available: false, reasonCode: "DURATION_ZERO", message: "Duration must be greater than 0 minutes." }; // AC2
    if (duration > this.MAX)
      return { available: false, reasonCode: "DURATION_TOO_LONG", message: "Duration is " + duration + " min; maximum is 120 min." }; // AC2
    if (room.blocked)
      return { available: false, reasonCode: "ROOM_BLOCKED", message: room.name + " is blocked and cannot be booked." }; // AC4
    const end = start + duration;
    const hit = room.bookings.find(b => start < b.end && b.start < end); // AC3 (touching endpoints allowed)
    if (hit)
      return { available: false, reasonCode: "OVERLAP", message: "Overlaps existing booking " + this.fmt(hit.start) + "-" + this.fmt(hit.end) + "." };
    return { available: true, reasonCode: "OK", message: room.name + " is free " + this.fmt(start) + "-" + this.fmt(end) + " (" + duration + " min)." }; // AC5: read-only
  },
  runTests () {
    const before = JSON.stringify(this.rooms);
    const cases = [
      ["T1", "402", "12:00", "60", "OK"],
      ["T2", "402", "10:30", "30", "OVERLAP"],
      ["T3", "404", "12:00", "30", "ROOM_BLOCKED"],
      ["T4", "402", "12:00", "0", "DURATION_ZERO"],
      ["T5", "402", "12:00", "121", "DURATION_TOO_LONG"],
      ["T6", "402", "08:00", "30", "PAST_START"],
      ["T7", "402", "11:00", "30", "OK"]
    ];
    const out = cases.map(c => {
      const r = this.check(c[1], c[2], c[3]);
      return c[0] + ": " + (r.reasonCode === c[4] ? "PASS" : "FAIL") + " (expected " + c[4] + ", got " + r.reasonCode + ")";
    });
    out.push("T8: " + (JSON.stringify(this.rooms) === before ? "PASS" : "FAIL") + " (bookings unchanged)");
    return out;
  }
}
