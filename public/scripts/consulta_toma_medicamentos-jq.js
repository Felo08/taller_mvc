$(document).on('ready',function(){

	$("#cedula").select2({
	    placeholder: "Buscar paciente",
	    allowClear: true,
	    language: "es",
	    ajax: { 
	        url: base_url+'mvc/controllers/CHuesped.php?action=obtenerHuespedsconsultaSelect', 
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {
	            return data;
	        }
	    },
	});

	$.datetimepicker.setLocale('es');
	jQuery('#fecha').periodpicker({
        end: '#fecha2',
        timepicker: false,
        lang: 'es',
        cells: [1,3],
        clearButtonInButton: true,
        fullsizeButton: true,
        closeAfterClear:function(){},
        i18n: {
         'es' : {
           'Select week #' : 'Seleccionar semana #',
           'Select period' : 'Seleccionar el rango de fecha',
           'Open fullscreen' : 'Abrir pantalla completa',
           'Close' : 'Salir',
           'OK' : 'Aceptar',
           'Choose period' : 'Elegir periodo'
          },
        },
      });


	$(document).on('click', "#btn_limpiar", function(e){
		e.preventDefault();
		$("#cedula").empty();
		$('#fecha').periodpicker('clear');
	});

	$(document).on('click', '#btn_buscar',function(e) {
		e.preventDefault();
		if(jQuery('#fecha').periodpicker('valueStringStrong').length > 0){
			if($('#from_generar_reporte').valid()){
				var win = window.open(base_url+"mvc/controllers/CKardex.php?action=generarReporteTomaMedicamentosExcel&"+$('#from_generar_reporte').serialize(), '_blank');
  				win.focus();
			}
		}else{
			$.notify('Debe seleccionar una rango de fecha');
		}
	})


	$('#from_generar_reporte').validate();


});