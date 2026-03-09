const SHEET_ID = "1uKnzzVcHxa5WoNkiODctUd28W7kA6xnATFNQ9O64fNc";

const url =
`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

async function loadBirthdays(){

const res = await fetch(url);
const text = await res.text();

const json = JSON.parse(text.substring(47).slice(0,-2));

const rows = json.table.rows;

let birthdays = [];

rows.forEach(row => {

const date = row.c[0]?.v;
const name = row.c[1]?.v;
const branch = row.c[2]?.v;
const image = row.c[3]?.v;

birthdays.push({date,name,branch,image});

});

filterToday(birthdays);

}

function filterToday(data){

const today = new Date().toISOString().slice(0,10);

const todaysBirthdays =
data.filter(p => p.date === today);

display(todaysBirthdays);

}

function display(list){

if(list.length === 0){

document.getElementById("template").src =
"templates/nobirthday.png";

return;

}

let index = 0;

function show(){

const person = list[index];

document.getElementById("personImage").src =
"images/" + person.image;

document.getElementById("personName").innerText =
person.name;

document.getElementById("personBranch").innerText =
person.branch;

document.getElementById("template").src =
"templates/template" + ((index % 3) + 1) + ".png";

index = (index + 1) % list.length;

}

show();
setInterval(show,10000);

}

loadBirthdays();