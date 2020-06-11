var validadorFiltros = undefined;
$(document).on('ready',function(e){
	$('#form_nuevo_nota').validate(); 

	validadorFiltros = $('#frm_filtro_fechas').validate();

	$(document).on('click','#consultar',function(){
		recargarGrid(false);
	});


	$("#cedula").select2({
	    placeholder: "Buscar Residente",
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


	$(document).on('click','#agregar_datelle',function (e){
		if($('#Valor_detalle').val().length > 0 &&  $('#concepto_detalle').val().length > 0){
			html = '<tr style="text-align: center;">'+
					'<td><input type="hidden" value="'+$('#concepto_detalle').val()+'" name="detalle[concepto][]"/>'+$('#concepto_detalle').val()+'</td>'+
					'<td><input class="Valor_detalle" type="hidden" value="'+$('#Valor_detalle').val()+'" name="detalle[valor][]"/>'+$('#Valor_detalle').val()+'</td>'+
					'<td><button class="btn eliminar_detalle" ><i class="glyphicon glyphicon-remove-circle"></i></button></td>'+
					'</tr>';
			$('#tbl-detalle tbody').append(html);
			calcular_total_nota();
			$('#Valor_detalle').val('');
			$('#concepto_detalle').val('');
		}else{
			$.notify('El concepto y valor no pueden estar vacíos.','error');
		}
	});


	$(document).on('click','.eliminar_detalle',function(){
		$(this).parent().parent().remove();
		calcular_total_nota();
	});

	function calcular_total_nota() {
		var total = 0;
		$('.Valor_detalle').each(function(i,elemento){
			total += parseFloat($(elemento).val());
		}).promise().done(function(){
			$('#valor_total_c').html(total);
			$('#valor_total').val(total);
		});
	}

	$(document).on('click','.btn-anular-nota',function(e) {
		e.preventDefault();
		var load = open_overlay();
		$.post(base_url+'mvc/controllers/CNotasCargo.php?action=anularNota',{'id_nota':$(this).attr('idnota')}, function(respuesta){
			if(respuesta.rpt){
				$.notify(respuesta.mensaje,'success');
				recargarGrid(true)
			}else{
				$.notify(respuesta.mensaje,'error');
			}
			load.hide();
		},'json');	
	});


	$(document).on('click','#guardar_nota_cargo',function(e){

		if($('#form_nuevo_nota').valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/CNotasCargo.php?action=guardarNotaDeCargo',$('#form_nuevo_nota').serialize(),function(respuesta){
				if(respuesta.rpt){
					$("#form_nuevo_nota")[0].reset();
					$("#cedula").empty();
					$('#tbl-detalle tbody').html('');
					$('#valor_total_c').html(0);
					$('#valor_total').val(0);
					$.notify(respuesta.mensaje,'success');
					$('#no_documento').val(respuesta.consecutivo_nota);
					$('#no_documento_c').html(respuesta.consecutivo_nota);
				}else{
					$.notify(respuesta.mensaje,'error');
				}
				load.hide();
			},'json');
		}

		e.preventDefault();
	});

	$('a[href="#listanotas"]').click(function(){
		recargarGrid(true);
	});
	

	function recargarGrid(reset) {
		setTimeout(function(){
			data = {};
			if($('#frm_filtro_fechas').valid() && $('#frm_filtro_fechas').valid())
				data = $('#frm_filtro_fechas').serializeArray();
			else{
				if(reset)
					validadorFiltros.resetForm();
			}
			$('#tbl_lista_notas').load(base_url+'mvc/controllers/CNotasCargo.php?action=obetenerNotasGrid',data);
		},20);
	}


});