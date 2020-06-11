$(document).ready(function(){
	$("#frm-medica").validate();

	$("#id_cedula").select2({
	    placeholder: "Buscar paciente",
	    allowClear: true,
	    language: "es",
	    ajax: { 
	        url: base_url+'mvc/controllers/CHuesped.php?action=obtenerHuespedsSelectcom',
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
 
		if($('#frm-medica').valid() && $('#frm-medica').valid()){
			loader = open_overlay();
			$.post(base_url+'mvc/controllers/Ccomercial.php',$("#frm-medica").serialize(),function(respuesta){
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
      $.post(base_url+'mvc/controllers/Ccomercial.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
          $("#load").hide();

      });



	});

	$(document).on('click', ".btn_edit_product", function()
	{
		    console.log("dddddg");
		    
		    
			$.post(base_url+'mvc/controllers/Ccomercial.php',{action:"consultar_usuario",'id_cedula':$(this).attr('id_tercero')},function(respuesta){
			//console.log(respuesta);
			$("#id_nombre_paciente").val(respuesta.nombre);
			$("#id_valor_pagar").val(respuesta.valor_paga);
			$("#id_tipo_habitacion").val(respuesta.tipo_habitacion);
			$("#id_tipo_plan").val(respuesta.tipo_plan);
			$("#id_no_habitacion").val(respuesta.nro_habitacion);
			$("#id_apellido_paciente").val(respuesta.apellido);
			
			
			
			    
			$("#id_tercero").val(respuesta.id);
			
			

			$("#mimodal").modal("show");
		} ,'json');
	});



	$(document).on('click', "#bnt_guardar_producto", function()
	{
	//	$("#load_ediatr").show();
		$.post(base_url+'mvc/controllers/Ccomercial.php',$("#frm-editar-productos").serializeArray(),function(respuesta){
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

		 $.post(base_url+'mvc/controllers/Ccomercial.php',{action:"recargar_comercial"},function(respuesta)
	            {
	            	$("#contenedor_list_productos").html(respuesta);
	            });
	}