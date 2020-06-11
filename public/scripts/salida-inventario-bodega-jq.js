$(document).ready(function(){
    $('#frm_salida_bodega').validate();  
    $('#frm_medicamento_detalle_salida').validate();  

    
    crearSelectAsignar();
    
    crearSelectBodega();

    crearSelectMedicamento();

    crearSelectLote();



  




    $("#cantidad").select2({
        placeholder: "Cantidad",
        allowClear: true,
        language: "es",
        ajax: { 
            url: base_url+'mvc/controllers/CSalidaInventarioBodega.php?action=obtenerCantidadDisponibleLoteBodega',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                data.id_medicamento = $("#id_medicamento").val();
                data.id_bodega = $("#id_bodega").val();
              // data.lote = $("#lote").val();
                return data;
            },
            error: function(data, page){
                setTimeout(function(){ $('.select2-results__option').html(data.responseText); },20);
            }
        }
    }); 







      $.validator.addMethod("validarCantidadDisponible", function(value, element) { 
        if($("#id_medicamento").val() != null){
            medicamento = $('#id_medicamento').select2('data')[0];
            if ( parseInt(medicamento.modelo.disponible) < parseInt(value) ) {
                return false;
            }
            return true;
        }else{
            return false;
        }
    }, function(params, element) {
            if($("#id_medicamento").val() != null){
                medicamento = $('#id_medicamento').select2('data')[0];
                if ( parseInt(medicamento.modelo.disponible) < parseInt($(element).val()) ) {
                    return 'La disponibilidad de este medicamento es de '+medicamento.modelo.disponible+'.';
                }
            }else{
                return 'Debe seleccionar un medicamento.';
            }     
        });

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
                url: base_url+'mvc/controllers/CEntradaInventarioBodega.php?action=obtenerbodegaSelect',
                cache: "true",
                type:'POST',
                dataType: 'json',
                data: function (data, page) {
                    return data;
                }
            },
            escapeMarkup: function (markup) { return markup; },
            templateResult: formatResultBodega,
        });

        if(data != undefined){
            var s2 = $("#id_bodega").data('select2'); 
                s2.trigger('select', { 
                  data: datar 
                }); 
        }
    }

    function formatResultBodega(item) {
        if(item.id != undefined)
            if(item.modelo.cedula == null)
                return item.text;
            else
                return item.text+"<br/><b>Cédula: </b>"+item.modelo.cedula;
        else
            return null;
    }

    function crearSelectLote(data) {
        var datar;
        if(data != undefined){
            datar = {'id':data.id_bodega, 'text':data.nombre_bodega,'modelo':data};
        }

        $("#lote").select2({
            placeholder: "Buscar lote",
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
                url: base_url+'mvc/controllers/CSalidaInventarioBodega.php?action=obtenerlistaloteselect',
                cache: "true",
                type:'POST',
                dataType: 'json',
                data: function (data, page) {
                    data.id_bodega = $("#id_bodega").val();
                    return data;
                },
                error: function(data, page){
                    setTimeout(function(){ $('.select2-results__option').html(data.responseText); },20);
                }
            },
        });

 
        if(data != undefined){
            var s2 = $("#lote").data('select2'); 
                s2.trigger('select', { 
                  data: datar 
                }); 
        }
    }

    function crearSelectAsignar(data) {
        var datar;
        if(data != undefined){
            datar = {'id':data.id_bodega, 'text':data.nombre_bodega,'modelo':data};
        }

        $("#asignara").select2({
            placeholder: "Asignar a",
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
                url: base_url+'mvc/controllers/CHuesped.php?action=obtenerHuespedDependenciaSelect2',
                cache: "true",
                type:'POST',
                dataType: 'json',
                data: function (data, page) {
                    data.id_medicamento = $("#id_medicamento").val();
                    data.id_bodega = $("#id_bodega").val();
                    return data;
                },
                error: function(data, page){
                    setTimeout(function(){ $('.select2-results__option').html(data.responseText); },20);
                }
            },
            escapeMarkup: function (markup) { return markup; },
            templateResult: formatResultAsignar,
        });

 
        if(data != undefined){
            var s2 = $("#asignara").data('select2'); 
                s2.trigger('select', { 
                  data: datar 
                }); 
        }   
    }

 function crearSelectMedicamento(data) {
        
            var datar;
            if(data != undefined){
                datar = {'id':data.id_bodega, 'text':data.nombre_bodega,'modelo':data};
            }






        $("#id_medicamento").select2({
                placeholder: "Buscar",
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
                    url: base_url+'mvc/controllers/CSalidaInventarioBodega.php?action=obtenerlistamedicaselect',
                    cache: "false",
                    type:'POST',
                    dataType: 'json',
                    data: function (data, page) {
                        try{
                          /*  data.id_bodega = $("#id_bodega").val();
                            data.lote = $("#lote").val();*/
                            return data;
                        }catch(err){
                        }
                    },
                    error: function(data, page){
                        setTimeout(function(){ $('.select2-results__option').html(data.responseText); },20);
                    }
                },
                escapeMarkup: function (markup) { return markup; },
                templateResult: formatResult,


            });

        
 
        if(data != undefined){
            var s2 = $("#id_medicamento").data('select2'); 
                s2.trigger('select', { 
                  data: datar 
                }); 
        }
    }

    function formatResult(item) {
        if(item.id != undefined)
            return ' <b>Articulo: </b>' + item.text + '<br/>';
        else
            return null;
    }

    function formatResultAsignar(item) {
        if(item.id != undefined){
            return item.text + '<br/><b>'+item.modelo.tipo+'</b>';
        }else{
            return null;
        }
    }

    $(document).on('change','#asignara',function(e){
        if($(this).val() != null){
            asignar = $('#asignara').select2('data')[0];
            $('#tipoasignacion').val(asignar.modelo.tipo);
        }else{
            $('#tipoasignacion').val('');
        }
    });

    $(document).on('change',"#id_bodega", function(e){
        $("#id_medicamento").select2("val", "");
        $("#id_medicamento").empty().trigger('change');
        $("#lote").select2("val", "");
        $("#lote").empty().trigger('change');
        $("#cantidad").empty().trigger('change');
    });

    $(document).on('change',"#lote", function(e){
       // if($('#lote').select2('data')[0] == undefined){
            $("#id_medicamento").select2("val", "");
            $("#id_medicamento").empty().trigger('change');
            $("#cantidad").empty().trigger('change');
        //}
    });

    $(document).on('change',"#id_medicamento", function(e){
        //if($('#id_medicamento').select2('data')[0] == undefined){
            $("#cantidad").empty().trigger('change');   
        //}
    });

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

    $(document).on('click', '.btn_cancelar_salida', function(e){
        bootbox.confirm("Esta realmente seguro que desea cancelar esta salida?", function(result){ 
            if (result) {
                var id_salida = $(this).attr('id_salida');
                $.post(base_url+'mvc/controllers/CSalidaInventarioBodega.php?action=cancelarSalidaBodega', {'id_salida' : id_salida},function(r){
                    $.notify(r.mensaje, "success");
                    recargar_grid_salidas_bodega();
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
        if($('#frm_salida_bodega').valid()){  
            var overlay = open_overlay();   
            $.post(base_url+'mvc/controllers/CSalidaInventarioBodega.php?action=insertarSalidaBodega',$("#frm_salida_bodega").serialize()+"&"+$("#frm_medicamento_detalle_salida").serialize(),function(respuesta){

            overlay.hide();
            if(respuesta.rpt){
                $.notify(respuesta.mensaje,"success");
                $('#no_factura').val(respuesta.consecutivo_actual);
                $('#no_factura').html(respuesta.consecutivo_actual);
                limpiarFormulario();
                recargar_grid_salidas_bodega();
            }else{
                $.notify(respuesta.mensaje,"error");
            }
            },'json');
        }   
    });


    $("#bnt-grabar-medicamento").click(function(e){
        if($('#frm_salida_bodega').valid()){  
            var overlay = open_overlay();   
            $.post('mvc/controllers/Cinventarioresidente.php',$("#frm_salida_bodega").serialize(),function(respuesta){
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
    

    function limpiarFormulario(){
        $("#frm_salida_bodega")[0].reset();
        //$("#frm_medicamento_detalle_salida")[0].reset();
        $("#id_bodega").select2("val", "");
        $("#id_medicamento").select2("val", "");
        $('#tabla tbody').html('');
        $('#valor_total_c').html('');
        
        $("#id_bodega").empty().trigger('change');
        $("#id_medicamento").empty().trigger('change');

        $('#asignara').empty().trigger('change');
        $('#tipoasignacion').val("");
    }

    function limpiarFormularioProducto(){
        $('#frm_medicamento_detalle_salida')[0].reset();

        $("#id_medicamento").select2("val", "");
        $("#id_medicamento").empty().trigger('change');

        $("#lote").select2("val", "");
        $("#lote").empty().trigger('change');

        $("#asignara").select2("val", "");
        $("#asignara").empty().trigger('change');

    }

    $('#bnt-nuevo').click(function(){
        limpiarFormulario();
    });

    function recargar_grid_salidas_bodega(){
        $("#listaSalidasBodegas").load(base_url+'mvc/controllers/CSalidaInventarioBodega.php?action=listarSalidasBodegas');
    }

    function recargar_grid_facturas(){
        $("#listaFacturas").load(base_url+'mvc/controllers/Cinventarioresidente.php?action=listarFacturas');
    }

    function recargar_grid_entrada_resi(){
        $("#listaFacturas").load(base_url+'mvc/controllers/Cinventarioresidente.php?action=listarentradaresidente');
    }