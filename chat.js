// chat.js

document.getElementById("send-btn").addEventListener("click", async function() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    // Adicionar a mensagem do usuário ao chat-box
    const chatBox = document.getElementById("chat-box");
    const userMessage = document.createElement("p");
    userMessage.innerText = "Você: " + userInput;
    chatBox.appendChild(userMessage);

    document.getElementById("user-input").value = ""; // Limpa o campo de entrada

    try {
        const response = await fetch("https://api.generativeai.googleapis.com/v1beta2/models/gemini-1.0-pro:generateMessage", {
            method: "POST",
            headers: {
                "Authorization": `Bearer YOUR_API_KEY`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: userInput,
                temperature: 0.9,
                maxOutputTokens: 2048
            })
        });

        if (!response.ok) throw new Error("Erro na resposta da API");

        const data = await response.json();
        const aiResponse = data.candidates[0].message;

        const botMessage = document.createElement("p");
        botMessage.innerText = "AI: " + aiResponse;
        botMessage.style.color = "blue";
        chatBox.appendChild(botMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        const errorMessage = document.createElement("p");
        errorMessage.innerText = "Erro ao conectar com o servidor.";
        errorMessage.style.color = "red";
        chatBox.appendChild(errorMessage);
    }
});
