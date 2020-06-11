 $(document).on('ready',function(){

 	var validador = $('#frm_control_diario_enfermeria').validate();	
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


    $("#cedulae").select2({
        placeholder: "Buscar enfermera",
        allowClear: true,
        language: "es",
        ajax: { 
            url: base_url+'mvc/controllers/CHuesped.php?action=obtenerEnfermeraSelect',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                return data;
            }
        },
    });

    $("#id_enfermera_turno").select2({
        placeholder: "Buscar enfermera",
        allowClear: true,
        language: "es",
        ajax: { 
            url: base_url+'mvc/controllers/CHuesped.php?action=obtenerEnfermeraSelect',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                return data;
            }
        },
    });

    $('#consultarControlEnfermeria').click(function(e){
    	e.preventDefault();
    	if(validador.element("#cedula") && validador.element("#turno")){
    		overlay = open_overlay(); 
	    	$.post(base_url+'mvc/controllers/Ccontrol_enfermeria.php?action=consultarControlEnfermeria',$('#frm_control_diario_enfermeria').serialize(),function(data){
	    		if(data.rpt){
   					$.notify(data.mensaje,"success");
   				}else{
   					$.notify(data.mensaje,"error");
   				}
   				overlay.hide();
	    	},'JSON');
    	}
    });

    function resetearFormularioEnfermeras() {
    	$('#frm_control_diario_enfermeria')[0].reset();
    	$("#cedula").empty();
    	$("#cedulae").empty();
    	$("#id_enfermera_turno").empty();
    }

    $('#nuevo').click(function(e){
    	e.preventDefault();
    	resetearFormularioEnfermeras();
    });


    $(document).on('change',"#cedula",function(e){
            $.post(base_url+'mvc/controllers/Chistoria.php',{action:"consultarInfoRevisionHCPaciente",'id_paciente':$('#cedula').val()},function(respuesta){
                        $("#num_identificacion").val(respuesta.cedula);
                        $("#nombre").val(respuesta.nombre);
                        $("#apellidos").val(respuesta.apellido);
                        $("#fecha_naciemiento").val(respuesta.fechanacimiento);
                        $("#ocupacion").val(respuesta.Ocupacionpaciente);
                        $("#estado_civil").val(respuesta.estadocivil);
                        
                        $("#edad").val(respuesta.edad);
                        $('#genero').val(respuesta.nombre_genero);
                        $("#id_tipo_usuario_editar").val(respuesta.vinculacion);
                        $("#telefono").val(respuesta.telefono);
                        $("#direccion").val(respuesta.direccion);
                        $("#id_eps").val(respuesta.eps);
                        $('#id_paciente').val(respuesta.id_cedula);
                        $('#fecha_in').val(respuesta.fechaingresopaciente);
                        $('#lugar_expedicion').val(respuesta.lugarespedicion);
                        $('#tipo_documento').val(respuesta.nombredocumento);
                        

                    } ,'json');
     });



    $('#guardarControl').on('click',function(e){
    	if($('#frm_control_diario_enfermeria').valid()){
	    	bootbox.confirm({
	    		title: "Confirmar proceso",
	            message: "Todo el formulario fue llenado correctamente si todos los pasos tienen un icono de marca de verificacion verde. Un icono de marca roja indica que hay datos vacios que deben llenarsen.", 
	            locale: 'es', 
	            callback: function(result) {                
	                if (result) { 
	                	overlay = open_overlay();                                            
	           			$.post(base_url+'mvc/controllers/Ccontrol_enfermeria.php?action=insertarControlEnfermeria',$('#frm_control_diario_enfermeria').serialize(),function(data){
	           				if(data.rpt){
	           					$.notify(data.mensaje,"success");
	           				}else{
	           					$.notify(data.mensaje,"error");
	           				}
	           				overlay.hide();
	           			},'JSON');
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
	    }else{
	    	$.notify('Por favor valide todos los campos de formulario',"error");
	    }
    });
 });


