document.getElementById("processFiles").addEventListener("click", async () => {
  const questionsFile = document.getElementById("questionsUpload").files[0];
  const answersFile = document.getElementById("answersUpload").files[0];

  if (!questionsFile || !answersFile) {
    alert("Por favor, sube ambos archivos de preguntas y respuestas.");
    return;
  }

  const themes = await getThemesFromExcel(questionsFile);
  displayThemes(themes);
});

async function getThemesFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetNames = workbook.SheetNames;
      resolve(sheetNames);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

function displayThemes(themes) {
  const temaList = document.getElementById("temaList");
  temaList.innerHTML = "";
  themes.forEach((theme) => {
    const li = document.createElement("button");
    li.textContent = theme;
    li.addEventListener("click", () => displayQuestionButtons(theme));
    temaList.appendChild(li);
  });
}

async function displayQuestionButtons(theme) {
  const questionsFile = document.getElementById("questionsUpload").files[0];
  const questions = await getQuestionsFromExcel(questionsFile, theme);
  const buttonContainer = document.getElementById("output");
  buttonContainer.innerHTML = "";

  const totalQuestions = questions.length;
  for (let i = 0; i < totalQuestions; i += 20) {
    const start = i + 1;
    const end = Math.min(i + 20, totalQuestions);
    const button = document.createElement("button");
    button.textContent = `Preguntas ${start}-${end}`;
    button.addEventListener("click", () => {
      localStorage.setItem(
        "questions",
        JSON.stringify(questions.slice(i, end))
      );
      window.location.href = "test.html";
    });
    buttonContainer.appendChild(button);
  }
}

async function getQuestionsFromExcel(file, sheetName) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[sheetName];
      const questions = XLSX.utils.sheet_to_json(sheet);
      resolve(questions);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
