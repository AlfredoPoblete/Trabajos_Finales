document.addEventListener('DOMContentLoaded', () => {
    const mensajeInput = document.getElementById('mensaje');
    const enviarBoton = document.getElementById('enviarMensaje');
    const chatOutput = document.getElementById('chat-output');

    function agregarMensaje(texto, clase, esHTML = false) {
    const div = document.createElement('div');
    div.className = clase;
    if (esHTML) {
        div.innerHTML = texto;
    } else {
        div.textContent = texto;
    }
    chatOutput.appendChild(div);
    chatOutput.scrollTop = chatOutput.scrollHeight;
    }   

    enviarBoton.addEventListener('click', async () => {
        const mensaje = mensajeInput.value;
        if (mensaje.trim() === '') {
            alert('Por favor, escribe un mensaje.');
            return;
        }

        // Mostrar el mensaje del usuario en el chat
        agregarMensaje(`Tú: ${mensaje}`, 'usuario');
        mensajeInput.value = ''; // Limpiar el input

        try {
            // Enviar el mensaje al servidor Flask
            const response = await fetch('http://127.0.0.1:5000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mensaje: mensaje })
            });

            const data = await response.json();

            if (response.ok) {
                // Mostrar la respuesta del chatbot
                agregarMensaje(`Asistente: ${data.respuesta}`, 'asistente', true);
            } else {
                // Manejar errores
                agregarMensaje(`Error: ${data.error}`, 'asistente');
            }

        } catch (error) {
            console.error('Error:', error);
            agregarMensaje('Error: No se pudo conectar con el servidor.', 'asistente');
        }
    });
});