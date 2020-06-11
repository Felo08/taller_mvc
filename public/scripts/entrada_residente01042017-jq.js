$(document).ready(function(){
	$('#frm-factura').validate();	

	$("#id_paciente").select2({
        placeholder: "Buscar paciente",
        allowClear: true,
        language: "es",
        ajax: { 
            url: 'mvc/controllers/CHuesped.php?action=obtenerHuespedsSelect',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                return data;
            }
        },
    });
});


	$("#bnt-grabar").click(function(e){

		if($('#frm-factura').valid()){	
			var overlay = open_overlay();	
			$.post('mvc/controllers/Cinventarioresidente.php',$("#frm-factura").serialize(),function(respuesta){
				overlay.hide();
				if(respuesta.rpt){
					limpiarFormulario();
					$.notify(respuesta.mensaje,"success");
					$('#consecutivo_actual').val(respuesta.consecutivo_actual);
					$('#no_factura').html(respuesta.consecutivo_actual);
		            
		            recargar_grid_facturas();
		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
			},'json');
		}		
			e.preventDefault();	
	});


	$("#bnt-grabar-medicamento").click(function(e){

		

		if($('#frm-factura').valid()){	
			var overlay = open_overlay();	
			$.post('mvc/controllers/Cinventarioresidente.php',$("#frm-factura").serialize(),function(respuesta){
				overlay.hide();
				if(respuesta.rpt){
					limpiarFormulario();
					$.notify(respuesta.mensaje,"success");
					$('#consecutivo_actual').val(respuesta.consecutivo_actual);
					$('#no_factura').html(respuesta.consecutivo_actual);
		            
		            recargar_grid_entrada_resi();
		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
			},'json');
		}		
			e.preventDefault();	
	});
	
	
	function limpiarFormulario() {
        $("#frm-factura")[0].reset();
        //$("#frm-factura")[0].reset();
        $("#id_paciente").select2("val", "");
        $('#tabla tbody').html('');
    }

    function recargar_grid_facturas(){
        $("#listaFacturas").load(base_url+'mvc/controllers/Cinventarioresidente.php?action=listarFacturas');
    }

     function recargar_grid_entrada_resi(){
        $("#listaFacturas").load(base_url+'mvc/controllers/Cinventarioresidente.php?action=listarentradaresidente');
    }