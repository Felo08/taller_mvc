var serverIO;
$(document).ready(function() {
    $('.navbar a.dropdown-toggle').on('click', function(e) {
        var elmnt = $(this).parent().parent();
        if (!elmnt.hasClass('nav')) {
            var li = $(this).parent();
            var heightParent = parseInt(elmnt.css('height').replace('px', '')) / 2;
            var widthParent = parseInt(elmnt.css('width').replace('px', '')) - 10;
            
            if(!li.hasClass('open')) li.addClass('open')
            else li.removeClass('open');
            $(this).next().css('top', heightParent + 'px');
            $(this).next().css('left', widthParent + 'px');
            
            return false;
        }
    });

    (function () {
      try {
          serverIO = io.connect("http://45.55.57.4:8087/", {  
              //'max reconnection attempts' : max_socket_reconnects
              'reconnection': true,
              'reconnectionDelay': 500,
              'reconnectionAttempts': 10
          });
          serverIO.emit('iniciar', {user_name: sessionStorage.getItem('user_name'), user: JSON.parse(sessionStorage.getItem('user')), key_poryect: sessionStorage.getItem('key_poryect'), sede: sessionStorage.getItem('sede')} );

          serverIO.on('replicarNotificacionSede', function (data) {
            if (sessionStorage.getItem('sede') == data.sede) {
              idusuario = JSON.parse(sessionStorage.getItem('user')).userid;
              reproducir_audio_notificacion('play');
              crearNotificacionHTML(data.notificacion[idusuario], true, data);
            }
          });

          serverIO.on('notificacionesNoLeidas', function(data){
            var element = $('#ctn_notificaciones_elemntos').find("[id_notificacion='"+data.notificacion.id+"']");
            if (element.length > 0) {
                if(element.attr('fecha_leido').length == 0){
                    element.attr('fecha_leido', data.notificacion.fecha_leido);
                    element.removeClass('notificacion-sinleer');
                    $('.numNotificaciones').html(data.numNoLeidas);
                }
                
            }
          });
         
      }catch(e){
        console.log(e);
      }
    })();


    $(document).on('click','.notificacion',function(e){
        e.preventDefault();
        if($(this).attr('modal') == 1){
            $('#modalNotificaciones').find('.modal-title').html($(this).attr('notificacion'));
            $('#modalNotificaciones iframe').attr("src",$(this).attr('href'));
            $('#modalNotificaciones').modal({show:true});
            element = $('#ctn_notificaciones_elemntos').find("[id_notificacion='"+$(this).attr('id_notificacion')+"']");
            if($(this).attr('fecha_leido').length == 0 && element.attr('fecha_leido').length == 0){
                var ntf = $(this);
                $.post(base_url+'mvc/controllers/CNotificacion.php?action=lecturaNorificacion',{id_notificacion:$(this).attr('id_notificacion')},function(notificacion){
                    n = $('.numNotificaciones').html();
                    noLeidas = parseInt(n) - 1; 
                    serverIO.emit('refrescarContadorNotificaciones',{notificacion: notificacion ,noLeidas: noLeidas,user: JSON.parse(sessionStorage.getItem('user')), key_poryect: sessionStorage.getItem('key_poryect'), sede: sessionStorage.getItem('sede') });
                    $('.numNotificaciones').html(noLeidas);
                    ntf.removeClass('notificacion-sinleer');
                    ntf.attr('fecha_leido',notificacion.fecha_leido);
                }, 'JSON');
            }
        }else{
            var ntf = $(this);
            if($(this).attr('fecha_leido').length == 0){
                $.post(base_url+'mvc/controllers/CNotificacion.php?action=lecturaNorificacion',{id_notificacion:$(this).attr('id_notificacion')},function(){
                   history.pushState({}, null, ntf.attr('href')); 
                });
            }else{
                history.pushState({}, null, ntf.attr('href')); 
            }
        }

    });
});


function enviarNotificacion(notificacion) {
  serverIO.emit('enviarNotificacionSede',{'notificacion': notificacion, user: JSON.parse(sessionStorage.getItem('user')), key_poryect: sessionStorage.getItem('key_poryect'), sede: sessionStorage.getItem('sede') });
}
  
function crearNotificacionHTML(id, notificarAhora, dataNotificarAhora){

  $.post(base_url+"mvc/controllers/CNotificacion.php?action=obtenerNotficacionId", {id_notificacion:id},function(notificacion){
    html = '<li>';
    html += '                <div><a href="'+base_url+notificacion.href+'" class="notificacion '+((notificacion.fecha_leido == null)?'notificacion-sinleer':'')+'" fecha_leido = "'+ ((notificacion.fecha_leido == null)?'':notificacion.fecha_leido) +'" id_notificacion="'+notificacion['id']+'" notificacion="' + notificacion.notificacion + '" modal="'+ notificacion.modal+'">';
    html +=               notificacion['notificacion']; 
    html += '            <span class="small italic">'+notificacion.tiempo+' </span>';
    html += '       </a></div>';
    html += '       </li>'; 
    $('#ctn_notificaciones_elemntos').prepend(html);
    e = parseInt($('.numNotificaciones').html()) + 1;
    $('.numNotificaciones').html(e);
    if (notificarAhora == true) {

      $.notify.addStyle('notificaciones', {
        html: "<div><div href='"+base_url+notificacion.href+"' style='background-color:rgba(115, 71, 160, 0.74)' class='notificacion " +((notificacion.fecha_leido == null)?'notificacion-sinleer':'')+"' fecha_leido = '"+ ((notificacion.fecha_leido == null)?'':notificacion.fecha_leido) +"' id_notificacion='"+notificacion['id']+"' notificacion='" + notificacion.notificacion + "' modal='"+ notificacion.modal+"'><b style='color:white'>Notifica "+dataNotificarAhora.user.nombres+"</b><br>"+notificacion['notificacion']+"<span style='display:none' data-notify-text/>☺</div></div>",
        classes: {
          base: {
            "white-space": "nowrap",
            "background-color": "rgba(115, 71, 160, 0.74)",
            "color" : "white",
            "padding": "5px"
          },
          superblue: {
            "color": "white",
            "background-color": "blue"
          }
        }
      });

        $.notify('....',{
          // whether to hide the notification on click
          clickToHide: true,
          // whether to auto-hide the notification
          autoHide: true,
          // if autoHide, hide after milliseconds
          autoHideDelay: 50000,
          // show the arrow pointing at the element
          arrowShow: true,
          // arrow size in pixels
          arrowSize: 5,
          // position defines the notification position though uses the defaults below
          position: 'rigth bottom',
          // default positions
          elementPosition: 'rigth bottom',
          globalPosition: 'rigth bottom',
          // default style
          style: 'notificaciones',
          // default class (string or [string])
          className: 'success',
          // show animation
          showAnimation: 'slideDown',
          // show animation duration
          showDuration: 500,
          // hide animation
          hideAnimation: 'slideUp',
          // hide animation duration
          hideDuration: 200,
          // padding between element and notification
          gap: 2
        });
    }

  },'JSON');
}

function reproducir_audio_notificacion(tarea) {
      if(tarea == 'play'){
           $("#audio_notificaciones").trigger('play');
      }
      if(tarea == 'stop'){
           $("#audio_notificaciones").trigger('pause');
           $("#audio_notificaciones").prop("currentTime",0);
      }
 }