$(document).ready(function(){


	$("#frm-medica").validate();

	$("#id_cedula").select2({
	    placeholder: "Buscar trabajador",
	    allowClear: true,
	    language: "es",
	    ajax: { 
	        url: base_url+'mvc/controllers/CHuesped.php?action=obtenerempleadoselect',
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {
	            return data;
	        }
	    },
	});

});  


	$("#bnt-guardar").click(function(e){
   console.log("saludo");
		if($('#frm-medica').valid() && $('#frm-medica').valid()){
			loader = open_overlay();
			$.post(base_url+'mvc/controllers/CegresoTrabajador.php',$("#frm-medica").serialize(),function(respuesta){
				if(respuesta.rpt){
					$("#id_cedula").val('').trigger('change');
			       	$('#frm-medica')[0].reset();
					$.notify(respuesta.mensaje,"success");
		             recargar_grid();
		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				loader.hide();
			},'json');
		}
		e.preventDefault();	

	});
	
	
	$(document).on('keyup',"#buscar_usuario",function(){
      $.post(base_url+'mvc/controllers/CegresoTrabajador.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
          $("#load").hide();

      });



	});

	function recargar_grid(){

		 $.post(base_url+'mvc/controllers/CegresoTrabajador.php',{action:"recargar_egreso"},function(respuesta)
	            {
	            	$("#contenedor_list_productos").html(respuesta);
	            });
	}