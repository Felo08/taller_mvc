$(document).on('ready',function(){
	$("#myTab").tab();
	$('#form1').validate();

	$("#cedula").select2({
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

	$("#forma_pago").select2({
        placeholder: "Buscar forma pago",
        allowClear: true,
        language: "es",
        ajax: { 
            url: base_url+'mvc/controllers/CReciboCajaMayor.php?action=obtenerformapagoselect',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                return data;
            }
        },
    });  
    
	$("#cedula").on('change',function(){
			
	});

	function resetearFormulario() {
		$("#cedula").empty();
		$("#forma_pago").empty();
		$('#consecutivo_anticipo_c').html('');
		$("#form1")[0].reset();
	}


	$(document).on('click',"#guardar",function(e){
	    if($('#form1').valid())
	    {
	      var load = open_overlay();
	      $.post(base_url+"mvc/controllers/CAnticipo.php?action=guardarAnticipo",$('#form1').serialize(),function(respuesta){
	        load.hide();
	        if(respuesta.rpt){
	        	resetearFormulario();
	        	$('#consecutivo_anticipo_c').html(respuesta.consecutivo_anticipo);
	        	$('#factura_dian').html(respuesta.consecutivo_anticipo);
	        	$('#grid').trigger("reloadGrid");
	          	$.notify(respuesta.mensaje,'success');
	        }else{
	        	$.notify(respuesta.mensaje,'eror');
	        }
	      },'json');
	    }
	    e.preventDefault();
	 });

});