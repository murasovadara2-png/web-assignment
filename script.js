document.getElementById("btn").addEventListener("click", function () {
  console.log("Кнопка нажата");
  document.getElementById("text").textContent = "Текст изменён после нажатия кнопки!";
});