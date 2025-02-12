document.addEventListener("DOMContentLoaded", () => {
  const questions = JSON.parse(localStorage.getItem("questions"));
  const form = document.getElementById("testForm");

  questions.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.innerHTML = `<p>${question.Pregunta}</p>`;

    ["A", "B", "C", "D"].forEach((option) => {
      if (question[`Respuesta ${option}`]) {
        const label = document.createElement("label");
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
    const selectedInput = form[`question${index}`].value;
    const questionNumber = question.Pregunta.match(/^\d{1,3}/)[0];
    const correctAnswer = answers.find((answer) =>
      answer.Pregunta.startsWith(questionNumber)
    );

    const inputs = form.querySelectorAll(`input[name="question${index}"]`);
    inputs.forEach((input) => {
      const label = input.parentElement; // Obtener el elemento padre que contiene el input y el texto
      label.style.color = ""; // Reset color

      if (correctAnswer) {
        const correctOption = correctAnswer["Respuesta Correcta"].toLowerCase();
        const labelText = label.textContent.trim();
        const selectedOption = labelText.charAt(0).toLowerCase(); // Obtener la primera letra del contenido de la etiqueta

        if (input.checked) {
          if (selectedOption === correctOption) {
            label.style.color = "green";
            correctCount++;
          } else {
            label.style.color = "red";
          }
        }
      }
    });
  });

  result.textContent = `Respuestas correctas: ${correctCount} de ${questions.length}`;
}
