
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
	

	

$( document ).on('change', "#concepto", function() {
console.log('ntra');

	$.post(base_url+'mvc/controllers/Csalidastock.php',{action:"consultar_disponible",'id_articulo':$(this).val()/*$(this).attr('id_tercero')*/},function(respuesta){

               console.log('aca no entra');
				$('#id_disponible').val(respuesta);
			    $('#id_disponible').html(respuesta);
			    console.log(respuesta);
			
		} ,'json');


});


$( document ).on('click', "#concepto", function() {
console.log('ntra');

	$.post(base_url+'mvc/controllers/Csalidastock.php',{action:"consultar_disponible",'id_articulo':$(this).val()/*$(this).attr('id_tercero')*/},function(respuesta){

               console.log('aca no entra');
				$('#id_disponible').val(respuesta);
			    $('#id_disponible').html(respuesta);
			    console.log(respuesta);
			
		} ,'json');


});






$( document ).on('change', "#id_tipo_concepto", function() {


console.log("concpetos");
    var str = "";
	str += $( this ).val() + " ";
	//alert( "Handler for .change() called." + str);

		$.post(base_url+'mvc/controllers/Csalidastock.php',{action:"consultar_stock_por_tipo",'id_articulo':str/*$(this).attr('id_tercero')*/},function(opciones){
      		$('#concepto').children().remove().end().append(opciones) ;
		});



  //  alert( "Handler for .change() called." + str);

});


$( document ).on('change', "#id_area", function() {
	console.log("area");
    var str = "";
	str += $( this ).val() + " ";
	//alert( "Handler for .change() called." + str);

		$.post(base_url+'mvc/controllers/Ccontactosadmin.php',{action:"consultar_contacto_area",'id_area':str/*$(this).attr('id_tercero')*/},function(opciones){
      		
           
      		$('#recibe').children().remove().end().append(opciones) ;
		});



  
   // alert( "Handler for .change() called." + str);

});





$( ".btn-sm" ).click(function() {
	console.log("click");
	var disponible = 0;
	var cantidad=0;
	var disponible_n=0;
	var valor=0;

	 var cantidad = $("#txtValor").val();

	 disponible =parseInt($('#id_disponible').val());
	
	



console.log(cantidad,'--------',disponible);

     /*if (cantidad==''){

     	 alert("La cantidad ingresada debe ser mayor acero")
      	e.preventDefault();
     }*/
	 if(cantidad>disponible)
	 {
      alert("La cantidad ingresada debe ser menor o igual al disponible")
      e.preventDefault();	
	 }
	 else{
	 	adicionar();
       	disponible_n=parseInt(disponible)-parseInt(cantidad);
       //	console.log(disponible_n----cantidad,'--------',disponible);
       	$('#id_disponible').val(disponible_n);
	   	$('#id_disponible').html(disponible_n);
	 }

	 	console.log("aca");



});



$("#bnt-grabar").click(function(e){

		if($('#frm-factura').valid()){	
			var overlay = open_overlay();	
			$.post('mvc/controllers/Csalidastock.php',$("#frm-factura").serialize(),function(respuesta){
				overlay.hide();
				if(respuesta.rpt){
					console.log("ssss");
					$.notify(respuesta.mensaje,"success");
					$('#no_factura').val(respuesta.consecutivo_actual);
					$('#no_factura').html(respuesta.consecutivo_actual);
		            limpiarFormulario();
		            recargar_grid_salidas();
		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
			},'json');
		}		
			e.preventDefault();	
	});


	$("#bnt-grabar-medicamento").click(function(e){

		console.log("ddddd");

		if($('#frm-factura').valid()){	
			var overlay = open_overlay();	
			$.post('mvc/controllers/Cinventarioresidente.php',$("#frm-factura").serialize(),function(respuesta){
				overlay.hide();
				if(respuesta.rpt){
					$.notify(respuesta.mensaje,"success");
					$('#consecutivo_actual').val(respuesta.consecutivo_actual);
					$('#no_factura').html(respuesta.consecutivo_actual);
		            limpiarFormulario();
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
        $("#id_paciente").select2("val", "");
        $('#tabla tbody').html('');
    }

    function recargar_grid_facturas(){
        $("#listaFacturas").load(base_url+'mvc/controllers/Cinventarioresidente.php?action=listarFacturas');
    }
    function recargar_grid_salidas(){
        $("#listaFacturas").load(base_url+'mvc/controllers/Csalidastock.php?action=listarsalida');
    }

     function recargar_grid_entrada_resi(){
        $("#listaFacturas").load(base_url+'mvc/controllers/Cinventarioresidente.php?action=listarentradaresidente');
    }