$(document).ready(function(){
    
    $(document).on('show.bs.collapse',  '.collapse', function () {
        $('.collapse.in').collapse('hide');
    });

    $('#frm_valoracion').validate();

    $(document).on('click', '.eliminar_valoracion',function(e){
        e.preventDefault();
        var a = $(this);
        $.post(base_url+'mvc/controllers/CValoracionGeron.php?action=eliminarValoraciondownton',{id_resultado_indice:$(this).attr('id_resultado_indice'),id_cedula:$("#cedula").val()},
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

    $(document).on('click','#guardar',function(e){
        if($('#frm_valoracion').valid()){
            var overlay = open_overlay();
            $.post(base_url+'mvc/controllers/CValoracionGeron.php?action=guardardownton', $('#frm_valoracion').serialize(),function(data){
                overlay.hide();
                if(data.rpt){
                    $('#content_id_encabezado').css('display','block');
                    $.notify(data.mensaje,'success');
                    recargarItemsResultados();


                    bloquearCamposTipoValoracion();
                    $('#frm_valoracion')[0].reset();
                    profesional = $('#profesional').val();
                    observacion = $('#observacion').val();
                    $('input').val('');
                    $('#profesional').val(profesional);
                    $('#observacion').val(observacion);
                    $("#tipo_valoracion").empty();
                    scrollElemento($("#cedula"));
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
        $("#tipo_valoracion").empty();
        $("#tipo_valoracion").select2("enable",false);
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

    function recargarItemsResultados() {
        $('#tbl_items_resultantes').load(base_url+'mvc/controllers/CValoracionGeron.php?action=listaIndicedownton',{cedula:$('#cedula').val()});
    }

    $("#cedula").change(function(e){
        recargarItemsResultados();
        data = $(this).select2("data");
        if(data[0] != undefined){
            $("#tipo_valoracion").select2("enable");
        }else{
            $("#tipo_valoracion").select2("enable",false);
            $("#tipo_valoracion").empty();
            $('#content_id_encabezado').css('displey','none');
            $('#frm_valoracion')[0].reset();
            $('input').val('');
            bloquearCamposTipoValoracion();
        }
    });

    $(document).on('click','.imprimir_excel',function(e){
        window.open(
          base_url+'mvc/controllers/CValoracionGeron.php?action=exportarExceldownton&id_encabezado='+$(this).attr('id_encabezado'),
          '_blank' // <- This is what makes it open in a new window.
        );
        e.stopPropagation();
        e.preventDefault();
    });    

    $(document).on('click','.continuar_indice',function(e){
        $('#content_id_encabezado').html($(this).attr('id_encabezado'));
        $('#id_encabezado').val($(this).attr('id_encabezado'));
        $('#content_id_encabezado').css('display','block');
        $('#profesional').val($(this).attr('profesional'));
        $('#pre_profesional').val($(this).attr('profesional'));
        $('#observacion').val($(this).attr('observacion'));
        scrollElemento($("#cedula"));
        e.stopPropagation();
        e.preventDefault();
    });

    $("#tipo_valoracion").select2({
        placeholder: ("Pregunta"),
        allowClear: true,
        language: "es",
        ajax: { 
            url: base_url+'mvc/controllers/CValoracionGeron.php?action=obtenerTipoDownton', 
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

    $("#tipo_valoracion").change(function(e){
        data = $(this).select2("data");
        if(data[0] != undefined){
            desbloquerCamosTipoValoracion();
        }else{
            bloquearCamposTipoValoracion();
        }
    });

    function desbloquerCamosTipoValoracion() {
        $("#indice_barthel").select2("enable");
        $('#profesional').removeAttr("disabled");
        $('#observacion').removeAttr("disabled");
    }

    function bloquearCamposTipoValoracion() {
        $("#indice_barthel").empty();
        $("#indice_barthel").select2("enable",false);
        $('#profesional').attr("disabled","disabled");
        $('#observacion').attr("disabled","disabled");
    }

    $("#indice_barthel").select2({
        placeholder: "Respuesta",
        allowClear: true,
        language: "es",
        ajax: { 
            url: base_url+'mvc/controllers/CValoracionGeron.php?action=obtenerIndicedownton',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                data['tipo_valoracion'] = $("#tipo_valoracion").val();
                data['cedula'] = $("#cedula").val();
                data['id_encabezado'] = $("#id_encabezado").val();
                return data;
            }
        },
    });  

})