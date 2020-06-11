	$(document).on('ready', function(e){
		$("#frm-tipo-turnos").validate();
		$("#frm-tipo-turnos-editar").validate();
		
		$('#color').colorpicker();
		$('#color').colorpicker('setValue', '#295CAB');
		$('#color_edit').colorpicker();
		$('#color_edit').colorpicker('setValue', '#295CAB');

		$.validator.addMethod("fechaUnica", function(value, element) {
		    var isSuccess = false;
		    var t = this;
	   		$.ajax({ url: base_url+"mvc/controllers/CCuadrosDeTurno.php", 
	            data: {'action':'validarFestivoUnico','fecha':value, 'idFesctivo':$(element).attr('idFestivo')}, 
	            async: false, 
	            success: 
	                function(msg) { isSuccess = msg === "true" ? true : false }
	          });
	    return isSuccess;
		}, "Este festivo ya fue creado.");	
	});

	$("#btn-enviar-tipo-turno").click(function(e){
		e.preventDefault();
		if($("#frm-tipo-turnos").valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/CCuadrosDeTurno.php?action=insertarTipoTurno',$("#frm-tipo-turnos").serialize(),function(respuesta){
				if(respuesta.rpt){
					$.notify(respuesta.mensaje,"success");
		            recargar_grid_festivos();
		            resetearFormulario();
		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				load.hide();
			},'json');
	        recargar_grid_festivos();
    	}
		e.preventDefault();	

	});

	
	$(document).on('click', ".btn_edit_tipo_turno", function(){		    
		$.post(base_url+'mvc/controllers/CCuadrosDeTurno.php',{action:"consultarTipoTurno",'id_tipo_turno':$(this).attr('id')},function(respuesta){
		$("#turno_edit").val(respuesta.turno);
		$("#alias_edit").val(respuesta.alias);
		$("#numero_horas_edit").val(respuesta.numero_horas);
		$("#valor_hora_edit").val(respuesta.valor_hora);
		$("#valor_hora_festivo_edit").val(respuesta.valor_hora_festivo);
		$("#id_tipo_turno_edit").val(respuesta.id_tipo_turno);
		$('#color_edit').colorpicker('setValue', respuesta.color);

		$("#mimodal").modal("show");
		} ,'json');
	});

 	$(document).on('click',".btn_eliminar_tipo_turno",function(e){
   		e.preventDefault();
	     var t  = this;
	     bootbox.confirm({
	        message: "Desea eliminar este registro?", 
	        locale: 'es', 
	        callback: function(result) {                
	            if (result) {                                             
	                $.post(base_url+'mvc/controllers/CCuadrosDeTurno.php',{action:"eliminarTipoTurno",'id':$(t).attr('id')},function(respuesta)
					{
					  if(respuesta.rpt)
				      {
						$.notify(respuesta.mensaje,"success");
			            recargar_grid_festivos();

					   }else{
					     $.notify(respuesta.mensaje,"error");
					       	}
					},'json');  
	            }                                
	        },
	        buttons: {
	            confirm: {
	                label: 'Aceptar',
	            },
	            cancel: {
	                label: 'Cancelar',
	            }
	        },
	    });

	});

	$(document).on('click', "#bnt_guardar_tipo_turno", function(e){
		e.preventDefault();
		if($("#frm-tipo-turnos-editar").valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/CCuadrosDeTurno.php?action=editarTipoTurno',$("#frm-tipo-turnos-editar").serializeArray(),function(respuesta){
				if(respuesta.rpt){
					$.notify(respuesta.mensaje,"success");
					$("#mimodal").modal('toggle');
					resetearFormulario1();
	                recargar_grid_festivos();
				}
				else{
					$.notify(respuesta.mensaje,"error");
				}
				load.hide();
			} ,'json');
		}
	});

	function resetearFormulario() {
		$("#frm-tipo-turnos")[0].reset();
	}

	function resetearFormulario1() {
		$("#frm-tipo-turnos-editar")[0].reset();
	}	

	function recargar_grid_festivos(){
		 $('#grid').trigger("reloadGrid");
	}