$(document).ready(function(){
	//	console.log("Evento ready");
		validarFormulario();

	$.validator.addMethod("cedulaUnica", function(value, element) {
	    var isSuccess = false;
   		$.ajax({ url: base_url+"mvc/controllers/Cusuarios.php", 
            data: {'action':'validarCedulaUsuario','cedula':value}, 
            async: false, 
            success: 
                function(msg) { isSuccess = msg === "true" ? true : false }
          });
    return isSuccess;
	}, "Esta cedula ya se encuentra asignada a un paciente, por favor utilice una diferente.");	

	$("#foto").fileinput({language:'es', 'showUpload':true, 'previewFileType':'image'});
	//$("#foto_editar").fileinput({language:'es', 'showUpload':true, 'previewFileType':'image'});

});
	

function validarFormulario(){
    $("#frm-usuario").validate();
    $("#frm-editar-productos").validate();

}

	$("#btn-enviar").click(function(e){

		if($("#frm-usuario").valid()){
			var data = new FormData(document.getElementById('frm-usuario'));
			var load = open_overlay();
			 
			$.ajax({
		        url: base_url+'mvc/controllers/Cusuarios.php?action=insertar',
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
  //    console.log($(this).val());
     
      $.post(base_url+'mvc/controllers/Cusuarios.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
      });



	});
	
	
	
	
$(document).on('click', ".btn_edit_product", function()
	{
		    
		    
		    
			$.post(base_url+'mvc/controllers/Cusuarios.php',{action:"consultar_usuario",'id_cedula':$(this).attr('id_tercero')},function(respuesta){
			//console.log(respuesta);
			$("#id_cedula").val(respuesta.cedula);
			$("#direccion").val(respuesta.direccion);
			$("#telefono").val(respuesta.telefono);
								
			$("#nombres").val(respuesta.nombre);
			$("#apellidos").val(respuesta.apellido);
			
						
		    $("#id_tipo_documento").val(respuesta.tipodocumento);
		    $("#id_genero").val(respuesta.genero);
		    
		    $("#fecha_nac").val(respuesta.fechanacimiento);
		    $("#lugar_nac").val(respuesta.lugarnacimiento);
		    
		    $("#id_estado_civil").val(respuesta.estadocivil); 
		    $("#ocupacion").val(respuesta.Ocupacionpaciente);   
		    $("#no_hijos").val(respuesta.nro_hijos); 
		      

           $("#lugar_exp").val(respuesta.lugarespedicion);  
           $("#fecha_exp").val(respuesta.fecha_expedicion);  
           

 		  $("#id_tipo_vinculacion").val(respuesta.vinculacion);  
           $("#id_eps").val(respuesta.eps); 
           $("#id_edad").val(respuesta.edad);  
           $("#fecha_ingreso").val(respuesta.fechaingresopaciente); 
           $("#estado_paciente").val(respuesta.estadopaciente); 
           $("#nombre_madre").val(respuesta.madre);  
           $("#nombre_padre").val(respuesta.padre);   
           $("#escolaridad").val(respuesta.id_escolaridad); 
           $("#religion").val(respuesta.id_religion); 
           $("#servicio_exequial").val(respuesta.exequial); 
           $("#nombre_exequial").val(respuesta.nombre_exequial);  
           $("#economico").val(respuesta.economico);   
           $("#id_alias").val(respuesta.alias); 
           $("#id_eps").val(respuesta.eps);    
           $("#id_rh_h").val(respuesta.rh);   

           
           $("#id_requiere_cama_s").val(respuesta.requiere_cama);  
           $("#id_capas_campana").val(respuesta.capas_campana); 

            $("#id_diagnostico_ed").val(respuesta.diagnostico);  
            $("#id_tratamiento_especial_ed").val(respuesta.tratamiento_especial);
            $("#id_observacion_ingreso_ed").val(respuesta.observaciones_ingreso);  

            $("#id_habitacion_e").val(respuesta.id_habitacion);  
            $("#id_no_habitacion_e").val(respuesta.no_habitacion);  



            $("#id_fecha_egreso").val(respuesta.fecha_egreso);  
            $("#id_motivo_egreso").val(respuesta.motivo_egreso); 

            $("#id_cotizante").val(respuesta.id_cotizante);  
            $("#id_ips").val(respuesta.id_ips); 
            $("#id_emergencia").val(respuesta.emergencia);  
            $("#id_prepagada").val(respuesta.prepagada); 
            $("#id_responsable").val(respuesta.acompanante);   
             $("#id_cedula_responsable").val(respuesta.cedula_acompanante);

             $("#id_parentesco_responsable").val(respuesta.parentesco_responsable);

             $("#farmacia").val(respuesta.farmacia);
             $("#contacto_farmacia").val(respuesta.contacto_farmacia);

  			 $("#direccion_farmacia").val(respuesta.direccion_farmacia);
  			 $("#utiliza_panal").val(respuesta.utiliza_panal);
  			 $("#piso").val(respuesta.piso);
  			 
 

		  // $("#ctn_foto_editar").html(''); 
		  // $("#ctn_foto_editar").html('<input type="file" data-preview-file-type="text" language="es" class="form-control" id="foto_editar" name="foto" placeholder=""/>'); 
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
		    
			$("#id_tercero").val(respuesta.id_cedula);
			
			

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
	var r = confirm("Desea bloquear el paciente?");
		if (r == true) 
		{
    		$.post(base_url+'mvc/controllers/Cusuarios.php',{action:"eliminar",'id_cedula':$(this).attr('id_tercero')},function(respuesta)
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
		        url: base_url+'mvc/controllers/Cusuarios.php?action=editar',
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
	 $.post(base_url+'mvc/controllers/Cusuarios.php',{action:"recargar_usuarios"},function(respuesta)
            {
            	$("#contenedor_list_productos").html(respuesta);
            });
}