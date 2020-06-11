$(document).on('ready',function(){

	$('#form1').validate(); 

	$("#cedula").select2({
	    placeholder: "Buscar Cliente",
	    allowClear: true,
	    language: "es",
	    ajax: { 
	        url: base_url+'mvc/controllers/CCliente.php?action=obtenerClienteSelect2',
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {
	            return data;
	        }
	    },
	});

	$(document).on('click','#agregar_datelle',function (e){
		if($('#Valor').val().length > 0 &&  $('#concepto').val().length > 0){
			html = '<tr style="text-align: center;">'+
					'<td><input type="hidden" value="'+$('#Valor').val()+'" name="detalle[valor][]"/>'+$('#Valor').val()+'</td>'+
					'<td><input type="hidden" value="'+$('#concepto').val()+'" name="detalle[concepto][]"/>'+$('#concepto').val()+'</td>'+
					'<td><button class="btn eliminar_detaller" ><i class="glyphicon glyphicon-remove-circle"></i></button></td>'+
					'</tr>';
			$('#tbl-detalle').append(html);
			$('#Valor').val('');
			$('#concepto').val('');
		}else{
			$.notify('El concepto y valor no pueden estar vacíos.','error');
		}
	});

	$(document).on('click','.eliminar_detaller',function(){
		$(this).parent().parent().remove();
	});

	$(document).on('click','#guardar_comprobante_egreso',function(e){

		if($('#form1').valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/CEgresos.php?action=guardarComprobanteEgreso',$('#form1').serialize(),function(respuesta){
				if(respuesta.rpt){
					$("#form1")[0].reset();
					$("#cedula").select2("val", "");
					$('#tbl-detalle').html('');
					$.notify(respuesta.mensaje,'success');
					$('#no_documento').val(respuesta.parametrizacionFactura.consecutivo_egreso);
				}else{
					$.notify(respuesta.mensaje,'error');
				}
				load.hide();
			},'json');
		}

		e.preventDefault();
	});
});