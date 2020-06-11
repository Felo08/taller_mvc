var validadorFiltros = undefined;
$(document).ready(function(){
    $('#id_valor_traslado').val('0'); 
    $('#id_sucursal').val('NA'); 
    $('#id_banco').val('NA'); 
    $('#id_cheque').val('NA'); 
    $('#id_ciudad').val('Medellin'); 
    $('#form_caja_mayor').validate();   
    $('#id_valor_traslado').number( true, 2 );
    $('#form_caja_menor_eidt').validate();  
    validadorFiltros = $('#frm_filtro').validate();

    function resetearFormulario() {
        $('#tbl-facturas tbody').html(''); 
        $('#tbl-notas tbody').html(''); 
        $('#tbl-anticipos tbody').html(''); 
        $('#form_caja_mayor')[0].reset(); 
        $('#consecutivo_legalizacion_anticipo_c').html();
        $('#valor_total_c').html('');
        $('#paciente_c').html('');
        $("#cedula").empty();
    }

    $("#cedula").select2({
        placeholder: "Buscar huesped",
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


      $("#forma_pago").select2({
        placeholder: "Buscar forma pago",
        allowClear: true,
        language: "es",
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
    $.validator.addMethod("validarvalortraslado", function(value, element) { 
        var totalDispoTraslado = 0;
        var valor_traslado = 0;
        for(i = 0; i < $('.abono').length; i++){ 
            x = $('.abono')[i]
            totalDispoTraslado += parseFloat((!$.isNumeric($(x).val())?0:$(x).val())); 
        }
        valor_traslado = ( !$.isNumeric($('#id_valor_traslado').val())?0:parseFloat($('#id_valor_traslado').val()) );
        return (valor_traslado - totalDispoTraslado)<0?false:true;
    }, "Los valores ingresados en las facturas y notas de cargo, no pueden ser mayores que el valor de traslado.");

    $.validator.addMethod("pagaconCheke", function(value, element) { 
        if( $('input[name=pago_cheque]:checked').val() == 2 )
        {
            if($('#id_cheque').val() == 'NA' || $('#id_cheque').val().length == 0)
                return false;
            else
                return true;
        }else{
            return true;
        }
    }, "Si va a pagar con cheque, por favor anexe el número.");


    $("#id_efectivo1").change(function(){
     
       $('#id_valor_efectivo').val('');

    });


    $("#id_efectivo2").change(function(){
      var valor_total;
       valor_total= $('#valor_total').val()
      
       $('#id_valor_efectivo').val(valor_total);

    });



    $("#id_transaccion1").change(function(){
     
       $('#id_valor_traslado').val(0);

    });


    $("#id_transaccion2").change(function(){
      var valor_total;
       valor_total= $('#valor_total').val()
      
       $('#id_valor_traslado').val(valor_total);

    });


   $("#cedula").on('change',function(){


        if($(this).val() != null){
            $.post(base_url+'mvc/controllers/CFacturacion.php?action=obtenerInformacionFactufacionCliente',{'cliente':$(this).val()},function(data){
                var html = '';
                if(data.rpt){
                    
                    datosPaciente = data;
                   

                    
                    if(Object.keys(data.contacto).length > 0){
                       
                         

                        $('#id_recibido_por').html(data.contacto.nombre_factura);
                        $('#id_recibido_por').val(data.contacto.nombre_factura);
                        
                    }
                    else

                    {
                      

                       $('#id_recibido_por').html(data.husped.nombre + " " + data.husped.apellido);
                       $('#id_recibido_por').val(data.husped.nombre + " " + data.husped.apellido);
                        
                        

                    }


                    $('#id_concepto').html("Pago de Facturas");
                    $('#id_concepto').val("Pago de Facturas");

                }
            },'json');
        }
    });
    $("#cedula").on('change',function(){
        if($(this).val() != null){
            $.post(base_url+'mvc/controllers/CAnticipo.php?action=obtenerInformacionHuesped',{'cliente':$(this).val()},function(data){
                var html = '';
                var opt = '';
                if(data.rpt){
                    
                    $('#consecutivo_legalizacion_anticipo_c').html(data.consecutivo_legalizacion_anticipo);
                    $('#consecutivo_legalizacion_anticipo').val(data.consecutivo_legalizacion_anticipo);
                      if(Object.keys(data.contacto).length > 0){
                        $('#paciente_c').html(data.contacto.nombre_contact + " " + data.contacto.apellido_contact);
                        $('#paciente').val(data.contacto.id);
                    }


                    for(r in data.concepto_abonos){
                        opt += '<option value="'+data.concepto_abonos[r].id_concepto+'">'+data.concepto_abonos[r].nombre_concepto+'</option>';
                    }
                    for(i in data.anticipos){
                        anticipo = data.anticipos[i];
                        html += '<tr id="anticipo_'+anticipo.id_anticipo+'">'
                                + '<td class="ctn_valor_anticipo">'+anticipo.consecutivo_anticipo+'</td>'
                                 + '<td>'+ $.number(parseFloat(anticipo.valor), 2 )+' </td>'
                               
                                + '<td><input class="valor_anticipo" type="hidden" value="'+ (parseFloat(anticipo.valor) - parseFloat(anticipo.valor_legalizacion))+'" value_inicial="'+(parseFloat(anticipo.valor) - parseFloat(anticipo.valor_legalizacion))+'" name="valor_anticipo['+anticipo.id_anticipo+']"><label class="lbl_valor_anticipo">'+$.number((parseFloat(anticipo.valor) - parseFloat(anticipo.valor_legalizacion)), 2 )+'</label></td>'
                                
                               
                                + '<td>'+anticipo.fecha+'</td>'
                                + '<td>'+(anticipo.elabora==null?'':anticipo.elabora)+'</td>'
                                + '<td>'+(anticipo.concepto==null?'':anticipo.concepto)+'</td>'
                                +'</tr>'
                                + '<tr><td colspan="6">';
                        html += '<table class="table table-bordered"><tr><th>Tipo</th><th>ID</th><th>Valor</th><th>Selcción</th><th>Abono</th><th>Valor restante</th><th>Concepto</th></tr>'        
                        for(i in data.facturacion){
                            factura = data.facturacion[i];
                            html += '<tr>'
                                    + '<td>Factura</td>'
                                    + '<td>'+factura.id_factura_dian+'</td>'
                                    + '<td><input class="valor_concepto" type="hidden" value="'+(factura.valor_concepto - factura.abono)+'" name="anticipo['+anticipo.id_anticipo+'][factura]['+factura.id_factura+']['+factura.id+'][valor_factura][]"><label>'+$.number( factura.valor_concepto, 2 )+'</label></td>'
                                    + '<td style="text-align:center"><input type="checkbox" class="chk-abono" value="'+factura.id_factura+'" id_anticipo="'+anticipo.id_anticipo+'" name="anticipo['+anticipo.id_anticipo+'][factura]['+factura.id_factura+']['+factura.id+'][]"></td>'
                                    + '<td style="text-align:center"><input type="text" disabled="disabled" class="abono form-control" name="anticipo['+anticipo.id_anticipo+'][factura]['+factura.id_factura+']['+factura.id+'][abonos][]"></td>'
                                    + '<td class="valor_restante">'+$.number( (factura.valor_concepto - factura.abono), 2 )+'</td>'
                                    + '<td style="text-align:center"><select name="anticipo['+anticipo.id_anticipo+'][factura]['+factura.id_factura+']['+factura.id+'][concepto_factura][]" class="form-control">'+opt+'</select></td>'
                                    +'</tr>';
                        }   

                        for(i in data.notas){
                            nota = data.notas[i];
                            html += '<tr>'
                                    +'<td>Nota</td>'
                                    +'<td>'+nota.no_documento+'</td>'
                                    +'<td><input class="valor_concepto" type="hidden" value="'+nota.saldo+'" name="anticipo['+anticipo.id_anticipo+'][nota]['+nota.id_nota+'][valor_nota][]"/><label>'+$.number(nota.valor,2)+'</label></td>'
                                    +'<td style="text-align:center"><input type="checkbox" class="chk-abono" value="'+nota.id_nota+'" id_anticipo="'+anticipo.id_anticipo+'" name="anticipo['+anticipo.id_anticipo+'][nota]['+nota.id_nota+'][]"></td>'
                                    +'<td ><input type="text" class="abono form-control" disabled="disabled" name="anticipo['+anticipo.id_anticipo+'][nota]['+nota.id_nota+'][abonosnotas][]"/></td>'
                                    +'<td class="valor_restante">'+$.number(nota.saldo,2)+'</td>'
                                    + '<td style="text-align:center"><select name="anticipo['+anticipo.id_anticipo+'][nota]['+nota.id_nota+'][concepto_notas][]" class="form-control">'+opt+'</select></td>'
                                    +'</tr>';
                        }  

                        html += '</table></td></tr>';
                    }
                    $('#tbl-anticipos tbody').html(html); 

                    $('.abono').number( true, 2 );
                }else{
                    $.notify(data.mensaje,'error');
                    $('#generar_notas').attr('disabled','disabled');
                }
            },'json');
        }else{
            resetearFormulario();
        }
    });

    /*function calcularValorAbonoSegunTrasladoDisponible(campo) {
        var ValorDisponibleTraslado = obtenerValorDisponibleTraslado();
        var valorInicial = parseFloat(campo.parent().parent().find('.valor_concepto').val());
        if(valorInicial < ValorDisponibleTraslado)
            campo.parent().parent().find('.abono').val(valorInicial);
        else
            campo.parent().parent().find('.abono').val(ValorDisponibleTraslado);   
        //campo.parent().parent().find('.abono').trigger('keyup'); 
        campo.parent().parent().find('.abono').trigger('blur'); 
    }

    $(document).on('blur','#id_valor_traslado',function(e){
        for(i = 0; i < $('.abono').length; i++){ 
            x = $('.abono')[i]
            $(x).val(0);
        }

        for(j = 0; j < $('.abono').length; j++){ 
            x = $('.abono')[j];
            if(!$(x).is(':disabled')){
                chk = $(x).parent().parent().find('.chk-abono');
                chk.trigger('click');
                chk.trigger('click');
            }
        }
    });*/

    $(document).on('change','.chk-abono',function(e){
        var valor_abono = parseFloat($(this).parent().parent().find('.abono').val());
        var id_anticipo = $(this).attr('id_anticipo');
        $(this).parent().parent().find('.abono').val('');
       
        if($(this).is(':checked')){
           chk = $('#tbl-anticipos').find('.chk-abono[value="'+$(this).val()+'"]');
           conto_chk = 0;
            for(j = 0; j < chk.length; j++){ 
                x = chk[j];
                if($(x).is(':checked')){
                    conto_chk++;
                }
            }
            if(conto_chk > 1){
                $(this).prop('checked', false); 
                $.notify('Esta factura o nota, ya esta siendo usada en otra legalización','error');
                e.preventDefault();
            }else{
                $(this).parent().parent().find('.abono').prop("disabled", false);
            }

          //calcularValorAbonoSegunTrasladoDisponible($(this));

        }else{
           var valor_antes = parseFloat($('#anticipo_'+id_anticipo).find('.valor_anticipo').val()) + valor_abono;
           $('#anticipo_'+id_anticipo).find('.valor_anticipo').val(valor_antes); 
           $('#anticipo_'+id_anticipo).find('.lbl_valor_anticipo').html($.number((valor_antes),2))
          
          valorInicial = parseInt($(this).parent().parent().find('.valor_concepto').val());
          $(this).parent().parent().find('.valor_restante').html( $.number((valorInicial),2) );
          $(this).parent().parent().find('.abono').prop("disabled", true);
        }
      //  calcularTotalPago();
      });

      $(document).on('keyup','.abono',function(e){
          validarAbono(e,this);   
      });

      $(document).on('keyup',"#valor_mayor", function(e){
         // calcularTotalPago();
      });

      $(document).on('keypress','.abono', function(e){
      });

      $(document).on('blur','.abono', function(e){
        validarAbono(e,this);   
      });
      
      function validarAbono(e,t) {
          var valor = 0, valorInicial = 0 ;
          if($.isNumeric(String.fromCharCode(e.which))) {
            if( (valor = parseInt($(t).val())) > (valorInicial = parseInt($(t).parent().parent().find('.valor_concepto').val())) ) {
                r = $(t).val().substring(0, $(t).val().length - 1);
                $(t).val(r);
                e.preventDefault();
            }else{
                $(t).parent().parent().find('.valor_restante').html($.number((valorInicial - valor),2));
                calcularTotalAnticipo(t);

            }
            //console.log($(t).parent().parent().parent().parent().parent().parent().parent().find('.valor_anticipo').length);
          }else{
            calcularTotalAnticipo(t);
            valorInicial = parseInt($(t).parent().parent().find('.valor_concepto').val());
            valor = $(t).val();
            $(t).parent().parent().find('.valor_restante').html($.number((valorInicial - valor),2));
            e.preventDefault();
          }
      }

      /**
      * Esta funcion calcula el total del anticipo, de acuerdo a los abonos de facturas y notas
      */
      function calcularTotalAnticipo(t) {
        var anticipo = $(t).parent().parent().parent().parent().parent().parent().prev();
        var total_abonos = 0;

        for(j = 0; j < anticipo.next().find('.abono').length; j++){ 
            x = anticipo.next().find('.abono')[j];
            if(!$(x).is(':disabled')){
                total_abonos += parseFloat($(x).val());
            }
        }
        t = parseFloat(anticipo.find('.valor_anticipo').attr('value_inicial')) - total_abonos;
        anticipo.find('.valor_anticipo').val(t);
        anticipo.find('.lbl_valor_anticipo').html($.number(t,2));
      }
      
      /*function calcularTotalPago() {
        var total = 0;
        $('.abono').each(function(i,elemento){
          if($.isNumeric($(elemento).val())) {
            total += parseInt($(elemento).val());
          }
        }).promise().done(function(){
          if($.isNumeric($("#valor_mayor").val()))
            total += parseInt($("#valor_mayor").val());
          $("#lbl_valor_total").html($.number(total,2));
          $("#valor_total").val(total);
          $("#valor_total_c").html($.number(total,2));

        });
      }*/


        

    $('a[href="#verRecibos"]').click(function(){
        recargarGridReciboCaja(true);
    });


    $(document).on('click','.editar_factura_caja_menor',function(e){
        e.preventDefault();
        var load = open_overlay();
        $.get(base_url+'mvc/controllers/CReciboCajaMenor.php?action=cargarInfoRecibo',{id_recibo:$(this).attr('id_recibo')}, function(data){
            if(data.rpt){
                $('#id_recibo_e').val(data.modal.id_recibo);
                $('#fecha_inicial_e').val(data.modal.fecha);
                $('#factura_dian_ce').html(data.modal.consecutivo);
                $('#factura_dian_e').val(data.modal.consecutivo);
                $('#ciudad_e').val(data.modal.ciudad);
                $('#concepto_e').val(data.modal.concepto);
                $('#valor_total_e').val(data.modal.valor);
                $('#elaborado_e').val(data.modal.elabora);
                var dataselect = {id:data.modal.id_cliente,text:data.modal.cliente};
                $("#paciente_e").select2({
                    placeholder: "Buscar proveedor",
                    allowClear: true,
                    language: "es",
                    width: 'resolve',
                    initSelection: function (element, callback) {
                        var data = [];//Array
                        data.push(dataselect);
                        callback(data);
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
                //setTimeout(function(){
                    $("#paciente_e").data('select2').trigger('select', { 
                      data: dataselect
                    }); 
              //  },100); 
                load.hide();
                $("#modalEditReciboCaja").modal('toggle');
            }else{
                $.notify(data.mensaje,'error');
            }
        },'json');
    });

    $(document).on('click','#guardarRecibo',function(e){
        e.preventDefault();
        if($('#form_caja_menor_eidt').valid()){
            var load = open_overlay();
            $.post(base_url+'mvc/controllers/CReciboCajaMenor.php?action=guardarReciboCaja',$('#form_caja_menor_eidt').serialize(),function(data){
                if(data.rpt){
                    $.notify(data.mensaje,'success');
                    recargarGridReciboCaja(true);
                    $("#modalEditReciboCaja").modal('toggle');
                }else{
                    $.notify(data.mensaje,'error');
                }
                load.hide();
            },'json');
        }
    }); 

    $(document).on('click','.ver_factura_caja_menor',function(e){
        e.preventDefault();
        var load = open_overlay();
        $.get(base_url+'mvc/controllers/CReciboCajaMenor.php?action=cargarInfoRecibo',{id_recibo:$(this).attr('id_recibo')}, function(data){
            if(data.rpt){
                $('#id_recibo_v').html(data.modal.id_recibo);
                $('#fecha_inicial_v').html(data.modal.fecha);
                $('#factura_dian_ve').html(data.modal.consecutivo);
                $('#factura_dian_v').html(data.modal.consecutivo);
                $('#ciudad_v').html(data.modal.ciudad);
                $('#concepto_v').html(data.modal.concepto);
                $('#valor_total_v').html(data.modal.valor);
                $('#elaborado_v').html(data.modal.elabora);
                $("#paciente_v").html(data.modal.cliente);
                $('#modalVerReciboCaja').modal('toggle');
            }else{
                $.notify(data.mensaje,'error');
            }
            load.hide();
        },'json');
    });

    $(document).on('click','.anular_factura_caja_mayor',function(e){
        var load = open_overlay();
        $.post(base_url+'mvc/controllers/CReciboCajaMayor.php?action=anularReciboCaja',{id_recibo:$(this).attr('id_recibo')},function(data){
            if(data.rpt){
                $.notify(data.mensaje,'success');
                recargarGridReciboCaja(true);
            }else{
                $.notify(data.mensaje,'error');
            }
            load.hide();
        },'json');


        e.preventDefault();    
    });

    $(document).on('click','#guardar_legalizacion',function(e){
        e.preventDefault();
        if($('#form_caja_mayor').valid()){
            var load = open_overlay();
            $.post(base_url+'mvc/controllers/CAnticipo.php?action=guardarLegalizacion',$('#form_caja_mayor').serialize(),function(data){
                if(data.rpt){
                    $.notify(data.mensaje,'success');
                    resetearFormulario();
                    $('#consecutivo_legalizacion_anticipo_c').html(data.consecutivo_legalizacion_anticipo);
                    $('#consecutivo_legalizacion_anticipo').val(data.consecutivo_legalizacion_anticipo);
                }else{
                    $.notify(data.mensaje,'error');
                }
                load.hide();
            },'json');
        }
    });

    $(document).on('click','#filtroRecibo',function(e){
        recargarGridReciboCaja(false);
        e.preventDefault();
    });
    
    function recargarGridReciboCaja(reset) {
        setTimeout(function(){
            data = {};
            if($('#frm_filtro').valid() && $('#frm_filtro').valid())
                data = $('#frm_filtro').serializeArray();
            else{
                if(reset)
                    validadorFiltros.resetForm();
            }
            $('#tbl_recibos_caja_menor').load(base_url+'mvc/controllers/CReciboCajaMayor.php?action=recargarRecibosCajaMayor',data);
        },20);
    }

});
