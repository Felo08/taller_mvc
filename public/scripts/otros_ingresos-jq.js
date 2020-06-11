var validadorFiltros = undefined;
$(document).ready(function(){
    $('#id_valor_traslado').val('0'); 
    $('#id_sucursal').val('NA'); 
    $('#id_banco').val('NA'); 
    $('#id_cheque').val('NA'); 
    $('#id_ciudad').val('Medellin'); 
    $('#form_otros_ingresos').validate();   
    $('#id_valor_traslado').number( true, 2 );
    $('#form_caja_menor_eidt').validate();  
    validadorFiltros = $('#frm_filtro').validate();

    function resetearFormulario() {
        $('#tbl-facturas tbody').html(''); 
        $('#tbl-notas tbody').html(''); 
        $('#form_otros_ingresos')[0].reset(); 
        $('#factura_dian_c').html();
        $('#valor_total_c').html('');
        $('#paciente_c').html('');
        $("#id_cedula").empty();
    }

    $("#id_cedula").select2({
        placeholder: "Buscar proveedor",
        allowClear: true,
        language: "es",
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


   $("#id_cedula").on('change',function(){

    });

    $("#id_cedula").on('change',function(){
        if($(this).val() != null){
   
        }else{
            resetearFormulario();
        }
    });
        

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
        if($('#form_otros_ingresos').valid()){
            var load = open_overlay();
            $.post(base_url+'mvc/controllers/CRecibos.php?action=guardarRecibOtrosIngresos',$('#form_otros_ingresos').serialize(),function(data){
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
    
 

     $(document).on('keyup',"#id_valor_traslado", function(e){
        calcularTotalPago();
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


    function calcularTotalPago() {
        var total = 0;
        $('.abono').each(function(i,elemento){
          if($.isNumeric($(elemento).val())) {
            total += parseInt($(elemento).val());
          }
        }).promise().done(function(){
          if($.isNumeric($("#id_valor_traslado").val()))
            total += parseInt($("#id_valor_traslado").val());
          $("#lbl_valor_total").html($.number(total,2));
          $("#valor_total").val(total);
          $("#valor_total_c").html($.number(total,2));

        });
      }

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