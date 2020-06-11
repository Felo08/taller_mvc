 var vacation;
 var is_mobile = /mobile|android/i.test (navigator.userAgent);
 $(document).on('ready',function(){

        $('#frm-cita').validate({
            rules: {
                'cita[cedula]': { required: true },
                'cita[ubicacion]': { required: true },
                'cita[descripcion]': { required: true },
                'cita[fecha_cita_inicio]': { required: true },
                'cita[fecha_cita_fin]': { required: true },
                'cita[color]': { required: true },
                'cita[id_tipo_cita]' : { required: true }, 
            },
            errorPlacement: function (error, element) {
                var name    = $(element).attr("name");
                var $obj    = $("#" + name + "_validate");
                if($obj.length){
                    error.appendTo($obj);
                }
                else {
                    if(name == 'cita[color]'){
                        $('#cp2').after('<label for="color" class="error" style="display: inline-block;">'+$(error).html()+'</label>');
                    }else{
                        error.insertAfter(element);
                    }    
                }
            },
            lang: 'es',
            onkeyup: false
        });

        $('#cp2').colorpicker();

        $(document).on('click', "#guardarCita", function(){
            var overlay;
            if($('#frm-cita').valid() && $('#frm-cita').valid()){
                overlay = open_overlay();
                $.ajax({
                    url: base_url+'mvc/controllers/CCitas.php?action=guardarCita',
                    dataType: 'json',
                    'type': 'POST',  
                    data: $("#frm-cita").serialize(), 
                    success: function(data) {
                        overlay.hide();
                        $.notify(data.msg, data.typeMsn);
                        if(data.rpt){
                            limpiarFormularioPaciente();
                            $('#calendar').fullCalendar('unselect');
                            $('#calendar').fullCalendar( 'removeEvents', [data.modelo.Id_cita] );
                            $('#calendar').fullCalendar('renderEvent',
                                {
                                    id: data.modelo.Id_cita,
                                    title: data.modelo.descripcion,
                                    start: new Date(data.modelo.fecha_cita_inicio),
                                    end: new Date(data.modelo.fecha_cita_fin),
                                    color: data.modelo.color,
                                    model: data.modelo,
                                    allDay: false
                                },
                                true // make the event "stick"
                            );
                            $('#modalCita').modal('hide');
                        }
                    },
                    error:function(respuesta) {
                        console.log(respuesta);
                    }
                });
            }
        });

        function limpiarFormularioPaciente() {
            $("#frm-cita")[0].reset();
            $('#cp2').colorpicker('setValue', '#1bb0c4');
            $("#paciente").select2("val", "");
            $("#paciente").empty().trigger('change');
        }

        $(document).on('change',"#medico",function(){
            if( (medico = $("#medico").select2("data")[0]) != undefined){
                crearCalenadirio({'slotDuration': '00:30:00', 'medico':medico});
            }else{
                $('#calendar').html('<img src="'+base_url+'public/images/citas.jpg">')
            }
        });


        $("#id_tipo_cita").select2({
            allowClear: true,
            language: "es",
            allowClear: true,
            data : dataTipoConsulta,
            placeholder: "Buscar tipo de consulta"
        });   

        $("#confirmada").select2({
            allowClear: true,
            language: "es",
            allowClear: true,
            data : dataConfirmaCita,
            placeholder: "Confirmar la cita médica"
        });   


        $("#medico").select2({
            placeholder: "Buscar médicos",
            allowClear: true,
            language: "es",
            ajax: { 
                url: base_url+'mvc/controllers/CCitas.php?action=obtenerMedicosFiltrados',
                cache: "true",
                type:'POST',
                dataType: 'json',
                data: function (data, page) {
                    return data;
                }
            },
        });

        crearSelectPaciente();

        $.fn.modal.Constructor.prototype.enforceFocus = function() {};

    });

    $('#modalCita').on('hidden.bs.modal', function () {
        $('#calendar').fullCalendar('unselect');
    });


    function open_overlay() {
      var target = document.createElement("div");
      document.body.appendChild(target);
      var spinner = new Spinner(opts).spin(target);
      return iosOverlay({
        text: "Espere ...",
        spinner: spinner
      });
    }

    function cambiarHorarioCita(event) {
        $.ajax({
            url: base_url+'mvc/controllers/CCitas.php?action=modificarHorarioCita',
            dataType: 'json',
            'type': 'POST',  
            data: {'id':event.id,'fecha_cita_inicio':event.start.format("YYYY-MM-DD  HH:mm"),'fecha_cita_fin':event.end.format("YYYY-MM-DD  HH:mm")}, 
            success: function(data) {
                $.notify(data.msg, data.typeMsn);
            },
            error:function(respuesta) {
                console.log(respuesta);
            }
        });
    }

    function crearSelectPaciente(data) {
        var datar;
        if(data != undefined){
            datar = {'id':data.id_cedula, 'text':data.nombre+' '+data.apellido,'modelo':data};
        }

        $("#paciente").select2({
            allowClear: true,
            language: "es",
            initSelection: function (element, callback) {
                if(data != undefined){
                    callback(datar);
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
            var s2 = $("#paciente").data('select2'); 
                s2.trigger('select', { 
                  data: datar 
                }); 
        }
    }

    function crearCalenadirio(settiongs){
        var config = settiongs;
        if( $('#calendar>*').length == 1 ){
            $('#calendar').html('');
            $('#calendar').fullCalendar({
               // slotEventOverlap: false,
                axisFormat: 'h(:mm)a',
                schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
                now: new Date(),
                slotDuration: settiongs.slotDuration,
                slotDuration: '00:01:00', 
                lang: 'es',
                selectable: true,
                selectHelper: true,
                editable: true, // enable draggable events
                unselectAuto: false,
                aspectRatio: 1.5,
                scrollTime: '00:00', // undo default 6am scrollTime
                minTime: "05:00:00",
                maxTime: "22:00:00",
                allDay: false,
                allDaySlot: false,
                titleFormat: 'MMMM',
                columnFormat: 'ddd MMM/D',
                header: {
                    left: 'today prev,next',
                    center: 'title',
                    //right: 'timelineDay,timelineThreeDays,agendaWeek,month'
                    right: 'agendaDay,agendaWeek,month'
                },
                defaultView: 'agendaWeek',
                views: {
                    timelineThreeDays: {
                        type: 'timeline',
                        duration: { days: 3 }
                    }
                },
                events: function(start, end, timezone, callback){
                    //console.log(config.medico.modelo);
                    medico = $("#medico").select2("data")[0];
                    $.ajax({
                        url: base_url+'mvc/controllers/CCitas.php?action=obtenerCitasMedico',
                        dataType: 'json',
                        data: {
                            start: start.format("YYYY-MM-DD"),  
                            end: end.format("YYYY-MM-DD"),
                            medico: medico.modelo
                        },
                        success: function(data) {
                            vacation = data.vacation;
                            callback(data.result);
                        }
                    });



                },
                select: function(start, end, jsEvent, view, resource) {
                
                    $("#startDate").html(start.format("YYYY-MM-DD  HH:mm"));
                    $("#enDate").html(end.format("YYYY-MM-DD  HH:mm"));
                    $("#EventStartDate").val(start.format("YYYY-MM-DD  HH:mm"));
                    $("#EventEnDate").val(end.format("YYYY-MM-DD  HH:mm"));
                    $("#cedula_medico").val($("#medico").select2("data")[0].id);
                    $('#Id_cita').val('');
                    $("#modalCita .modal-header h4").html('Nueva cita');
                    $("#modalCita").modal("show");
                },
                eventResize: function(event, delta, revertFunc, jsEvent, ui, view){
                    if(event.vacation){
                        revertFunc();
                        return;
                    }
                    bootbox.confirm({
                        message: "Esta seguro de realizar el cambio de horario?", 
                        locale: 'es', 
                        callback: function(result) {                
                            if (!result) {                                             
                                revertFunc();  
                            }else{
                               cambiarHorarioCita(event); 
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
                },
                eventDrop : function(event, delta, revertFunc, jsEvent, ui, view ){
                    if(event.vacation){
                        revertFunc();
                        return;
                    }

                    var start = new Date(event.start);
                    var end = new Date(event.end);

                    var overlap = $('#calendar').fullCalendar('clientEvents', function(ev) {
                        if( ev == event) {
                            return false;
                        }
                        var estart = new Date(ev.start);
                        var eend = new Date(ev.end);

                        return (
                            ( Math.round(start) > Math.round(estart) && Math.round(start) < Math.round(eend) )
                            ||
                            ( Math.round(end) > Math.round(estart) && Math.round(end) < Math.round(eend) )
                            ||
                            ( Math.round(start) < Math.round(estart) && Math.round(end) > Math.round(eend) )
                        );
                    });
                    if (overlap.length){
                        revertFunc();
                        return false;
                    }


                    bootbox.confirm({
                        message: "Esta seguro de realizar el cambio de horario?", 
                        locale: 'es', 
                        callback: function(result) {                
                            if (!result) {                                             
                                revertFunc();  
                            }else{
                                cambiarHorarioCita(event);
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
                },
                eventRender: function(event, element) {
                    if(!event.vacation){
                        if(event.model != undefined)
                            element.find('.fc-title').html("<b>"+event.model.paciente.nombre_completo+"</b>"); 
                        e  = $("<a id='removEvent"+event._id+"' class='closeon btn btn-danger'>X</a>");
                        element.append( e );
                        $(document).on("click", "#removEvent"+event._id, function(e) {
                            var me = this;
                            if(swBootbox){
                               swBootbox = false;
                               bootbox.confirm({
                                    title: "Esta seguro que desea cancelar la cita?", 
                                    locale: 'es', 
                                    message: '<div class="row">  ' +
                                                '<div class="col-md-12"> ' +
                                                '<form class="form-horizontal" id="frm_cancelacion"> ' +
                                                '<div class="form-group"> ' +
                                                '<label class="col-md-4 control-label" for="name">Puede especificar las razones por las que cancelo la cita</label> ' +
                                                '<div class="col-md-4"> ' +
                                                '<textarea id="razones_cancelacion" name="razones_cancelacion" placeholder="Razones de cancelación" class="form-control input-md" style="height: 133px;"> </textarea>' +
                                                '<input type="hidden" name="id" id="id_cita" value="'+event._id+'"/>' +
                                                '</div> ' +
                                                '</form> </div>  </div>',
                                    callback: function(result) {                
                                           if(result){
                                                $.post(base_url+'mvc/controllers/CCitas.php?action=cancelarCita',$('#frm_cancelacion').serialize(),function(data){
                                                        $.notify(data.msg, data.typeMsn);
                                                        swBootbox = true;
                                                        if(data.rpt){
                                                            jQuery('#calendar').fullCalendar('removeEvents', event.id);
                                                        }
                                                    },'json');
                                           }else{
                                                swBootbox = true;
                                           }                          
                                    },
                                    buttons: {
                                        confirm: {
                                            label: 'Aceptar'
                                        },
                                        cancel: {
                                            label: 'Cancelar',
                                        }
                                    },
                                });
                            }
                                e.preventDefault();

                        });

                        element.on("dblclick",function(){
                                crearSelectPaciente(event.model.paciente);
                                $("#startDate").html(event.start.format("YYYY-MM-DD  HH:mm"));
                                $("#enDate").html(event.end.format("YYYY-MM-DD  HH:mm"));
                                $("#EventStartDate").val(event.start.format("YYYY-MM-DD  HH:mm"));
                                $("#EventEnDate").val(event.end.format("YYYY-MM-DD  HH:mm"));
                                $("#cedula_medico").val($("#medico").select2("data")[0].id);
                                $('#cp2').colorpicker('setValue', event.color);
                                $('#descripcionCita').val(event.model.descripcion);
                                $('#ubicacion').val(event.model.ubicacion);       
                                $('#ubicacion').trigger('change'); 
                                //$('#confirmada').select2('val',event.model.confirmada);
                                $('#confirmada').val(event.model.confirmada).trigger('change');
                              //  $('#id_tipo_cita').select2('val',event.model.id_tipo_cita);
                                $('#id_tipo_cita').val(event.model.id_tipo_cita).trigger('change');;
                                $('#Id_cita').val(event.model.Id_cita);

                                $("#list").empty().append('<option value="id">text</option>').val('id').trigger('change');

                                $("#modalCita .modal-header h4").html('Editar cita');

                                $('#modalCita').modal('show');
                        });  
                    }
                },
                slotEventOverlap:false,
                eventOverlap: false,
                selectOverlap: false,
            });

            if(is_mobile){
                $('#calendar').fullCalendar( 'changeView', 'agendaDay');
                //$('.fc-view tbody').draggable();
            }
        }else{
            $.when($.each($('#calendar').fullCalendar('clientEvents'),function(i,e){ 
                jQuery('#calendar').fullCalendar('removeEvents', e.id); 
            })).done(function(){ 
                $('#calendar').fullCalendar('refetchEvents');
            });
        }
    
    }