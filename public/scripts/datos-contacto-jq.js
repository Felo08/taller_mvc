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
			$.post(base_url+'mvc/controllers/Ccontactos.php',$("#frm-usuario").serialize(),function(respuesta){
				console.log(respuesta);
				if(respuesta.rpt){
					$.notify(respuesta.mensaje,"success");
		             recargar_grid();

		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				load.hide();
			},'json');
	        recargar_grid();
    	}
		e.preventDefault();	

	});
	
	
	
	
$(document).on('keyup',"#buscar_usuario",function(){
      console.log($(this).val());
     
      $.post(base_url+'mvc/controllers/Ccontactos.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
      });

	});
	

	$(document).on('keyup',"#buscar_usuario_n",function(){
      console.log($(this).val());
     
      $.post(base_url+'mvc/controllers/Ccontactos.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
      });



	});
	
	
	
$(document).on('click', ".btn_edit_product", function()
	{
		    console.log("dddddg");
		    
		    
			$.post(base_url+'mvc/controllers/Ccontactos.php',{action:"consultar_usuario",'id_cedula':$(this).attr('id_tercero')},function(respuesta){
			console.log(respuesta);
			$("#id_cedula").val(respuesta.nit);
			$("#direccion").val(respuesta.direccion);
			$("#telefono").val(respuesta.tel_fijo);
								
			$("#nombres").val(respuesta.nombre_contact);
			$("#apellidos").val(respuesta.apellido_contact);
			$("#correo").val(respuesta.correo);
			$("#empresa").val(respuesta.empresa);
			$("#paciente").val(respuesta.cedula);
			$("#profesion").val(respuesta.profesion);
			$("#celular").val(respuesta.celular);
			$("#ciudad").val(respuesta.ciudad);
			$("#id_fecha_nac").val(respuesta.fecha_cumple);
			$("#id_parentesco").val(respuesta.tipo_familar);
			$("#id_resposable_editar").val(respuesta.contacto_emergencia);
			$("#id_colaborador").val(respuesta.colaborador);
            
            
            $("#id_acompanante_salida").val(respuesta.contacto_salida);
			
			
			    
			$("#id_tercero").val(respuesta.id);
			
			

			$("#mimodal").modal("show");
		} ,'json');
	});


$(document).on('click',".btn_eliminar_producto",function()
	{
   
     var txt;
	var r = confirm("Desea bloquear el paciente?");
		if (r == true) 
		{
    		$.post(base_url+'mvc/controllers/Ccontactos.php',{action:"eliminar",'id_cedula':$(this).attr('id_tercero')},function(respuesta)
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

$(document).on('click', "#bnt_guardar_producto", function()
	{
	//	$("#load_ediatr").show();
		$.post(base_url+'mvc/controllers/Ccontactos.php',$("#frm-editar-productos").serializeArray(),function(respuesta){
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
	 $.post(base_url+'mvc/controllers/Ccontactos.php',{action:"recargar_usuarios"},function(respuesta)
            {
            	$("#contenedor_list_productos").html(respuesta);
            });
}