// ---- Задание 2: кнопка ----
document.getElementById("btn").addEventListener("click", function () {
  console.log("Кнопка нажата");
  document.getElementById("text").textContent = "Текст изменён после нажатия кнопки!";
});

// ---- Задание 3: данные из Google Таблицы ----
const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGXOfiDiyisngHCB3s5uEd7YJA0FDO_MkoQi8Qw_BH3a-FJJzEoC9jR-cpXzhItco3fRZ5tNFImzjJ/pub?gid=0&single=true&output=csv";

// исправлено: ИИ делал split(",") и ломал строки, где внутри названия есть запятая
// в кавычках (например "Война и мир, том 1"), поэтому я написал разбор строки CSV
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function loadBooks() {
  const container = document.getElementById("books");
  try {
    const response = await fetch(url);

    // исправлено: ИИ не проверял response.ok, поэтому при неверной ссылке
    // ошибка не обрабатывалась и на странице оставалось "Загрузка..."
    if (!response.ok) {
      throw new Error("Ошибка загрузки: " + response.status);
    }

    const text = await response.text();

    // исправлено: split("\n") оставлял символ \r в последней колонке и пустые строки
    // в конце, теперь учитываю \r\n и отфильтровываю пустые строки
    const rows = text
      .split(/\r?\n/)
      .filter(line => line.trim() !== "")
      .map(parseCSVLine);

    // исправлено: добавлена проверка, что в таблице вообще есть данные
    if (rows.length < 2) {
      throw new Error("В таблице нет данных");
    }

    // исправлено: ИИ вставлял данные через innerHTML, что небезопасно (можно внедрить HTML),
    // поэтому я строю таблицу через createElement и textContent
    const table = document.createElement("table");
    table.border = "1";
    table.cellPadding = "6";

    // исправлено: заголовки берутся из первой строки таблицы, а не прописаны вручную
    const headerRow = document.createElement("tr");
    rows[0].forEach(title => {
      const th = document.createElement("th");
      th.textContent = title;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    rows.slice(1).forEach(row => {
      const tr = document.createElement("tr");
      row.forEach(cell => {
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    container.innerHTML = "";
    container.appendChild(table);
  } catch (error) {
    // исправлено: добавлен try/catch и понятное сообщение для пользователя
    console.error(error);
    container.textContent = "Не удалось загрузить данные. Проверьте ссылку на таблицу.";
  }
}

loadBooks();