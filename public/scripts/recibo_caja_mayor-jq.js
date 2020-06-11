var validadorFiltros = undefined;
$(document).ready(function(){
    $('#form_caja_mayor').validate();   

    $('#form_caja_menor_eidt').validate();  
    validadorFiltros = $('#frm_filtro').validate(); 

    function resetearFormulario() {
        $('#tbl-facturas tbody').html(''); 
        $('#tbl-notas tbody').html(''); 
        $('#form_caja_mayor')[0].reset(); 
        $('#factura_dian_c').html();
        $('#valor_total_c').html('');
        $('#paciente_c').html('');
        $("#cedula").empty();
        $("#forma_pago").empty();
    }

    $("#cedula").select2({
        placeholder: "Buscar huesped", 
        allowClear: true,
        language: "es",
        ajax: { 
            url: base_url+'mvc/controllers/CHuesped.php?action=obtenerHuespedsSelectodos',
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




    $("#cedula").on('change',function(){
        if($(this).val() != null){
            $.post(base_url+'mvc/controllers/CReciboCajaMayor.php?action=obtenerInformacionFactufacionCajaMayorCliente',{'cliente':$(this).val()},function(data){
                var html = '';
                if(data.rpt){
                    
                    $('#factura_dian_c').html(data.consecutivo_recibo_caja);
                    $('#factura_dian').val(data.consecutivo_recibo_caja);
                      if(Object.keys(data.contacto).length > 0){
                        $('#paciente_c').html(data.contacto.nombre_contact + " " + data.contacto.apellido_contact);
                        $('#paciente').val(data.contacto.id);
                    }

                    for(i in data.facturacion){
                        factura = data.facturacion[i];
                        html += '<tr>'
                                + '<td>'+factura.id_factura_dian+'</td>'
                                + '<td><input class="valor_concepto" type="hidden" value="'+(factura.valor_concepto - factura.abono)+'" name="valor_factura[]"><label>'+factura.valor_concepto+'</label></td>'
                                + '<td style="text-align:center"><input type="checkbox" class="chk-abono" value="'+factura.id_factura+'" name="facturas[]"></td>'
                                + '<td style="text-align:center"><input type="text" disabled="disabled" class="abono form-control" name="abonos['+factura.id_factura+']"></td>'
                                + '<td class="valor_restante">'+(factura.valor_concepto - factura.abono)+'</td>'
                                +'</tr>';
                    }
                    $('#tbl-facturas tbody').html(html); 
                    html = '';
                    for(i in data.notas){
                        nota = data.notas[i];
                        html += '<tr>'
                                +'<td>'+nota.no_documento+'</td>'
                                +'<td><input class="valor_concepto" type="hidden" value="'+nota.saldo+'"/><label>'+nota.valor+'</label></td>'
                                +'<td style="text-align:center"><input type="checkbox" class="chk-abono" value="'+nota.id_nota+'" name="notas[]"></td>'
                                +'<td ><input type="text" class="abono form-control" disabled="disabled" name="abonosnotas['+nota.id_nota+']"/></td>'
                                +'<td class="valor_restante">'+nota.saldo+'</td>'
                                +'</tr>';
                    }
                    $('#tbl-notas tbody').html(html); 
                }else{
                    $.notify(data.mensaje,'error');
                    $('#generar_notas').attr('disabled','disabled');
                }
            },'json');
        }else{
            resetearFormulario();
        }
    }); 



    $(document).on('change','.chk-abono',function(e){
        $(this).parent().parent().find('.abono').val('');
        if($(this).is(':checked')){
          $(this).parent().parent().find('.abono').prop("disabled", false);
        }else{
          valorInicial = parseInt($(this).parent().parent().find('.valor_concepto').val());
          $(this).parent().parent().find('.valor_restante').html(valorInicial);
          $(this).parent().parent().find('.abono').prop("disabled", true);
        }
        calcularTotalPago();
      });

      $(document).on('keyup','.abono',function(e){
          if(e.which==8){
            validarAbono(e,this);
          }
          calcularTotalPago();
      });

      $(document).on('keyup',"#valor_mayor", function(e){
          calcularTotalPago();
      });

      $(document).on('keypress','.abono', function(e){
        validarAbono(e,this);   
      });

      $(document).on('blur','.abono', function(e){
        validarAbono(e,this);   
      });
      
      function validarAbono(e,t) {
          var valor = 0, valorInicial = 0 ;
          if($.isNumeric(String.fromCharCode(e.which))) {
            if( (valor = parseInt($(t).val()+String.fromCharCode(e.which))) > (valorInicial = parseInt($(t).parent().parent().find('.valor_concepto').val())) ) {
              e.preventDefault();
            }else{
                $(t).parent().parent().find('.valor_restante').html(valorInicial - valor);
            }
          }else{
            valorInicial = parseInt($(t).parent().parent().find('.valor_concepto').val());
            valor = $(t).val();
            $(t).parent().parent().find('.valor_restante').html(valorInicial - valor);
            e.preventDefault();
          }
      }
      function calcularTotalPago() {
        var total = 0;
        $('.abono').each(function(i,elemento){
          if($.isNumeric($(elemento).val())) {
            total += parseInt($(elemento).val());
          }
        }).promise().done(function(){
          if($.isNumeric($("#valor_mayor").val()))
            total += parseInt($("#valor_mayor").val());
          $("#lbl_valor_total").html(total);
          $("#valor_total").val(total);
          $("#valor_total_c").html(total);
          $("#valor").val(total);


        });
      }


        

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

    $(document).on('click','#generar_recibo',function(e){
        e.preventDefault();
        if($('#form_caja_mayor').valid()){
            var load = open_overlay();
            $.post(base_url+'mvc/controllers/CReciboCajaMayor.php?action=insertarReciboCaja',$('#form_caja_mayor').serialize(),function(data){
                if(data.rpt){
                    $.notify(data.mensaje,'success');
                    resetearFormulario();
                    $('#factura_dian_c').html(data.resolucion);
                    $('#factura_dian').val(data.resolucion);
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