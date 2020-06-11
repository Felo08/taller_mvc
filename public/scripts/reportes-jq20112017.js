$(document).ready(function(){

    $("#proveedor").select2({
        placeholder: "Buscar Proveedor",
        allowClear: true,
        language: "es",
        ajax: {  
            url: 'mvc/controllers/CHuesped.php?action=obtenerclienteSelect',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                return data;
            }
        },
    }); 
 

    $("#id_cedula").select2({
        placeholder: "Buscar Residente",
        allowClear: true,
        language: "es",
        ajax: { 
            url: base_url+'mvc/controllers/CHuesped.php?action=obtenerHuespedsSelect',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                /*console.log(typeof(data))
                data.fecha = $("#id_fecha").val();
                data.turno = $("#id_turno").val();
                data.enfermera = $("#id_enfermera").val();*/
                return data;
            }
        },
    });


    $("#id_bodega").select2({
        placeholder: "Buscar Bodega",
        allowClear: true,
        language: "es",
        ajax: { 
            url: 'mvc/controllers/CReportes.php?action=obtenerbodegaSelect',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                return data;
            }
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: formatResultBodega,
    });
    
   
    function formatResultBodega(item) {
        if(item.id != undefined)
            if(item.modelo.tipo_bodega == 2)
                return "<b>Sub: </b>"+item.text;
            else
                return item.text
        else
            return null;
    }
 $("#bnt-exportar").click(function(e){
   
        if($('#frm-medica').valid() && $('#frm-medica').valid()){
            //loader = open_overlay();
            window.open(base_url+'mvc/controllers/CReportes.php?'+$("#frm-medica").serialize(), "_blank");
            /*$.post(,,function(respuesta){
                if(respuesta.rpt){
                    
                    $.notify(respuesta.mensaje,"success");
                    // recargar_grid();
                }else{
                    $.notify(respuesta.mensaje,"error");
                }
                //loader.hide();
            },'json');*/
        }
        e.preventDefault(); 

    });

  
   $("#bnt-exportar-inventariores").click(function(e){
  // log.console("dddd");
        if($('#frm-medica').valid() && $('#frm-medica').valid()){
            //loader = open_overlay();
            window.open(base_url+'mvc/controllers/CReportes.php?'+$("#frm-medica").serialize(), "_blank");
          
        }
        e.preventDefault(); 

    });

   
    $("#bnt-exportar-cxp").click(function(e){
   
        if($('#frm-medica').valid() && $('#frm-medica').valid()){
            //loader = open_overlay();
            window.open(base_url+'mvc/controllers/CReportes.php?'+$("#frm-medica").serialize(), "_blank");
            /*$.post(,,function(respuesta){
                if(respuesta.rpt){
                    
                    $.notify(respuesta.mensaje,"success");
                    // recargar_grid();
                }else{
                    $.notify(respuesta.mensaje,"error");
                }
                //loader.hide();
            },'json');*/
        }
        e.preventDefault(); 

    });

     $("#bnt-exportar-egresos").click(function(e){
  // log.console("dddd");
        if($('#frm-medica').valid() && $('#frm-medica').valid()){
            //loader = open_overlay();
            window.open(base_url+'mvc/controllers/CReportes.php?'+$("#frm-medica").serialize(), "_blank");
            /*$.post(,,function(respuesta){
                if(respuesta.rpt){
                    
                    $.notify(respuesta.mensaje,"success");
                    // recargar_grid();
                }else{
                    $.notify(respuesta.mensaje,"error");
                }
                //loader.hide();
            },'json');*/
        }
        e.preventDefault(); 

    });





    $("#id_mes").select2({
        placeholder: "Buscar mes",
        allowClear: true,
        language: "es",
        ajax: { 
            url: base_url+'mvc/controllers/CHuesped.php?action=obtenermeselect2',
            cache: "true",
            type:'POST',
            dataType: 'json',
            data: function (data, page) {
                return data;
            }
        },
    });

      });


 






    
    


   

   

