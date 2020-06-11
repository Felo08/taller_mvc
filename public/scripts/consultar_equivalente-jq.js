$(document).on('ready',function(){
	$('#frm_filtro_fechas').validate();

	$(document).on('click','#consultar',function(){
		if($('#frm_filtro_fechas').valid()){ 
			$.get(base_url+'mvc/controllers/CEgresos.php?action=consultarEgresosFiltroFechas',{'fecha_ini':$('#fecha_ini').val(),'fecha_fin':$('#fecha_fin').val()},function(html){
				$('#contenedor_list_egresos').html(html);
			});
		}
	});

	$(document).on('keyup',"#buscar_egreso",function(){
		$.get(base_url+'mvc/controllers/CEgresos.php?action=consultarEgresosFiltro',{'filtro':$(this).val()},function(html){
			$('#contenedor_list_egresos').html(html);
		});
	});

	$(document).on('click','.print_egreso',function(e){
		e.preventDefault();
	});

	$(document).on('click','#export_egresos_excel',function(e){
		if($('#frm_filtro_fechas').valid()){ 
			window.open(base_url+'mvc/controllers/CEgresos.php?action=exportarExcel&'+$('#frm_filtro_fechas').serialize()+'&filtro='+$('#buscar_egreso').val(),'_blank');
		}
		e.preventDefault();
	});

	$(document).on('click','.eliminar_egreso',function(e){
		btn_elimnar = $(this);
		bootbox.confirm({
            message: "Esta seguro de borrar este egreso?", 
            locale: 'es', 
            callback: function(result) {                
                if (!result) {                                             
                    $(document).click();  
                }else{
                	var load = open_overlay();
                	console.log(btn_elimnar.attr('idequivalente'));
                	$.post(base_url+'mvc/controllers/CEgresos.php?action=eliminarEgreso',{'id_equivalente':btn_elimnar.attr('idequivalente')},function(data){
						if(data.rpt){
							$.notify(data.mensaje,"success");
                   			$('#buscar_egreso').trigger('keyup');
						}else{
							$.notify(data.mensaje,'error');
						}
						load.hide();
					},'json');
                }                                 
            },
            buttons: {
                confirm: {
                    label: 'Aceptar',
                },
                cancel: {
                    label: 'Cancelar',
                }
            },
        });
		e.preventDefault();
	});
}); 