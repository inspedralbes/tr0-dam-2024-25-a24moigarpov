<template>
  <div class="editor-container">
    <h1>Editor de Preguntas</h1>
    <div v-if="questions.length === 0">No hay preguntas disponibles.</div>
    
    <div v-for="(question, index) in questions" :key="question.id" class="question-card">
      <div class="question">
        <strong>{{ question.pregunta }}</strong>
        <img :src="question.imatge" alt="Pregunta Imagen" class="question-image" />
      </div>
      <ul class="respuesta-list">
        <li v-for="(respuesta, idx) in question.respostes" :key="idx">
          {{ respuesta.resposta }}
          <span v-if="respuesta.correcta" class="correct-label">(Correcta)</span>
        </li>
      </ul>
      <div class="button-group">
        <button @click="editQuestion(question.id)" class="edit-button">Editar</button>
        <button @click="deleteQuestion(question.id, index)" class="delete-button">Eliminar</button>
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
        <label class="respuesta-label">
          <input type="radio" v-model="respuesta.correcta" :value="true" /> Correcta
        </label>
        <label class="respuesta-label">
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
          { respuesta: '', correcta: false },
          { respuesta: '', correcta: false },
          { respuesta: '', correcta: false },
          { respuesta: '', correcta: false },
        ],
      },
      editing: false,
      editingId: null,
    };
  },
  async mounted() {
    await this.loadQuestions();
  },
  methods: {
    async loadQuestions() {
      try {
        const response = await fetch('/api/preguntas');
        if (!response.ok) throw new Error('Error al cargar preguntas');
        const data = await response.json();
        this.questions = data.preguntes || [];
      } catch (error) {
        console.error("Error al cargar el JSON:", error);
      }
    },
    async deleteQuestion(id, index) {
      try {
        const response = await fetch(`/api/preguntas/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar la pregunta');
        this.questions.splice(index, 1); // Eliminar de la lista en la interfaz
      } catch (error) {
        console.error("Error al eliminar la pregunta:", error);
      }
    },
    async editQuestion(id) {
      const questionToEdit = this.questions.find(q => q.id === id);
      if (questionToEdit) {
        this.newQuestion = { ...questionToEdit };
        this.editing = true;
        this.editingId = id;
      }
    },
    async updateQuestion() {
      try {
        const response = await fetch(`/api/preguntas/${this.editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newQuestion)
        });

        if (!response.ok) throw new Error('Error al actualizar la pregunta');
        await this.loadQuestions(); // Recargar preguntas
        this.resetForm();
      } catch (error) {
        console.error("Error al actualizar la pregunta:", error);
      }
    },
    async addQuestion() {
      if (!this.newQuestion.pregunta || this.newQuestion.respostes.every(r => !r.respuesta)) {
        alert("Por favor, complete la pregunta y al menos una respuesta.");
        return;
      }

      try {
        const response = await fetch('/api/preguntas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newQuestion)
        });

        if (!response.ok) throw new Error('Error al agregar la pregunta');
        await this.loadQuestions(); // Recargar preguntas
        this.resetForm(); // Reiniciar el formulario
      } catch (error) {
        console.error("Error al agregar la pregunta:", error);
      }
    },
    resetForm() {
      this.newQuestion = {
        pregunta: '',
        imatge: '',
        respostes: [
          { respuesta: '', correcta: false },
          { respuesta: '', correcta: false },
          { respuesta: '', correcta: false },
          { respuesta: '', correcta: false },
        ],
      };
      this.editing = false;
      this.editingId = null;
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

.respuesta-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.respuesta-label {
  margin-left: 10px; /* Espacio entre respuesta y etiquetas de correcta/incorrecta */
}

.correct-label {
  margin-left: 10px; /* Espacio entre respuesta y etiqueta de correcta */
  color: green;
}
</style>
