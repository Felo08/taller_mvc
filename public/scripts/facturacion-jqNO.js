$(document).ready(function(){
		console.log("Facturacion");

	});


	$("#bnt-grabar").click(function(e){

		console.log("Paula");
		$("#load").toggle();	
		console.log("Paula");
		$.post('http://localhost/cliniges/mvc/controllers/Cfacturacion.php',$("#frm-factura").serialize(),function(respuesta){
			console.log(respuesta);
			if(respuesta.rpt){
				$.notify(respuesta.mensaje,"success");
	             recargar_grid();

	       	}else{
	       		$.notify(respuesta.mensaje,"error");
	       	}
			$("#load").toggle();
		},'json');

		e.preventDefault();	
		console.log("Paula");
	});
	
	
	

	
	
	
	

	function recargar_grid(){

		 $.post('http://localhost/sp/mvc/controllers/Cusuarios.php',{action:"recargar_usuarios"},function(respuesta)
	            {
	            	$("#contenedor_list_productos").html(respuesta);


	            	//console.log(respuesta);
					

	            });
	}