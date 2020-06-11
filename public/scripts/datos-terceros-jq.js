$(document).ready(function(){
	$("#frm-usuario").validate();
	$("#frm-editar-productos").validate();

	$.validator.addMethod("cedulaunicaeditar", function(value, element) {
	    var isSuccess = false;
   		$.ajax({ 
   			url: base_url+"mvc/controllers/Cterceros.php", 
            data: {'cedulaActual':$(element).attr('ncedula'), 'cedula':value, 'action': 'validarExistenciaTerceroEditar'}, 
            async: false, 
            success: 
                function(msg) { isSuccess = msg === "true" ? true : false }
          });
    return isSuccess;
	}, "Esta número de documento ya se encuentra asignada a un tercero, por favor utilice uno diferente.");	

	$.validator.addMethod("cedulaUnica", function(value, element) {
	    var isSuccess = false;
   		$.ajax({ 
   			url: base_url+"mvc/controllers/Cterceros.php", 
            data: {'cedula':value, 'action': 'validarExistenciaTercero'}, 
            async: false, 
            success: 
                function(msg) { isSuccess = msg === "true" ? true : false }
          });
    return isSuccess;
	}, "Esta número de documento ya se encuentra asignada a un tercero, por favor utilice uno diferente.");	

	crearSelect2ConceptoTercero();
	crearSelect2ConceptoTerceroEditar();

});

$('#cedula').keypress(function(e){
	if(e.which == 46){
		if($(this).val().split('.').length > 1)
			return false;
	}
});

$('#id_cedula').keypress(function(e){
	if(e.which == 46){
		if($(this).val().split('.').length > 1)
			return false;
	}
});


	$("#btn-enviar").click(function(e){

		if($("#frm-usuario").valid()){
			var load = open_overlay();
			$.post(base_url+'mvc/controllers/Cterceros.php',$("#frm-usuario").serialize(),function(respuesta){
				if(respuesta.rpt){
					$.notify(respuesta.mensaje,"success");
		            recargar_grid();
		       		resetarFormulario();
		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				load.hide();
			},'json');
	        recargar_grid();
    	}
		e.preventDefault();	

	});
	
	
function resetarFormulario() {
	$("#frm-usuario")[0].reset();
	$("#tipo_concepto").empty().trigger('change');
}	
	
$(document).on('keyup',"#buscar_usuario",function(){
      console.log($(this).val());
     
      $.post(base_url+'mvc/controllers/Cterceros.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
      });



	});
	
function resetarFormularioEditar() {
	$("#frm-editar-productos")[0].reset();
	$("#id_tipo_concepto").empty().trigger('change');
}	
	
	
$(document).on('click', ".btn_edit_product", function()
{
		   
    var load = open_overlay();
    resetarFormularioEditar();
	$.post(base_url+'mvc/controllers/Cterceros.php',{action:"consultar_usuario",'id_cedula':$(this).attr('id_tercero')},function(respuesta){
		$("#id_cedula").val(respuesta.cedula);
		$("#id_cedula").attr('ncedula', respuesta.cedula);
		
		$("#id_direccion").val(respuesta.direccion);
		$("#telefono").val(respuesta.tel_fijo);
							
		$("#id_nombres").val(respuesta.nombre);
		$("#id_correo").val(respuesta.correo);
		$("#id_tipo_tercero").val(respuesta.tipo_cliente);

		$("#id_contacto").val(respuesta.contacto);
		$("#id_ciudad").val(respuesta.ciudad);
		$("#id_banco").val(respuesta.banco);
		$("#id_cuenta_bancaria").val(respuesta.cuenta_bancaria);

		$("#id_tel_contacto").val(respuesta.tel_contacto);
		$("#id_telefono").val(respuesta.telefono);

		$("#tipo_porcentaje_descuento_editar").val(respuesta.tipo_porcentaje_descuento);
		$("#base_descuento_edit").val(respuesta.base_descuento);
		//$("#id_tipo_concepto").val(respuesta.id_retencion);
		
		    
		$("#id_tercero").val(respuesta.id_cliente);


		if(respuesta.retenciones != undefined){
	        var s2 = $("#id_tipo_concepto").data('select2'); 
	        respuesta.retenciones.forEach(function(currentValue,index,arr){
		        s2.trigger('select', { 
		          data: currentValue
		        }); 
	        });
	    }

		$("#mimodal").modal("show");
		load.hide();
	} ,'json');
});


$(document).on('click',".btn_eliminar_producto",function()
	{
   
     var txt;
	var r = confirm("Desea bloquear el tercero?");
		if (r == true) 
		{
    		$.post(base_url+'mvc/controllers/Cterceros.php',{action:"eliminar",'id_cedula':$(this).attr('id_tercero')},function(respuesta)
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

$(document).on('click', "#bnt_guardar_producto", function()
	{
	//	$("#load_ediatr").show();
		$.post(base_url+'mvc/controllers/Cterceros.php',$("#frm-editar-productos").serializeArray(),function(respuesta){
			if(respuesta.rpt){
			$.notify(respuesta.mensaje,"success");
				$("#mimodal").modal('toggle');

                recargar_grid();

			}
			else
				{
					$.notify(respuesta.mensaje,"error");

				}
			
		} ,'json');
	});
	

function recargar_grid(){
	 $.post(base_url+'mvc/controllers/Cterceros.php',{action:"recargar_usuarios"},function(respuesta)
            {
            	$("#contenedor_list_productos").html(respuesta);
            });
}

function crearSelect2ConceptoTerceroEditar(data) {
	if(data != undefined){
        datar = data;
    }
	$("#id_tipo_concepto").select2({
	    placeholder: "Buscar concepto",
	    language: "es",
	    multiple: true,
	    allowClear: true,
	   
	    ajax: { 
	        url: base_url+'mvc/controllers/Cterceros.php?action=filtroRetencionFiltro',
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {	        	
	            return data;
	        }
	    },
	});
	if(data != undefined){
        var s2 = $("#id_tipo_concepto").data('select2'); 
        datar.forEach(function(currentValue,index,arr){
	        s2.trigger('select', { 
	          data: currentValue
	        }); 
        });
    }
}

function crearSelect2ConceptoTercero(data) {
	if(data != undefined){
        datar = data;
    }
	$("#tipo_concepto").select2({
	    placeholder: "Buscar concepto",
	    allowClear: true,
	    language: "es",
	    multiple: true,
	    initSelection: function (element, callback) {
            if(data != undefined){
                callback(datar);
            }else{
                callback([]);
            }
        },
	    ajax: { 
	        url: base_url+'mvc/controllers/Cterceros.php?action=filtroRetencionFiltro',
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {	        	
	            return data;
	        }
	    },
	});
	if(data != undefined){
        var s2 = $("#tipo_concepto").data('select2'); 
        s2.trigger('select', { 
          data: datar 
        }); 
    }
}