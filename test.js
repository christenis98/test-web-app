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

  document.getElementById("checkAnswers").addEventListener("click", (event) => {
    event.preventDefault();
    checkAnswers(questions);
  });
});

function checkAnswers(questions) {
  const form = document.getElementById("testForm");
  const result = document.getElementById("result");
  let correctCount = 0;

  questions.forEach((question, index) => {
    const selectedOption = form[`question${index}`].value;
    if (selectedOption === question.Correcta) {
      correctCount++;
    }
  });

  result.textContent = `Respuestas correctas: ${correctCount} de ${questions.length}`;
}
