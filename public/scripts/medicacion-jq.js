$(document).ready(function(){
	$("#frm-medica").validate();

	$("#id_cedula").select2({
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


	$("#bnt-guardar").click(function(e){
 
		if($('#frm-medica').valid() && $('#frm-medica').valid()){
			loader = open_overlay();
			$.post(base_url+'mvc/controllers/Cmedicacion.php',$("#frm-medica").serialize(),function(respuesta){
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
	
	$(document).on('click','.btn_eliminar_medicacion',function(e){
		if(confirm("Realmente desea eliminar esta medicación?")){
			$.post(base_url+'mvc/controllers/Cmedicacion.php',{'action':'eliminarMedicacion','id_medicacion':$(this).attr('id_medicacion')},function(respuesta)
      		{
      			loader = open_overlay();
      			if(respuesta.rpt){
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
      $.post(base_url+'mvc/controllers/Cmedicacion.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
          $("#load").hide();

      });



	});


	

	function recargar_grid(){

		 $.post(base_url+'mvc/controllers/Cmedicacion.php',{action:"recargar_medicacion"},function(respuesta)
	            {
	            	$("#contenedor_list_productos").html(respuesta);
	            });
	}