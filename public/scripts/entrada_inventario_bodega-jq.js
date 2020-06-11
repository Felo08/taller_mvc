$(document).ready(function(){
    $('#frm_entrada_bodega').validate();  
    $('#frm_medicamento_detalle_entrada').validate();  

    
   // crearSelectProveedor();
    crearSelectBodega();

    crearSelectMedicamento();

    function crearSelectBodega(data) {
        var datar;
        if(data != undefined){
            datar = {'id':data.id_bodega, 'text':data.nombre_bodega,'modelo':data};
        }

        $("#id_bodega").select2({
            placeholder: "Buscar bodega",
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
                url: base_url+'mvc/controllers/CEntradaInventarioBodega.php?action=obtenerbodegaSelectEntradaSalidas',
                cache: "true",
                type:'POST',
                dataType: 'json',
                data: function (data, page) {
                    return data;
                } 
            },
            escapeMarkup: function (markup) { return markup; },
            templateResult: formatResultBodega
        });

        function formatResultBodega(item) {
            //console.log(item);return;
            if(item.id != undefined)
                if(item.modelo.cedula == null)
                    return item.text;
                else
                    return item.text+"<br/><b>Cédula: </b>"+item.modelo.cedula;
            else
                return null;
        }

 
        if(data != undefined){
            var s2 = $("#id_bodega").data('select2'); 
                s2.trigger('select', { 
                  data: datar 
                }); 
        }
    }

    $("#id_lote").select2({
        placeholder: "Buscar lote",
        allowClear: true,
        language: "es",
        ajax: { 
            url: base_url+'mvc/controllers/CEntradaInventarioBodega.php?action=obtenerLoteSelect',
            cache: "true",
            type:'POST',
            dataType: 'json', 
            data: function (data, page) {
                return data;
            },
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatResultLote,
    });


    $("#id_medicamento").select2({
        placeholder: "Selecciona",
        allowClear: true,
        language: "es",
        ajax: { 
            url: base_url+'mvc/controllers/CEntradaInventarioBodega.php?action=obtener_insumo_panal',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                return data;
            },
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatResultLote,
    });






   function formatResultLote(item) {
        if(item.id != undefined){
            var lote = $('.lote_detalle').toArray();
            var retur = true;   
            for(x in lote){
                if($(lote[x]).val() == item.id){
                    retur = false;break;
                }
            }
            return (retur?item.text:null);
        }else
            return null;
    }


    function crearSelectMedicamento(data) {
        var datar;
        if(data != undefined){
            datar = {'id':data.id_bodega, 'text':data.nombre_bodega,'modelo':data};
        }



       /* $("#id_medicamento").select2({
            placeholder: "Buscar medicamento",
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
                url: base_url+'mvc/controllers/CEntradaInventarioBodega.php?action=obtenerlistamedicaselect',
                cache: "true",
                type:'POST',
                dataType: 'json',
                data: function (data, page) {
                    data.lote = $("#id_lote").val();
                    data.id_bodega = $("#id_bodega").val();
                    return data;
                },
                error: function(data, page){
                    setTimeout(function(){ $('.select2-results__option').html(data.responseText); },20);
                }
            },
            escapeMarkup: function (markup) { return markup; },
            templateResult: formatResult,
        }).on("change", function(e) {
            if($("#id_medicamento").select2('data')[0] != undefined){
                $('#pre_laboratorio').html($("#id_medicamento").select2('data')[0].modelo.laboratorio);
                $('#laboratorio').val($("#id_medicamento").select2('data')[0].modelo.laboratorio);
            }else{
                $('#pre_laboratorio').html('');
                $('#laboratorio').val('');
            }
        });;*/

     

       function formatResult(item) {
            if(item.id != undefined){
                var medicamentos = $('.medicamento_id').toArray();
                var retur = true;   
                for(x in medicamentos){
                    if($(medicamentos[x]).val() == item.id){
                        retur = false;break;
                    }
                }
                return (retur?('<b>Medicamento: </b>' + item.text + '<br/><b>Presentacion: </b>'+item.modelo.farmaceuta+ '<br/><b>Laboratorio:      </b>'+item.modelo.laboratorio + '<br/><b>Concentracion: </b>'+item.modelo.concentracion):null);
            }else
                return null;
        }

 
        if(data != undefined){
            var s2 = $("#id_bodega").data('select2'); 
                s2.trigger('select', { 
                  data: datar 
                }); 
        }
    }

   
    $(document).on('click','.btn_editar_factura', function(e){
        e.preventDefault();
        var id_entrada_cargo = $(this).attr('id_entrada_cargo');
        var overlay = open_overlay();
        $('#tabla tbody').html('');
        $.post(base_url+'mvc/controllers/CnotasResidente.php?action=obtenerInfoFactura',{'id_entrada_cargo' : id_entrada_cargo}, function(e){
            $('#inputEmail').val(e.data.fecha);
            $('#id_entrada_cargo').val(e.data.id_entrada_cargo);
           // crearSelectProveedor(e.proveedor);
            crearSelectPaciente(e.paciente);
            $('#tabla').append('');
            for(i in e.dataDetalle){
                detalle = e.dataDetalle[i];
                cont++;
                var id="'fila_"+cont+"'";
                var concepto = '';
                var id_concepto = '';
                if(detalle.id_concepto!=null){
                    concepto = detalle.concepto;
                    id_concepto = detalle.id_concepto;
                }
                $('#tabla').append('<tr id="fila_'+cont+'">'
                          +'<td >'+concepto+'<input value="'+id_concepto+'" type="hidden" name="concepto_cp[]"/></td>'
                          +'<td>'+(detalle.cantidad!=null?detalle.cantidad:'')+'<input value="'+(detalle.cantidad!=null?detalle.cantidad:'')+'" type="hidden" name="valor_cp[]"/></td>'
                          +'<td>'+(detalle.valor!=null?detalle.valor:'')+'<input value="'+(detalle.valor!=null?detalle.valor:'')+'" type="hidden" name="valoruni_cp[]"/></td>'
                          +'<td>'+(detalle.valor_total!=null?detalle.valor_total:'')+'<input value="'+(detalle.valor_total!=null?detalle.valor_total:'')+'" type="hidden" name="valorart_cp[]"/></td>'
                          +'<td>'+(detalle.porcentaje!=null?detalle.porcentaje:'')+'<input value="'+(detalle.porcentaje!=null?detalle.porcentaje:'')+'" type="hidden" name="valoriva_cp[]"/></td>'
                           +'<td>'+(detalle.por_recargo!=null?detalle.por_recargo:'')+'<input value="'+(detalle.por_recargo!=null?detalle.por_recargo:'')+'" type="hidden" name="por_recargo[]"/></td>'
                          +'<td>'+(detalle.proveedor!=null?detalle.proveedor:'')+'<input value="'+(detalle.id_proveedor!=null?detalle.id_proveedor:'')+'" type="hidden" name="id_proveedor_cp[]"/></td>'
                          +'<td>'+(detalle.no_factura!=null?detalle.no_factura:'')+'<input value="'+(detalle.no_factura!=null?detalle.no_factura:'')+'" type="hidden" name="fact[]"/></td>'
                          
                          +'<td>'+(detalle.valor_recargo!=null?detalle.valor_recargo:'')+'<input value="'+(detalle.valor_recargo!=null?detalle.valor_recargo:'')+'"  class="valor_recargo" type="hidden" name="valorrecargo_cp[]"/></td>'
                          +'<td><span onclick="eliminar('+id+')" class="glyphicon glyphicon-remove">&nbsp;</span></td><input type="hidden" name="costos['+cont+']['+id_concepto+']" value="'+(detalle.cantidad!=null?detalle.cantidad:'')+'" ></tr>');
            }
            calcularTotalPago();
            overlay.hide();
        },'json');
        $('a[href="#nuevafactura"]').trigger('click');
    });

    $(document).on('click', '.btn_cancelar_entrada', function(e){
        var id_entrada = $(this).attr('id_entrada');
        bootbox.confirm("Esta realmente seguro que desea cancelar esta entrada?", function(result){ 
            if (result) {
                $.post(base_url+'mvc/controllers/CEntradaInventarioBodega.php?action=cancelarEntradaBodega', {'id_entrada' : id_entrada},function(r){
                    $.notify(r.mensaje, "success");
                    recargar_grid_entradas_bodega();
                },'json');
            }
        })
    });


});



$( document ).on('click', "#concepto", function() {
    var str;
    str = $(this ).val();
    //alert( "Handler for .change() called." + str);

    console.log(str);
     


    $.post(base_url+'mvc/controllers/Carticulos.php',{action:"consultar_stock",'id_stock':str},function(respuesta){
            $('#text_total').val(respuesta.valor);
            $('#text_total').html(respuesta.valor);
            $('#id_iva_v').val(respuesta.iva_compra);
            $('#id_iva_v').html(respuesta.iva_compra);
            
    } ,'json');
            


});




$( document ).on('change', "#id_tipo_concepto", function() {
  
   var ldt_cedula= $('#id_paciente').val();

    var str;
    str = $( this ).val();
    console.log(str);
     


    $.post(base_url+'mvc/controllers/CnotasResidente.php',{action:"consultar_iva_paciente",'id_cedula':ldt_cedula/*$(this).attr('id_tercero')*/},function(respuesta){
            $('#id_iva').val(respuesta);
            $('#id_iva').html(respuesta);
            
            if(str=='3' || str=='5' || str=='10')
            {
            
            $('#id_iva').val(respuesta);
            $('#id_iva').html(respuesta);
            }
            else
            {
             
             $('#id_iva').val(0);
             $('#id_iva').html(0);

            }

            
            
    } ,'json');
            


});






$( document ).on('change', "#id_tipo_concepto", function() {


    var str = "";
    str += $( this ).val() + " ";
   
    $.post(base_url+'mvc/controllers/CnotasResidente.php',{action:"consultar_stock_por_tipos",'id_articulo':str/*$(this).attr('id_tercero')*/},function(opciones){
            $('#concepto').children().remove().end().append(opciones) ;
    });


});


$("#bnt-grabar").click(function(e){
       e.preventDefault();  
        if($('#frm_entrada_bodega').valid()){  
            if($('#tabla tbody tr').length > 0){
                var overlay = open_overlay();   
                $.post(base_url+'mvc/controllers/CEntradaInventarioBodega.php?action=insertarEntradaBodega',$("#frm_entrada_bodega").serialize()+"&"+$("#frm_medicamento_detalle_entrada").serialize(),function(respuesta){

                overlay.hide();
                if(respuesta.rpt){
                
                    $.notify(respuesta.mensaje,"success");
                    $('#no_factura').val(respuesta.consecutivo_actual);
                    $('#no_factura').html(respuesta.consecutivo_actual);
                    limpiarFormulario();
                    recargar_grid_entradas_bodega();
                }else{
                    $.notify(respuesta.mensaje,"error");
                }
                },'json');
            }else{
                $.notify('Debe agregar adicionar medicamentos al detalle de la entrada.',"error");
            }
        }   
    });


    $("#bnt-grabar-medicamento").click(function(e){
        if($('#frm_entrada_bodega').valid()){  
            var overlay = open_overlay();   
            $.post('mvc/controllers/Cinventarioresidente.php',$("#frm_entrada_bodega").serialize(),function(respuesta){
                overlay.hide();
                if(respuesta.rpt){
                    $.notify(respuesta.mensaje,"success");
                    $('#consecutivo_actual').val(respuesta.consecutivo_actual);
                    $('#no_factura').html(respuesta.consecutivo_actual);
                    limpiarFormulario();
                    recargar_grid_entrada_resi();
                }else{
                    $.notify(respuesta.mensaje,"error");
                }
            },'json');
        }       
            e.preventDefault(); 
    });
    
    
    function limpiarFormulario() {
        $("#frm_entrada_bodega")[0].reset();
        $("#frm_medicamento_detalle_entrada")[0].reset();
        $("#id_bodega").select2("val", "");
        $("#id_medicamento").select2("val", "");
        $('#tabla tbody').html('');
        $('#valor_total_c').html('');
        //$("#id_cliente").empty().trigger('change');
        $("#id_bodega").empty().trigger('change');
        $("#id_medicamento").empty().trigger('change');
        $("#id_lote").empty().trigger('change');
        $('#pre_laboratorio').html('');
        $('#laboratorio').val('');
    }

    $('#bnt-nuevo').click(function(){
        limpiarFormulario();
    });

    function recargar_grid_entradas_bodega(){
        $("#listaFacturas").load(base_url+'mvc/controllers/CEntradaInventarioBodega.php?action=listarEntradasBodegas');
    }

    function recargar_grid_facturas(){
        $("#listaFacturas").load(base_url+'mvc/controllers/Cinventarioresidente.php?action=listarFacturas');
    }
    function recargar_grid_salidas(){
        $("#listaFacturas").load(base_url+'mvc/controllers/Csalidastock.php?action=listarsalida');
    }

     function recargar_grid_entrada_resi(){
        $("#listaFacturas").load(base_url+'mvc/controllers/Cinventarioresidente.php?action=listarentradaresidente');
    }