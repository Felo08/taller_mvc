var validator = undefined;
$(document).ready(function(){
    
    validator = $('#frm_valoracion').validate();

    crearSelect2Cedula();

    function crearSelect2Cedula(data) {
      	$("#cedula").select2({
	        placeholder: "Buscar huesped", 
	        allowClear: true,
	        language: "es",
	        initSelection: function (element, callback) {
	            if(data != undefined){
	                callback(data);
	            }else{
	                callback({id:0,text:''});
	            }
	        },
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

	    if(data != undefined){
            var s2 = $("#cedula").data('select2'); 
                s2.trigger('select', { 
                  data: data 
                }); 
        }
      }  

    $("#cedula").change(function(){
       	$('.chk').prop('checked', false);
       	$('#id_encabezado').val('');
    	var w = this;
		data = $(w).select2("data");
        if(data[0] != undefined){
	    	$.post(base_url+'mvc/controllers/CValoracionGeron.php?action=obtenerInfoEncuestaPfeiffer',{cedula:$('#cedula').val()},function(data){
	    		$('#fecha').html(data.fecha_actual);
				$('#nombre').html(data.data_huesped.nombre+' '+data.data_huesped.apellido);
                $('.chkno').prop('checked', true);
	    	},'json');
	    	recargarGrid();
	    }else{
	    	$('#fecha').html('');
    		$('#nombre').html('');	
    		recargarGrid();
	    }
    });

    $(document).on('click','.btn_ver_detalle_encuesta',function(){
		var overlay = open_overlay();
    	$('#ver_encuenta_pfeiffer .modal-body').load(base_url+'mvc/controllers/CValoracionGeron.php?action=cargarEncuentaPfeiffer',{id_encabezado:$(this).attr('id-encabezado')},function(){
			overlay.hide();
			$('#ver_encuenta_pfeiffer').modal('show');
    	});
    });

    $(document).on('click','.btn_editar_encuesta',function(){
		var overlay = open_overlay();
    	$.post(base_url+'mvc/controllers/CValoracionGeron.php?action=cargarInfoEncuentaPfeiffer',{cedula:$(this).attr('cedula'),id_encabezado:$(this).attr('id-encabezado')},function(data){
			console.log(data);	
			crearSelect2Cedula({id:data.data_huesped.id_cedula,text:(data.data_huesped.nombre+" "+data.data_huesped.apellido),modelo:data.data_huesped});
			$('#fecha').html(data.fecha_actual);
			$('#nombre').html(data.data_huesped.nombre+' '+data.data_huesped.apellido);
			$('#observacion').val(data.data_encabezado.observacion);
			$('#profesional').val(data.data_encabezado.profesional);
			$('#id_encabezado').val(data.data_encabezado.id_encabezado_pfeiffer);
			setTimeout(function(){ 
                $(data.data_encuenta).each(function(i,row){
                    $(document).find("[pregunta="+row.pregunta+""+row.respuesta+"]").prop("checked",true);
			     });
    			$('a[href="#contestarEncuenta"]').trigger('click');
    			overlay.hide();
            },"100");
    	},'json');
    });

    $('#ingresar').on('click',function(e){
    	e.preventDefault();
    	if($('#frm_valoracion').valid()){
    		var overlay = open_overlay();
    		$.post(base_url+'mvc/controllers/CValoracionGeron.php?action=guardarEncuestaPfeiffer',$('#frm_valoracion').serialize(),function(data){
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
    	$("#cedula").empty();
    	$("#cedula").focus();
    	limpiar1();
    	setTimeout(function(){validator.resetForm();},100);
    }); 

    $('a[href="#consultarEncuesta"]').click(function(){
		recargarGrid();
	});

	function recargarGrid() {
		data = {};
		selectCedula = $('#cedula').select2("data");

        if(selectCedula[0] != undefined)
        	data.cedula = $('#cedula').val();
		$('#tbl-listado-encuestas').load(base_url+'mvc/controllers/CValoracionGeron.php?action=cargarListaDoEncuestaPorFecha',data);
	}

    function limpiar1() {
       	$('#frm_valoracion')[0].reset();
       	$('#id_encabezado').val('');
    	$('#fecha').html('');
    	$('#nombre').html('');	
    }   


}); 