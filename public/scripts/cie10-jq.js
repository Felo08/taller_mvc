

function validarFormulario(){
    $("#frm-cie10").validate();
}
$(document).on('ready', function(e){
	$("#frm-cie10").validate();
	$("#frm_editar_cie10").validate();

	$.validator.addMethod("codigoUnico", function(value, element) {
	    var isSuccess = false;
	    var t = this;
   		$.ajax({ url: base_url+"mvc/controllers/CCie10.php", 
            data: {'action':'validarCodigoUnico','codigo':value, 'idCie10':$(element).attr('idcie10')}, 
            async: false, 
            success: 
                function(msg) { isSuccess = msg === "true" ? true : false }
          });
    return isSuccess;
	}, "Este código ya fue agregado.");	
});
	
	$("#btn-enviar").click(function(e){

		if($("#frm-cie10").valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/CCie10.php?action',$("#frm-cie10").serialize(),function(respuesta){
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


	$("#btn-enviar-cie10").click(function(e){

		if($("#frm-cie10").valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/CCie10.php?action=insertarCie10',$("#frm-cie10").serialize(),function(respuesta){
				if(respuesta.rpt){
					$.notify(respuesta.mensaje,"success");
		             recargar_grid_cie10();

		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				load.hide();
			},'json');
	        recargar_grid_cie10();
    	}
		e.preventDefault();	

	});
	
	
	
	
$(document).on('keyup',"#buscar_usuario",function(){     
      $.post(base_url+'mvc/controllers/Ceps.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
      });



	});

$(document).on('keyup',"#buscar_usuario_cups",function(){     
      $.post(base_url+'mvc/controllers/Ceps.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
      });



	});
	
	
	
	
$(document).on('click', ".btn_edit_cie10", function()
	{		    
		$.post(base_url+'mvc/controllers/CCie10.php',{action:"consultarCie10",'idCie10':$(this).attr('id')},function(respuesta){
		$("#id_codigo_cie10").attr('idCie10',respuesta.id);
		$("#id_codigo_cie10").val(respuesta.codigo);
		$("#id_nombre_cie10").val(respuesta.descripcion);
		$("#id_edit").val(respuesta.id);

		$("#mimodal").modal("show");
		} ,'json');
	});

 	$(document).on('click',".btn_eliminar_cie10",function(){
   
     var t  = this;
     bootbox.confirm({
        message: "Desea bloquear el registro?", 
        locale: 'es', 
        callback: function(result) {                
            if (result) {                                             
                $.post(base_url+'mvc/controllers/CCie10.php',{action:"eliminarCie10",'id':$(t).attr('id')},function(respuesta)
				{
				  if(respuesta.rpt)
			      {
					$.notify(respuesta.mensaje,"success");
		            recargar_grid_cie10();

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

$(document).on('click', "#bnt_guardar_producto", function()
	{
	//	$("#load_ediatr").show();
		$.post(base_url+'mvc/controllers/Ceps.php',$("#frm_editar_cie10").serializeArray(),function(respuesta){
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


$(document).on('click', "#bnt_guardar_ci10", function()
	{
	//	$("#load_ediatr").show();
		$.post(base_url+'mvc/controllers/CCie10.php?action=editarCie10',$("#frm_editar_cie10").serializeArray(),function(respuesta){
			if(respuesta.rpt){
			$.notify(respuesta.mensaje,"success");
				$("#mimodal").modal('toggle');
                recargar_grid_cie10();
			}
			else{
					$.notify(respuesta.mensaje,"error");
				}
			
		} ,'json');
	});
	

function recargar_grid(){
	 $.post(base_url+'mvc/controllers/Ceps.php',{action:"recargar_usuarios"},function(respuesta)
            {
            	$("#contenedor_list_productos").html(respuesta);
            });
}



function recargar_grid_cie10(){
	 $('#grid').trigger("reloadGrid");
}



