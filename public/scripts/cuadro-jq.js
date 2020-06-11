$(function() {

	crearSelecTipoTurno();
	crearSelecPaciente();
	$('#frm-turno').validate()

	$('#cp2').colorpicker();

	$(document).on('click','#guardarTurno',function(e){
		e.preventDefault();
		var overlay;
        if($('#frm-turno').valid() && $('#frm-turno').valid()){
            overlay = open_overlay();
            $.ajax({
                url: base_url+'mvc/controllers/CCuadrosDeTurno.php?action=guardarTurno',
                dataType: 'json',
                'type': 'POST',  
                data: $("#frm-turno").serialize(), 
                success: function(data) {
                    overlay.hide();
                    $.notify(data.msg, data.typeMsn);
                    if(data.rpt){
                        limpiarFormularioTurno();
                        /*$('#calendar').fullCalendar('unselect');
                        $('#calendar').fullCalendar( 'removeEvents', [data.modelo.id_cuadro] );
                        
                        var d = {
                                id: data.modelo.id_cuadro,
                                title: data.modelo.alias,
                                start: data.modelo.fecha_turno,
                                end: data.modelo.fecha_turno,
                                color: data.modelo.color_evento,
                                model: data.modelo,
                                resourceId: data.modelo.id_medico,
                                allDay: true
                            };
                        console.log(d);
                        $('#calendar').fullCalendar('renderEvent',
                            d,
                            true // make the event "stick"
                        );*/
                        $("#calendar").fullCalendar("refetchEvents");
                        $('#modalTurno').modal('hide');
                    }
                },
                error:function(respuesta) {
                    console.log(respuesta);
                }
            });
        }
	});

});

function cambiarHorarioTurno(event) {
	$.ajax({
            url: base_url+'mvc/controllers/CCuadrosDeTurno.php?action=cambiarHorarioTurno',
            dataType: 'json',
            'type': 'POST',  
            data: {'id':event.id,'fecha_inicio':event.start.format("YYYY-MM-DD"),'fecha_fin':event.end.format("YYYY-MM-DD")}, 
            success: function(data) {
                $.notify(data.msg, data.typeMsn);
            },
            error:function(respuesta) {
                console.log(respuesta);
            }
        });
}

function limpiarFormularioTurno() {
	$('#frm-turno')[0].reset();
	$("#id_paciente").empty();
	$("#id_tipo_turno").empty();

	$('#pre_nombre_medico').html('');
	$('#id_medico').val('');
	$('#pre_fecha_turno').html('');
	$('#fecha_turno').val('');
	$('#id_cuadro').val('');
}


function crearSelecPaciente(data) {
	$("#id_paciente").select2({
        allowClear: true,
        language: "es",
        initSelection: function (element, callback) {
            if(data != undefined){
                callback(data);
            }else{
                callback({id:0,text:''});
            }
        },
        placeholder: "Buscar paciente",
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
        var s2 = $("#id_paciente").data('select2'); 
            s2.trigger('select', { 
              data: data 
            }); 
    }
}

function crearSelecTipoTurno(data) {
	$("#id_tipo_turno").select2({
        allowClear: true,
        language: "es",
        initSelection: function (element, callback) {
            if(data != undefined){
                callback(data);
            }else{
                callback({id:0,text:''});
            }
        },
        placeholder: "Buscar tipo de turno",
        ajax: { 
            url: base_url+'mvc/controllers/CCuadrosDeTurno.php?action=obtenerTipoTurnoSelect',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                return data;
            }
        },
    });
    if(data != undefined){
        var s2 = $("#id_tipo_turno").data('select2'); 
            s2.trigger('select', { 
              data: data
            }); 
    }

    $("#id_tipo_turno").change(function(){
        var data = $("#id_tipo_turno").select2('data')[0];
        if(data != undefined){
            $('#pre_color').html(data.modelo.color);
            $('#color').val(data.modelo.color);
            $('#pre_numero_horas').html(data.modelo.numero_horas);
            $('#pre_valor_hora').html(data.modelo.valor_hora);
            $('#pre_valor_hora_festivo').html(data.modelo.valor_hora_festivo);
        }else{
            $('#pre_color').html('');
            $('#color').val('');
            $('#pre_numero_horas').html('');
            $('#pre_valor_hora').html('');
            $('#pre_valor_hora_festivo').html('');
        } 
    });
}