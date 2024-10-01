<template>
  <div class="editor-container">
    <button @click="resetForm" class="add-button">Añadir Pregunta</button>
    <h1>Editor de Preguntas</h1>
    <div v-if="questions.length === 0">No hay preguntas disponibles.</div>
    <div v-for="(question, index) in questions" :key="index" class="question-card">
      <div class="question">
        <strong>{{ question.pregunta }}</strong>
        <img :src="question.imatge" alt="Pregunta Imagen" class="question-image" />
      </div>
      <ul class="respuesta-list">
        <li v-for="(respuesta, idx) in question.respostes" :key="idx">
          {{ respuesta.resposta }} <span v-if="respuesta.correcta">(Correcta)</span>
        </li>
      </ul>
      <div class="button-group">
        <button @click="editQuestion(index)" class="edit-button">Editar</button>
        <button @click="deleteQuestion(index)" class="delete-button">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [],
      newQuestion: {
        pregunta: '',
        imatge: '',
        respostes: [
          { resposta: '', correcta: false },
          { resposta: '', correcta: false },
          { resposta: '', correcta: false },
          { resposta: '', correcta: false },
        ],
      },
    };
  },
  async mounted() {
    try {
      // Cambia la ruta a la de tu archivo JSON
      const response = await import('C:/Users/Argo/tr0-dam-2024-25-a24moigarpov/back/preguntas.json');
      this.questions = response.preguntes || []; // Asegúrate de usar 'preguntes' aquí
    } catch (error) {
      console.error("Error al cargar el JSON:", error);
    }
  },
  methods: {
    editQuestion(index) {
      this.newQuestion = { ...this.questions[index] };
      this.questions.splice(index, 1);
    },
    deleteQuestion(index) {
      this.questions.splice(index, 1);
    },
    resetForm() {
      this.newQuestion = {
        pregunta: '',
        imatge: '',
        respostes: [
          { resposta: '', correcta: false },
          { resposta: '', correcta: false },
          { resposta: '', correcta: false },
          { resposta: '', correcta: false },
        ],
      };
    },
  },
};
</script>

<style scoped>
.editor-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
}

.add-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  float: right;
  margin-bottom: 20px;
}

.question-card {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.question-image {
  max-width: 100%;
  height: auto;
}

.respuesta-list {
  list-style-type: none;
  padding: 0;
}

.button-group {
  margin-top: 10px;
}

.edit-button {
  background-color: #007bff;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}

.delete-button {
  background-color: #dc3545;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
