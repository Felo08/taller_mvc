$(document).ready(function(){
	$('#frm-ordenes').validate();	
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
	
});


	$("#bnt_guardar").click(function(e){
		e.preventDefault();	
		if($('#frm-ordenes').valid() && $('#frm-ordenes').valid()){
			loader = open_overlay();	
			$.post(base_url+'mvc/controllers/Cordenes.php',$("#frm-ordenes").serialize(),function(respuesta){
				if(respuesta.rpt){
					$("#cedula").val('').trigger('change');
		        	$('#frm-ordenes')[0].reset();
					$.notify(respuesta.mensaje,"success");
		             recargar_grid();
		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				loader.hide();
			},'json');

		}

	});


$(document).on('keyup',"#buscar_usuario",function(){
      $.post(base_url+'mvc/controllers/Cordenes.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
          $("#load").hide();
      });



	});
	
	
	
	
	$(document).on('click',".btn_eliminar_producto",function()
	{
   
     var txt;
	var r = confirm("Desea eliminar?");
		if (r == true) 
		{
    		$.post(base_url+'mvc/controllers/Cordenes.php',{action:"eliminar",'id_examen':$(this).attr('id_examen')},function(respuesta)
				{
					console.log(respuesta);
			      if(respuesta.rpt)
			      {
							$.notify(respuesta.mensaje,"success");
				             recargar_grid();

				   }else{
				       		$.notify(respuesta.mensaje,"error");
				       	}
				},'json');
		} 

	
});



	

	function recargar_grid(){

		 $.post(base_url+'mvc/controllers/Cordenes.php',{action:"recargar_ordenes"},function(respuesta)
	            {
	            	$("#contenedor_list_productos").html(respuesta);


	            	//console.log(respuesta);
					

	            });
	}