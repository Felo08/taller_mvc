function validarFormulario(){
    $("#frm-plan").validate();
}

	$("#btn-enviar").click(function(e){

		if($("#frm-plan").valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/CPlanCuidado.php',$("#frm-plan").serialize(),function(respuesta){
				console.log(respuesta);
				if(respuesta.rpt){
					$.notify(respuesta.mensaje,"success");

		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				load.hide();
			},'json');
			recargar_grid();

    	}
		e.preventDefault();	

	});

$(document).on('click',".btn_eliminar_producto",function()
	{
   
     var txt;
	var r = confirm("Desea bloquear el paciente?");
		if (r == true) 
		{
    		$.post(base_url+'mvc/controllers/CPlanCuidado.php',{action:"eliminar",'id_cedula':$(this).attr('id_tercero')},function(respuesta)
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


$(document).on('keyup',"#buscar_usuario",function(){
      console.log($(this).val());
     
      $.post(base_url+'mvc/controllers/CPlanCuidado.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
      });

	});
	

$(document).on('keyup',"#buscar_usuario_n",function(){
      console.log($(this).val());
     
      $.post(base_url+'mvc/controllers/CPlanCuidado.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
      });



	});


function recargar_grid(){
	 $.post(base_url+'mvc/controllers/CPlanCuidado.php',{action:"recargar_usuarios"},function(respuesta)
            {
            	$("#contenedor_list_productos").html(respuesta);
            });
}

  $(document).ready(function(){
  console.log("sssss");

  $("#frm-consulta").validate();
  $("#id_cedula").select2({
      placeholder: "Buscar Residente",
      allowClear: true,
      language: "es",
      ajax: { 
          url: base_url+'mvc/controllers/CHuesped.php?action=obtenerHuespedsSelect',
          cache: "true",
          type:'POST',
          dataType: 'json',
          data: function (data, page) {
            /*console.log(typeof(data))
            data.fecha = $("#id_fecha").val();
            data.turno = $("#id_turno").val();
            data.enfermera = $("#id_enfermera").val();*/
              return data;
          }
      },
  });



});


$("#bnt-exportar").click(function(e){
   
    if($('#frm-consulta').valid() && $('#frm-consulta').valid()){
      //loader = open_overlay();
      window.open(base_url+'mvc/controllers/CPlanCuidado.php?'+$("#frm-consulta").serialize(), "_blank");
      /*$.post(,,function(respuesta){
        if(respuesta.rpt){
          
          $.notify(respuesta.mensaje,"success");
                // recargar_grid();
            }else{
              $.notify(respuesta.mensaje,"error");
            }
        //loader.hide();
      },'json');*/
    }
    e.preventDefault(); 

  });



