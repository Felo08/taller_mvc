$(document).on('ready',function(e){
	$('#frm-medicar').validate(); 
	$('#frm-alergia').validate(); 
	$('#frm-observacion').validate(); 
	$('#frm-dieta').validate(); 
	$('#frm-diagnostico').validate(); 
	$('#exportar').popover({ html : true,
							 placement: 'bottom',
							 container: 'body'
							  });

	$(document).on('click', '#exportar', function(e){
		e.preventDefault();
	});

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


	$('#cedula').change(function(e){
		data = $(this).select2("data");
        if(data[0] != undefined){
			$('#tbl_lista_medicamentos').html('<center><img src="'+base_url+'public/images/ajax-loader.gif"/></center>').load(base_url+'mvc/controllers/CKardex.php?action=verListadoMedicamentosPaciente',{cedula:$("#cedula").val()});
		}else{
			$('#tbl_lista_medicamentos').html('');
		}	
	});	

	$(document).on('click','#exportar_excel',function(e){
		e.preventDefault();
		if($('#cedula').val() != null){
			window.open(base_url+'mvc/controllers/CKardex.php?action=exportarKardexExcel&id_paciente='+$('#cedula').val(),'_blank');
		}else{	
			$.notify('Debe seleccionar un huesped.','error');
		}
	});

	$(document).on('click','#exportar_pdf',function(e){
		e.preventDefault();
		if($('#cedula').val() != null){
			window.open(base_url+'mvc/controllers/CKardex.php?action=exportarKardexPdf&id_paciente='+$('#cedula').val(),'_blank');
		}else{	
			$.notify('Debe seleccionar un huesped.','error');
		}
	});	
});