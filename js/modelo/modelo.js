/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
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
    this.preguntaEliminada.notificar();
  },

  //se guardan las preguntas
  guardar: function(){
  },
};
