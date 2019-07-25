/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.preguntasBorradas = new Evento(this);
  this.preguntasRestablecidas = new Evento(this);
  this.respuestaAgregada = new Evento(this);
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    let idMasAlto = 0;

    // Se valida si ya existen respuestas
    if(this.preguntas.length === 0){
      return idMasAlto;
    }else{
      this.preguntas.forEach(function(pregunta){
        if(pregunta.id > idMasAlto){
          idMasAlto = pregunta.id;
        }
      });
    }
    return idMasAlto;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();
  },

  borrarPregunta: function(idPregunta) {
    let preguntasMenosUno = this.preguntas.filter((pregunta)=>{
      return pregunta.id !== idPregunta
    })

    this.preguntas = preguntasMenosUno;
    this.guardar();
    this.preguntaEliminada.notificar();
  },

  editarPregunta: function(nombre, respuestas, idQuestion, posQuestion){
    var nuevaPregunta = {'textoPregunta': nombre, 'id': idQuestion, 'cantidadPorRespuesta': respuestas};
    this.preguntas.splice(posQuestion, 1, nuevaPregunta);
    this.guardar();
    this.preguntaEditada.notificar();
  },

  agregarRespuesta: function(nombrePregunta,respuestaSeleccionada){
    for (var i = 0; i < this.preguntas.length; i++) {
      if (this.preguntas[i]["textoPregunta"] == nombrePregunta) {
        for(var j = 0; j < this.preguntas[i].cantidadPorRespuesta.length; j++){
          if (this.preguntas[i].cantidadPorRespuesta[j]["textoRespuesta"] == respuestaSeleccionada){
            this.preguntas[i].cantidadPorRespuesta[j]["cantidad"] = this.preguntas[i].cantidadPorRespuesta[j]["cantidad"] + 1;
          }
        }
      }
    }
    this.guardar();
    this.respuestaAgregada.notificar();
  },

  borrarTodasLasPreguntas: function(){
    console.log("por aqui si entra");
    this.preguntas = [];
    this.guardar();
    this.preguntasBorradas.notificar();
  },

  sumarleVotoARespuesta: function(idPregunta){}, 

  //se guardan las preguntas
  guardar: function(){
    localStorage.setItem("preguntas", JSON.stringify(this.preguntas));
  },

  reestablecerDataLocalStorage: function(preguntasLocalStorage){
    this.preguntas = preguntasLocalStorage;
    this.preguntasRestablecidas.notificar();
  }
};
