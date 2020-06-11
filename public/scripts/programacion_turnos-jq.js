/*$(document).ready(function(){
		console.log("Evento ready");
		validarFormulario();

	$.validator.addMethod("cedulaUnica", function(value, element) {
	    var isSuccess = false;
   		$.ajax({ url: base_url+"mvc/controllers/Ccontactos.php", 
            data: {'action':'validarCedulaUsuario','cedula':value}, 
            async: false, 
            success: 
                function(msg) { isSuccess = msg === "true" ? true : false }
          });
    return isSuccess;
	}, "Esta cedula ya se encuentra asignada a un paciente, por favor utilice una diferente.");	
});*/
	

function validarFormulario(){
    $("#frm-usuario").validate();
}

	$("#btn-enviar").click(function(e){
    	e.preventDefault();	

		if($("#frm-usuario").valid()){



			var load = open_overlay();
			$.post(base_url+'mvc/controllers/Cusuarios.php?action=asignar_turnos',$("#frm-usuario").serialize(),function(respuesta){
				$("#contenedor_lista_turnos").html(respuesta);
				load.hide();
			});
	        //recargar_grid();
    	}
		

	});


		$(document).on("click", "#btn_guardar", function(e){

			console.log("dssss");
    	//e.preventDefault();	

		if($("#frm-usuario").valid()){



			var load = open_overlay();
			$.post(base_url+'mvc/controllers/Cusuarios.php?action=guardar',$("#frm-usuario").serialize()+"&"+$("#frm_lista_turnos").serialize(),function(respuesta){
				
               if(respuesta.rpt){
                  $.notify(respuesta.mensaje,'success');
                  $("#contenedor_lista_turnos").html('');
               }
				load.hide();
                



			},"JSON");
	        //recargar_grid();
    	}
		

	});






