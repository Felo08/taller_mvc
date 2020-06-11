$(document).ready(function(){
	$('#frm-roles').validate();
	$('#frm-editar-usuario').validate();

	$.validator.addMethod("igualarContrasenas", function(value, element) { 
	    if($('#pass1').val().length > 0 && $('#pass2').val().length > 0){
		    return ($('#pass1').val() == $('#pass2').val() )?true:false;
		}else{
			return true;
		}
	}, "Las contraseñas deben ser iguales.");

	$.validator.addMethod("cedulaUnica", function(value, element) {
	    var isSuccess = false;
   		$.ajax({ url: base_url+"mvc/controllers/CRoles.php", 
            data: {'action':'validarCedulaUsuario','cedula':value}, 
            async: false, 
            success: 
                function(msg) { isSuccess = msg === "true" ? true : false }
          });
    return isSuccess;
	}, "Esta cédula ya se encuentra asignada a un usuario, por favor emplé una diferente.");


	$.validator.addMethod("usuarioUnico", function(value, element) {
	    var isSuccess = false;
   		$.ajax({ url: base_url+"mvc/controllers/CRoles.php", 
            data: {'action':'validarNombreUsuario','nombreUsuario':value}, 
            async: false, 
            success: 
                function(msg) { isSuccess = msg === "true" ? true : false }
          });
    return isSuccess;
	}, "El nombre de usuario ya se encuentra en uso, por favor emplé uno diferente.");

	$.validator.addMethod("cedulaUnicaEdit", function(value, element) {
	    var isSuccess = false;
   		$.ajax({ url: base_url+"mvc/controllers/CRoles.php", 
            data: {'action':'validarCedulaUsuarioEdit','cedula':value, "id_usuario":$("#id_usuario").val()}, 
            async: false, 
            success: 
                function(msg) { isSuccess = msg === "true" ? true : false }
          });
    return isSuccess;
	}, "Esta cédula ya se encuentra asignada a un usuario, por favor emplé una diferente.");

	$.validator.addMethod("usuarioUnicoEdit", function(value, element) {
	    var isSuccess = false;
   		$.ajax({ url: base_url+"mvc/controllers/CRoles.php", 
            data: {'action':'validarNombreUsuarioEdit','nombreUsuario':value, "id_usuario":$("#id_usuario").val()}, 
            async: false, 
            success: 
                function(msg) { isSuccess = msg === "true" ? true : false }
          });
    return isSuccess;
	}, "El nombre de usuario ya se encuentra en uso, por favor emplé uno diferente.");


	$(document).on('blur', '#pass1', function(){
		$('#pass2').trigger('blur');
	});

	$(document).on('click','#bnt_guardar_permisos',function(e){
		var load = open_overlay();
		$.post(base_url+"mvc/controllers/CRoles.php",$('#frm_permisos_usuario').serialize(),function(data){
			if(data.rpt){
				$.notify(data.mensaje,"success");
			}else{
				$.notify(data.mensaje,"error");
			}
			load.hide();
		},'JSON');
		e.preventDefault();
	});

	$(document).on('keyup',"#buscar_usuario",function(){
      $.post(base_url+'mvc/controllers/CRoles.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_roles").html(respuesta);
      });


	});

});


	$("#bnt_guardar").click(function(e){

		if($('#frm-roles').valid() && $('#frm-roles').valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/CRoles.php',$("#frm-roles").serialize(),function(respuesta){
				if(respuesta.rpt){
					$("#frm-roles")[0].reset();
					$.notify(respuesta.mensaje,"success");
		             recargar_grid();
		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				load.hide();
			},'json');

		}

		e.preventDefault();	

	});
	
	$(document).on('click', ".btn_edit_usuario", function()
	{
		$.post(base_url+'mvc/controllers/CRoles.php',{action:"consultar_rol",'id_rol':$(this).attr('id_usuario')},function(respuesta){
			$("#id_cedula").val(respuesta.cedula);
			$("#id_nombre").val(respuesta.nombres);
			$("#id_nombre_usuario").val(respuesta.nombre_usuario);
										
			$("#id_usuario").val(respuesta.id_usuario);

			$("#mimodal").modal("show");
		} ,'json');
	});

	$(document).on('click','.btn_permisos_usuario',function(e){
		var load = open_overlay();
		$.post(base_url+'mvc/controllers/CRoles.php',{'action':'obtenerPerimosUsuario','id_usuario':$(this).attr('id_usuario')},function(html){
			$('#myModalPermisos .modal-body').html(html);
			load.hide();
			$("#myModalPermisos").modal("show");
		});
	});
	
	$(document).on('click','.btn_eliminar_usuario',function(e){
		$r = confirm('Realmente desea eliminar este registro?');
		if($r){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/CRoles.php',{'action':'eliminarUsuario','id_usuario':$(this).attr('id_usuario')},function(data){
				if(data.rpt){
					$.notify(data.mensaje,'success');
					recargar_grid();
				}else{
					$.notify(data.mensaje,'error');
				}
				load.hide();
			},'JSON');
		}
		e.preventDefault();
	});
	
	$(document).on('click', "#bnt_guardar_usuario", function()
	{
		if($('#frm-editar-usuario').valid() && $('#frm-editar-usuario').valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/CRoles.php',$("#frm-editar-usuario").serializeArray(),function(respuesta){
				if(respuesta.rpt){
				$.notify(respuesta.mensaje,"success");
					$("#mimodal").modal('toggle');
	                recargar_grid();
				}
				else{
					$.notify(respuesta.mensaje,"error");
				}
				load.hide();				
			} ,'json');
		}
	});

	$(document).on('change','.permiso',function(e){
		if($(this).is(":checked")){
			element = $(this);
			while(element.attr('mipadre') != 0){
				element = $('[idpermiso='+element.attr('mipadre')+']');
				element.prop("checked", true);
			}
			$(this).parent().parent().parent().find('input[type=checkbox]').prop("checked", true);
		}else{
			$(this).parent().parent().parent().find('input[type=checkbox]').prop("checked", false);
		}
	});

	function recargar_grid(){

		 $.post(base_url+'mvc/controllers/CRoles.php',{action:"recargar_usuarios"},function(respuesta)
	            {
	            	$("#contenedor_list_productos").html(respuesta);	

	            });
	}