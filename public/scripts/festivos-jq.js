	function validarFormulario(){
	    $("#frm-cie10").validate();
	}

	$(document).on('ready', function(e){
		$("#frm-festivos").validate();
		$("#frm-festivos-editar").validate();

		$.validator.addMethod("fechaUnica", function(value, element) {
		    var isSuccess = false;
		    var t = this;
	   		$.ajax({ url: base_url+"mvc/controllers/Cusuarios.php", 
	            data: {'action':'validarFestivoUnico','fecha':value, 'idFesctivo':$(element).attr('idFestivo')}, 
	            async: false, 
	            success: 
	                function(msg) { isSuccess = msg === "true" ? true : false }
	          });
	    return isSuccess;
		}, "Este festivo ya fue creado.");	
	});

	$("#btn-enviar-festivos").click(function(e){
		e.preventDefault();
		if($("#frm-festivos").valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/Cusuarios.php?action=insertarFestivo',$("#frm-festivos").serialize(),function(respuesta){
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

	
	$(document).on('click', ".btn_edit_festivo", function(){		    
		$.post(base_url+'mvc/controllers/Cusuarios.php',{action:"consultarFestivo",'idFestivo':$(this).attr('id')},function(respuesta){
		$("#fecha_edit").attr('idFestivo',respuesta.id);
		$("#fecha_edit").val(respuesta.fecha);
		$("#descripcion_edit").val(respuesta.descripcion);
		$("#id_edit").val(respuesta.id);

		$("#mimodal").modal("show");
		} ,'json');
	});

 	$(document).on('click',".btn_eliminar_festivo",function(e){
   		e.preventDefault();
	     var t  = this;
	     bootbox.confirm({
	        message: "Desea eliminar este registro?", 
	        locale: 'es', 
	        callback: function(result) {                
	            if (result) {                                             
	                $.post(base_url+'mvc/controllers/Cusuarios.php',{action:"eliminarFestivo",'id':$(t).attr('id')},function(respuesta)
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

	$(document).on('click', "#bnt_guardar_festivo", function(e){
		e.preventDefault();
		if($("#frm-festivos-editar").valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/Cusuarios.php?action=editarFestivo',$("#frm-festivos-editar").serializeArray(),function(respuesta){
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
		$("#frm-festivos")[0].reset();
	}

	function resetearFormulario1() {
		$("#frm-festivos-editar")[0].reset();
	}	

	function recargar_grid_festivos(){
		 $('#grid').trigger("reloadGrid");
	}