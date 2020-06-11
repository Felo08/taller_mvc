$(document).ready(function(){
    
    $(document).on('show.bs.collapse',  '.collapse', function () {
        $('.collapse.in').collapse('hide');
    });

    var validador = $('#frm_valoracion').validate();
    
    $(document).on('click', '.eliminar_valoracion',function(e){
        e.preventDefault();
        var a = $(this);
        $.post(base_url+'mvc/controllers/CValoracionGeron.php?action=eliminarValoracionIndiceBarthel',{id_resultado_indice:$(this).attr('id_resultado_indice'),id_cedula:$("#cedula").val()},
            function(respuesta){
            console.log(respuesta);
            if(respuesta.rpt){
                $.notify(respuesta.mensaje,'success');
                a.parent().parent().remove();
            }else{
                $.notify(respuesta.mensaje,'error');
            }
        },'json');
    });

    $(document).on('click','#guardarEquilibrio',function(e){
        var overlay = open_overlay();
        $.post(base_url+'mvc/controllers/CValoracionGeron.php?action=guardarEquilibrio', $('#frm_valoracion').serialize(),function(data){
            overlay.hide();
            if(data.rpt){
                $.notify(data.mensaje,'success');
                $('#nuevo').trigger('click');
            }else{
                $.notify(data.mensaje,'error');
            }    
        },'JSON');
    });
    $(document).on('click','#guardar',function(e){
        if(validador.element("#id_parametro") & validador.element("#id_situacion")){
            var overlay = open_overlay();
            $.post(base_url+'mvc/controllers/CValoracionGeron.php?action=guardarEquilibrio', $('#frm_valoracion').serialize(),function(data){
                overlay.hide();
                if(data.rpt){
                    $('#content_id_encabezado').css('display','block');
                    $.notify(data.mensaje,'success');
                    $('#content_id_encabezado').html(data.id_encabezado);
                    $('#id_encabezado').val(data.id_encabezado);
                    recargarItemsResultados($("#cedula").select2('data')[0].id);

                    bloquearCamposTipoValoracion();
                    profesional = $('#profesional').val();
                    observacion = $('#observacion').val();
                    $('#frm_valoracion')[0].reset();
                    $('input').val('');
                    $('#profesional').val(profesional);
                    $('#observacion').val(observacion);
                    $("#id_parametro").empty();
                    //scrollElemento($("#cedula"));
                    $('#tbl_items_resultantes').html('');
                    $('#content_id_encabezado').html(data.id_encabezado);
                    $('#id_encabezado').val(data.id_encabezado);

                }else{
                    $.notify(data.mensaje,'error');
                }
            },'JSON');
        }
    });

    $(document).on("click",'#nuevo',function(){
        bloquearCamposTipoValoracion();
        $('#content_id_encabezado').css('display','none');    
        $('#frm_valoracion')[0].reset();
        profesional = $('#profesional').val();
        observacion = $('#observacion').val();
        $('input').val('');
        $('#profesional').val(profesional);
        $('#observacion').val(observacion);
        $("#id_parametro").empty();
        $("#id_parametro").select2("enable",false);
        $("#cedula").empty();
        scrollElemento($("#cedula"));
        $('#tbl_items_resultantes').html('');
    });

    function scrollElemento(e) {
        $('html, body').animate({ 
            scrollTop: e.offset().top - 50 }, 
        'slow', function() {
                e.focus();
        });  
    }

    function limpiarCamposSelect2() {
        bloquearCamposTipoValoracion();
        $('#content_id_encabezado').css('display','none');    
        //$('#frm_valoracion')[0].reset();
        profesional = $('#profesional').val();
        observacion = $('#observacion').val();
        $('input').val('');
        $('#profesional').val(profesional);
        $('#observacion').val(observacion);
        $("#id_parametro").empty();
        $("#id_parametro").select2("enable",false);
        scrollElemento($("#id_parametro"));
        $('#tbl_items_resultantes').html('');
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

    function recargarItemsResultados(id_cedula) {
        $('#tbl_items_resultantes').load(base_url+'mvc/controllers/CValoracionGeron.php?action=listarEquilibrio',{cedula:id_cedula,'id_encabezado':$('#id_encabezado').val()},function(){

            $('.collapse_equilibrio').each(function(i,e){ 
                if( $(e).attr('aria-expanded') == 'false' )
                    setTimeout(function(){ $(e).trigger('click'); },3);

            }).promise().done(function () {
                setTimeout(function(){$('#accordion').show();},10);
            });
        });
    }

    $("#cedula").change(function(e){
        data = $(this).select2("data");
        if(data[0] != undefined){
            limpiarCamposSelect2();
            recargarItemsResultados($("#cedula").select2('data')[0].id);
            $("#id_parametro").select2("enable");
        }else{
            $('#cedula').empty();
            $("#id_parametro").select2("enable",false);
            $("#id_parametro").empty();
            limpiarCamposSelect2();
        }
    });

    $(document).on('click','.imprimir_excel',function(e){
        window.open(
          base_url+'mvc/controllers/CValoracionGeron.php?action=exportarExcelEquilibrio&id_encabezado='+$(this).attr('id_encabezado'),
          '_blank' // <- This is what makes it open in a new window.
        );
        e.stopPropagation();
        e.preventDefault();
    });    

    $(document).on('click','.continuar_equilibrio',function(e){
        $('#content_id_encabezado').html($(this).attr('id_encabezado'));
        $('#id_encabezado').val($(this).attr('id_encabezado'));
        $('#content_id_encabezado').css('display','block');
        $('#profesional').val($(this).attr('profesional'));
        $('#pre_profesional').val($(this).attr('profesional'));
        $('#observacion').val($(this).attr('observacion'));
        $(this).parent().find('.collapse_equilibrio').trigger('click');
        scrollElemento($("#cedula"));
        e.stopPropagation();
        e.preventDefault();
    });

    $("#id_parametro").select2({
        placeholder: ("Parámetro"),
        allowClear: true,
        language: "es",
        ajax: { 
            url: base_url+'mvc/controllers/CValoracionGeron.php?action=obtenerParametrosEquilibrio',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                data['cedula'] = $("#cedula").val();
                data['id_encabezado'] = $("#id_encabezado").val();
                return data;
            }
        },
    });  

    $("#id_parametro").change(function(e){
        data = $(this).select2("data");
        if(data[0] != undefined){
            desbloquerCamosTipoValoracion();
        }else{
            bloquearCamposTipoValoracion();
        }
    });

    function desbloquerCamosTipoValoracion() {
        $("#id_situacion").select2("enable");
        $('#profesional').removeAttr("disabled");
        //$('#observacion').removeAttr("disabled");
    }

    function bloquearCamposTipoValoracion() {
        $("#id_situacion").empty();
        $("#id_situacion").select2("enable",false);
    }

    $("#id_situacion").select2({
        placeholder: "Tipo",
        allowClear: true,
        language: "es",
        ajax: { 
            url: base_url+'mvc/controllers/CValoracionGeron.php?action=obtenerSituacionEquilibrio',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                data['id_parametro'] = $("#id_parametro").val();
                data['cedula'] = $("#cedula").val();
                data['id_encabezado'] = $("#id_encabezado").val();
                return data;
            }
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatResult,
    });  

    function formatResult(item) {
        if(item.id != undefined){
                return item.text + '<br/><b>Puntuación: </b>'+item.modelo.puntuacion;
        }else
            return null;
    }

});