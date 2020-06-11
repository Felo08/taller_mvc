$(document).ready(function(){
	$('#frm-incapacidad').validate();	
	
	$("#documento").select2({
        placeholder: "Buscar paciente",
        allowClear: true,
        language: "es",
        ajax: { 
            url: 'mvc/controllers/CHuesped.php?action=obtenerHuespedsSelect',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                return data;
            } 
        },
    });

});

	jQuery.validator.addMethod("validfechasincapacidad", function(value, element) {
        var dateInit = new Date($("#fecha_inicial").val())
        var dateFin = new Date($("#fecha_final").val())
        return (dates.compare(dateInit,dateFin) == 1 || dates.compare(dateInit,dateFin) == 0)?false:true;
      }, "La fecha final no puede ser menor o igaul a la fecha inicial");


	$(document).on('blur','#fecha_inicial',function(){
		calcular_dias_incapacidad();
	});

	$(document).on('blur','#fecha_final',function(){
		calcular_dias_incapacidad();	
	});

	function calcular_dias_incapacidad(){
		if($('#fecha_final').valid()){
			var a = moment($('#fecha_final').val());
			var b = moment($('#fecha_inicial').val());
			var days = a.diff(b, 'days');
			$("#dias_incapacidad_content").html(days+' dia(s)');
			$("#dias_incapacidad").val(days);
		}
	}


	$("#buscar").click(function(e){
			$.post(base_url+'mvc/controllers/Cincapacidades.php',$("#frm-incapacidad").serialize(),function(respuesta){
			
				$("#nombre_paciente").val(respuesta.nombre);
				$("#apellido_paciente").val(respuesta.apellido);
				$("#id_cedula").val(respuesta.id_cedula);				
			
			},'json');
		e.preventDefault();	
	});



	$("#bnt_guardar").click(function(e){

		if($('#frm-incapacidad').valid() && $('#frm-incapacidad').valid()){
			loader = open_overlay();
			$.post(base_url+'mvc/controllers/Cincapacidades.php',$("#frm-incapacidad").serialize(),function(respuesta){
				if(respuesta.rpt){
					$("#documento").val('').trigger('change');
			       	$('#frm-incapacidad')[0].reset();
			       	$("#dias_incapacidad_content").html('');
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
      console.log($(this).val());
     

      $("#load").show();
      $.post(base_url+'mvc/controllers/Cincapacidades.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
          $("#load").hide();

      });



	});


	

function recargar_grid(){

	 $.post(base_url+'mvc/controllers/Cincapacidades.php',{action:"recargar_incapacidad"},function(respuesta)
            {
            	$("#contenedor_list_productos").html(respuesta);				

            });
}