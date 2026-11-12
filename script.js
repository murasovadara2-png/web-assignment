document.getElementById("btn").addEventListener("click", function () {
  console.log("Кнопка нажата");
  document.getElementById("text").textContent = "Текст изменён после нажатия кнопки!";
});
const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGXOfiDiyisngHCB3s5uEd7YJA0FDO_MkoQi8Qw_BH3a-FJJzEoC9jR-cpXzhItco3fRZ5tNFImzjJ/pub?gid=0&single=true&output=csv";

fetch(url)
  .then(response => response.text())
  .then(text => {
    const rows = text.split("\n").map(row => row.split(","));

    let html = "<table border='1'><tr><th>Название</th><th>Автор</th><th>Год</th></tr>";
    for (let i = 1; i < rows.length; i++) {
      html += `<tr><td>${rows[i][0]}</td><td>${rows[i][1]}</td><td>${rows[i][2]}</td></tr>`;
    }
    html += "</table>";

    document.getElementById("books").innerHTML = html;
  });