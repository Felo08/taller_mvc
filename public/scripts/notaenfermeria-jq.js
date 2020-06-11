$(document).ready(function(){


	$("#frm-medica").validate();
	$("#frm-consultar-notas-medicamentos").validate();

	$("#id_cedula").select2({
	    placeholder: "Buscar paciente",
	    allowClear: true,
	    language: "es",
	    ajax: { 
	        url: base_url+'mvc/controllers/CHuesped.php?action=obtenerHuespedsSelect',
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {
	            return data;
	        }
	    }, 
	});

	$("#id_cedula_consulta").select2({
	    placeholder: "Buscar paciente",
	    allowClear: true,
	    language: "es",
	    ajax: { 
	        url: base_url+'mvc/controllers/CHuesped.php?action=obtenerHuespedsSelect',
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {
	            return data;
	        }
	    }, 
	});

	jQuery('#fecha_consulta').periodpicker({
        end: '#fecha_consulta2',
        timepicker: false,
        lang: 'es',
        cells: [1,3],
        clearButtonInButton: true,
        closeAfterClear:function(){},
        i18n: {
         'es' : {
           'Select week #' : 'Seleccionar semana #',
           'Select period' : 'Seleccionar período',
           'Open fullscreen' : 'Abrir pantalla completa',
           'Close' : 'Salir',
           'OK' : 'Aceptar',
           'Choose period' : 'Elegir periodo'
          },
        },
        onAfterHide: function () { 
           $('#fecha_consulta').val((this.oldStringRange)); 
        }
      });

});
	
	$("#bnt-nuevo").click(function(e){
		e.preventDefault();	
		$("#id_cedula").val('').trigger('change');
		$('#frm-medica')[0].reset();
		$("#id_cedula").focus();
		$("#id_control").val("");
	});

	$(document).on('click','#consultar_notas_enfermerias', function(e){
		e.preventDefault();
		if($('#frm-consultar-notas-medicamentos').valid()){
			if (jQuery('#fecha_consulta').periodpicker('valueStringStrong').length>0) {
				var win = window.open(base_url+'mvc/controllers/Cnotas_enfermeria.php?action=consultarNotasEnfermeriaRangoPaciente&id_paciente='+jQuery('#id_cedula_consulta').val()+'&rangoFecha='+jQuery('#fecha_consulta').periodpicker('valueStringStrong'), '_blank');
	  			win.focus();
			}else{
				$.notify("Se debe selecionar un rango de fecha.");
			}
		}
	}),

	$("#bnt-guardar").click(function(e){

		if($('#frm-medica').valid() && $('#frm-medica').valid()){
			loader = open_overlay();
			if($("#id_control").val().length == 0){ 
				$.post(base_url+'mvc/controllers/Cnotas_enfermeria.php?action=insertar',$("#frm-medica").serialize(),function(respuesta){
					if(respuesta.rpt){
						$("#id_cedula").val('').trigger('change');
				       	$('#frm-medica')[0].reset();
						$.notify(respuesta.mensaje,"success");
			             recargar_grid();
			       	}else{
			       		$.notify(respuesta.mensaje,"error");
			       	}
					loader.hide();
				},'json');
			}else{
				$.post(base_url+'mvc/controllers/Cnotas_enfermeria.php?action=actualizarControl',$("#frm-medica").serialize(),function(respuesta){
					if(respuesta.rpt){
						$("#id_cedula").val('').trigger('change');
				       	$('#frm-medica')[0].reset();
						$.notify(respuesta.mensaje,"success");
			             recargar_grid();
			       	}else{
			       		$.notify(respuesta.mensaje,"error");
			       	}
					loader.hide();
				},'json');
			}
		}
		e.preventDefault();	

	});

	$('a[href="#verTodasLasNotaEnfermeria"]').click(function(e){
		$('#grid').trigger("reloadGrid"); 
		e.preventDefault();
	});
	
	$(document).on('keyup',"#buscar_usuario",function(){
      $.post(base_url+'mvc/controllers/Cnotas_enfermeria.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
          $("#load").hide();

      });



	});



	$(document).on('click', ".btn_edit_control", function(){ 
			loader = open_overlay();
			$.post(base_url+'mvc/controllers/Cnotas_enfermeria.php',{action:"consultar_control",'id_evolucion':$(this).attr('id_evolucion')},function(respuesta){
			$("#observacion").val(respuesta.controlEnfermeria.observacion);
			$("#id_control").val(respuesta.controlEnfermeria.id);

			$("#turnomanana").val(respuesta.controlEnfermeria.turno);

			$("#estado_t").val(respuesta.controlEnfermeria.estado_t);
			$("#fecha").val(respuesta.controlEnfermeria.fecha);
			$("#pendiente").val(respuesta.controlEnfermeria.pendiente);
			$("#dolor_donde").val(respuesta.controlEnfermeria.dolor_donde);
			$("#edemas_donde").val(respuesta.controlEnfermeria.edemas_donde);
			$("#equimosis_donde").val(respuesta.controlEnfermeria.equimosis_donde);
			$("#oxigeno").val(respuesta.controlEnfermeria.oxigeno);
			$("#sonda").val(respuesta.controlEnfermeria.sonda);

			$("#alimentacion").val(respuesta.controlEnfermeria.id_tipo_alimento);
			


			for(x in respuesta.respuestasControlEnfermeria){
				row = respuesta.respuestasControlEnfermeria[x];
				$("#opncionRespuesta"+(row.id_pregunta)+(row.respuesta)).prop("checked", true);
			}

			
            $("#id_cedula").data('select2').trigger('select', { 
              data: {id:respuesta.paciente.id_cedula, 'text':respuesta.paciente.nombre+" "+respuesta.paciente.apellido,modelo:respuesta.paciente} 
            }); 
			
			loader.hide();
			$('a[href="#crearNotaEnfermeria"]').trigger("click");
			//$("#mimodal").modal("show");
		} ,'json');
	});



$(document).on('click', "#bnt_guardar_producto", function()
	{
	//	$("#load_ediatr").show();
		$.post(base_url+'mvc/controllers/Cnotas_enfermeria.php',$("#frm-editar-productos").serializeArray(),function(respuesta){
			if(respuesta.rpt){
			$.notify(respuesta.mensaje,"success");
				$("#mimodal").modal('toggle');

                recargar_grid();

			}
			else
				{
					$.notify(respuesta.mensaje,"error");

				}
			
		} ,'json');
	});



$(document).on('click',".btn_cerrar_control",function()
	{
   
     var txt;
	var r = confirm("Desea cerrar la nota. Recuerde que ya no se pueden realizar modificaciones?");
		if (r == true) 
		{
    		$.post(base_url+'mvc/controllers/Cnotas_enfermeria.php',{action:"eliminar",'id_evolucion':$(this).attr('id_evolucion')},function(respuesta)
				{
			      if(respuesta.rpt)
			      {
							$.notify(respuesta.mensaje,"success");
				             recargar_grid();

				   }else{
				       		$.notify(respuesta.mensaje,"error");
				       	}
				},'json');
		} 

	
});






	


	

	function recargar_grid(){

		 $.post(base_url+'mvc/controllers/Cnotas_enfermeria.php',{action:"recargar_notas"},function(respuesta)
	            {
	            	$("#contenedor_list_productos").html(respuesta);
	            });
	}