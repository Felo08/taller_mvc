$(document).ready(function(){
	$('#frm_login').validate();
	$('#frm_terminos_condiciones').validate();
	$(document).on('click', '#btn_iniciar_sesion',function(e){
		if($('#frm_login').valid()){
			var overlay = open_overlay();	
			$.post('mvc/controllers/CLogin.php',$("#frm_login").serialize(),function(respuesta){
				if(!respuesta.rpt){
		       		$.notify(respuesta.mensaje,respuesta.notyType);
		       	}else{
		       		if (respuesta.aceptar_terminos_condiciones) {
						window.location.assign(respuesta.url);
		       		}else{
		       			$('#id_usuario_terminos_condiciones').val(respuesta.usuario.id_usuario);
		       			$('#usuario_terminos_condiciones').html(respuesta.usuario.nombres);
		       			$('#acptarTerminosCondiciones').modal('toggle');
		       		}
		       	}
		       	overlay.hide();
			},'json');
		}
		e.preventDefault();
	});

	$(document).on('click','#btn_aceptar_terminos',function(e){
		if( $('#aceptar_termino').prop('checked') ){
			var overlay = open_overlay();	
			$.post('mvc/controllers/CLogin.php?action=aceptarTerminosIniciarSesion',$("#frm_terminos_condiciones").serialize(),function(respuesta){
				if(!respuesta.rpt){
					$.notify(respuesta.mensaje,respuesta.notyType);
				}else{
					window.location.assign(respuesta.url);
				}
				overlay.hide();
			},"JSON");
		}else{
			$.notify('Debe aceptar los terminos y condiciones.','warn');
		}
	});

	$(document).on('keypress', '#inputPassword',function(e) {
	    if(e.which == 13) {
	    	$('#btn_iniciar_sesion').trigger('click');
	    }
	});

	$(document).on('keypress', '#usuario',function(e) {
	    if(e.which == 13) {
	    	$('#btn_iniciar_sesion').trigger('click');
	    }
	});

});