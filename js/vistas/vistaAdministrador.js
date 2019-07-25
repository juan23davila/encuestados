/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaEliminada.suscribir(function() { 
    contexto.reconstruirLista(); 
  });

  this.modelo.preguntaEditada.suscribir(function() { 
    contexto.reconstruirLista(); 
  });

  this.modelo.preguntasBorradas.suscribir(function() { 
    contexto.reconstruirLista(); 
  });

  this.modelo.preguntasRestablecidas.suscribir(function() { 
    contexto.reconstruirLista(); 
  });
};


VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    validacionDeFormulario();
    this.reconstruirLista();
    this.configuracionDeBotones();
    this.obtenerPreguntasLocalStorage();
  },

  //this.modelo.preguntas = [{"textoPregunta": "Mi primera Pregunta", "id": 0, "cantidadPorRespuesta": [{"textoRespuesta": "respuesta 1", "cantidad": 2},{"textoRespuesta": "respuesta 2", "cantidad": 3}]}]
  construirElementoPregunta: function(pregunta){
    var contexto = this;

    //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
    var nuevoItem = $("<li class=\"list-group-item\" id=\""+pregunta.id+"\">"+pregunta.textoPregunta+"</li>");

    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas;
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    //asociacion de eventos a boton
    //Agrega pregunta
    e.botonAgregarPregunta.click(function() {
      var value = e.pregunta.val();
      var respuestas = [];

      $('[name="option[]"]').each(function(respuesta) {
        respuesta = $(this).val();
        if (respuesta.length > 0) {
          respuestas.push({'textoRespuesta':respuesta, 'cantidad':0});
        }
      })

      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(value, respuestas);
    });

    //borra Pregunta
    e.botonBorrarPregunta.click(()=>{
      var id = parseInt($('.list-group-item.active').attr('id'));
      contexto.controlador.borrarPregunta(id);
    });

    //editar Pregunta
    e.botonEditarPregunta.click(()=>{

      // Se limpia el formulario por si el usuario se encuentra registrando una nueva pregunta
      contexto.limpiarFormulario();
      let $respuestasVacias = $('.form-group.answer.has-feedback');
      $respuestasVacias.each(function(respuesta){
        attrClass = $(this).attr('class');
        if(!attrClass.includes("hide")){
          $(this).attr('class', "form-group answer has-feedback has-success");
        }
      });
      contexto.limpiarFormulario(); //Fin de la limpieza del formulario

      //Pregunta seleccionada
      var id = parseInt($('.list-group-item.active').attr('id'));

      if(!isNaN(id)){
        //Se obtiene información de la pregunta
        let preguntaToEdit = this.modelo.preguntas.filter((pregunta)=>{
          return pregunta.id == id;
        })

        //Se despliega información de la pregunta para editarla
        deplegarInfoPregunta(e.pregunta, e.respuesta, preguntaToEdit[0], this);
        //Se muestra el botón de editar pregunta
        e.botonEditQuestion.show();
        e.botonAgregarPregunta.hide();

        //Se obtiene la posición del elemento a modificar
        var index = indexDePregunta(this.modelo.preguntas, "id", id);
        e.posQuestionToEdit.val(index);

        localStorage.setItem("preguntaToEdit", JSON.stringify(preguntaToEdit[0]));

      }else{
        alert("Debe seleccionar una pregunta");
      }
      
    });

    //Editar pregunta fase 2
    e.botonEditQuestion.click(()=>{
      //Se obtiene info de la pregunta sin modifical
      var preguntaNoModificada = JSON.parse(localStorage.getItem("preguntaToEdit"));

      var value = e.pregunta.val();
      var idQuestion = preguntaNoModificada.id;
      var posQuestion = e.posQuestionToEdit.val();
      var respuestas = [];
      var contador = 0;
      var cantidadRespondida

      //Se recorren las respuestas modificadas
      $('[name="option[]"]').each(function(respuesta) {
        respuesta = $(this).val();
        if (respuesta.length > 0) {
          if(preguntaNoModificada.cantidadPorRespuesta.length > contador){
            cantidadRespondida = preguntaNoModificada.cantidadPorRespuesta[contador]["cantidad"];
          }else{
            cantidadRespondida = 0;
          }
          contador++;
          respuestas.push({'textoRespuesta':respuesta, 'cantidad':cantidadRespondida});
        }
      })
      contexto.limpiarFormulario();
      contexto.controlador.editarPregunta(value, respuestas, idQuestion, posQuestion);

      // Se muestra nuevamente el botón de agregar Pregunta
      e.botonAgregarPregunta.show();
      e.botonEditQuestion.hide();
    });

    // Se borran todas las preguntas de la encuesta
    e.borrarTodo.click(()=>{
      var answer = window.confirm("¿Está seguro que desea eliminar toda la encuesta?", "Si", "No");
      if (answer) {
        contexto.controlador.borrarTodo();
      }
    });
  },

  obtenerPreguntasLocalStorage: function() {
    let pregsLocalStorage = JSON.parse(localStorage.getItem("preguntas"));
    //Valida si se ha guardado información en localStorage
    if(pregsLocalStorage != null){
      this.controlador.reestablecerDataLocalStorage(pregsLocalStorage);
    }
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};

/**
 * Encargada de deplegar la información para que esta pueda ser editada
 */
function deplegarInfoPregunta(preguntaVista, respuestaVista, preguntaEdit, contexto){
  preguntaVista.val(preguntaEdit.textoPregunta);

  let primeraRespuesta = true;

  //Se despliegan las respuestas
  preguntaEdit.cantidadPorRespuesta.forEach(respuesta=>{
    if(primeraRespuesta){
      respuestaVista.children(".form-control").val(respuesta.textoRespuesta);
      primeraRespuesta = false;
    }else{
      var $template = $('#optionTemplate')
      $clone = $template
        .clone()
        .removeClass('hide')
        .attr('id', "respuesta" + this.cantRespuestas)
        .attr('class', "form-group answer has-feedback has-success")
        .insertBefore($template);
        $option = $clone.find('[name="option[]"]');
        $option.val(respuesta.textoRespuesta);

      // agregado de nuevo campo al formulario
      $('#localStorageForm').formValidation('addField', $option);
    }
  });
}

/**
 * Obtiene posición en el arreglo de preguntas dado un id
*/ 
function indexDePregunta(arrayToSearch, clave, valor) { 
  for (var i = 0; i < arrayToSearch.length; i++) {
    if (arrayToSearch[i][clave] == valor) {
      return i;
    }
  }
  return null;
}