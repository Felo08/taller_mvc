    function obtenerDateResource() {
        fecha = $('#calendar').fullCalendar('getDate');
        console.log(fecha);
        if (typeof fecha.month !== "undefined") { 
            return {'mes':fecha.month()+1};
        }else{
            return {'mes':'aun no '};
        }
    }
    $(function() { // document ready


        $.notify.addStyle('messagetouch',{
              html: "<div><span data-notify-text/></div>",
              classes: {
                base: {
                  "white-space": "nowrap",
                  "background": "#020202",
                  "padding": "5px",
                  "opacity":"0.8",
                  "font-family":"'Helvetica Neue', Helvetica, Arial",
                  "color":"white",
                },
              },
        });


		$('#modalTurno').on('hidden.bs.modal', function () {
	        $('#calendar').fullCalendar('unselect');
	    });

 
		$('#calendar').fullCalendar({
			now: moment(new Date()).format('YYYY-MM-DD'),
			lang: 'es',
			selectable: true,

            select: true,
            selectOverlap:false,
            height: 'auto',

            editable: false, // enable draggable events
            disableDragging : false,
			header: {
				left: 'today prev,next',
				center: 'title',
				right: ''
			},
			defaultView: 'timelineMonth',
			views: {
				timelineDay: {
					buttonText: ':15 slots',
					slotDuration: '00:15'
				},
				timelineTenDay: {
					type: 'timeline',
					duration: { days: 10 }
				}
			},
		     resourceArea2: '30%',
			//resourceLabelText: 'Personal medico',
            resourceColumns: [
                {
                    labelText: 'Profesionales',
                    field: 'profesional',
                    width: '40%',
                },
                {
                    labelText: 'Horas laboradas',
                    field: 'hlabor',
                    width: '30%',
                    render: function(resource, el) {
                        el.addClass('horalabor');
                        
                    }
                }
            ],
			resources: {
				url: base_url+'mvc/controllers/CCuadrosDeTurno.php?action=obtenerDoctoresCalendario',
       	 		type: 'POST',
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
                                cambiarHorarioTurno(event);
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
			select: function(start, end, jsEvent, view, resource) {
                console.log("hello");
                $('#pre_nombre_medico').html(resource.profesional);
            	$('#id_medico').val(resource.id);
            	$('#pre_fecha_turno').html(start.format("YYYY-MM-DD"));
            	$('#fecha_turno').val(start.format("YYYY-MM-DD"));
            	$("#modalTurno .modal-header h4").html('Nuevo turno');
            	$('#modalTurno').modal('toggle');

            },

        eventMouseover: function(calEvent, jsEvent) {
            var tooltip = '<div class="tooltipevent" style=""><span class="tooltiptext"><b>Paciente: </b>' + calEvent.modelo.paciente + '<br/>'
                    + '<b>Dirección: </b>'+calEvent.modelo.direccion+'<br/>'
                    + '<b>Teléfono: </b>'+calEvent.modelo.telefono+'<br/>'
                    +'</span></div>';
            $("body").append(tooltip);
            $(this).mouseover(function(e) {
                $(this).css('z-index', 10000);
                $('.tooltipevent').fadeIn('500');
                $('.tooltipevent').fadeTo('10', 1.9);
            }).mousemove(function(e) {
                $('.tooltipevent').css('top', e.pageY + 10);
                $('.tooltipevent').css('left', e.pageX);

            });
        },

        eventMouseout: function(calEvent, jsEvent) {
             $(this).css('z-index', 8);
             $('.tooltipevent').remove();
        },       
        eventAfterAllRender: function(view) {
            //$('[data-toggle="tooltip"]').tooltip(); 
        },
        eventRender: function(event, element) {
            e  = $("<a id='removEvent"+event._id+"' class='closeturno btn btn-danger'>X</a><br/><br/><br/>");
            element.append( e );

            $(document).on("click", "#removEvent"+event._id, function(e) {
                var me = this;
                if(swBootbox){
                   swBootbox = false;
                   bootbox.confirm({
                        title: "Esta seguro que desea eliminar el turno?", 
                        locale: 'es', 
                        message: '<div class="row">  ' +
                                    '<div class="col-md-12"> ' +
                                    '<form class="form-horizontal" id="frm_eliminacion"> ' +
                                    '<div class="form-group"> ' +
                                    '<label class="col-md-12 control-label" style="text-align: left;" for="name">Puede especificar las razones por las que elimina el turno</label> ' +
                                    '<div class="col-md-12"> ' +
                                    '<textarea id="razons_eliminacion" name="razons_eliminacion" placeholder="Razones de cancelación" class="form-control input-md" style="height: 133px;"> </textarea>' +
                                    '<input type="hidden" name="id_cuadro" id="id_cuadro" value="'+event._id+'"/>' +
                                    '</div> ' +
                                    '</form> '
                                    +'</div> '
                                    +' </div>',
                        callback: function(result) {                
                               if(result){
                                    $.post(base_url+'mvc/controllers/CCuadrosDeTurno.php?action=eliminarTurno',$('#frm_eliminacion').serialize(),function(data){
                                            $.notify(data.msg, data.typeMsn);
                                            swBootbox = true;
                                            if(data.rpt){
                                                $("#calendar").fullCalendar("refetchEvents");
                                            }
                                        },'json');
                               }else{
                                    swBootbox = true;
                               }                          
                        },
                        buttons: {
                            confirm: {
                                label: 'Eliminar'
                            },
                            cancel: {
                                label: 'Cancelar',
                            }
                        },
                    });
                }
                    e.preventDefault();

            });

            element.on('touchstart',function(){
                $.notify('Paciente: '+event.modelo.paciente+'\nDirección: '+event.modelo.direccion+'\nDirección: '+event.modelo.telefono, {
                  style: 'messagetouch',
                  autoHideDelay: 6000
                });
            });
        	
            element.on("dblclick",function(){
                crearSelecPaciente({id: event.modelo.id_paciente, text: event.modelo.paciente , modelo: {} })
				crearSelecTipoTurno({id: event.modelo.id_tipo_turno, text: event.modelo.alias+" - "+event.modelo.turno+" ("+event.modelo.numero_horas+")", modelo: {} });
				$('#pre_nombre_medico').html(event.modelo.nombremedico);
				$('#id_medico').val(event.modelo.id_medico);

				$('#pre_fecha_turno').html(event.modelo.fecha_turno);
				$('#fecha_turno').val(event.modelo.fecha_turno);

				$('#cp2').colorpicker('setValue', event.modelo.color_evento);

				$('#id_cuadro').val(event.modelo.id_cuadro);

                $("#modalTurno .modal-header h4").html('Editar turno');

                $('#modalTurno').modal('show');
            });

        },
			events: function(start, end, timezone, callback){
                    $.ajax({
                        url: base_url+'mvc/controllers/CCuadrosDeTurno.php?action=obtenerTurnosMedicos',
                        dataType: 'json',
                        data: {
                            start: start.format("YYYY-MM-DD"),  
                            end: end.format("YYYY-MM-DD"),
                        },
                        success: function(data) {
                            setTimeout(function(){ 
                                $.each(data.horasLaboradas,function(i,t){
                                    var trParent = $('#calendar table .horalabor').parent().parent().parent();
                                    //if( ().length > 0){
                                        e = trParent.find('[data-resource-id="'+i+'"]');
                                        e.find('.horalabor .fc-cell-text').html(t);
                                    //}
                                });
                             }, 100);

                            callback(data.data);
                        }
                    });



                },
		});
	
	});

