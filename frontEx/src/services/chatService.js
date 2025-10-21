import axios from "axios";

const chatService = async (pregunta) => {
    try {
        const respuesta = await axios.post(
            "http://localhost:3000/api/v1/chatbot",
            { pregunta },
            { headers: { "Content-Type": "application/json" } }
        );
        console.log(respuesta.data.respuesta);
        return respuesta.data.respuesta
    } catch (err) {
        throw new Error(err.message);
    }
};

export default chatService;