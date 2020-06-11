$(document).ready(function(){
    $('#form_caja_menor').validate();   
	$('#form_caja_menor_eidt').validate();	
    $('#frm_filtro').validate();
recargarGridRecibosNoCancelados();
    function resetearFormulario() {
        $('#form_caja_menor')[0].reset();
        $('#factura_dian_c').html();
        $('#paciente').empty();
    }

    $("#paciente").select2({
        placeholder: "Buscar proveedor",
        allowClear: true,
        language: "es",
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

     $("#proveedor").select2({
        placeholder: "Buscar proveedor",
        allowClear: true,
        language: "es",
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


    $('a[href="#verRecibos"]').click(function(){
        recargarGridReciboCaja();
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
                    recargarGridReciboCaja();
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


    $(document).on('click','#generarRecibo',function(e){
        e.preventDefault();
        if($('#form_caja_menor').valid()){
            var load = open_overlay();
            $.post(base_url+'mvc/controllers/CReciboCajaMenor.php?action=insertarReciboCaja',$('#form_caja_menor').serialize(),function(data){
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
        if($('#frm_filtro').valid()){
            $.get(base_url+'mvc/controllers/CReciboCajaMenor.php?action=recargarRecibosCajaMenor',$('#frm_filtro').serialize(),function(html){
                 $("#tbl_recibos_caja_menor").html(html);
            });
        }
        e.preventDefault();
    });
    
    function recargarGridReciboCaja() {
        $("#tbl_recibos_caja_menor").load(base_url+'mvc/controllers/CReciboCajaMenor.php?action=recargarRecibosCajaMenor');
    }

     function recargarGridRecibosNoCancelados() {
         $('#grid_recibos_no_cancelados').load(base_url+'mvc/controllers/CReciboCajaMenor.php?action=recargarGridRecibosNoCancelados',{id_caja_menor: $('#cajamenor_reembolso').val()});
     }


      $(document).on('click','#bnt-grabar-reembolso',function(e){
        e.preventDefault();
        if($('#frm-factura').valid()){
            var load = open_overlay();
            $.post(base_url+'mvc/controllers/CReciboCajaMenor.php?action=guardarReembolso',$('#frm-factura').serialize(),function(data){
                if(data.rpt){
                    $.notify(data.mensaje,'success');
                    recargarGridreembolso();
                    recargarGridRecibosNoCancelados();
                    //$("#modalEditReciboCaja").modal('toggle');
                }else{
                    $.notify(data.mensaje,'error');
                }
                load.hide();
            },'json');
        }
    });
     $(document).on('change','.chk_adicionar_recibo',function(e){
        var valor = parseFloat($('#id_reembolso').val());
        if($(this).prop( "checked" )){
            valor += parseFloat($(this).attr('valor'));
        }else{
            valor -= parseFloat($(this).attr('valor'));
        }
        $('#id_reembolso').val(valor);
        $('#id_reembolso_pre').html(number_format(valor,2,'.',','));
     });





});