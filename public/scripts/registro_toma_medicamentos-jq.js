var load;

$(document).on('ready',function(){
    $('#frm-buscar').validate();
	$('#frm_toma').validate();

	$("#cedula").select2({
	    placeholder: "Buscar paciente",
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

	/*$('#fecha').datetimepicker({
	    timepicker:false,
	    format:'Y-m-d'
	});*/

/*	$(document).on('change','.chk_toma_medicamento', function(e){
		e.preventDefault();
		var chk = $(this);
		var hora = 0;
		var turno = '';
		if(chk.attr('campo').indexOf('manana')>=0){
			hora = chk.attr('campo').replace('manana', '');
			turno = 'M';
		}else if(chk.attr('campo').indexOf('tarde')>=0){
			hora = chk.attr('campo').replace('tarde', '');
			turno = 'T';
		}else if(chk.attr('campo').indexOf('noche')>=0){
			hora = chk.attr('campo').replace('noche', '');
			turno = 'N';
		}else if(chk.attr('campo').indexOf('madrugada')>=0){
			hora = chk.attr('campo').replace('madrugada', '');
			turno = 'MA';
		}

		row = $("#grid").getRowData($(this).attr('id_km'));
		//console.log(chk.attr('valor_toma'));return;
		bootbox.confirm({ 
		  //size: "small",
		  title: "Registrar dosis medicamento", 
		  message: '<div class="row">  ' +
                                                '<div class="col-md-12"> ' +
                                                '<form class="form" id="frm_registro_medica"> ' +
	                                            '<div class="col-md-12 form-group"> ' +
	                                                '<div class="col-md-6 form-group"> ' +
		                                                '<label class="control-label" for="">Medicamento</label> ' +
		                                                '<pre class="form-control">'+row.medicamento+'</pre>' +
	                                                '</div> ' +
	                                                '<div class="col-md-6 form-group"> ' +
		                                                '<label class="control-label" for="">Dosis</label> ' +
		                                                '<pre class="form-control">'+row.dosis+'</pre>' +
	                                                '</div> ' +
	                                            '</div> ' +
	                                            '<div class="col-md-12 form-group"> ' +
	                                                '<label class="control-label" for="">Registrado por</label> ' +
	                                                '<pre class="form-control">'+usuario_registro+'</pre>' +
                                                '</div> ' +
                                                '<div class="col-md-12 form-group"> ' +
                                                	'<label class="control-label" for="observacion_toma">Observación</label> ' +
                                                	'<textarea id="observacion_toma" name="observacion" placeholder="Obersevacioón" class="form-control" style="height: 100px;"> </textarea>' +
                                                '</div> ' +
                                                '<input type="hidden" name="id_medicamento" id="id_medicamento_registro" value="'+row.id+'"/>'+
                                                '<input type="hidden" name="id_medicamento_maestro" id="id_medicamento_maestro" value="'+row.id_medicamento_maestro+'"/>'+
                                                '<input type="hidden" name="valor_toma" id="valor_toma" value="'+chk.attr('valor_toma')+'"/>'+
                                                '<input type="hidden" name="id_cedula" id="cedula_registro" value="'+row.id_cedula+'"/>'+
                                                '<input type="hidden" name="hora" id="hora_registro" value="'+hora+'"/>'+
                                                '<input type="hidden" name="turno" id="turno_registro" value="'+turno+'"/>'+
                                                '<input type="hidden" name="fecha" id="fecha_registro" value="'+$("#fecha").val()+'"/>'+
                                                '</form> </div>  </div>'+
                                                '<script type="text/javascript">$("#frm_suspension").validate()</script>',
		  callback: function(result){ 
		  	if(result){
		  		if($("#frm_registro_medica").valid()){
						var load = open_overlay();
						var r = true;
				  		$.ajax({
						  type: 'POST',
						  url: base_url+'mvc/controllers/CKardex.php?action=guardarRegistroTomaMedicamento',
						  data: $("#frm_registro_medica").serialize(),
						  success: function(respuesta){
					        load.hide();
				  			if(respuesta.rpt){
				  				chk.remove();
				  				$("#btn_buscar").trigger('click');
					          	$.notify(respuesta.mensaje,'success');
			  					bootbox.hideAll()
					        }else{
					        	$.notify(respuesta.mensaje,'error');
					        	r = false;
					        }
				  		  },
						  dataType: 'JSON',
						  async:false
						});
					return r;
		  		}else{
		  			return false;
		  		}
		  	}else{
		  		chk.prop('checked', false);
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
	});*/

	$(document).on('change','.chk_toma_medicamento', function(e){
		var chk = $(this);
		if (chk.is(':checked')) {
			var load = open_overlay();
			var r = true;
			row = $("#grid").getRowData($(this).attr('id_km'));
	  		$.ajax({
			  type: 'POST',
			  url: base_url+'mvc/controllers/CKardex.php?action=validarExistenciaMedicamento',
			  data: 'id_medicamento_maestro='+row.id_medicamento_maestro+'&id_cedula='+row.id_cedula+'&valor_toma='+chk.attr('valor_toma'),
			  success: function(respuesta){
		        load.hide();
		        $('[data-toggle="tooltip"], .tooltip').tooltip("hide");
	  			if(!respuesta.rpt){
	  				chk.prop('checked', false);
		        	$.notify(respuesta.mensaje,'error');
		        	r = false;
		        }
	  		  },
			  dataType: 'JSON',
			  async:false
			});
		}

	});

	$(document).on('click', "#btn_guardar_medicamentos", function(e){
		if($('.chk_toma_medicamento:checked').length > 0){
			bootbox.confirm({
		        message: "Una vez guarde los medicamentos, se realizara la descarga de todos los medicamentos seleccionados en inventario. Esta seguro de guardar?", 
		        locale: 'es', 
		        callback: function(result) {                
		            if (result) {                                             
		                data = [];
						$('.chk_toma_medicamento:checked').each(function(i,elemento){
							row = $("#grid").getRowData($(elemento).attr('id_km'));
							var chk = $(elemento);
							var hora = 0;
							var turno = '';
							if(chk.attr('campo').indexOf('manana')>=0){
								hora = chk.attr('campo').replace('manana', '');
								turno = 'M';
							}else if(chk.attr('campo').indexOf('tarde')>=0){
								hora = chk.attr('campo').replace('tarde', '');
								turno = 'T';
							}else if(chk.attr('campo').indexOf('noche')>=0){
								hora = chk.attr('campo').replace('noche', '');
								turno = 'N';
							}else if(chk.attr('campo').indexOf('madrugada')>=0){
								hora = chk.attr('campo').replace('madrugada', '');
								turno = 'MA';
							}
							r = {id_medicamento: row.id ,id_medicamento_maestro: row.id_medicamento_maestro,valor_toma: $(elemento).attr('valor_toma'),id_cedula: row.id_cedula,hora: hora,turno: turno,fecha:$("#fecha").val()};
							data.push(r);
					    }).promise().done(function(){
					    	var load1 = open_overlay();
					    	$.post(base_url+'mvc/controllers/CKardex.php?action=guardarMedicamentosMasivamente',{data: data},function(data){
								if(data.rpt){
									$.notify(data.mensaje,"success");
									$("#btn_buscar").trigger('click');
								}else{
				   		       		$.notify(data.mensaje,"error");
								}
								load1.hide();
							},'JSON');
					    }); 
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



		}else{
			$.notify("Debe selecionar medicamentos para guardar.",'error');
		}
	});

	$(document).on('click', "#btn_limpiar", function(e){
		e.preventDefault();
		$("#cedula").empty();
		$("#fecha").val('');
		$("#btn_buscar").trigger('click');
	});

	$(document).on('click', ".btn_reg_toma", function(e){
		e.preventDefault();
		row = $("#grid").getRowData($(this).attr('id_km'));
		if(row.num_toma.length > 0){
			$('#msg_error_toma_medicamento').show();
			$("#guardar_toma_medicamento").hide();
			$('#cantidad_toma_reg').val(row.num_toma);
		}else{
			$("#guardar_toma_medicamento").show();
			$('#msg_error_toma_medicamento').hide();
		}

		$('#paciente_reg').html(row.paciente);
		$('#medicamento_reg').html(row.medicamento);
		$('#fecha_reg').html(row.fecha);
		$('#dosis_reg').html(row.dosis);
		$('#id_km_medicamento_reg').val(row.id);
		$('#frecuencia_reg').html(row.frecuencia);
		$('#modalRegTomaMedicamento').modal('toggle');
	});

	$(document).on('click', "#guardar_toma_medicamento", function(e){
		e.preventDefault();
		if( $('#frm_toma').valid() ){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/CKardex.php?action=guardarRegistroTomaMedicamento',$('#frm_toma').serialize(),function(data){
				if(data.rpt){
					$('#modalRegTomaMedicamento').modal('toggle');
					$.notify(data.mensaje,"success");
					$("#btn_buscar").trigger('click');
				}else{
   		       		$.notify(data.mensaje,"error");
				}
				load.hide();
			},'JSON');
		}
	});

	

	$(document).on('click', "#btn_buscar", function(e){
		if ($('#frm-buscar').valid()) {
			e.preventDefault();

		    var f = { groupOp: "AND", rules: [], fecha_registro_medica:'' };

		    if($("#cedula").val() != null && $("#cedula").val() != "")
		    	f.rules.push({ field: "id_cedula", op: "eq", data: $("#cedula").val() });

/*		    if($("#fecha").val() != null && $("#fecha").val() != "")
		    	f.rules.push({ field: "fecha_registro_medica", op: "eq", data: $("#fecha").val() });
*/
		    var grid = $('#grid');
		    grid[0].p.search = f.rules.length > 0;
		    $.extend(grid[0].p.postData, { filters: JSON.stringify(f), fecha_registro_medica:$("#fecha").val() });
		    grid.trigger("reloadGrid", [{ page: 1 }]);
		}
	});

});