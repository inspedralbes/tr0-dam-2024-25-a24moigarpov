<template>
  <div class="editor-container">
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

    <!-- Sección para añadir una nueva pregunta -->
    <div class="add-question-section">
      <h2>Añadir Nueva Pregunta</h2>
      <input v-model="newQuestion.pregunta" placeholder="Pregunta" class="input-field" />
      <input v-model="newQuestion.imatge" placeholder="URL de Imagen" class="input-field" />
      
      <h3>Respuestas</h3>
      <div v-for="(respuesta, idx) in newQuestion.respostes" :key="idx" class="respuesta-container">
        <input v-model="respuesta.resposta" placeholder="Respuesta" class="input-field" />
        <label>
          <input type="radio" v-model="respuesta.correcta" :value="true" /> Correcta
        </label>
        <label>
          <input type="radio" v-model="respuesta.correcta" :value="false" /> Incorrecta
        </label>
      </div>
      <button @click="addQuestion" class="add-button">Añadir Pregunta</button>
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
    addQuestion() {
      if (!this.newQuestion.pregunta || this.newQuestion.respostes.every(r => !r.resposta)) {
        alert("Por favor, complete la pregunta y al menos una respuesta.");
        return;
      }

      this.questions.push(this.newQuestion);
      this.resetForm(); // Reiniciar el formulario
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

.edit-button, .delete-button {
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button {
  background-color: #007bff;
  color: white;
  margin-right: 5px;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

.add-question-section {
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  background-color: #fff;
}

.input-field {
  width: calc(100% - 20px);
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.add-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
