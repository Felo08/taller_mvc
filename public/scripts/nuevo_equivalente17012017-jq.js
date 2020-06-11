var validadorFiltros = undefined;
$(document).on('ready',function(e){
	$('#form_nuevo_documento').validate(); 
	validadorFiltros = $('#frm_filtro').validate();

	$(document).on('click','#consultar',function(){
		recargarGrid(false);
	});


	$("#cedula").select2({
	    placeholder: "Buscar Cliente",
	    allowClear: true,
	    language: "es",
	    ajax: { 
	        url: base_url+'mvc/controllers/CCliente.php?action=obtenerClienteTipoSelect2',
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {
	            return data;
	        }
	    },
	});


	$(document).on('click','#agregar_datelle',function (e){
		if($('#Valor_detalle').val().length > 0 &&  $('#concepto_detalle').val().length > 0){
			html = '<tr style="text-align: center;">'+
					'<td><input type="hidden" value="'+$('#concepto_detalle').val()+'" name="detalle[concepto][]"/>'+$('#concepto_detalle').val()+'</td>'+
					'<td><input class="Valor_detalle" type="hidden" value="'+$('#Valor_detalle').val()+'" name="detalle[valor][]"/>'+$('#Valor_detalle').val()+'</td>'+
					'<td><button class="btn eliminar_detalle" ><i class="glyphicon glyphicon-remove-circle"></i></button></td>'+
					'</tr>';
			$('#tbl-detalle').append(html);
			calcular_total_concepto();
			$('#Valor_datelle').val('');
			$('#concepto_datelle').val('');
		}else{
			$.notify('El concepto y valor no pueden estar vacíos.','error');
		}
	});


	$(document).on('click','.eliminar_detalle',function(){
		$(this).parent().parent().remove();
		calcular_total_concepto();
	});

	function calcular_total_concepto() {
		var total = 0;
		$('.Valor_detalle').each(function(i,elemento){
			total += parseFloat($(elemento).val());
		}).promise().done(function(){
			$('#valor_total_c').html(total);
			$('#valor_total').val(total);
		});
	}

	$(document).on('click','.btn-eliminar-equivalencia',function(e) {
		e.preventDefault();
		var load = open_overlay();
		$.post(base_url+'mvc/controllers/CEquivalente.php?action=anularEquivalencia',{'id_equivalente':$(this).attr('idequivalente')}, function(respuesta){
			if(respuesta.rpt){
				$.notify(respuesta.mensaje,'success');
				recargarGrid(true)
			}else{
				$.notify(respuesta.mensaje,'error');
			}
			load.hide();
		},'json');	
	});


	$(document).on('click','#guardar_comprobante_egreso',function(e){

		if($('#form_nuevo_documento').valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/CEquivalente.php?action=guardarDocumentoEquivalencia',$('#form_nuevo_documento').serialize(),function(respuesta){
				if(respuesta.rpt){
					$("#form_nuevo_documento")[0].reset();
					$("#cedula").empty();
					$('#tbl-detalle').html('');
					$.notify(respuesta.mensaje,'success');
					$('#no_documento').val(respuesta.factura_equivalen);
				}else{
					$.notify(respuesta.mensaje,'error');
				}
				load.hide();
			},'json');
		}

		e.preventDefault();
	});

	$('a[href="#listaEquivalentes"]').click(function(){
		recargarGrid(true);
	});
	

	function recargarGrid(reset) {
		setTimeout(function(){
			data = {};
			if($('#frm_filtro').valid() && $('#frm_filtro').valid())
				data = $('#frm_filtro').serializeArray();
			else{
				if(reset)
					validadorFiltros.resetForm();
			}
			$('#tbl_lista_equivalentes').load(base_url+'mvc/controllers/CEquivalente.php?action=obetenerEquivalenciasGrid',data);
		},20);
	}


});