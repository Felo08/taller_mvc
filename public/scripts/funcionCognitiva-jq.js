var validator = undefined;
$(document).ready(function(){
    
    validator = $('#frm_valoracion').validate();

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

    $("#cedula").change(function(){
        recargarGridEncuesta();
       	$('.chk').prop('checked', false);
        $('.chkno').prop('checked', true);
       	$('#id_encabezado').val('');
    	var w = this;
		data = $(w).select2("data");
        if(data[0] != undefined){
	    	$.post(base_url+'mvc/controllers/CValoracionGeron.php?action=obtenerInfoEncuestaYesavage',{cedula:$('#cedula').val()},function(data){
	    		$('#fecha').html(data.fecha_actual);
				$('#nombre').html(data.data_huesped.nombre+' '+data.data_huesped.apellido);
	    	},'json');
	    }else{
	    	$('#fecha').html('');
    		$('#nombre').html('');	
	    }
    })

    $('#ingresar').on('click',function(e){
    	e.preventDefault();
    	if($('#frm_valoracion').valid()){
    		var overlay = open_overlay();
    		$.post(base_url+'mvc/controllers/CValoracionGeron.php?action=guardarEncuestaYesavage',$('#frm_valoracion').serialize(),function(data){
    			overlay.hide();
    			if(data.rpt){
                    $.notify(data.mensaje,'success');
                    $('#limpiar').trigger('click');
                }else{
                    $.notify(data.mensaje,'error');
                }
    		},'json')
    	}
    });

    $('#limpiar').on('click',function(e){
        e.preventDefault();
    	$("#cedula").focus();
    	limpiar1();
    	setTimeout(function(){validator.resetForm();},100);
    }); 

    function limpiar1() {
       	$('#frm_valoracion')[0].reset();
       	$('#id_encabezado').val('');
        $("#cedula").empty().trigger('change');
    	$('#fecha').html('');
    	$('#nombre').html('');	
    }   

    $('a[href="#verEncuesta"]').click(function(){
        if($('#tbl_encuestas').html().length == 0)
            recargarGridEncuesta();
    });


    function recargarGridEncuesta() {
        $('#tbl_encuestas').html('<center><img src="'+base_url+'public/images/ajax-loader.gif"></center>').load(base_url+'mvc/controllers/CValoracionGeron.php?action=listarEncuestaYesavage',{id_cedula:$('#cedula').val()});
    }
}); 