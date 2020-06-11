var opts = {lines: 13, length: 11, width: 5, radius: 17, corners: 1, rotate: 0,color: '#FFF',speed: 1, trail: 60, shadow: false, hwaccel: false, className: 'spinner', zIndex: 2e9, top: 'auto', left: 'auto'};

$(document).ready(function(){
	$('#frm-examenes').validate();
	$("#id_paciente").select2({
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

		if($('#frm-examenes').valid() && $('#frm-examenes').valid()){
			var load = open_overlay();
			var url=base_url+'mvc/controllers/Cexamenes.php';
			var data = new FormData(document.getElementById('frm-examenes'));
		    $.ajax({
		        url: url,
		        type: 'POST',
		        dataType: "JSON",
		        data: data,
		        processData: false,
		        contentType: false,
		        success: function (respuesta, status)
		        {
		        	if(respuesta.rpt){
			            recargar_grid();
		        		$("#id_paciente").val('').trigger('change');
		        		$('#frm-examenes')[0].reset();
						$.notify(respuesta.mensaje,"success");
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
	


$(document).on('click',".btn_edit_imprimir", function(e)
	{
		if($(this).attr('esdrive') == 'false'){
			$('#mimodalpdf').find('iframe').attr('src',base_url+'mvc/controllers/Cexamenes.php?action=imprimirArchivoPaciente&id='+$(this).attr('id_examen'));
		}else{
			$('#mimodalpdf').find('iframe').attr('src', "http://docs.google.com/gview?url="+base_url+"mvc/controllers/Cexamenes.php?action=imprimirArchivoPaciente&id="+$(this).attr('id_examen')+"&embedded=true");
		}
		$("#mimodalpdf").modal("show");
		e.preventDefault();// es como un return False, frena el comportamiento natural de un evento
	});
 
		

	function recargar_grid(){

	 	$.post(base_url+'mvc/controllers/Cexamenes.php',{action:"listarExamenesMedicos",'buscar_examen':''},function(respuesta){
        	$("#contenedor_list_examenes_medicos").html('');
        	$("#contenedor_list_examenes_medicos").html(respuesta);
        });
	}


	$('#mimodalpdf').find('iframe').on('load', function(){
			$(this).css('height','541px');
			$("#frm-examen").contents().find("body").css("text-align","center");
	});
	
	
	
	
	$(document).on('keyup',"#buscar_examen",function(){      

      $("#load").show();
      $.post(base_url+'mvc/controllers/Cexamenes.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_examenes_medicos").html(respuesta);
          $("#load").hide();

      });



	});


$(document).on('click',".btn_eliminar_producto",function()
	{
   
     var txt;
	var r = confirm("Desea eliminar?");
		if (r == true) 
		{
    		$.post(base_url+'mvc/controllers/Cexamenes.php',{action:"eliminar",'id_examen':$(this).attr('id_examen')},function(respuesta)
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


function open_overlay() {
  var target = document.createElement("div");
  document.body.appendChild(target);
  var spinner = new Spinner(opts).spin(target);
  return iosOverlay({
    text: "Espere ...",
    spinner: spinner
  });
}

	

