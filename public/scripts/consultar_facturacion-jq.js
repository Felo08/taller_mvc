

var datosPaciente = null;

$(document).on('ready',function(){
	$('#form_fac').validate();

	$("#cedula").select2({
	    placeholder: "Buscar huesped",
	    allowClear: true,
	    language: "es",
	    ajax: { 
	        url: base_url+'mvc/controllers/CHuesped.php?action=obtenerHuespedsSelectodos',
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {
	            return data;
	        }
	    },
	});

	$("#cedula").on('change',function(){


		if($(this).val() != null){
			$.post(base_url+'mvc/controllers/CFacturacion.php?action=obtenerInformacionFactufacionCliente',{'cliente':$(this).val()},function(data){
				var html = '';
				if(data.rpt){
					datosPaciente = data;
					$('#factura_dian_c').html(data.consecutivo_actual);
					$('#factura_dian').val(data.consecutivo_actual);
					$('#paciente_c').html(data.husped.nombre + " " + data.husped.apellido);
					$('#paciente').val(data.husped.id_cedula);

					
					if(Object.keys(data.contacto).length > 0){

						$('#contacto_nombre').html(data.contacto.nombre_factura);
						$('#nombre').val(data.contacto.nombre_factura);
						$('#contacto_nit').html(data.contacto.nit_factura);
						$('#nit').val(data.contacto.nit_factura);
						$('#contacto_direccion').html(data.contacto.direccion_factura);
						$('#direccion').val(data.contacto.direccion_factura);
						$('#contacto_telefono').html(data.contacto.telefono_factura);
						$('#telefono').val(data.contacto.telefono_factura);
						$('#correo_contacto').html(data.contacto.correo_factura);
						$('#correo').val(data.contacto.correo_factura);
					}
					else

					{

						$('#contacto_nombre').html("");
						$('#nombre').val("");
						$('#contacto_nit').html("");
						$('#nit').val("");
						$('#contacto_direccion').html("");
						$('#direccion').val("");
						$('#contacto_telefono').html("");
						$('#telefono').val("");
						$('#correo_contacto').html("");
						$('#correo').val("");

					}

					if(Object.keys(data.datosComercial).length > 0){
						$('#pre_valor_pagar').html(data.datosComercial.valor_paga);
						$('#pre_valor_unitario').html(data.datosComercial.valor_paga);
						$('#valor_pagar').val(data.datosComercial.valor_paga);
						$('#valor_unitario').val(data.datosComercial.valor_paga);
					}
					/*for(i in data.datosComercial){
						datosComercial = data.datosComercial[i];
						html += '<tr>'
								//+'<td><input type="hidden" name="datosComerciales[id]" value="'+datosComercial.id+'"/>01</td>'
								+'<td><textarea class="form-control" id="descripcion_factura" name="descripcion_factura"></textarea></td>'
								+'<td><input type="hidden" name="opcion[]" value="'+datosComercial.valor_paga+'"/>'+datosComercial.valor_paga+'</td>'
								+'</tr>';
					}
					$('#tbl_comercial tbody').html(html); */
				}else{
					$.notify(data.mensaje,'error');
					$('#generar_notas').attr('disabled','disabled');
				}
			},'json');
		}else{
			resetearFormulario();
		}
	});

	function resetearFormulario() {
		$("#cedula").empty();
		$('pre').html('');
		$("#form_fac")[0].reset();
		datosPaciente = null;
	}

	function recargarGrid() {
		$('#tbl_parametrizacion_facturacion').load(base_url+'mvc/controllers/CFacturacion.php?action=recargarGridFacturacion');
	}

	$('a[href="#verFac"]').click(function(){
		recargarGrid();
	});


	 $(document).on('blur','#fecha_inicial',function(){
		calcular_dias_incapacidad();
	});

	$(document).on('blur','#fecha_final',function(){
		calcular_dias_incapacidad();	
	});

	function calcular_dias_incapacidad(){
		if($('#fecha_final').valid()){
			var a = moment($('#fecha_final').val());
			var b = moment($('#fecha_inicial').val());
			var days = a.diff(b, 'days') + 1;
			$("#cantidad_dias").val(days);
			$("#pre_cantidad_dias").html(days);

			if(datosPaciente != null){
				if(datosPaciente.datosComercial.tipo_plan == 7){
					total_pagar = days * datosPaciente.datosComercial.valor_paga;
					$('#pre_valor_pagar').html(total_pagar);
					$('#valor_pagar').val(total_pagar);
				}
			}
		}
	}




	$(document).on('click',"#crearFacturacion",function(e){
	    if($('#form_fac').valid())
	    {
	      var load = open_overlay();
	      $.post(base_url+"mvc/controllers/CFacturacion.php?action=insertarFacturacion",$('#form_fac').serialize(),function(respuesta){
	        load.hide();
	        if(respuesta.rpt){
	        	resetearFormulario();	
	          	$.notify(respuesta.mensaje,'success');
	          //window.location.replace("<?php echo base_url('cliniges/recibos_caja_m/formato_recibo.php?id_factura='); ?>"+respuesta.id_factura);
	        }else{
	        	$.notify(respuesta.mensaje,'eror');
	        }
	      },'json');
	    }
	    e.preventDefault();
	 });

	  $(document).on('change','.chk-abono',function(e){
	    $(this).parent().parent().find('.abono').val('');
	    if($(this).is(':checked')){
	      $(this).parent().parent().find('.abono').prop("disabled", false);
	    }else{
	      valorInicial = parseInt($(this).parent().parent().find('.valor_concepto').val());
	      $(this).parent().parent().find('.valor_restante').html(valorInicial);
	      $(this).parent().parent().find('.abono').prop("disabled", true);
	    }
	    calcularTotalPago();
	  });

	  $(document).on('keyup','.abono',function(e){
	      if(e.which==8){
	        validarAbono(e,this);
	      }
	      calcularTotalPago();
	  });

	  $(document).on('keyup',"#valor_mayor", function(e){
	      calcularTotalPago();
	  });

	  $(document).on('keypress','.abono', function(e){
	    validarAbono(e,this);   
	  });

	  $(document).on('blur','.abono', function(e){
	    validarAbono(e,this);   
	  });
	  
	  function validarAbono(e,t) {
	      var valor = 0, valorInicial = 0 ;
	      if($.isNumeric(String.fromCharCode(e.which))) {
	        if( (valor = parseInt($(t).val()+String.fromCharCode(e.which))) > (valorInicial = parseInt($(t).parent().parent().find('.valor_concepto').val())) ) {
	          e.preventDefault();
	        }else{
	            $(t).parent().parent().find('.valor_restante').html(valorInicial - valor);
	        }
	      }else{
	        valorInicial = parseInt($(t).parent().parent().find('.valor_concepto').val());
	        valor = $(t).val();
	        $(t).parent().parent().find('.valor_restante').html(valorInicial - valor);
	        e.preventDefault();
	      }
	  }
	  function calcularTotalPago() {
	    var total = 0;
	    $('.abono').each(function(i,elemento){
	      if($.isNumeric($(elemento).val())) {
	        total += parseInt($(elemento).val());
	      }
	    }).promise().done(function(){
	      if($.isNumeric($("#valor_mayor").val()))
	        total += parseInt($("#valor_mayor").val());
	      $("#lbl_valor_total").html(total);
	      $("#valor_total").val(total);
	      $("#valor_total_c").html(total);

	    });
	  }

});