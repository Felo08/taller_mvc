$(document).ready(function(){


	$(document).on('click','#consultar',function(){
		if($('#frm_filtro_fechas').valid()){ 
			$.get(base_url+'mvc/controllers/Csupervision.php?action=consultarsuperFiltroFechas',{'fecha_ini':$('#fecha_ini').val(),'fecha_fin':$('#fecha_fin').val()},function(html){
				$('#contenedor_list_egresos').html(html);
			});
		}
	});


	$("#frm-medica").validate();
	$("#id_cedula").select2({
	    placeholder: "Buscar Residente",
	    allowClear: true,
	    language: "es",
	    ajax: { 
	        url: base_url+'mvc/controllers/CHuesped.php?action=obtenerHuespedcontrolSelectsigno',
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {
	        	console.log(typeof(data))
	        	data.fecha = $("#id_fecha").val();
	        	data.turno = $("#id_turno").val();
	        	data.enfermera = $("#id_enfermera").val();
	            return data;
	        }
	    },
	});

});



	$("#bnt-guardar").click(function(e){
   
		if($('#frm-medica').valid() && $('#frm-medica').valid()){
			//loader = open_overlay();
			$.post(base_url+'mvc/controllers/Csupervision.php',$("#frm-medica").serialize(),function(respuesta){
				if(respuesta.rpt){
					
					$.notify(respuesta.mensaje,"success");
					resetearFormulario();
		            // recargar_grid();
		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				//loader.hide();
			},'json');
		}
		e.preventDefault();	

	});


	$("#bnt-exportar").click(function(e){
   
		if($('#frm-medica').valid() && $('#frm-medica').valid()){
			//loader = open_overlay();
			window.open(base_url+'mvc/controllers/CRegistrosignos.php?'+$("#frm-medica").serialize(), "_blank");
			/*$.post(,,function(respuesta){
				if(respuesta.rpt){
					
					$.notify(respuesta.mensaje,"success");
		            // recargar_grid();
		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				//loader.hide();
			},'json');*/
		}
		e.preventDefault();	

	});

	$("#bnt-exportar-alerta").click(function(e){
		
   
		if($('#frm-medica').valid() && $('#frm-medica').valid()){
			//loader = open_overlay();
			window.open(base_url+'mvc/controllers/CRegistrosignos.php?'+$("#frm-medica").serialize(), "_blank");
			
		}
		e.preventDefault();	

	});



		function resetearFormulario() {
		$("#id_cedula").empty();
		
		$("#frm-medica")[0].reset();
	}

	
	
	






	

	