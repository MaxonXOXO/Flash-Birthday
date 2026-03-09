const SHEET_ID = "1uKnzzVcHxa5WoNkiODctUd28W7kA6xnATFNQ9O64fNc";
const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

async function loadBirthdays() {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    let birthdays = [];
    rows.forEach(row => {
        const date = row.c[0]?.v;
        const name = row.c[1]?.v;
        const branch = row.c[2]?.v;
        const image = row.c[3]?.v;
        birthdays.push({ date, name, branch, image });
    });

    filterToday(birthdays);
}

function filterToday(data) {
    // Get current date in YYYY/MM/DD to match your sheet
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}/${month}/${day}`;
    
    console.log("Searching for:", today); // Debug: Check what it's looking for

    const todaysBirthdays = data.filter(p => {
        // Ensure the date from the sheet is also a string
        const sheetDate = String(p.date).trim();
        return sheetDate === today;
    });

    console.log("Matches found:", todaysBirthdays); // Debug: See if it found anything
    display(todaysBirthdays);
}

function display(list) {
    if (!list || list.length === 0) {
        const template = document.getElementById("template");
        if (template) template.src = "templates/nobirthday.png";
        return;
    }

    let index = 0;

    function show() {
        const person = list[index];
        
        // Safety check: ensure person exists
        if (!person) return;

        const imgEl = document.getElementById("personImage");
        const nameEl = document.getElementById("personName");
        const branchEl = document.getElementById("personBranch");
        const templateEl = document.getElementById("template");

        // Update content only if elements exist
        if (imgEl) imgEl.src = "images/" + (person.image || "default.jpg");
        if (nameEl) nameEl.innerText = person.name || "N/A";
        if (branchEl) branchEl.innerText = person.branch || "";
        
        // Cycle templates 1, 2, and 3
        if (templateEl) {
            templateEl.src = "templates/template" + ((index % 3) + 1) + ".png";
        }
        
        index = (index + 1) % list.length;
    }

    show(); // Initial call
    setInterval(show, 10000); // Subsequent calls
}

loadBirthdays();