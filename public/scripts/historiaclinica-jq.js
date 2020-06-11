$(document).ready(function(){
	$("#frm-editar-historia").validate({
		invalidHandler: invalidHandlerHC
	});
	$("#frm-editar-revision").validate({
		invalidHandler: invalidHandlerHC
	});

	$("#paciente").select2({
	    placeholder: "Buscar responsable",
	    allowClear: true,
	    language: "es",
	    ajax: { 
	        url: base_url+'mvc/controllers/CHuesped.php?action=obtenerHuespedsSelect',
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {
	            return data;
	        }
	    },
	});

	$(document).on('click', '#btn_reseter_frm_hc', function(e){
		reseter_frm_hc();
	});

	$(document).on('click', '#btn_nueva_hc', function (e) {
		if($("#frm-editar-revision").valid() && $("#frm-editar-revision").valid()){
			var loader = open_overlay();
			$('#id_paciente').val($('#paciente').val());
			data = $("#frm-editar-historia").serializeArray();
			$.post(base_url+'mvc/controllers/Chistoria.php',data,function(respuesta){ 
				if(respuesta.rpt){
					$.notify(respuesta.mensaje,"success");
	                $("#paciente").trigger('change');
				}else{
						$.notify(respuesta.mensaje,"error");
				}
			 	loader.hide();
			} ,'json');
		}
	});
	crearDiagnosticoPpalMultiSelect();
	crearDiagnosticoMultiSelect();

	$('[data-toggle="tooltip"]').tooltip();

	$(document).on('change',"#paciente",function(e){
		if($(this).val() != null){
			$.post(base_url+'mvc/controllers/Chistoria.php?action=validarExistenciaHCPaciente',{'paciente':$(this).val()},function(r){
				if(r.rpt){
					$('#ctn_imagen_historia_clinica').hide();
					$('#ctn_form_hc_paciente').hide();
					$('#buscar_hc').trigger('keyup');
					$('#ctn_historias_clinicas_paciente').show();
				}else{
					$('#ctn_imagen_historia_clinica').hide();
					$('#ctn_historias_clinicas_paciente').hide();

					if($('#ctn_form_hc_paciente .panel-body').html().length <= 8){
						html = $('#content_frm_hc').html();
						$('#id_otro_diagnostico').remove();
						$('#ctn_form_hc_paciente .panel-body').html(html);
						$('#ctn_id_otro_diagnostico').html('<select required="required" style="width:100%" name="otro_diagnostico[]" class="form-control textAreaHC" id="id_otro_diagnostico"></select>');
						$("#ctn_id_diagnostico_ppal").html('<select required="required" style="width:100%" name="diagnostico_ppal[]" class="form-control" id="id_diagnostico_ppal"></select>');
						crearDiagnosticoPpalMultiSelect();
						crearDiagnosticoMultiSelect();
					}
					reseter_frm_hc();

					$.post(base_url+'mvc/controllers/Chistoria.php',{action:"consultarInfoRevisionHCPaciente",'id_paciente':$('#paciente').val()},function(respuesta){
						$("#id_documento").val(respuesta.cedula);

						$("#id_nombre").val(respuesta.nombre);
						
						$("#id_apellido").val(respuesta.apellido);

						$("#fecha_nac").val(respuesta.fechanacimiento);

						$("#ocupacion").val(respuesta.Ocupacionpaciente);

						$("#id_estado_civil").val(respuesta.estadocivil);
						
						$("#optradio").prop("checked", true)
						
						$("#id_edad").val(respuesta.edad);
						
						$('#id_genero').val(respuesta.genero);

						$("#id_tipo_usuario_editar").val(respuesta.vinculacion);

						$("#telefono").val(respuesta.telefono);
						
						$("#direccion").val(respuesta.direccion);

						$("#id_eps").val(respuesta.eps);

					} ,'json');

					$('#ctn_form_hc_paciente').show();
					$('#content_frm_hc').html('');
				}
			},'json');
		}else{
			$('#ctn_form_hc_paciente').hide();
			$('#ctn_historias_clinicas_paciente').hide();
			$('#ctn_imagen_historia_clinica').show();
		}
		e.preventDefault();
	});

	$(document).on('click', '#btn_addicionar_revision', function(e) {
		e.preventDefault();
		$.post(base_url+'mvc/controllers/Chistoria.php',{action:"consultarInfoRevisionHCPaciente",'id_paciente':$('#paciente').val()},function(respuesta){
			$("#id_documento_editar").val(respuesta.cedula);
			$("#id_nombre_editar").val(respuesta.nombre);
			$("#id_apellido_editar").val(respuesta.apellido);
			$("#fecha_nac_editar").val(respuesta.fechanacimiento);
			$("#ocupacion_editar").val(respuesta.Ocupacionpaciente);
			$("#direccion_editar").val(respuesta.direccion);
			$("#telefono_editar").val(respuesta.telefono);
			$("#id_tipo_documento_editar").val(respuesta.tipodocumento);
			$("#id_estado_civil_editar").val(respuesta.estadocivil);
		//	$("#id_cita_editar").val(respuesta.Id_cita);
			$("#id_paciente_editar").val(respuesta.id_cedula);
			$("#optradio").prop("checked", true)
			$("#id_edad_editar").val(respuesta.edad);
			$("#id_eps_editar").val(respuesta.eps);
			$("#id_tipo_usuario_editar").val(respuesta.vinculacion);

			$("#modal-revision").modal("show");
		} ,'json');
	});


});

function invalidHandlerHC(form, validator) {
    var errors = validator.numberOfInvalids();
    if (errors) {                    
        var firstInvalidElement = $(validator.errorList[0].element);
        $('html,body').scrollTop(firstInvalidElement.offset().top);
        firstInvalidElement.focus();
    }
}
	$("#bnt_guardar").click(function(e){
		$("#load").toggle();	
		e.preventDefault();

		var url=base_url+'mvc/controllers/Cexamenes.php';
		var data = new FormData(document.getElementById('frm-examenes'));
	    $.ajax({
	        url: url,
	        type: 'POST',
	        dataType: "JSON",
	        data: data,
	        processData: false,
	        contentType: false,
	        success: function (respuesta, status)
	        {
	        	if(respuesta.rpt){
					$.notify(respuesta.mensaje,"success");
		             recargar_grid();
		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
	        },
	        error: function (xhr, desc, err)
	        {
	        	$.notify(respuesta.mensaje,"error");
	        	$("#load").toggle();
	        }
	    }); 
	});
	


$(document).on('click',".btn_edit_imprimir", function(e)
	{
		$('#mimodalpdf').find('iframe').attr('src',base_url+'mvc/controllers/Chistoria.php?action=generarhistoriaPDF&id_cedula='+$(this).attr('id_cedula'));
		/*$("#mimodalpdf").modal("show");
		e.preventDefault();// es como un return False, frena el comportamiento natural de un evento
		
		*/
	});
	
	



$(".btn_edit_hclinica").click(function()
	{
	// alert("ddddd");
	//	console.log();
		$.post(base_url+'mvc/controllers/Chistoria.php',{action:"consultar_cita",'id_cita':$(this).attr('id_cita')},function(respuesta){
			/*console.log(respuesta);
			
			*/
			$("#id_documento").val(respuesta.cedula);
		
			$("#id_nombre").val(respuesta.nombre);
			$("#id_apellido").val(respuesta.apellido);
			$("#fecha_nac").val(respuesta.fechanacimiento);
			$("#ocupacion").val(respuesta.Ocupacionpaciente);
			$("#direccion").val(respuesta.direccion);
			$("#telefono").val(respuesta.telefono);
			$("#id_tipo_documento").val(respuesta.tipodocumento);
			$("#id_estado_civil").val(respuesta.estadocivil);

			$("#id_eps").val(respuesta.eps);
			$("#tipo_usuario").val(respuesta.vinculacion);
			//$("#id_cita").val(respuesta.Id_cita);

			$("#id_edad").val(respuesta.edad);
			$("#id_paciente").val(respuesta.id_cedula);					
			$("#mimodal").modal("show");
		} ,'json');
	});
	
$(document).on('click', ".btn_edit_consulta", function()
	{
		console.log();
		$.post(base_url+'mvc/controllers/Chistoria.php',{action:"consultar_cita",'id_cita':$(this).attr('id_cita')},function(respuesta){
			/*console.log(respuesta);
			
			*/
			$("#id_documento_editar").val(respuesta.cedula);
			$("#id_nombre_editar").val(respuesta.nombre);
			$("#id_apellido_editar").val(respuesta.apellido);
			$("#fecha_nac_editar").val(respuesta.fechanacimiento);
			$("#ocupacion_editar").val(respuesta.Ocupacionpaciente);
			$("#direccion_editar").val(respuesta.direccion);
			$("#telefono_editar").val(respuesta.telefono);
			$("#id_tipo_documento_editar").val(respuesta.tipodocumento);
			$("#id_estado_civil_editar").val(respuesta.estadocivil);
		//	$("#id_cita_editar").val(respuesta.Id_cita);
			$("#id_paciente_editar").val(respuesta.id_cedula);
			$("#optradio").prop("checked", true)
			$("#id_edad_editar").val(respuesta.edad);
			$("#id_eps_editar").val(respuesta.eps);
			$("#id_tipo_usuario_editar").val(respuesta.vinculacion);



			$("#modal-revision").modal("show");
		} ,'json');
	});



	$(document).on('click', "#bnt_guardar_hclinica", function()
	{
		if($("#frm-editar-historia").valid() && $("#frm-editar-historia").valid()){
			var loader = open_overlay();
			$.post(base_url+'mvc/controllers/Chistoria.php',$("#frm-editar-historia").serializeArray(),function(respuesta){
				if(respuesta.rpt){
					$.notify(respuesta.mensaje,"success");
	                recargar_grid();
	                $("#mimodal").modal("hide");
				}
				else{
					$.notify(respuesta.mensaje,"error");
				}
			 	loader.hide();
			} ,'json');
		}
	});
	
	
	
	$(document).on('click', "#bnt_guardar_revision", function()
	{
		if($("#frm-editar-revision").valid() && $("#frm-editar-revision").valid()){
			var loader = open_overlay();
			$.post(base_url+'mvc/controllers/Crevision.php',$("#frm-editar-revision").serializeArray(),function(respuesta){
				if(respuesta.rpt){
					$.notify(respuesta.mensaje,"success");
	                $("#modal-revision").modal("hide");
	                $('#buscar_hc').trigger('keyup');
				}else{
						$.notify(respuesta.mensaje,"error");
				}
			 	loader.hide();
			} ,'json');
		}
	});

	function reseter_frm_hc() {
		$('#frm-editar-historia')[0].reset();
	}
	
	
	
	
		
	$(document).on('keyup',"#buscar_hc",function(){
	  data = $("#frm_buscar_hc").serializeArray(); 
	  data.push({'name':'paciente','value':$('#paciente').val()});
      $.post(base_url+'mvc/controllers/Chistoria.php',data,function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);

      });



	});
		

	function recargar_grid(){

		 $.post(base_url+'mvc/controllers/Chistoria.php',{action:"recargar_historia"},function(respuesta)
        {
        	$("#contenedor_list_productos").html(respuesta);					
        });
	}

	function crearDiagnosticoMultiSelect() {
		$('#id_otro_diagnostico').select2({
		    allowClear: false,
		    language: "es",
		    placeholder: "Buscar otros diagnóstico",
		    multiple: true,
		    default: false,
		    ajax: { 
		        url: base_url+'mvc/controllers/Chistoria.php?action=buscarDiagnosticoPrincipal',
		        cache: "true",
		        type:'POST',
		        dataType: 'json',
		        data: function (data, page) {
		            return data;
		        }
		    },
		});
	}

	function crearDiagnosticoPpalMultiSelect() {
		$('#id_diagnostico_ppal').select2({
		    allowClear: false,
		    language: "es",
		    placeholder: "Buscar diagnóstico",
		    multiple: true,
		    default: false,
		    ajax: { 
		        url: base_url+'mvc/controllers/Chistoria.php?action=buscarDiagnosticoPrincipal',
		        cache: "true",
		        type:'POST',
		        dataType: 'json',
		        data: function (data, page) {
		            return data;
		        }
		    },
		});
	}


	$('#mimodalpdf').find('iframe').on('load', function(){
			$(this).css('height','541px');
	});

