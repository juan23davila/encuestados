/*
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  agregarPregunta: function(pregunta, respuestas) {
      this.modelo.agregarPregunta(pregunta, respuestas);
  },
  borrarPregunta: function(idPregunta) {
    this.modelo.borrarPregunta(idPregunta);
  },
  editarPregunta: function(value, respuestas, idQuestion, posQuestion){
    this.modelo.editarPregunta(value, respuestas, idQuestion, posQuestion);
  },
  borrarTodo: function(){
    this.modelo.borrarTodasLasPreguntas();
  },
  reestablecerDataLocalStorage: function(pregsLocalStorage){
    this.modelo.reestablecerDataLocalStorage(pregsLocalStorage);
  },
  agregarVoto: function(nombrePregunta,respuestaSeleccionada){
    this.modelo.agregarRespuesta(nombrePregunta,respuestaSeleccionada);
  }
};
