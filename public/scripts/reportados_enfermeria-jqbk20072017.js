$(document).on('ready',function(){
	$('#reportEnfermeria').validate();

	$("#cedula").select2({
	    placeholder: "Buscar huesped",
	    allowClear: true,
	    language: "es",
	    ajax: { 
	        url: base_url+'mvc/controllers/CEnfermeria.php?action=obtenerHuesped',
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {
	        	data.fecha = $("#fecha").val();
	            return data;
	        }
	    },
	});
});