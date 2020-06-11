	
$(document).on('click',".btn_edit_imprimir", function(e)
	{
		$('#mimodalpdf').find('iframe').attr('src',base_url+'mvc/controllers/Chistoria.php?action=generarhistoriaPDF&id_cedula='+$(this).attr('id_cedula'));
		/*$("#mimodalpdf").modal("show");
		e.preventDefault();// es como un return False, frena el comportamiento natural de un evento
		
		*/
	});
	
	



		
	
	
		
	$(document).on('keyup',"#buscar_hc",function(){
      $.post(base_url+'mvc/controllers/Chistoria.php',$("#frm_buscar_hc").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);

      });



	});
	
	
	
		







 
		

	function recargar_grid(){

		 $.post('http://localhost/cliniges/mvc/controllers/Chistoria.php',{action:"recargar_historia_cons"},function(respuesta)
	            {
	            	$("#contenedor_list_productos").html(respuesta);


	            	//console.log(respuesta);
					

	            });
	}


	$('#mimodalpdf').find('iframe').on('load', function(){
			$(this).css('height','541px');
	});

