/*$(document).ready(function(){
		console.log("Evento ready");
		validarFormulario();

	$.validator.addMethod("cedulaUnica", function(value, element) {
	    var isSuccess = false;
   		$.ajax({ url: base_url+"mvc/controllers/Ccontactos.php", 
            data: {'action':'validarCedulaUsuario','cedula':value}, 
            async: false, 
            success: 
                function(msg) { isSuccess = msg === "true" ? true : false }
          });
    return isSuccess;
	}, "Esta cedula ya se encuentra asignada a un paciente, por favor utilice una diferente.");	
});*/
	

function validarFormulario(){
    $("#frm-usuario").validate();
}

	$("#btn-enviar").click(function(e){

		if($("#frm-usuario").valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/Carticulos.php',$("#frm-usuario").serialize(),function(respuesta){
				console.log(respuesta);
				if(respuesta.rpt){
					$.notify(respuesta.mensaje,"success");
					 limpiarFormulario();
		             recargar_grid_habitacion();

		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				load.hide();
			},'json');
	        recargar_grid_habitacion();
    	}
		e.preventDefault();	

	});


	$("#btn-enviarh").click(function(e){

	//	console.log("sssss"); 

		if($("#frm-usuario").valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/Carticulos.php',$("#frm-usuario").serialize(),function(respuesta){
				console.log(respuesta);
				if(respuesta.rpt){
					$.notify(respuesta.mensaje,"success");
					 limpiarFormulario();
		            // recargar_grid_habitacion();

		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				load.hide();
			},'json');
	     //   recargar_grid_habitacion();
    	}
		e.preventDefault();	

	});




	$("#btn-enviar-stock").click(function(e){

		if($("#frm-usuario").valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/Carticulos.php',$("#frm-usuario").serialize(),function(respuesta){
				console.log(respuesta);
				if(respuesta.rpt){
					$.notify(respuesta.mensaje,"success");
		             recargar_grid_stock();

		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				load.hide();
			},'json');
	        recargar_grid_stock();
    	}
		e.preventDefault();	

	});




		$("#btn-enviar-medicamento").click(function(e){
          console.log("medicamentos");
		if($("#frm-usuario").valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/Carticulos.php',$("#frm-usuario").serialize(),function(respuesta){
				console.log(respuesta);
				if(respuesta.rpt){
					$.notify(respuesta.mensaje,"success");

					limpiarFormulario();
		             recargar_grid_medicamentos();

		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				load.hide();
			},'json');
	        recargar_grid_medicamentos();
    	}
		e.preventDefault();	

	});

		function limpiarFormulario() {
        $("#frm-usuario")[0].reset();
        //$("#frm-factura")[0].reset();
       // $("#id_paciente").select2("val", "");

       // $("#tipo_concepto").empty();
        
    }

	
	
	
	
	
$(document).on('keyup',"#buscar_usuario",function(){
      console.log($(this).val());
     
      $.post(base_url+'mvc/controllers/Carticulos.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
      });



	});

$(document).on('keyup',"#buscar_stock",function(){
      console.log($(this).val());
     
      $.post(base_url+'mvc/controllers/Carticulos.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
      });



	});

$(document).on('keyup',"#buscar_medicamento",function(){
      console.log($(this).val());
     
      $.post(base_url+'mvc/controllers/Carticulos.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
      });



	});
	
	
	
	
	
$(document).on('click', ".btn_edit_product", function()
	{
		   
		    
		    
			$.post(base_url+'mvc/controllers/Carticulos.php',{action:"consultar_usuario",'id_cedula':$(this).attr('id_tercero')},function(respuesta){
			//console.log(respuesta);
			$("#id_nombre_c").val(respuesta.nombre_concepto);
			$("#id_referencia").val(respuesta.codigo);
			$("#id_descripcion_c").val(respuesta.descripcion);
			$("#id_tipo_concepto").val(respuesta.tipo_concepto);
									
			    
			$("#id_tercero").val(respuesta.id);
			
			

			$("#mimodal").modal("show");
		} ,'json');
	});




$(document).on('click', ".btn_edit_medicamento", function()
	{
		   
		    
		    
			$.post(base_url+'mvc/controllers/Carticulos.php',{action:"consultar_medicamento",'id_cedula':$(this).attr('id_tercero')},function(respuesta){
			//console.log(respuesta);
			$("#id_nombre_medicamento").val(respuesta.nombre_medicamento);
			$("#id_farmaceuta").val(respuesta.farmaceuta);
			$("#id_concentracion").val(respuesta.concentracion);
			$("#id_via_administracion").val(respuesta.via);
			$("#id_medida").val(respuesta.id_medida);
			$("#id_descripcion1").val(respuesta.descripcion); 
			$("#id_tipo_concepto").val(respuesta.tipo_concepto);   
			$("#id_tercero").val(respuesta.id_medicamento);
			
			$("#modal_medicamento").modal("show");
		} ,'json');
	});



$(document).on('click', ".btn_edit_habitacion", function()
	{
		   
		   console.log("ddddd");
		    
			$.post(base_url+'mvc/controllers/Carticulos.php',{action:"consultar_habitacion",'id_cedula':$(this).attr('id_tercero')},function(respuesta){
			//console.log(respuesta);
			$("#id_nombre_medicamento").val(respuesta.nombre);
			   
			$("#id_tercero").val(respuesta.id);
			
			$("#modal_medicamento").modal("show");
		} ,'json');
	});


$(document).on('click', ".btn_edit_stock", function()
	{
		   
		   
		    
			$.post(base_url+'mvc/controllers/Carticulos.php',{action:"consultar_stock",'id_stock':$(this).attr('id_stock')},function(respuesta){
			//console.log(respuesta);
			$("#id_referencia").val(respuesta.codigo);
			$("#id_nombre_c").val(respuesta.nombre_concepto);

			$("#valor").val(respuesta.valor);
			$("#id_descripcion_c").val(respuesta.descripcion);
			$("#id_tipo_concepto").val(respuesta.id_tipo_concepto);
			$("#id_recuperable").val(respuesta.id_recuperable);
			


			


			   
			$("#id_tercero").val(respuesta.id);
			
			$("#modal_stock").modal("show");
		} ,'json');
	});




$(document).on('click',".btn_eliminar_producto",function()
	{
   
     var txt;
	var r = confirm("Desea bloquear el articulo?");
		if (r == true) 
		{
    		$.post(base_url+'mvc/controllers/Carticulos.php',{action:"eliminar",'id_cedula':$(this).attr('id_tercero')},function(respuesta)
				{
					console.log(respuesta);
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



$(document).on('click',".btn_eliminar_habitacion",function()
	{
   
     var txt;
	var r = confirm("Desea bloquear la habitacion?");
		if (r == true) 
		{
    		$.post(base_url+'mvc/controllers/Carticulos.php',{action:"eliminar_habitacion",'id_cedula':$(this).attr('id_tercero')},function(respuesta)
				{
					console.log(respuesta);
			      if(respuesta.rpt)
			      {
							$.notify(respuesta.mensaje,"success");
				             recargar_grid_habitacion();

				   }else{
				       		$.notify(respuesta.mensaje,"error");
				       	}
				},'json');
		} 

	
});





$(document).on('click',".btn_eliminar_medicamento",function()
	{
   
     var txt;
	var r = confirm("Desea bloquear el medicamento?");
		if (r == true) 
		{
    		$.post(base_url+'mvc/controllers/Carticulos.php',{action:"eliminar_medicamento",'id_cedula':$(this).attr('id_tercero')},function(respuesta)
				{
					console.log(respuesta);
			      if(respuesta.rpt)
			      {
							$.notify(respuesta.mensaje,"success");
				             recargar_grid_medicamentos();

				   }else{
				       		$.notify(respuesta.mensaje,"error");
				       	}
				},'json');
		} 

	
});


$(document).on('click',".btn_eliminar_stock",function()
	{
   
     var txt;
	var r = confirm("Desea bloquear el articulo?");
		if (r == true) 
		{
    		$.post(base_url+'mvc/controllers/Carticulos.php',{action:"eliminar_stock",'id_stock':$(this).attr('id_stock')},function(respuesta)
				{
					console.log(respuesta);
			      if(respuesta.rpt)
			      {
							$.notify(respuesta.mensaje,"success");
				             recargar_grid_stock();

				   }else{
				       		$.notify(respuesta.mensaje,"error");
				       	}
				},'json');
		} 

	
});


$(document).on('click', "#bnt_guardar_producto", function()
	{
	//	$("#load_ediatr").show();
		$.post(base_url+'mvc/controllers/Carticulos.php',$("#frm-editar-productos").serializeArray(),function(respuesta){
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


$(document).on('click', "#bnt_guardar_habitacion", function()
	{
	//	$("#load_ediatr").show();
		$.post(base_url+'mvc/controllers/Carticulos.php',$("#frm-editar-medicamento").serializeArray(),function(respuesta){
			if(respuesta.rpt){
			$.notify(respuesta.mensaje,"success");
				$("#mimodal").modal('toggle');

                recargar_grid_habitacion();

			}
			else
				{
					$.notify(respuesta.mensaje,"error");

				}
			
		} ,'json');
	});



$(document).on('click', "#bnt_guardar_stock", function()
	{
	//	$("#load_ediatr").show();
		$.post(base_url+'mvc/controllers/Carticulos.php',$("#frm-editar-productos").serializeArray(),function(respuesta){
			if(respuesta.rpt){
			$.notify(respuesta.mensaje,"success");
				$("#mimodal").modal('toggle');

                recargar_grid_stock();

			}
			else
				{
					$.notify(respuesta.mensaje,"error");

				}
			
		} ,'json');
	});


$(document).on('click', "#bnt_guardar_medicamento", function()
	{
	
		$.post(base_url+'mvc/controllers/Carticulos.php',$("#frm-editar-medicamento").serializeArray(),function(respuesta){
			if(respuesta.rpt){
			$.notify(respuesta.mensaje,"success");
				$("#modal_medicamento").modal('toggle');

                recargar_grid_medicamentos();

			}
			else
				{
					$.notify(respuesta.mensaje,"error");

				}
			
		} ,'json');
	});
	

function recargar_grid(){
	 $.post(base_url+'mvc/controllers/Carticulos.php',{action:"recargar_usuarios"},function(respuesta)
            {
            	$("#contenedor_list_productos").html(respuesta);
            });
}


function recargar_grid_habitacion(){
	 $.post(base_url+'mvc/controllers/Carticulos.php',{action:"recargar_habitacion"},function(respuesta)
            {
            	$("#contenedor_list_productos").html(respuesta);
            });
}


function recargar_grid_stock(){
	 $.post(base_url+'mvc/controllers/Carticulos.php',{action:"recargar_stock"},function(respuesta)
            {
            	$("#contenedor_list_productos").html(respuesta);
            });
}

function recargar_grid_medicamentos(){
	 $.post(base_url+'mvc/controllers/Carticulos.php',{action:"recargar_medicamentos"},function(respuesta)
            {
            	$("#contenedor_list_productos").html(respuesta);
            });
}