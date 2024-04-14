/// Function to switch between sections
// function showSection(sectionId) {
//     const sections = document.querySelectorAll('div[id$="Translator"], div[id$="Section"]');
//     sections.forEach(section => {
//         if (section.id === sectionId) {
//             section.style.display = 'block';
//         } else {
//             section.style.display = 'none';
//         }
//     });
// }

// Function to translate text
function translate() {
    console.log("translate() function is called");
    const inputText = document.getElementById("textInput").value;
    const targetLanguage = document.getElementById("textTargetLanguage").value;

    fetch('http://localhost:3000/translate/text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: inputText,
            targetLanguage: targetLanguage
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("translatedText").innerText = data.translatedText;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to translate document
function translateDocument() {
    console.log("translateDocument() function is called");
    const file = document.getElementById("documentInput").files[0];
    const sourceLanguage = document.getElementById("documentSourceLanguage").value;
    const targetLanguage = document.getElementById("documentTargetLanguage").value;

    const formData = new FormData();
    formData.append('documentFile', file);
    formData.append('sourceLanguage', sourceLanguage);
    formData.append('targetLanguage', targetLanguage);

    fetch('http://localhost:4000/translate/document', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("translatedDocument").innerText = data.translatedDocument;
        const downloadLink = document.getElementById("downloadLink");
        downloadLink.href = URL.createObjectURL(new Blob([data.translatedDocument], {
            type: 'text/plain'
        }));
        downloadLink.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Call translation functions on page load
window.onload = function() {
    translate();
    translateDocument();
};

// Event listener for translation button
document.getElementById("translateButton").addEventListener("click", translate);
