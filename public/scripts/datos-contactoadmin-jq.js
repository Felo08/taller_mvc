$(document).ready(function(){
	//	console.log("Evento ready");
		validarFormulario();

	/*$.validator.addMethod("cedulaUnica", function(value, element) {
	    var isSuccess = false;
   		$.ajax({ url: base_url+"mvc/controllers/Ccontactosadmin.php", 
            data: {'action':'validarCedulaUsuario','cedula':value}, 
            async: false, 
            success: 
                function(msg) { isSuccess = msg === "true" ? true : false }
          });
    return isSuccess;
	}, "Esta cedula ya se encuentra asignada a un paciente, por favor utilice una diferente.");	
*/
	$("#foto").fileinput({language:'es', 'showUpload':true, 'previewFileType':'image'});
	//$("#foto_editar").fileinput({language:'es', 'showUpload':true, 'previewFileType':'image'});

}); 

function validarFormulario(){
    $("#frm-usuario").validate();
}



	



	$("#btn-enviar").click(function(e){

		if($("#frm-usuario").valid()){
			var data = new FormData(document.getElementById('frm-usuario'));
			var load = open_overlay();
			
			$.ajax({
		        url: base_url+'mvc/controllers/Ccontactosadmin.php?action=insertar',
		        type: 'POST',
		        dataType: "JSON",
		        data: data,
		        processData: false,
		        contentType: false,
		        success: function (respuesta, status){
		        	if(respuesta.rpt){
		        		$.notify(respuesta.mensaje,"success");
		        		$("#frm-usuario")[0].reset();
	        			recargar_grid();
		        	}else{
						$.notify(respuesta.mensaje,"error");	        		
		        	}
			       	load.hide();
		        },
		        error: function (xhr, desc, err){
		        	$.notify(respuesta.mensaje,"error");
		        	$("#load").toggle();
		        }
		    });
			
    	}
		e.preventDefault();	

	});
	
	
	
$(document).on('keyup',"#buscar_usuario",function(){
      console.log($(this).val());
     
      $.post(base_url+'mvc/controllers/Ccontactosadmin.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
      });



	});


$(document).on('keyup',"#buscar_usuario_n",function(){
      console.log($(this).val());
     
      $.post(base_url+'mvc/controllers/Ccontactosadmin.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
      });



	});
	
	
	
	
$(document).on('click', ".btn_edit_product", function()
	{
		    
		    
		    
			$.post(base_url+'mvc/controllers/Ccontactosadmin.php',{action:"consultar_usuario",'id_cedula':$(this).attr('id_tercero')},function(respuesta){
			//console.log(respuesta);
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
			$("#telefono_esposo").val(respuesta.telefono_esposo);
			$("#contacto_principal").val(respuesta.contacto_principal);
			$("#varios_contactos").val(respuesta.varios_contactos);
			$("#ciudad").val(respuesta.ciudad);
			$("#id_fecha_nac").val(respuesta.fecha_cumple);
			$("#id_registro_pro").val(respuesta.registro_profesional);
			$("#id_fecha_contrato").val(respuesta.fecha_ingreso);
			$("#id_dependencia").val(respuesta.id_dependencia);
			

			$("#id_cargo").val(respuesta.cargo);
			$("#id_fecha_terminacion").val(respuesta.fecha_retiro);
			$("#id_fecha_vacaciones").val(respuesta.fecha_vacaciones);
			$("#id_fecha_termina_vacas").val(respuesta.fecha_termina_vaca);

			$("#id_estado_civi").val(respuesta.estado_civil);
			$("#id_no_hijoss").val(respuesta.no_hijos);
			$("#id_conyugess").val(respuesta.conyuge);


			 $el = $("#foto_editar");
           	if ($el.data('fileinput')) {
            	$el.fileinput('destroy');
        	}
           $("#foto_editar").fileinput({
           	 	theme: "fa",
    			previewFileType:'image',
    			language:'es',
			    minFileCount: 1,
			    maxFileCount: 1,
			    overwriteInitial: false,
			    initialPreview: [
			        // IMAGE DATA
			        base_url+"imagenes/foto_paciente/"+respuesta.foto,

			    ],
			    initialPreviewAsData: true, // identify if you are sending preview data only and not the raw markup
			    initialPreviewFileType: 'image', // image is the default and can be overridden in config below
			    initialPreviewConfig: [
			     //  {caption: "Desert.jpg", size: 827000, width: "120px", url: "/file-upload-batch/2", key: 1},
			    ],
			    purifyHtml: true, // this by default purifies HTML data for preview
			    uploadExtraData: {
			        img_key: "1000",
			        img_keywords: "happy, places",
			    }
			});

			$('#ctn_foto_editar .fileinput-remove-button').click(function(){
				$('.file-preview-initial').remove();
			});

			
			
			    
			$("#id_tercero").val(respuesta.id);
			
			

			$("#mimodal").modal("show");
		} ,'json');
	});

$("#foto_editar").change(function() {  
	setTimeout(function(){
		$('.file-preview-initial').remove();
	},1);
});


$(document).on('click',".btn_eliminar_producto",function()
	{
   
     var txt;
	var r = confirm("Desea bloquear el contacto?");
		if (r == true) 
		{
    		$.post(base_url+'mvc/controllers/Ccontactosadmin.php',{action:"eliminar",'id_cedula':$(this).attr('id_tercero')},function(respuesta)
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

$(document).on('click', "#bnt_guardar_producto", function(){

		var data = new FormData(document.getElementById('frm-editar-productos'));
		if($("#frm-editar-productos").valid()){
			var load = open_overlay();
			$.ajax({
		        url: base_url+'mvc/controllers/Ccontactosadmin.php?action=editar',
		        type: 'POST',
		        dataType: "JSON",
		        data: data,
		        processData: false,
		        contentType: false,
		        success: function (respuesta, status){
		        	if(respuesta.rpt){
		        		$.notify(respuesta.mensaje,"success");
		        		$("#frm-editar-productos")[0].reset();
	        			recargar_grid();
		        		$("#mimodal").modal('toggle');
		        	}else{
						$.notify(respuesta.mensaje,"error");	        		
		        	}
			       	load.hide();
		        },
		        error: function (xhr, desc, err){
		        	$.notify(respuesta.mensaje,"error");
		        	$("#load").toggle();
		        }
		    });
		}

});

function recargar_grid(){
	 $.post(base_url+'mvc/controllers/Ccontactosadmin.php',{action:"recargar_usuarios"},function(respuesta)
            {
            	$("#contenedor_list_productos").html(respuesta);
            });
}