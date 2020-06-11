$(document).ready(function(){


	$("#frm-medica").validate();

	$("#id_cedula").select2({
	    placeholder: "Buscar paciente",
	    allowClear: true,
	    language: "es",
	    ajax: { 
	        url: base_url+'mvc/controllers/CHuesped.php?action=obtenerHuespedsaludSelectcom',
	        cache: "true",
	        type:'POST',
	        dataType: 'json',
	        data: function (data, page) {
	            return data;
	        }
	    },
	});

});  


	$("#bnt-guardar").click(function(e){
   console.log("saludo");
		if($('#frm-medica').valid() && $('#frm-medica').valid()){
			loader = open_overlay();
			$.post(base_url+'mvc/controllers/Cacompanante.php',$("#frm-medica").serialize(),function(respuesta){
				if(respuesta.rpt){
					$("#id_cedula").val('').trigger('change');
			       	$('#frm-medica')[0].reset();
					$.notify(respuesta.mensaje,"success");
		             recargar_grid();
		       	}else{
		       		$.notify(respuesta.mensaje,"error");
		       	}
				loader.hide();
			},'json');
		}
		e.preventDefault();	

	});
	
	
	$(document).on('keyup',"#buscar_usuario",function(){
      $.post(base_url+'mvc/controllers/Cacompanante.php',$("#frm_buscar").serialize(),function(respuesta)
      {
         $("#contenedor_list_productos").html(respuesta);
          $("#load").hide();

      });



	});

	$(document).on('click', ".btn_edit_product", function()
	{
		    
		    
		    
			$.post(base_url+'mvc/controllers/Csalud.php',{action:"consultar_usuario",'id_cedula':$(this).attr('id_tercero')},function(respuesta){
			//console.log(respuesta);
			$("#id_paciente").val(respuesta.npaciente + ' '+ respuesta.apellido);
			$("#id_emergencia_medica").val(respuesta.emergencia);
			$("#id_eps").val(respuesta.eps);


			$("#id_ips").val(respuesta.id_ips);
			$("#id_prepagada").val(respuesta.id_prepagada);

			$("#id_motivo_ingreso").val(respuesta.motivoingreso);
			$("#id_estado_fisico_ingreso").val(respuesta.estadofisico);

			$("#id_enfermedades_padecidas").val(respuesta.enfermedad_padecida);
			$("#id_intervenciones_quirurjicass").val(respuesta.intervenciones_quirurgica);

			$("#id_alergiasa").val(respuesta.alergia);
			$("#id_historia_familiar").val(respuesta.antecedente_familiar);

			$("#id_grado_dependendencia").val(respuesta.id_dependencia);
			$("#id_cabeza").val(respuesta.cabeza);

			$("#id_cardio_respiratorio").val(respuesta.cardiorespiratorio);
			$("#id_musculo_esqueletico").val(respuesta.esqueletico);
			$("#id_genito_urinario").val(respuesta.urinario);
			$("#id_gastro_intestinal").val(respuesta.gastrointestinal);

			$("#id_piel").val(respuesta.piel);
			$("#id_lenguaje").val(respuesta.lenguaje);
			$("#id_organos_sentidos").val(respuesta.organos_sentidos);
			$("#id_estado_neurologico").val(respuesta.neurologico);


			$("#id_presion").val(respuesta.presion);
			$("#id_pulso").val(respuesta.pulso);
			$("#id_frecuencia_respiratoria").val(respuesta.fr);
			$("#id_temperatura").val(respuesta.temp);

			$("#id_peso").val(respuesta.peso);
			$("#id_oximetria_digital").val(respuesta.oximetria);
			$("#id_glicemia").val(respuesta.glicemia);
			$("#id_talla").val(respuesta.talla);

			$("#id_sanguinea").val(respuesta.sanguinea);
			$("#id_deposicion").val(respuesta.deposicion);
			$("#id_sueno").val(respuesta.sueno);
			$("#id_apetito").val(respuesta.apetito);
			$("#id_habitos_alimenticios").val(respuesta.habito);

			$("#id_nombre_responsable").val(respuesta.nombre);
			$("#id_cargo_responsable").val("Enfermera Jefe");



			$("#id_respuesta_deporte").val(respuesta.deporte);
			$("#id_frecuencia_deporte").val(respuesta.fre_deporte);
			$("#id_tipo_deporte").val(respuesta.tip_deporte);

			$("#id_respuesta_tabaco").val(respuesta.tabaco);
			$("#id_frecuencia_tabaco").val(respuesta.fre_tabaco);
			$("#id_tipo_tabaco").val(respuesta.tip_tabaco);


			$("#id_respuesta_licor").val(respuesta.alcohol);
			$("#id_frecuencia_licor").val(respuesta.fre_alcohol);
			$("#id_tipo_licor").val(respuesta.tip_alcohol);


			$("#id_respuesta_drogas").val(respuesta.drogas);
			$("#id_frecuencia_drogas").val(respuesta.fre_drogas);
			$("#id_tipo_drogas").val(respuesta.tip_drogas);

			$("#id_respuesta_otro").val(respuesta.otros_habitos);
			$("#id_frecuencia_otro").val(respuesta.fre_otros_h);
			$("#id_tipo_otro").val(respuesta.tipo_otros);



			$("#id_medico_ips").val(respuesta.nombremedico);
			$("#id_especialidad_medico_ips").val(respuesta.profesion);
			$("#id_telefono_medico_ips").val(respuesta.telefono);


				$("#id_medico_eps").val(respuesta.nombre1);
			$("#id_especialidad_medico_eps").val(respuesta.profesion1);
			$("#id_telefono_medico_eps").val(respuesta.telefono1);





			
			    
			$("#id_tercero").val(respuesta.id_cedula);
			
			

			$("#mimodal").modal("show");
		} ,'json');
	});



	$(document).on('click', "#bnt_guardar_producto", function()
	{
	//	$("#load_ediatr").show();
		$.post(base_url+'mvc/controllers/Csalud.php',$("#frm-editar-productos").serializeArray(),function(respuesta){
			if(respuesta.rpt){
			$.notify(respuesta.mensaje,"success");
				$("#mimodal").modal('toggle');

                recargar_grid();

			}
			else
				{
					$.notify(respuesta.mensaje,"error");

				}
			
		} ,'json');
	});


	$(document).on('click', '#btn_adicionar_hijo', function(e){
		console.log("sss");
		e.preventDefault();
		if($('#nombre_hijo').val().length>0){
			var html = '';
			var nhijo = parseInt($('#tbl_hijos').attr('nhijo'));
			html += '<tr class="hijo'+nhijo+'">';
			html += '<td>'+$('#nombre_hijo').val()+'<input type="hidden" value="'+$('#nombre_hijo').val()+'" name="hijos[medicamento][]"/></td>';
			
			html += '<td>'+$('#presentacion').val()+'<input type="hidden" value="'+$('#presentacion').val()+'" name="hijos[presentacion][]"/></td>';
			
			html += '<td>'+$('#dosis').val()+'<input type="hidden" value="'+$('#dosis').val()+'" name="hijos[dosis][]"/></td>';
			
			html += '<td><center><a type="button" class="btn btn-danger btn_remove" id="btn_remover_hijo" style="padding: 5px 12px;"><i class="glyphicon glyphicon-remove-circle"></i></a></center></td>';
			html += '</tr>';

			$('#tbl_hijos tbody').append(html);
			$('#nombre_hijo').html('');
			$('#nombre_hijo').val(''); 

			$('#presentacion').html('');
			$('#presentacion').val('');

			$('#dosis').html('');
			$('#dosis').val('');

			$('#frecuencia').html('');
			$('#frecuencia').val(''); 

			$('#via').html('');
			$('#via').val(''); 

			$('#hora').html('');
			$('#hora').val(''); 

		}else{
			$.notify('Por favor adicione el item ',"error");	
		}
	});

	$(document).on('click','.btn_remove',function(e){
		$(this).parent().parent().parent().remove();
	});



	

	function recargar_grid(){

		 $.post(base_url+'mvc/controllers/Cacompanante.php',{action:"recargar_salud"},function(respuesta)
	            {
	            	$("#contenedor_list_productos").html(respuesta);
	            });
	}