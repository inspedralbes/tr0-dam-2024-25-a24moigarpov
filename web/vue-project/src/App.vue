<template>
  <div class="editor-container">
    <h1>Editor de Preguntas</h1>
    <div v-if="questions.length === 0" class="no-questions">No hay preguntas disponibles.</div>
    
    <!-- Mostrar preguntas existentes -->
    <div v-for="(question, index) in questions" :key="question.id" class="question-card">
      <div class="question">
        <strong>{{ question.pregunta }}</strong>
        <img :src="question.imatge" alt="Pregunta Imagen" class="question-image" />
      </div>
      <ul class="respuesta-list">
        <li v-for="(respuesta, idx) in question.respostes" :key="respuesta.id" class="respuesta-item">
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
      <input v-model="newQuestion.pregunta" placeholder="Pregunta" class="input-field" />
      <input v-model="newQuestion.imatge" placeholder="URL de Imagen" class="input-field" />
      
      <h3>Respuestas</h3>
      <div v-for="(respuesta, idx) in newQuestion.respostes" :key="respuesta.id" class="respuesta-container">
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
      questions: [], // Lista de preguntas
      isEditing: false, // Estado de edición
      newQuestion: {
        pregunta: '',
        imatge: '',
        respostes: [
          { id: 1, resposta: '', correcta: false },
          { id: 2, resposta: '', correcta: false },
          { id: 3, resposta: '', correcta: false },
          { id: 4, resposta: '', correcta: false },
        ],
      },
    };
  },
  async mounted() {
    await this.fetchQuestions(); // Cargar preguntas al inicio
  },
  methods: {
    async fetchQuestions() {
      try {
        const response = await fetch('http://a24moigarpov.dam.inspedralbes.cat:25555/api/preguntes');
        this.questions = await response.json() || [];
      } catch (error) {
        console.error("Error al cargar las preguntas:", error);
      }
    },
    editQuestion(index) {
      this.newQuestion = { ...this.questions[index] }; // Cargar la pregunta seleccionada para editar
      this.isEditing = true; // Activar modo de edición
    },
    async updateQuestion() {
      try {
        await fetch(`http://a24moigarpov.dam.inspedralbes.cat:25555/api/preguntes/${this.newQuestion.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.newQuestion),
        });
        this.resetForm();
        this.isEditing = false; // Desactivar modo de edición
        await this.fetchQuestions(); // Recargar preguntas
      } catch (error) {
        console.error("Error al actualizar la pregunta:", error);
      }
    },
    async deleteQuestion(id) {
      try {
        await fetch(`http://a24moigarpov.dam.inspedralbes.cat:25555/api/preguntes/${id}`, { method: 'DELETE' });
        await this.fetchQuestions(); // Recargar preguntas
      } catch (error) {
        console.error("Error al eliminar la pregunta:", error);
      }
    },
    resetForm() {
      this.newQuestion = {
        pregunta: '',
        imatge: '',
        respostes: [
          { id: 1, resposta: '', correcta: false },
          { id: 2, resposta: '', correcta: false },
          { id: 3, resposta: '', correcta: false },
          { id: 4, resposta: '', correcta: false },
        ],
      };
    },
    async addQuestion() {
      if (!this.newQuestion.pregunta || this.newQuestion.respostes.every(r => !r.resposta)) {
        alert("Por favor, complete la pregunta y al menos una respuesta.");
        return;
      }

      // Obtener el ID máximo actual
      const maxId = this.questions.length > 0 
        ? Math.max(...this.questions.map(q => q.id)) 
        : 0; // Si no hay preguntas, comenzar desde 0

      // Asignar un nuevo ID
      this.newQuestion.id = maxId + 1;

      // Asignar ID a cada respuesta
      this.newQuestion.respostes.forEach((respuesta, idx) => {
        respuesta.id = idx + 1; // Asignar un ID único a cada respuesta
      });

      try {
        await fetch('http://a24moigarpov.dam.inspedralbes.cat:25555/api/preguntes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.newQuestion),
        });
        this.resetForm(); // Reiniciar formulario
        await this.fetchQuestions(); // Recargar preguntas
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
  width: 100%; /* Ajusta el ancho al 100% del contenedor */
  height: 400px; /* Establece una altura fija para las imágenes */
  object-fit: cover; /* Asegura que la imagen cubra el área sin distorsionar */
}

.respuesta-list {
  list-style-type: none; /* Quitar puntos de lista */
  padding: 0;
}

.respuesta-item {
  color: #e0e0e0; /* Color de texto claro */
}

.button-group {
  margin-top: 10px; /* Espacio superior para botones */
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
  margin-right: 5px; /* Espacio entre botones */
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

.add-button {
  background-color: #4caf50; /* Color verde para añadir */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px; /* Espacio superior para el botón */
}

.radio-group {
  display: flex; /* Mostrar opciones en línea */
  gap: 10px; /* Espacio entre las opciones */
  align-items: center; /* Alinear verticalmente */
}
</style>
