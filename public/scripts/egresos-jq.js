var todasLasFacturas = false; //Esta  variable sirve para saber si quiere ver todas las facturas al momento de dar clic sobrre el btn cancelar, ubicado en la grid
$(document).on('ready',function(){
  $('#id_valor_traslado').val('0'); 

  $('#id_valor_traslado').number( true, 2 );
  $('#id_nocheque').val('0'); 

  $('#form1').validate(); 

  crearSelect2Cliente(); 

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


  $(document).on('click','#agregar_datelle',function (e){
    if($('#Valor').val().length > 0 &&  $('#concepto').val().length > 0){
      html = '<tr style="text-align: center;">'+
          '<td><input type="hidden" value="'+$('#Valor').val()+'" name="detalle[valor][]"/>'+$('#Valor').val()+'</td>'+
          '<td><input type="hidden" value="'+$('#concepto').val()+'" name="detalle[concepto][]"/>'+$('#concepto').val()+'</td>'+
          '<td><button class="btn eliminar_detaller" ><i class="glyphicon glyphicon-remove-circle"></i></button></td>'+
          '</tr>';
      $('#tbl-detalle').append(html);
      $('#Valor').val('');
      $('#concepto').val('');
    }else{
      $.notify('El concepto y valor no pueden estar vacÃ­os.','error');
    }
  });

  $(document).on('click','.eliminar_detaller',function(){
    $(this).parent().parent().remove();
  });

  $(document).on('click','#guardar_comprobante_egreso',function(e){

    if($('#form1').valid()){
      var load = open_overlay();
      var data = $('#form1').serializeArray(); 
      data.push({'name' : 'cedula','value':$('#cedula').select2("data")[0].id});
      $.post(base_url+'mvc/controllers/CEgresos.php?action=guardarComprobanteEgreso', data ,function(respuesta){
        if(respuesta.rpt){
          $("#form1")[0].reset();
          
        $("#cedula").empty().trigger("change");
        $("#forma_pago").empty().trigger("change");
        
        $('#tbl-facturas tbody').html('');

        $("#valor_total_c").html('');
        $("#id_valor_total").val('0');
        $('#id_nocheque').val('0'); 


          $.notify(respuesta.mensaje,'success');
          $('#no_documento').val(respuesta.parametrizacionFactura.consecutivo_egreso);
          if($('#modal_egresos').length > 0){
            $('#modal_egresos').modal('toggle');
          }

          if($('#grid').length > 0){
            $('#grid').trigger("reloadGrid");
          }
        }else{
          $.notify(respuesta.mensaje,'error');
        }
        load.hide();
      },'json');
    }

    e.preventDefault();
  });
});



  $(document).on('change', '#forma_pago', function(e){
    e.preventDefault();
    if($(this).val() == 5){
      console.log("dddd");
      $('#ctn_tarjeta_credito').show();
    }else{
      $('#ctn_tarjeta_credito').hide();
      $("#id_tarjeta_credito").empty().trigger("change");
    }
  });





$(document).on('change',"#cedula", function(){
        if($(this).val() != null){
          var data = {}; 
          if(!todasLasFacturas){
            data = {'cliente':$(this).val()};
          }
          
          $.post(base_url+'mvc/controllers/CEgresos.php?action=obtenerFacturacioncxp',data,function(data){
                var html = '';
                var opt = '';
                if(data.rpt){
                    for(i in data.facturacion){
                        factura = data.facturacion[i];
                        valor_restante = factura.subtotal - factura.abono;
                        html += '<tr>'
                          + '<td>'+factura.no_documento+'</td>'
                         + '<td>'+ factura.fecha_venci+'</td>'

                                + '<td><input class="valor_concepto" type="hidden" value="'+ ( (factura.subtotal - factura.abono) )+'" name="valor_factura[]">  <input type="hidden" class="subtotal" value="'+factura.subtotal+'"> <label>'+ number_format( factura.subtotal)+'</label></td>'
                                
                                + '<td style="text-align:center"><input type="checkbox" class="chk-abono" value="'+factura.id_cxp+'" name="facturas[]"></td>'
                                + '<td style="text-align:center"><input type="text" disabled="disabled" class="abono form-control" name="abonos['+factura.id_cxp+']"></td>'
                                + '<td><input type="hidden" class="hidden_valor_restante" value="'+(valor_restante)+'" name="valor_restante['+factura.id_cxp+']"><div class="valor_restante">'+ number_format( valor_restante )+'</div></td>'
                                + '<td class="porcentaje_retencion"><input type="hidden" class="hidden_porcentaje_retencion" value="'+( (factura.por_retencion))+'" name="porcentaje_retencion['+factura.id_cxp+']">'+( (factura.por_retencion))+'</td>'
                                + '<td class="valor_retenciones"><input type="hidden" class="hidden_valor_retenciones" value="'+((0*factura.por_retencion)/100)+'" name="valor_retencion['+factura.id_cxp+']"><div class="ctn_valor_retenciones">'+((0*factura.por_retencion)/100)+'</div></td>'
                                + '<td class="tope_minimo"><input type="hidden" class="hidden_tope_minimo" value="'+( (factura.tope_min))+'" name="tope_minimo['+factura.id_cxp+']">'+( (factura.tope_min))+'</td>'  
                                + '<td class="valoraiva"><input type="hidden" class="hidden_valor_aiva" value="'+( (factura.valor_aiva))+'" name="valoraiva['+factura.id_cxp+']">'+number_format( (factura.valor_aiva))+'</td>'  
                                
                                +'</tr>';
                    }
                    html += '<tr id="totales"><td colspan="8"></td></tr>'
                    $('#tbl-facturas tbody').html(html); 
                    calcularTotales();
                    
                }
            },'json');
        }else{
            
        }
    });




      $(document).on('change','.chk-abono',function(e){
        $(this).parent().parent().find('.abono').val('');
        var porcentaje_retencion = parseFloat($(this).parent().parent().find('.hidden_porcentaje_retencion').val() );
        var tope_minimo= parseFloat($(this).parent().parent().find('.hidden_tope_minimo').val() );

        if($(this).is(':checked')){
          var valor_restante = parseFloat($(this).parent().parent().find('.hidden_valor_restante').val());
          var valor_vrete=parseFloat($(this).parent().parent().find('.hidden_valor_aiva').val());
         /* console.log(valor_vrete);
          console.log(tope_minimo);*/
          $(this).parent().parent().find('.abono').prop("disabled", false);
 
          $(this).parent().parent().find('.abono').val( valor_restante );
          var valor_retenciones = Math.round(((valor_vrete*porcentaje_retencion)/100));
          if(tope_minimo > valor_restante){ 
            valor_retenciones=0;
            
            
            $(this).parent().parent().find('.hidden_porcentaje_retencion').val(0);
 
          }
          $(this).parent().parent().find('.abono').prop("disabled", false);

          $(this).parent().parent().find('.abono').val( valor_restante );
          //var valor_retenciones = ((valor_restante*porcentaje_retencion)/100);
          $(this).parent().parent().find('.hidden_valor_retenciones').val( valor_retenciones );
          $(this).parent().parent().find('.ctn_valor_retenciones').html( valor_retenciones );
          $(this).parent().parent().find('.valor_restante').html(0);
          $(this).parent().parent().find('.hidden_valor_restante').val(0);
        }else{
          var valorInicial = parseFloat(parseInt($(this).parent().parent().find('.valor_concepto').val()));
          var valor_retenciones = ((0*porcentaje_retencion)/100);
          if(tope_minimo > valor_restante)
          { 
            valor_retenciones=0;
            
            $(this).parent().parent().find('.hidden_porcentaje_retencion').val(0);
          }
          $(this).parent().parent().find('.valor_restante').html(valorInicial);
          $(this).parent().parent().find('.hidden_valor_restante').val(valorInicial);
          $(this).parent().parent().find('.hidden_valor_retenciones').val( valor_retenciones );
          $(this).parent().parent().find('.ctn_valor_retenciones').html( valor_retenciones );
          $(this).parent().parent().find('.abono').prop("disabled", true);
        }
        calcularTotalPago();
      });

      $(document).on('keyup','.abono',function(e){
         // if(e.which==8){
            validarAbono(e,this);
        //  }
         // calcularTotalPago();
      });



     $(document).on('keyup','.abono',function(e){
         // if(e.which==8){
            validarAbono(e,this);
          //var t = this;
          var t=parseFloat($(this).parent().parent().find('.hidden_valor_aiva').val());
        
         // }
         var porcentaje_retencion = parseFloat( $(t).parent().parent().find('.hidden_porcentaje_retencion').val() );
         var valor_retenciones = 0;
          if(!isNaN(parseInt($(t).val()))){
            valor_retenciones = ((parseInt($(t).val())*porcentaje_retencion)/100);
          }
          $(t).parent().parent().find('.hidden_valor_retenciones').val( valor_retenciones );
          $(t).parent().parent().find('.ctn_valor_retenciones').html( valor_retenciones );
          calcularTotalPago();
      });

     
      $(document).on('keypress','.abono', function(e){
        validarAbono(e,this);   
      });

      $(document).on('blur','.abono', function(e){
        validarAbono(e,this);   
      });

    function obtenerValorDisponibleTraslado() {
    var totalDispoTraslado = 0;
    var valor_traslado = 0;
    for(i = 0; i < $('.abono').length; i++){ 
        x = $('.abono')[i]
        totalDispoTraslado += parseFloat((!$.isNumeric($(x).val())?0:$(x).val())); 
    }
    valor_traslado = ( !$.isNumeric($('#id_valor_traslado').val())?0:parseFloat($('#id_valor_traslado').val()) );
    return (valor_traslado - totalDispoTraslado)<0?0:(valor_traslado - totalDispoTraslado);
}

 function calcularTotalPago() {
    var total = 0;
    $('.abono').each(function(i,elemento){
      var valor_retenciones = 0;
      var abono = 0;
      if($.isNumeric($(elemento).parent().parent().find('.hidden_valor_retenciones').val()))
        valor_retenciones = parseFloat( $(elemento).parent().parent().find('.hidden_valor_retenciones').val() );
      if($.isNumeric($(elemento).val())) 
        abono = parseFloat($(elemento).val());
      
      total += (abono - valor_retenciones);
    }).promise().done(function(){
      if($.isNumeric($("#valor_mayor").val()))
        total += parseFloat($("#valor_mayor").val());
      $("#lbl_valor_total").html(number_format(total,2,'.',','));
      $("#valor_total").val(total);
      $("#valor_total_c").html(number_format(total,2,'.',','));

      calcularTotales();
    });
  }

function validarAbono(e,t) {
          var valor = 0, valorInicial = 0 ;
          if($.isNumeric(String.fromCharCode(e.which))) {
            if( (valor = parseInt($(t).val()+String.fromCharCode(e.which))) > (valorInicial = parseInt($(t).parent().parent().find('.valor_concepto').val())) ) {
              e.preventDefault();
            }else{
                v = valorInicial - valor;
                $(t).parent().parent().find('.valor_restante').html($.number(valorInicial - valor,2));
                $(t).parent().parent().find('.hidden_valor_restante').val(valorInicial - valor);
            }
          }else{
            valorInicial = parseInt($(t).parent().parent().find('.valor_concepto').val());
            valor = $(t).val();
            v = valorInicial - valor;
            $(t).parent().parent().find('.valor_restante').html($.number(valorInicial - valor,2));
            $(t).parent().parent().find('.hidden_valor_restante').val(valorInicial - valor);


            e.preventDefault();
          }

          var valorRestatne = parseFloat($(t).parent().parent().find('.valor_restante').html());

      }

  function crearSelect2Cliente(data){
    var datar;
    if(data != undefined){
        datar = {'id':data.id_cliente, 'text':data.razon_social+' '+data.nombre+' '+data.apellido,'modelo':data};
    }
    $("#cedula").select2({
        placeholder: "Buscar Cliente",
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
            url: base_url+'mvc/controllers/CCliente.php?action=obtenerClienteSelect2',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                return data;
            }
        },
    });
    if(data != undefined){
        var s2 = $("#cedula").data('select2'); 
        s2.trigger('select', { 
          data: datar 
        }); 
    }
  }


  function limpiarFormulario() {
      $("#frm-factura")[0].reset();
      //$("#proveedor").select2("val", "");
      $("#proveedor").empty().trigger("change");
      $("#paciente").empty().trigger("change");
       $("#id_concepto").empty().trigger("change");

      $("#pre_valor_compra").html('');
  }

  function calcularTotales() {
    var p = 0,subtotal=0,valrestante=0,porcentaje_retencion=0,valor_retencion=0;
    $('#tbl-facturas tr').each(function(i,tr){
        if(p>0){
          if($(tr).find('.subtotal').val() != undefined)
            subtotal += parseFloat($(tr).find('.subtotal').val());

          if($(tr).find('.hidden_valor_restante').val() != undefined)
            valrestante += parseFloat($(tr).find('.hidden_valor_restante').val());
          
         /* if($(tr).find('.hidden_porcentaje_retencion').val() != undefined)
            porcentaje_retencion += parseFloat($(tr).find('.hidden_porcentaje_retencion').val());*/

          if($(tr).find('.hidden_valor_retenciones').val() != undefined)
            valor_retencion += parseFloat($(tr).find('.hidden_valor_retenciones').val());
        }
        p++;
    }).promise().done(function(e){
      tr = "<td></td><td></td><td><b>"+number_format(subtotal,2,'.',',')+"</b></td><td></td><td></td><td><b>"+number_format(valrestante,2,'.',',')+"</b></td><td><b>"+number_format(porcentaje_retencion,2,'.',',')+"</b></td><td><b>"+number_format(valor_retencion,2,'.',',')+"</b></td><td></td>";
      $('#totales').html(tr);
    });

    //totales
  }

