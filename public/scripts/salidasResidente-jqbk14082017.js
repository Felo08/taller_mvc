var validadorFiltros = undefined;
$(document).ready(function(){
    $('#form_salidaResidente').validate();   

	$('#form_caja_menor_eidt').validate();	
    validadorFiltros = $('#frm_filtro').validate();

    $("#cedula").select2({
        placeholder: "Buscar paciente",
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

    $("#cedula").change(function(e){
        if($(this).val() != null){
            $.post(base_url+'mvc/controllers/CInventario.php?action=obtenerEntradasInventario',{id_paciente:$(this).val()},function(data){
                var html = '';
                $.each(data,function(i,e){
                    html += '<tr><td>'+e.nombre_concepto +' '+ e.descripcion+'</td>'
                            + '<td><input type="text" name="disponible" class="form-control disponible" valor_disponible_real="'+e.disponible+'" value="'+e.disponible+'" disabled/></td>'
                            + '<td><input type="text" class="form-control valor-salida" name="valor_salida['+e.id+']"></td>'
                            + '</tr>';
                });
                $('#tbl-art tbody').html(html);
            },'JSON');
        }else{
            $('#tbl-art tbody').html('');
        }
    });

    $(document).on('click','#filtroSalidas',function(e){
        e.preventDefault();
        recargarGrid();
    });

    $(document).on('change', ".valor-salida", function(e){
        var ld_disponible;
        var ld_salida;
        var ld_disponible_real; 
        ld_disponible=parseInt($(this).parent().prev().children().val());
        ld_disponible_real=parseInt($(this).parent().prev().children().attr("valor_disponible_real"));
        ld_salida=parseInt($(this).val());
    
        if(isNaN(ld_salida))
        {
        
            $(this).parent().prev().children().val(ld_disponible_real);
            return false;
        }
        if (ld_salida>ld_disponible)
        {
          alert("La cantidad debe ser menor al disponible");
          $(this).val("0");
          $(this).parent().prev().children().val(ld_disponible_real);
          
          
          e.preventDefault();
        }
        else
        {
          ld_disponible= ld_disponible_real-ld_salida;
          $(this).parent().prev().children().val(ld_disponible);
        }
          
    });

    $('a[href="#verSalidas"]').click(function(){
        recargarGrid();
    });


    $('#guardar').on('click',function(e){
        e.preventDefault();
        if($('#form_salidaResidente').valid()){
            overlay = open_overlay();
            $.post(base_url+'mvc/controllers/CInventario.php?action=guardarInventarioResidente', $('#form_salidaResidente').serialize(), function(data){
                if(data.rpt){
                    $.notify(data.mensaje,'success');
                    $('#tbl-art tbody').html('');
                    $("#form_salidaResidente")[0].reset();
                    $("#cedula").empty();
                    $('#ctn_no_documento').html(data.dataNuevo.no_documento);
                    $('#no_documento').val(data.dataNuevo.no_documento);
                    fecha
                }else{
                    $.notify(data.mensaje,'error');
                }
                overlay.hide();
            },'json');
        }
    });

});

function recargarGrid() {
    $('#tbl_salidas_residente').load(base_url+'mvc/controllers/CInventario.php?action=recargarSalidasResidente',$('#frm_filtro').serialize());
}

function adicionar(){
	cont++;
  	var valor=$("#txtValor").val();
 	var concepto = $("#concepto option:selected").html();

 	var id="'fila_"+cont+"'";
    $('#tbl-facturas').append('<tr id="fila_'+cont+'"><td >'+concepto+'</td><td>'+valor+'</td><td><span onclick="eliminar('+id+')" class="glyphicon glyphicon-remove">&nbsp;</span></td><input class="valor_concepto" type="hidden" name="costos['+cont+']['+$("#concepto option:selected").val()+']" value="'+valor+'"> </tr>');
    $("#txtValor").val("");
    calcular_total();
}

function calcular_total() {
  var total = 0;
  $('.valor_concepto').each(function(i,element){
      total += parseFloat($(element).val());
  }).promise().done(function(){
    $('#valor_pagar').val(total);
    $('#valor_pagar_c').html(number_format(total, 0, ",", "."));
  });
}

function eliminar(id){
  $("#"+id).remove();
  calcular_total();
}
