document.addEventListener("DOMContentLoaded", () => {
  const questions = JSON.parse(localStorage.getItem("questions"));
  const form = document.getElementById("testForm");

  questions.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question-container";
    questionDiv.innerHTML = `<p>${question.Pregunta}</p>`;

    ["A", "B", "C", "D"].forEach((option) => {
      if (question[`Respuesta ${option}`]) {
        const label = document.createElement("label");
        label.className = "option-label";
        label.innerHTML = `
          <input type="radio" name="question${index}" value="${option}">
          ${question[`Respuesta ${option}`]}
        `;
        questionDiv.appendChild(label);
        questionDiv.appendChild(document.createElement("br"));
      }
    });

    form.appendChild(questionDiv);
  });

  document
    .getElementById("checkAnswers")
    .addEventListener("click", async (event) => {
      event.preventDefault();
      const answersFile = document.getElementById("answersUpload").files[0];
      if (!answersFile) {
        alert("Por favor, sube el archivo de respuestas.");
        return;
      }
      const answers = await getAnswersFromExcel(answersFile);
      checkAnswers(questions, answers);
    });
});

async function getAnswersFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const answers = XLSX.utils.sheet_to_json(sheet);
      resolve(answers);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

function checkAnswers(questions, answers) {
  const form = document.getElementById("testForm");
  const result = document.getElementById("result");
  let correctCount = 0;

  questions.forEach((question, index) => {
    const selectedOption = form[`question${index}`].value;
    const questionNumber = question.Pregunta.match(/^\d{1,3}/)[0];
    const correctAnswer = answers.find((answer) =>
      String(answer.Pregunta).startsWith(questionNumber)
    );

    const inputs = form.querySelectorAll(`input[name="question${index}"]`);
    inputs.forEach((input) => {
      const label = input.parentElement;

      if (correctAnswer) {
        const correctOption = correctAnswer["Respuesta Correcta"];

        // Marcar la respuesta correcta en verde
        if (input.value.toLowerCase() === correctOption.toLowerCase()) {
          label.style.color = "green";
        }

        // Si es la respuesta seleccionada y es incorrecta, marcarla en rojo
        if (
          input.checked &&
          input.value.toLowerCase() !== correctOption.toLowerCase()
        ) {
          label.style.color = "red";
        }

        // Contar respuesta correcta
        if (
          input.checked &&
          input.value.toLowerCase() === correctOption.toLowerCase()
        ) {
          correctCount++;
        }
      }
    });
  });

  result.textContent = `Respuestas correctas: ${correctCount} de ${questions.length}`;
}
