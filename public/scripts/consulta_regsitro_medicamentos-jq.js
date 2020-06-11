$(document).on('ready',function(){

	$('#from_generar_reporte').validate();

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

	/*
	$.datetimepicker.setLocale('es');
  	$('#fecha').datetimepicker({
     timepicker:false,
     format:'Y-m',
     onChangeDateTime:function(dp,$input){

      }
  	});*/
  	$('#fecha').datepicker({
	    autoclose: true,
	    minViewMode: 1,
	    language: 'es',
	    format: 'yyyy-mm'
	}).on('changeDate', function(selected){
	        startDate = new Date(selected.date.valueOf());
	        startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
	        $('.to').datepicker('setStartDate', startDate);
	    }); 

	$('.to').datepicker({
	    autoclose: true,
	    minViewMode: 1,
	    format: 'yyyy-mm'
	}).on('changeDate', function(selected){
	        FromEndDate = new Date(selected.date.valueOf());
	        FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
	        $('#fecha').datepicker('setEndDate', FromEndDate);
	    });


	$(document).on('click', "#btn_limpiar", function(e){
		e.preventDefault();
		$("#cedula").empty();
		$('#fecha').periodpicker('clear');
	});

	$(document).on('click', '#btn_buscar',function(e) {
		e.preventDefault();
		if($('#from_generar_reporte').valid()){
			if($('#from_generar_reporte').valid()){
				var win = window.open(base_url+"mvc/controllers/CKardex.php?action=generarReporteregsitromedicamentosExcel&"+$('#from_generar_reporte').serialize(), '_blank');
  				win.focus();
			}
		}
	})


	$('#from_generar_reporte').validate();


});