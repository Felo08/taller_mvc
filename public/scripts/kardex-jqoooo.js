$(document).on('ready',function(e){
	$('#frm-medicar').validate(); 
	$('#frm-alergia').validate(); 
	$('#frm-observacion').validate(); 
	$('#frm-dieta').validate(); 
	$('#frm-diagnostico').validate(); 

	$("#cedula").select2({
	    placeholder: "Buscar huesped",
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


	$('#cedula').change(function(e){
		if( (husped = $("#cedula").select2("data")[0]) != undefined){
			nombre = husped.modelo.nombre+' '+husped.modelo.apellido;
			$('#nombre_huesped').html(nombre);
			$('#cedula_huesped').html(husped.modelo.cedula);
			$('#cedula_medicar').val(husped.modelo.id_cedula);

			$('#nombre_huesped_alergia').html(nombre);
			$('#cedula_huesped_alergia').html(husped.modelo.cedula);
			$('#cedula_alergia').val(husped.modelo.id_cedula);

			$('#nombre_huesped_observacion').html(nombre);
			$('#cedula_huesped_observacion').html(husped.modelo.cedula);
			$('#cedula_observacion').val(husped.modelo.id_cedula);

			$('#nombre_huesped_diagnostico').html(nombre);
			$('#cedula_huesped_diagnostico').html(husped.modelo.cedula);
			$('#cedula_diagnostico').val(husped.modelo.id_cedula);

			$('#nombre_huesped_dieta').html(nombre);
			$('#cedula_huesped_dieta').html(husped.modelo.cedula);
			$('#cedula_dieta').val(husped.modelo.id_cedula);	
            
			$("#ctn_id_diagnostico_ppal").html('<select required="required" style="width:100%" name="diagnostico_ppal[]" class="form-control" id="id_diagnostico_ppal"></select>');
			
            $.post(base_url+"mvc/controllers/CKardex.php?action=obtenerDiagnosticos",{'id_paciente':husped.modelo.id_cedula},function(data){
                crearDiagnosticoPpalMultiSelect(data);    
            },'json');
            
			recargarGridMedicamentoSuspendidos();
			recargarGridMedicamentosKardex();
			recargarGridAlergias();		
			recargarGridDietas();		
			recargarGridObservaciones();
			recargarGridDiagnostico();
            
		}else{
			resetearFormularioMedicar();
			resetearFormularioAlergia();
			resetearFormularioDieta();
			resetearFormularioObservacion();
			resetearFormularioDiagnostico();
		
		}
	});

	crearSelectMedicamento();

	$(document).on('click','#guardar_medicamentos_kardex',function(e){
		e.preventDefault();
		if($("#cedula").val() != null)
		{
			if($('#frm-medicar').valid()){
				var load = open_overlay();
				 $.post(base_url+"mvc/controllers/CKardex.php?action=insertarMedicamentosKardex",$('#frm-medicar').serialize(),function(respuesta){
			        load.hide();
			        if(respuesta.rpt){
			        	resetearFormularioMedicar1();	
			          	$.notify(respuesta.mensaje,'success');
			          	recargarGridMedicamentosKardex();
			        }else{
			        	$.notify(respuesta.mensaje,'error');
			        }
			      },'json');
			}
		}else{
			$.notify('Por favor seleccione un huesped.','error');
		}
	});

	$(document).on('click','#guardar_alergia',function(e){
		e.preventDefault();
		if($("#cedula").val() != null)
		{
			if($('#frm-alergia').valid()){
				var load = open_overlay();
				$.post(base_url+"mvc/controllers/CKardex.php?action=agregarAlergia",$('#frm-alergia').serialize(),function(respuesta){
			        load.hide();
			        if(respuesta.rpt){
			        	resetearFormularioAlergia1();	
			        	recargarGridAlergias();
			          	$.notify(respuesta.mensaje,'success');
			        }else{
			        	$.notify(respuesta.mensaje,'error');
			        }
			      },'json');
			}
		}else{
			$.notify('Por favor seleccione un huesped.','error');
		}
	});
	
	$(document).on('click','#guardar_observacion',function(e){
		if($("#cedula").val() != null)
		{
			if($('#frm-observacion').valid()){
				var load = open_overlay();
				$.post(base_url+"mvc/controllers/CKardex.php?action=agregarObservacion",$('#frm-observacion').serialize(),function(respuesta){
			        load.hide();
			        if(respuesta.rpt){
						resetearFormularioObservacion1();	
						recargarGridObservaciones();
			          	$.notify(respuesta.mensaje,'success');
			        }else{
			        	$.notify(respuesta.mensaje,'error');
			        }
			      },'json');
			}
		}else{
			$.notify('Por favor seleccione un huesped.','error');
		}
		e.preventDefault();
	});

	$(document).on('click','#guardar_dieta',function(e){
		if($("#cedula").val() != null)
		{
			if($('#frm-dieta').valid()){
				var load = open_overlay();
				$.post(base_url+"mvc/controllers/CKardex.php?action=agregarDieta",$('#frm-dieta').serialize(),function(respuesta){
			        load.hide();
			        if(respuesta.rpt){
						resetearFormularioDieta1();
						recargarGridDietas();	
			          	$.notify(respuesta.mensaje,'success');
			        }else{
			        	$.notify(respuesta.mensaje,'error');
			        }
			      },'json');
			}
		}else{
			$.notify('Por favor seleccione un huesped.','error');
		}
		e.preventDefault();
	});

	$(document).on('click','#guardar_diagnostico',function(e){
		if($("#cedula").val() != null)
		{
			if($('#frm-diagnostico').valid()){
				var load = open_overlay();
				$.post(base_url+"mvc/controllers/CKardex.php?action=agregarDiagnostico",$('#frm-diagnostico').serialize(),function(respuesta){
			        load.hide();
			        if(respuesta.rpt){
						resetearFormularioDiagnostico1();	
						recargarGridDiagnostico();
			          	$.notify(respuesta.mensaje,'success');
			        }else{
			        	$.notify(respuesta.mensaje,'error');
			        }
			      },'json');
			}
		}else{
			$.notify('Por favor seleccione un huesped.','error');
		}
		e.preventDefault();
	});	

	function recargarGridMedicamentosKardex(){
		$('#tbl_lista_medicamentos').load(base_url+'mvc/controllers/CKardex.php?action=cargarMedicamentosHuesped',{cedula:$('#cedula').val()});
	}

	function recargarGridAlergias() {
		$('#tbl_lista_alergias').load(base_url+'mvc/controllers/CKardex.php?action=cargarAlegiasHuesped',{cedula:$('#cedula').val()});
	}

	function recargarGridDietas() {
		$('#tbl_lista_dietas').load(base_url+'mvc/controllers/CKardex.php?action=cargarDietasHuesped',{cedula:$('#cedula').val()});
	}

	function recargarGridObservaciones() {
		$('#tbl_lista_observaciones').load(base_url+'mvc/controllers/CKardex.php?action=cargarObservacionesHuesped',{cedula:$('#cedula').val()});
	}

	function recargarGridDiagnostico() {
		$("#tbl_lista_diagnostico").load(base_url+'mvc/controllers/CKardex.php?action=cargarDiagnosticoHuesped',{cedula:$('#cedula').val()});
	}

	function recargarGridMedicamentoSuspendidos() {
		$("#tbl_medicamentos_suspendidos").load(base_url+'mvc/controllers/CKardex.php?action=cargarMedicamentoSuspendidos',{cedula:$('#cedula').val()});
	}

	$('a[href="#medicamentosuspendido"]').click(function(){ recargarGridMedicamentoSuspendidos(); });
	
	$(document).on('click','#guardar_frecuencia_medicamento',function (e) {
		e.preventDefault();
		var load = open_overlay();
		$.post(base_url+'mvc/controllers/CKardex.php?action=guardarFrecuenciaMedicamento',$('#frm-frecuencia').serialize(),function(respuesta){
			load.hide();
	        if(respuesta.rpt){
	          	$.notify(respuesta.mensaje,'success');
	        }else{
	        	$.notify(respuesta.mensaje,'error');
	        }
		},'json');		
	});
	 

	$(document).on('click','.horario_dosis', function(e){
		$('#frm-frecuencia #cedula_frecuencia').val($("#cedula").val());
		$('#frm-frecuencia #id_medicamento').val($(this).attr('id_medicamento'));
		var load = open_overlay();
		$.post(base_url+'mvc/controllers/CKardex.php?action=cargarFrecuenciaDosisPaciente',{cedula:$("#cedula").val(),id_medicamento:$(this).attr('id_medicamento')},function(data){
			if(data.rpt){
	          	for (var i = 1; i <= 13; i++) {
	          		indexdia = 'dia'+i;
	          		indexnoche = 'dia'+i;
	          		$('select[name=dia'+i+']').val(data.dia[indexdia]);
	          		$('select[name=noche'+i+']').val(data.noche[indexnoche]);
	          	}
	          	$('textarea[name=observacion_dia]').val(data.dia.observacion);
	          	$('textarea[name=observacion_noche]').val(data.noche.observacion);
	        }else{
	        	$.notify(data.mensaje,'error');
	        }
			load.hide();
			$('#frecuenciaDosis').modal('toggle');
		},'json');
		e.preventDefault();
	});

	$(document).on('click','.suspender_medicamento', function(e){
		e.preventDefault();
		var id_medicamento = $(this).attr('id_medicamento');
		bootbox.confirm({ 
		  //size: "small",
		  title: "Esta seguro que desea suspender este medicamento?", 
		  message: '<div class="row">  ' +
                                                '<div class="col-md-12"> ' +
                                                '<form class="form-horizontal" id="frm_suspension"> ' +
                                                '<div class="col-md-12 form-group"> ' +
                                                '<label class="control-label" for="motivo_suspension">Especifique el motivo de suspesión del medicamento</label> ' +
                                                '<textarea id="motivo_suspension" name="motivo_suspension" required="required" placeholder="Motivo de la suspesión" class="form-control" style="height: 100px;"> </textarea>' +
                                                '</div> ' +
                                                '<div class="col-md-12 form-group"> ' +
                                                '<label class="control-label" for="name">Fechaa de suspesión</label> ' +
                                                '<input type="date" id="fecha_suspension" required="required" name="fecha_suspension" class="form-control"/>' +
                                                '</div> ' +
                                                '<input type="hidden" name="id_medicamento" id="id_medicamento_supencion" value="'+id_medicamento+'"/>'+
                                                '<input type="hidden" name="cedula" id="cedula_supencion" value="'+$("#cedula").val()+'"/>'+
                                                '</form> </div>  </div>'+
                                                '<script type="text/javascript">$("#frm_suspension").validate()</script>',
		  callback: function(result){ 
		  	if(result && $("#frm_suspension").valid()){
					var load = open_overlay();
			  		$.post(base_url+'mvc/controllers/CKardex.php?action=suspenderMedicamento',$("#frm_suspension").serialize(),function(respuesta){
				        load.hide();
			  			if(respuesta.rpt){
			  				recargarGridMedicamentosKardex();
				          	$.notify(respuesta.mensaje,'success');
				        }else{
				        	$.notify(respuesta.mensaje,'error');
				        }
			  		},'JSON');
	  		}else{
	  			return false;
	  		}
		  },
		  buttons:{
		  	cancel:{
				label: 'Cancelar',
		  	},
		  	confirm:{
		  		label: 'Aceptar',
		  	} 
		  }
		})
	});

	$(document).on('click','#nuevo_medicamentos_kardex',function(e){
		e.preventDefault();
		resetearFormularioMedicar();
		$('#cedula').empty();
		$('#cedula').focus();
	});

	$(document).on('click','.editar_medicamento', function(e){
		var id_medicamento = $(this).attr('id_medicamento');
		var load = open_overlay();
		$.post(base_url+'mvc/controllers/CKardex.php?action=consultarMedicamentoActual',{id:id_medicamento},function(data){
  			$('#fecha').val(data.fecha);
  			$('#duracion').val(data.fecha_final_toma);
  			$('#dosis').val(data.dosis);
  			$('#frecuencia').val(data.frecuencia);
  			$('#id_med').val(data.id);
			crearSelectMedicamento({id:data.medicamento.id_medicamento,text:data.medicamento.nombre_medicamento+"("+data.medicamento.concentracion+")",modelo:data.medicamento});
  			$('#fecha').focus();
			load.hide();
  		},'JSON');
		e.preventDefault();
	});

	$(document).on('click','.eliminar_horario', function(e){
		e.preventDefault();
	});


	function crearSelectMedicamento(data) {
		$("#medicamento").select2({
		    placeholder: "Buscar medicamento",
		    allowClear: true,
		    language: "es",
		    initSelection: function (element, callback) {
                if(data != undefined){
                    callback(data);
                }else{
                    callback({id:0,text:''});
                }
            },
		    ajax: { 
		        url: base_url+'mvc/controllers/CKardex.php?action=obtenerMedicamentosSelect2',
		        cache: "true",
		        type:'POST',
		        dataType: 'json',
		        data: function (data, page) {
		        	data.id_cedula = $('#cedula').val();
		            return data;
		        },
	            error: function(data, page){
	                setTimeout(function(){ $('.select2-results__option').html(data.responseText); },20);
	            }
		    },
		    escapeMarkup: function (markup) { return markup; },
            templateResult: formatResultMedicamento
		});



		if(data != undefined){
        	var s2 = $("#medicamento").data('select2'); 
            s2.trigger('select', { 
              data: data 
            });
        }
	}

	function formatResultMedicamento(item) {
		if(item.id != undefined)
            	return item.text+"<br/><b>Concentración: </b>"+(item.modelo.concentracion == null?'N/A':item.modelo.concentracion)+"<br/><b>Presntación: </b>"+(item.modelo.presentacion == null?'N/A':item.modelo.presentacion);
            else
                return null;
	}


	$(document).on('click','#exportar_excel',function(e){
		e.preventDefault();
		if($('#cedula').val() != null){
			window.open(base_url+'mvc/controllers/CKardex.php?action=exportarKardexExcel&id_paciente='+$('#cedula').val(),'_blank');
		}else{	
			$.notify('Debe seleccionar un huesped.','error');
		}
	});

	function resetearFormularioMedicar() {
		$('#frm-medicar')[0].reset();
		$("#medicamento").empty();
		$('#cedula_huesped').html('');
		$('#nombre_huesped').html('');
		$('#tbl_lista_medicamentos').html('');
		$('#cedula_medicar').val('');
		$('#id_med').val('');
	}

	function resetearFormularioMedicar1() {
		$("#medicamento").empty();
		$('#fecha').val('');
		$('#duracion').val('');
		$('#dosis').val('');
		$('#frecuencia').val('');
		$('#id_med').val('');
	}

	function resetearFormularioAlergia() {
		$('#frm-alergia')[0].reset();
		$('#nombre_huesped_alergia').html('');
		$('#cedula_huesped_alergia').html('');
		$('#tbl_lista_alergias').html('');
	}

	function resetearFormularioAlergia1() {
		$('#frm-alergia #alergia').val('');
	}

	function resetearFormularioObservacion() {
		$('#frm-observacion')[0].reset();
		$('#nombre_huesped_observacion').html('');
		$('#cedula_huesped_observacion').html('');
		$('#tbl_lista_observaciones').html();
	}

	function resetearFormularioObservacion1() {
		$('#frm-observacion #observacion').val('');
		$('#frm-observacion #pendiente').val('');
		$('#frm-observacion #activo').attr('checked','checked');
	}

	function resetearFormularioDieta() {
		$('#frm-dieta')[0].reset();
		$('#tbl_lista_dietas').html('');
		$('#nombre_huesped_dieta').html('');
		$('#cedula_huesped_dieta').html('');

	}

	function resetearFormularioDiagnostico1(){
		$('#frm-diagnostico #observacion').val('');
	}

	function resetearFormularioDiagnostico() {
		$('#frm-diagnostico')[0].reset();
		$("#tbl_lista_diagnostico").html('');
		$('#nombre_huesped_diagnostico').html('');
		$('#cedula_huesped_diagnostico').html('');
        $('#id_diagnostico_ppal').empty();
	}

	function resetearFormularioDieta1(){
		$('#frm-alergia #dieta').val('');	
	}
});

function crearDiagnosticoPpalMultiSelect(data) {
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
        
    if(data != undefined){
        var s2 = $("#id_diagnostico_ppal").data('select2'); 
        data.forEach(function(currentValue,index,arr){
	        s2.trigger('select', { 
	          data: currentValue
	        }); 
        });
    }        
        
	}