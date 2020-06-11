
$(document).ready(function(){
    $('#frm-factura').validate();	

	crearSelect2Proveedor();
	crearSelect2TipoConcepto();
	crearSelect2Pacientex();
	crearSelect2TipoPago();
	crearSelect2TarjetaCredito();

	$(document).on('click','.btn_cancelar_cxp',function(e){
	 	e.preventDefault();
	 	$.post(base_url+'mvc/controllers/CCliente.php?action=obtenerClienteXId',{id_proveedor:$(this).attr('id_proveedor')}, function(proveedor){
	 		crearSelect2Cliente(proveedor);
	 		$('#cedula').select2("enable",true);
	 		 $('#id_nocheque').val('0'); 
	 		$('#modal_egresos').modal('toggle');
	 	},'json');
	});

	$('#proveedor').on('change', function(e){
		if($(this).val() != null){
			proveedor = $(this).select2("data")[0];
			$('#tipo_porcentaje_descuento').html(proveedor.modelo.tipo);
			$('#base_descuento').html(proveedor.modelo.base_descuento);
		}else{
			$('#tipo_porcentaje_descuento').html('');
			$('#base_descuento').html(0);
		}
	});

	$.validator.addMethod("uniconumproveedor", function(value, element) {
	    var isSuccess = true;
	    if($('#proveedor').val() != null && ($('#id_cxp').val() == null || $('#id_cxp').val().length == 0) )
	    {
	   		$.ajax({ url: base_url+"mvc/controllers/Ccuentasxpagar.php", 
	            data: {'action':'validarNumeroProveedor','documento':value, "proveedor":$('#proveedor').val()}, 
	            async: false, 
	            success: 
	                function(msg) { isSuccess = msg === "true" ? true : false }
	          });
	   	}
    return isSuccess;
	}, "Este número de documento ya se encuentra registrado para este proveedor.");	

	$(document).on('click','.btn_editar_cxp',function(e){
	 	e.preventDefault();
	 	var overlay = open_overlay();
	 	$.post(base_url+'mvc/controllers/Ccuentasxpagar.php?action=obtenerCuentaXPagar',{id_cxpagar:$(this).attr('id_cxpagar')}, function(data){
	 		$('#inputEmail').val(data.cuentaxpagar.fecha);
	 		$('#fecha_vencimiento').val(data.cuentaxpagar.fecha_venci);
	 		$('#documento').val(data.cuentaxpagar.no_documento);
	 		$('#retencion').val(data.cuentaxpagar.id_retencion);
	 		$('#recuperable').val(data.cuentaxpagar.id_recuperable);
	 		$('#id_aiva').val(data.cuentaxpagar.valor_aiva); 
	 		$('#id_iva').val(data.cuentaxpagar.valor_iva); 
	 		$('#id_descuento').val(data.cuentaxpagar.descuento); 
	 		$('#id_notacredito').val(data.cuentaxpagar.nota_credito); 
	 		$('#no_nota').val(data.cuentaxpagar.numero_nota); 
	 		$('#pre_valor_compra').html(number_format(data.cuentaxpagar.subtotal,2,'.',',')); 
	 		$('#id_valor_compra').val(data.cuentaxpagar.subtotal); 
	 		$('#id_cxp').val(data.cuentaxpagar.id_cxp); 
	 		$('#descripcion').val(data.cuentaxpagar.descripcion); 

	 		crearSelect2Proveedor(data.proveedor);
	 		crearSelect2TipoConcepto(data.tipo_concepto);
	 		crearSelect2Pacientex(data.paciente);

	 		if(Object.keys(data.tipo_pago).length > 0)
	 			crearSelect2TipoPago(data.tipo_pago);
			if(Object.keys(data.tarjeta_credito).length > 0){
				crearSelect2TarjetaCredito(data.tarjeta_credito);
				$('#ctn_tarjeta_credito').show();
			}
	 		overlay.hide();
	 		$('a[href="#nuevafactura"]').trigger('click');
	 	},'json');
	 });

	$(document).on('click', '#bnt-nuevo', function(e){
		e.preventDefault();
		limpiarFormularioCeuntasXPagar();
	})

	$(document).on('change', '#id_tipo_pago', function(e){
		e.preventDefault();
		if($(this).val() == 5){
			$('#ctn_tarjeta_credito').show();
		}else{
			$('#ctn_tarjeta_credito').hide();
			$("#id_tarjeta_credito").empty().trigger("change");
 		}
	})


});
	$('a[href="#verfactura"]').click(function(e){
		setTimeout(function(){
			$(window).trigger('resize');
		},10);
	});

	$("#bnt-grabar").click(function(e){
       var ldt_recuperable = $('#recuperable').val();
       var ldt_paciente = $('#paciente').select2("data")[0];
      

         if((ldt_recuperable=='1') && (ldt_paciente==undefined))
         {
           $.notify('Debe ingresar el paciente responsable del cargo',"error");
			e.preventDefault();	
         }
         else
         {
			if($('#frm-factura').valid()){	
				var overlay = open_overlay();	
				$.post('mvc/controllers/Ccuentasxpagar.php',$("#frm-factura").serialize(),function(respuesta){
					overlay.hide();
					if(respuesta.rpt){
						$.notify(respuesta.mensaje,"success");
					//	$('#consecutivo_actual').val(respuesta.consecutivo_actual);
						//$('#no_factura').html(respuesta.consecutivo_actual);
			            limpiarFormularioCeuntasXPagar();
			            recargar_grid_facturas();
			       	}else{
			       		$.notify(respuesta.mensaje,"error");
			       	}
				},'json');
			}		
			e.preventDefault();	
		}
	});

	
	function limpiarFormularioCeuntasXPagar() {
        $("#frm-factura")[0].reset();
        $('#id_cxp').val('');
        $("#proveedor").empty().trigger("change");
        $("#paciente").empty().trigger("change");
        $("#id_concepto").empty().trigger("change");

        $("#id_tipo_pago").empty().trigger("change");
        $("#id_tarjeta_credito").empty().trigger("change");
 	
        $('#ctn_tarjeta_credito').hide();

        $("#pre_valor_compra").html('');
    }


    function recargar_grid_facturas(){
       //$('#grid').trigger("reloadGrid");
       $("#listaFacturas").load(base_url+'mvc/controllers/Ccuentasxpagar.php?action=obtenercxp',{'filtro':$('#buscar_param_cxp').val()});
    }

   

$(document).on('keyup','#id_aiva', function(e){
	calcularValorCompra();
});

$(document).on('keyup','#id_iva', function(e){
	calcularValorCompra();
});

$(document).on('keyup','#id_descuento', function(e){
	calcularValorCompra();
});

$(document).on('keyup','#id_notacredito', function(e){
	calcularValorCompra();
});

$(document).on('keyup','#buscar_param_cxp',function(e){
	recargar_grid_facturas();
});

function calcularValorCompra() {
	var valor = $('#id_aiva').val();
	proveedor = $('#proveedor').select2("data")[0];
	var tipo_retencion=$('#id_concepto').val();

	if($.isNumeric($('#id_iva').val()) && $.isNumeric($('#id_aiva').val()) && $.isNumeric($('#id_descuento').val()) && $.isNumeric($('#id_notacredito').val()))
	{
		//if($('#id_iva').val().length > 0){
			valor = parseFloat($('#id_aiva').val())  + parseFloat($('#id_iva').val())- parseFloat($('#id_descuento').val()) -
			parseFloat($('#id_notacredito').val()) ;
		//}
	}

	if(proveedor.modelo.id_tipo_porcentaje_descuento == 2){//Antes de iva
		iva = (proveedor.modelo.base_descuento*$('#id_aiva').val())/100;
		valor -= iva;
	} else if (proveedor.modelo.id_tipo_porcentaje_descuento == 3) {
		iva = (proveedor.modelo.base_descuento*$('#id_iva').val())/100;
		valor -= iva;
	}
     if(tipo_retencion==7)
     {
     	valor=valor * (-1);
     }
     else
     {
     	valor=valor;
     }

	/*Si el concepto es de anticipo multimplico el valor total * -1 */
	$('#id_valor_compra').val(valor);
	$('#pre_valor_compra').html(number_format(valor,2,'.',','));	
}

$(document).on('click',".btn_eliminar_cxp",function()
	{
   
     var txt;
	var r = confirm("Desea elinar la cuenta x pagar?");
		if (r == true) 
		{
    		$.post(base_url+'mvc/controllers/Ccuentasxpagar.php',{action:"eliminar",'id_cxpagar':$(this).attr('id_cxpagar')},function(respuesta)
				{
					//console.log(respuesta);
			      if(respuesta.rpt)
			      {
							$.notify(respuesta.mensaje,"success");
				             recargar_grid_facturas();

				   }else{
				       		$.notify(respuesta.mensaje,"error");
				       	}
				},'json');
		} 

	
});

function crearSelect2TipoConcepto(data) {
	if(data != undefined){
        datar = {'id':data.id_retencion, 'text':data.concepto,'modelo':data};
    }
	$("#id_concepto").select2({
	    placeholder: "Buscar retención",
	    allowClear: true,
	    language: "es",
	    initSelection: function (element, callback) {
            if(data != undefined){
                callback(datar);
            }else{
                callback({id:0,text:''});
            }
        },
	    ajax: { 
	        url: base_url+'mvc/controllers/Ccuentasxpagar.php?action=obtenertiporetencion',
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {
	        	console.log(typeof(data))
	        	data.proveedor = $("#proveedor").val();
	        	
	            return data;
	        }
	    },
	});
	if(data != undefined){
        var s2 = $("#id_concepto").data('select2'); 
        s2.trigger('select', { 
          data: datar 
        }); 
    }
}


function crearSelect2Proveedor(data) {
	var datar;
    if(data != undefined){
        datar = {'id':data.id_cliente, 'text':data.nombre +' '+data.apellido,'modelo':data};
    }
	$("#proveedor").select2({
        placeholder: "Buscar proveedor",
        allowClear: true,
        language: "es",
        initSelection: function (element, callback) {
            if(data != undefined){
                callback(datar);
            }else{
                callback({id:0,text:''});
            }
        },
        ajax: { 
            url: base_url+'mvc/controllers/CCliente.php?action=obtenerClienteTipoSelect2',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                return data;
            }
        },
    });

    if(data != undefined){
        var s2 = $("#proveedor").data('select2'); 
        s2.trigger('select', { 
          data: datar 
        }); 
    }
}

function crearSelect2Pacientex(data) {
	var datar;
    if(data != undefined){
        datar = {'id':data.id_cedula, 'text':data.nombre+' '+data.apellido,'modelo':data};
    }
	$("#paciente").select2({
        placeholder: "Buscar Paciente",
        allowClear: true,
        language: "es",
        initSelection: function (element, callback) {
            if(data != undefined){
                callback(datar);
            }else{
                callback({id:0,text:''});
            }
        },
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

	if(data != undefined){
        var s2 = $("#paciente").data('select2'); 
        s2.trigger('select', { 
          data: datar 
        }); 
    }

}


function crearSelect2TipoPago(data) {
	var datar;
    if(data != undefined){
        datar = {'id':data.id_tipo_pago, 'text':data.nombre_pago,'modelo':data};
    }
	$("#id_tipo_pago").select2({
        placeholder: "Buscar forma de pago",
        allowClear: true,
        language: "es",
        initSelection: function (element, callback) {
            if(data != undefined){
                callback(datar);
            }else{
                callback({id:0,text:''});
            }
        },
        ajax: { 
            url: base_url+'mvc/controllers/CReciboCajaMayor.php?action=obtenerformapagoselect',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                return data;
            }
        },
    });

	if(data != undefined){
        var s2 = $("#id_tipo_pago").data('select2'); 
        s2.trigger('select', { 
          data: datar 
        }); 
    }
}


function crearSelect2TarjetaCredito(data) {
	var datar;
    if(data != undefined){
        datar = {'id':data.id, 'text':data.nombre_tarjeta,'modelo':data};
    }
	$("#id_tarjeta_credito").select2({
        placeholder: "Buscar tarjeta de Crédito",
        allowClear: true,
        language: "es",
        initSelection: function (element, callback) {
            if(data != undefined){
                callback(datar);
            }else{
                callback({id:0,text:''});
            }
        },
        ajax: { 
            url: base_url+'mvc/controllers/Ccuentasxpagar.php?action=obtenerTarjetasDeCredito',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                return data;
            }
        },
    });

	if(data != undefined){
        var s2 = $("#id_tarjeta_credito").data('select2'); 
        s2.trigger('select', { 
          data: datar 
        }); 
    }
}
