$(document).ready(function(){


	$("#frm-medica").validate();

	$("#id_cedula").select2({
	    placeholder: "Buscar paciente",
	    allowClear: true,
	    language: "es",
	    ajax: { 
	        url: base_url+'mvc/controllers/CHuesped.php?action=obtenerHuespedsocialSelectcom',
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {
	            return data;
	        }
	    },
	});

});


	$("#bnt-guardar").click(function(e){
   console.log("sssss");
		if($('#frm-medica').valid() && $('#frm-medica').valid()){
			loader = open_overlay();
			$.post(base_url+'mvc/controllers/Csocial.php',$("#frm-medica").serialize(),function(respuesta){
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