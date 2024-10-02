<template>
  <div class="editor-container">
    <h1>Editor de Preguntas</h1>
    <div v-if="questions.length === 0" class="no-questions">No hay preguntas disponibles.</div>
    
    <div v-for="(question, index) in questions" :key="index" class="question-card">
      <div class="question">
        <strong>{{ question.pregunta }}</strong>
        <img :src="question.imatge" alt="Pregunta Imagen" class="question-image" />
      </div>
      <ul class="respuesta-list">
        <li v-for="(respuesta, idx) in question.respostes" :key="idx" class="respuesta-item">
          {{ respuesta.resposta }}
          <span v-if="respuesta.correcta">(Correcta)</span>
          <span v-else>(Incorrecta)</span>
        </li>
      </ul>
      <div class="button-group">
        <button @click="editQuestion(index)" class="edit-button">Editar</button>
        <button @click="deleteQuestion(question.id)" class="delete-button">Eliminar</button>
      </div>
    </div>

    <!-- Sección para añadir o editar una pregunta -->
    <div class="add-question-section">
      <h2>{{ isEditing ? 'Editar Pregunta' : 'Añadir Nueva Pregunta' }}</h2>
      <input v-model="newQuestion.id" placeholder="ID" class="input-field" disabled v-if="isEditing"/>
      <input v-model="newQuestion.pregunta" placeholder="Pregunta" class="input-field" />
      <input v-model="newQuestion.imatge" placeholder="URL de Imagen" class="input-field" />
      
      <h3>Respuestas</h3>
      <div v-for="(respuesta, idx) in newQuestion.respostes" :key="idx" class="respuesta-container">
        <input v-model="respuesta.resposta" placeholder="Respuesta" class="input-field" />
        <span class="radio-group">
          <label>
            <input type="radio" v-model="respuesta.correcta" :value="true" /> Correcta
          </label>
          <label>
            <input type="radio" v-model="respuesta.correcta" :value="false" /> Incorrecta
          </label>
        </span>
      </div>
      <button @click="isEditing ? updateQuestion() : addQuestion()" class="add-button">
        {{ isEditing ? 'Actualizar Pregunta' : 'Añadir Pregunta' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [],
      isEditing: false,
      newQuestion: {
        id: null, // Agregado para manejar el ID
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
    await this.fetchQuestions();
  },
  methods: {
    async fetchQuestions() {
      try {
        const response = await fetch('http://localhost:3000/api/preguntes');
        const data = await response.json();
        this.questions = data || [];
      } catch (error) {
        console.error("Error al cargar las preguntas:", error);
      }
    },
    editQuestion(index) {
      this.newQuestion = { ...this.questions[index] };
      this.isEditing = true; // Cambiar a modo edición
    },
    async updateQuestion() {
      try {
        const response = await fetch(`http://localhost:3000/api/preguntes/${this.newQuestion.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.newQuestion),
        });

        if (response.ok) {
          this.resetForm(); // Reiniciar el formulario
          this.isEditing = false; // Salir del modo edición
          this.fetchQuestions(); // Recargar preguntas después de la actualización
        }
      } catch (error) {
        console.error("Error al actualizar la pregunta:", error);
      }
    },
    async deleteQuestion(id) {
      try {
        const response = await fetch(`http://localhost:3000/api/preguntes/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          this.fetchQuestions(); // Recargar preguntas después de eliminar
        }
      } catch (error) {
        console.error("Error al eliminar la pregunta:", error);
      }
    },
    resetForm() {
      this.newQuestion = {
        id: null,
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
    async addQuestion() {
      if (!this.newQuestion.pregunta || this.newQuestion.respostes.every(r => !r.resposta)) {
        alert("Por favor, complete la pregunta y al menos una respuesta.");
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/preguntes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.newQuestion),
        });

        if (response.ok) {
          this.resetForm(); // Reiniciar el formulario
          this.fetchQuestions(); // Recargar preguntas después de añadir
        }
      } catch (error) {
        console.error("Error al añadir la pregunta:", error);
      }
    },
  },
};
</script>

<style scoped>
.editor-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #121212; /* Color de fondo oscuro */
  color: #e0e0e0; /* Color de texto claro */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

h1, h2, h3 {
  text-align: center;
  color: #ffffff; /* Texto blanco para encabezados */
}

.no-questions {
  text-align: center;
  color: #ccc; /* Color más claro para el mensaje */
}

.question-card {
  background-color: #1e1e1e; /* Fondo de las tarjetas */
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #333; /* Borde oscuro */
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

.respuesta-item {
  display: flex; /* Utilizar flexbox para alinear los elementos */
  justify-content: space-between; /* Espacio entre el texto y las opciones */
  align-items: center; /* Centrar verticalmente */
  color: #e0e0e0; /* Color de texto claro */
}

.radio-group {
  display: flex; /* Mostrar opciones en línea */
  gap: 10px; /* Espacio entre los botones */
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
  background-color: #007bff; /* Color azul para editar */
  color: white;
  margin-right: 5px;
}

.delete-button {
  background-color: #dc3545; /* Color rojo para eliminar */
  color: white;
}

.add-question-section {
  margin-top: 20px;
  border: 1px solid #333; /* Borde oscuro */
  border-radius: 5px;
  padding: 20px;
  background-color: #1e1e1e; /* Fondo oscuro */
}

.input-field {
  width: calc(100% - 20px);
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #444; /* Borde más oscuro */
  border-radius: 5px;
  background-color: #333; /* Fondo de los campos de entrada */
  color: #e0e0e0; /* Texto claro en los campos de entrada */
}

.input-field::placeholder {
  color: #bbb; /* Color de placeholder */
}

.add-button {
  background-color: #4caf50; /* Color verde para añadir */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
