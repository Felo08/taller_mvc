$(document).ready(function(){

	  $("#id_paciente").select2({
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

});






	$("#id_paciente").change(function(e){
   
        console.log("dddfrr");
			//loader = open_overlay();
			$.post(base_url+'mvc/controllers/Ccontrol_enfermeria.php',$("#frm-medica").serialize(),function(respuesta){

				console.log(respuesta);
				if(Object.keys(respuesta).length > 0){

				$("#id_presion").val(respuesta.presion);
				$("#id_pa_evaluada").val(respuesta.valor15);
				$("#id_observacion_pa").val(respuesta.observacion);

				$("#id_reportar_pa").val(respuesta.reportarpresion);



				$("#id_deposicion").val(respuesta.depo);
				$("#id_deposicion_evaluada").val(respuesta.valor);
				$("#id_observacion_depo").val(respuesta.valor13);
				$("#id_reportar_depo").val(respuesta.reportardepo);


				$("#id_eliminacion").val(respuesta.eli);
				$("#id_eliminacion_evaluada").val(respuesta.valor1);
				$("#id_observacion_eli").val(respuesta.valor14);
				$("#id_reportar_eli").val(respuesta.reportareli);


				$("#id_bano").val(respuesta.bano);
				$("#id_observacion_bano").val(respuesta.valor2);
				$("#id_reportar_bano").val(respuesta.reportarbano);

				$("#id_alimentacion").val(respuesta.ali);
				$("#id_observacion_alimentacion").val(respuesta.valor7);
				$("#id_reportar_alimentacion").val(respuesta.reportarali);


				$("#id_higiene_oral").val(respuesta.oral);
				$("#id_higiene_oral_observacion").val(respuesta.valor8);
				$("#id_reportar_oral").val(respuesta.reportaroral);


				$("#id_visita_medica").val(respuesta.visita);
				$("#id_observacion_visita_medica").val(respuesta.valor9);
				$("#id_reportar_visita_medica").val(respuesta.reportarvisita);

				$("#id_salidas").val(respuesta.salida);
				$("#id_observacion_salida").val(respuesta.valor4);
				$("#id_reportar_salida").val(respuesta.reportarsalida);


				$("#id_regreso").val(respuesta.regreso);
				$("#id_observacion_regreso").val(respuesta.valor3);
				$("#id_reportar_regreso").val(respuesta.reportarregreso);
				

				$("#id_toma_muestra").val(respuesta.muestra);
				$("#id_observacion_toma_muestra").val(respuesta.valor5);
				$("#id_reportar_toma_muestra").val(respuesta.reportarmuestra);


				$("#id_recreacion").val(respuesta.recreacion);
				$("#id_observacion_recreacion").val(respuesta.valor10);
				$("#id_reportar_recreacion").val(respuesta.reportarrecreacion);

				$("#id_toma_medicamentos").val(respuesta.medicamento);
				$("#id_observacion_medicamentos").val(respuesta.valor6);
				$("#id_reportar_medicamentos").val(respuesta.reportarmedicamento);


				$("#id_urgencias").val(respuesta.urgencia);
				$("#id_observacion_urgencias").val(respuesta.valor11);
				$("#id_reportar_urgencias").val(respuesta.reportarurgencia);

				$("#id_sueno").val(respuesta.sueno);
				$("#id_observacion_sueno").val(respuesta.valor12);
				$("#id_reportar_sueno").val(respuesta.reportarsueno);

				$("#id_otras_observaciones").val(respuesta.otrasobservaciones);
				$("#id_elabora").val(respuesta.enfermera);
				

				
				



			}else{
				$("#id_presion").val('');
				$("#id_pa_evaluada").val('');
				$("#id_observacion_pa").val('');

				$("#id_reportar_pa").val('');
				$("#id_deposicion").val('');
				$("#id_deposicion_evaluada").val('');
				$("#id_observacion_depo").val('');
				$("#id_reportar_depo").val('');


				$("#id_eliminacion").val('');
				$("#id_eliminacion_evaluada").val('');
				$("#id_observacion_eli").val('');
				$("#id_reportar_eli").val('');


				$("#id_bano").val('');
				$("#id_observacion_bano").val('');
				$("#id_reportar_bano").val('');

				$("#id_alimentacion").val('');
				$("#id_observacion_alimentacion").val('');
				$("#id_reportar_alimentacion").val('');


				$("#id_higiene_oral").val('');
				$("#id_higiene_oral_observacion").val('');
				$("#id_reportar_oral").val('');


				$("#id_visita_medica").val('');
				$("#id_observacion_visita_medica").val('');
				$("#id_reportar_visita_medica").val('');

				$("#id_salidas").val('');
				$("#id_observacion_salida").val('');
				$("#id_reportar_salida").val('');


				$("#id_regreso").val('');
				$("#id_observacion_regreso").val('');
				$("#id_reportar_regreso").val('');
				

				$("#id_toma_muestra").val('');
				$("#id_observacion_toma_muestra").val('');
				$("#id_reportar_toma_muestra").val('');


				$("#id_recreacion").val('');
				$("#id_observacion_recreacion").val('');
				$("#id_reportar_recreacion").val('');

				$("#id_toma_medicamentos").val('');
				$("#id_observacion_medicamentos").val('');
				$("#id_reportar_medicamentos").val('');


				$("#id_urgencias").val('');
				$("#id_observacion_urgencias").val('');
				$("#id_reportar_urgencias").val('');

				$("#id_sueno").val('');
				$("#id_observacion_sueno").val('');
				$("#id_reportar_sueno").val('');

				$("#id_otras_observaciones").val('');
				$("#id_elabora").val('');



				
				
			}

				
			

				
				//loader.hide();
			},'json');
	
		e.preventDefault();	

	});
	
	
	