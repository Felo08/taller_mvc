$(document).on('ready',function(){
	$("#form_parametrizacion").validate();

	$(document).on('submit','#form_parametrizacion',function(e){
		e.preventDefault();
		if($("#form_parametrizacion").valid()){
			var data = new FormData(document.getElementById('form_parametrizacion'));
			var load = open_overlay();
			$.ajax({
		        url: base_url+'mvc/controllers/CParametrizacion.php?action=insertarFacturaParam',
		        type: 'POST',
		        dataType: "JSON",
		        data: data,
		        processData: false,
		        contentType: false,
		        success: function (respuesta, status)
		        {
		        	if(respuesta.rpt){
		        		$.notify(respuesta.mensaje,"success");
		        		$("#form_parametrizacion")[0].reset();
		        	}else{
						$.notify(respuesta.mensaje,"error");	        		
		        	}
			       	load.hide();
		        },
		        error: function (xhr, desc, err)
		        {
		        	$.notify(respuesta.mensaje,"error");
		        	$("#load").toggle();
		        }
		    });



		}
	});

	$("#archivo").fileinput({language:'es', 'showUpload':true, 'previewFileType':'image'});
});