$(document).ready(function(){


    $("#frm-medica").validate();
	$("#id_cedula").select2({
	    placeholder: "Buscar paciente",
	    allowClear: true,
	    language: "es",
	    ajax: { 
	        url: base_url+'mvc/controllers/CHuesped.php?action=obtenerHuespedcontrolSelectcom',
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {
	        	data.fecha = $("#id_fecha").val();
	        	data.turno = $("#id_turno").val();
	        	data.enfermera = $("#id_enfermera").val();
	            return data;
	        }
	    }, 
	});

});

	$('a[href="#verControlEnfermeria"]').click(function(){
		setTimeout(function(){ $(window).trigger('resize'); }, 9);
	});	

	$(document).on('click', '.btn_editar', function(e){
		e.preventDefault();
		var overlay = open_overlay();
		$.post(base_url+'mvc/controllers/Ccontrol_enfermeria.php?action=obtenerControlEnfermeria',{id:$(this).attr('id_control_enfermeria')},function(data){
			
			if(data.paciente != undefined){
				var s2 = $("#id_cedula").data('select2'); 
	            s2.trigger('select', { 
	                  data: {'id':data.paciente.id_cedula, 'text':data.paciente.nombre+' '+data.paciente.apellido,'modelo':data.paciente} 
	            }); 
			}

			$('#id_fecha').val(data.fecha);
			$('#observacion_eli').val(data.valor14);
			$('#id_turno').val(data.turno);
			$('#pre_enfermera').html(data.enfermera);
			$('#enfermera').val(data.enfermera);
			$('#pa').val(data.presion);
			$('#pa_evaluada').val(data.valor15);
			$('#observacion_pa').val(data.observacion);
			$('#reportar_pa').val(data.reportarpresion);
			$('#deposicion').val(data.depo);
			$('#deposicion_evaluada').val(data.valor);
			$('#observacion_depo').val(data.valor13);
			$('#reportar_depo').val(data.reportardepo);
			$('#eliminacion').val(data.eli);
			$('#eliminacion_evaluada').val(data.valor1);
			$('#reportar_eli').val(data.reportareli);
			$('#bano').val(data.bano);
			$('#observacion_bano').val(data.valor2);
			$('#reportar_bano').val(data.reportarbano);
			$('#alimentacion').val(data.ali);
			$('#observacion_alimentacion').val(data.valor7);
			$('#reportar_alimentacion').val(data.reportarali);
			$('#higiene_oral').val(data.oral);
			$('#higiene_oral_observacion').val(data.valor8);
			$('#reportar_oral').val(data.reportaroral);
			$('#visita_medica').val(data.visita);
			$('#observacion_visita_medica').val(data.valor9);
			$('#id_reportar_visita_medica').val(data.reportarvisita);

			
			$('#salidas').val(data.salida);
			$('#observacion_salida').val(data.valor4);
			$('#reportar_salida').val(data.reportarsalida);
			$('#regreso').val(data.regreso);
			$('#observacion_regreso').val(data.valor3);
			$('#reportar_regreso').val(data.reportarregreso);
			$('#toma_muestra').val(data.muestra);
			$('#observacion_toma_muestra').val(data.valor5);
			$('#reportar_toma_muestra').val(data.reportarmuestra);
			$('#recreacion').val(data.recreacion);
			$('#observacion_recreacion').val(data.valor10);
			$('#reportar_recreacion').val(data.reportarrecreacion);
			$('#toma_medicamentos').val(data.medicamento);
			$('#observacion_medicamentos').val(data.valor6);
			$('#reportar_medicamentos').val(data.reportarmedicamento);
			$('#urgencias').val(data.urgencia);
			$('#observacion_urgencias').val(data.valor11);
			$('#reportar_urgencias').val(data.reportarurgencia);
			$('#sueno').val(data.sueno);
			$('#observacion_sueno').val(data.valor12);
			$('#reportar_sueno').val(data.reportarsueno);
			$('#otras_observaciones').val(data.otrasobservaciones);

			$('#respiracion').val(data.f_respiratoria);
			$('#temperatura').val(data.temperatura);
			$('#cardiaca').val(data.f_cardica);
			$('#oximetria').val(data.oximetria);
			$('#peso').val(data.peso);
			$('#id_observacion_peso').val(data.observacion_peso);

			

    
			$('#id_control_enfermeria').val(data.id);
			overlay.hide();
			$('a[href="#frm_enfermeria"]').trigger('click');
			$("#id_fecha").focus();

		},'JSON');
	});	
	
	$(document).on('click', '.btn_terminar', function(e){
		e.preventDefault();
		var id = $(this).attr('id_control_enfermeria');
		bootbox.confirm({
			title:"Terminar ingreso enfermería",
            message: "Esta seguro que desea terminar este ingreso?, una vez acepte, no podrá volver a editarlo.", 
            locale: 'es', 
            callback: function(result) {                
                if (result) {                                             
                    $.post(base_url+'mvc/controllers/Ccontrol_enfermeria.php?action=terminarIngreso',{id:id},function(r){
                    	$('#grid').trigger("reloadGrid"); 
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

	$('#btn_nuevo').click(function(){
		$('#frm-medica')[0].reset();
		$('#id_control_enfermeria').val('');
		$("#id_fecha").focus();
	});

	$("#bnt-guardar").click(function(e){
   
		if($('#frm-medica').valid() && $('#frm-medica').valid()){
			//loader = open_overlay();
			$.post(base_url+'mvc/controllers/Ccontrol_enfermeria.php?action=guardar',$("#frm-medica").serialize(),function(respuesta){
				if(respuesta.rpt){
					$("#id_cedula").val('').trigger('change');
			       	$('#frm-medica')[0].reset();
			       	$('#id_control_enfermeria').val('');
					$.notify(respuesta.mensaje,"success");
		            $('#grid').trigger("reloadGrid"); 
		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				//loader.hide();
			},'json');
		}
		e.preventDefault();	

	});
	
	
	$(document).on('keyup',"#buscar_usuario",function(){
      $.post(base_url+'mvc/controllers/Csocial.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
          $("#load").hide();

      });



	});

	$(document).on('click', ".btn_edit_product", function()
	{
		    
		    
		    
			$.post(base_url+'mvc/controllers/Csocial.php',{action:"consultar_usuario",'id_cedula':$(this).attr('id_tercero')},function(respuesta){
			//console.log(respuesta);
			$("#id_nombre_paciente").val(respuesta.nombre);
			$("#id_apellido_paciente").val(respuesta.apellido);
			$("#id_viajes_realizados").val(respuesta.viajes_realizados);
			$("#id_club_social").val(respuesta.club_social);
			$("#id_salidas").val(respuesta.salidas);
			$("#id_restriccion").val(respuesta.restriccion_visita);
			$("#id_restriccion_visita").val(respuesta.nombre_restriccion);
			$("#id_motivo_restriccion").val(respuesta.motivo_restriccion);


			$("#id_historia_laboral").val(respuesta.historia_laboral);
			$("#id_lecturas_romanticas").val(respuesta.lecturas);
			$("#id_pasatiempos").val(respuesta.id_pasatiempo);
			$("#id_otros_pasatiempos").val(respuesta.otros_pasatiempos);
			$("#id_musica").val(respuesta.musicia);
			$("#id_programas_radiales").val(respuesta.programas_radiales);
			$("#id_programas_televisivos").val(respuesta.programas_tele);
			$("#id_actividad_religiosa").val(respuesta.asistencia_templo);
			$("#id_frecuencia_templo").val(respuesta.frecuencia_templo);

			$("#id_cargo").val(respuesta.cargo_ingreso);
			$("#id_nombre_responsable").val(respuesta.nombre_ingreso);
			
			    
			$("#id_tercero").val(respuesta.id_social);
			
			

			$("#mimodal").modal("show");
		} ,'json');
	});



	$(document).on('click', "#bnt_guardar_producto", function()
	{
	//	$("#load_ediatr").show();
		$.post(base_url+'mvc/controllers/Csocial.php',$("#frm-editar-productos").serializeArray(),function(respuesta){
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


	

	function recargar_grid(){

		 $.post(base_url+'mvc/controllers/Csocial.php',{action:"recargar_social"},function(respuesta)
	            {
	            	$("#contenedor_list_productos").html(respuesta);
	            });
	}