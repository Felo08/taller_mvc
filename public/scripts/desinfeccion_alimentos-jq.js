var ctn_desinfeccion = 1;
$(document).on('ready',function(){
	$('#frmDesinfeccion').validate();

	function resetearfrmDesinfeccion() {
		$("#frmDesinfeccion")[0].reset();
		$('#tbl_desinfeccion tbody').html('');
	}


	$(document).on('click','#generar_notas',function(e){
		e.preventDefault();
	});

	$(document).on('click', '#btn_adicionar_desinfeccion', function(e){
		e.preventDefault();
		var html = "";
		if ($('#frmDesinfeccion').valid()) {
			html += "<tr>" 
					+"<td><input type='hidden' name='desinfeccion["+ctn_desinfeccion+"][tipo_desinfeccion]' value='"+$('#tipo_desinfeccion').val()+"'/> "+$('#tipo_desinfeccion').find('option:selected').text()+"</td>"
					+"<td><input type='hidden' name='desinfeccion["+ctn_desinfeccion+"][fecha]' value='"+$('#fecha').val()+"'/>"+$('#fecha').val()+"</td>"
					+"<td><input type='hidden' name='desinfeccion["+ctn_desinfeccion+"][agua]' value='"+$('#agua').val()+"'/>"+$('#agua').val()+"</td>"
					+"<td><input type='hidden' name='desinfeccion["+ctn_desinfeccion+"][hipo]' value='"+$('#hipo').val()+"'/>"+$('#hipo').val()+"</td>"
					+"<td><input type='hidden' name='desinfeccion["+ctn_desinfeccion+"][expo]' value='"+$('#expo').val()+"'/>"+$('#expo').val()+"</td>"
					+"<input type='hidden' name='desinfeccion["+ctn_desinfeccion+"][responsable]' value='"+$('#responsable').val()+"'/>"
					+"<td><input type='hidden' name='desinfeccion["+ctn_desinfeccion+"][objeto]' value='"+$('#objeto').val()+"'/>"+$('#objeto').val()+"</td>"
					+"<td style='text-align: center;'><a href='#' class='eliminarDesinfeccion' id_desinfeccion='"+ctn_desinfeccion+"'><i class='glyphicon glyphicon-remove'></i></a>"
					"</tr>";
			$('#tbl_desinfeccion tbody').append(html);
		}
		ctn_desinfeccion++;
	});

	$(document).on('click','.eliminarDesinfeccion',function(e){
		e.preventDefault();
		$(this).parent().parent().remove();
	});

	$('a[href="#consultar"]').click(function(){
		setTimeout(function(){ $(window).trigger('resize'); }, 5);
	});

	$('a[href="#consultarXFecha"]').click(function(){
		setTimeout(function(){ $(window).trigger('resize'); }, 5);
	});

	$(document).on('click',"#guardar_desinfeccion",function(e){
	    e.preventDefault();
	    if($('#tbl_desinfeccion tbody tr').length > 0)
	    {
	      var load = open_overlay();
	      $.post(base_url+"mvc/controllers/CDesinfeccionAlimentos.php?action=insertarMaestroDesinfeccion",$('#frmDesinfeccion').serialize(),function(respuesta){
	        load.hide();
	        if(respuesta.rpt){
	        	resetearfrmDesinfeccion();	
	          	$.notify(respuesta.mensaje,'success');
	        }else{
	        	$.notify(respuesta.mensaje,'eror');
	        }
	      },'json');
	    }else{
	    	$.notify('Debe adicionar elementos a la tabla.','error');
	    }
	 });

	  $(document).on('change','.chk-abono',function(e){
	    $(this).parent().parent().find('.abono').val('');
	    if($(this).is(':checked')){
	      $(this).parent().parent().find('.abono').prop("disabled", false);
	    }else{
	      valorInicial = parseInt($(this).parent().parent().find('.valor_concepto').val());
	      $(this).parent().parent().find('.valor_restante').html(valorInicial);
	      $(this).parent().parent().find('.abono').prop("disabled", true);
	    }
	    calcularTotalPago();
	  });

	  $(document).on('keyup','.abono',function(e){
	      if(e.which==8){
	        validarAbono(e,this);
	      }
	      calcularTotalPago();
	  });

	  $(document).on('keyup',"#valor_mayor", function(e){
	      calcularTotalPago();
	  });

	  $(document).on('keypress','.abono', function(e){
	    validarAbono(e,this);   
	  });

	  $(document).on('blur','.abono', function(e){
	    validarAbono(e,this);   
	  });
	  
	  function validarAbono(e,t) {
	      var valor = 0, valorInicial = 0 ;
	      if($.isNumeric(String.fromCharCode(e.which))) {
	        if( (valor = parseInt($(t).val()+String.fromCharCode(e.which))) > (valorInicial = parseInt($(t).parent().parent().find('.valor_concepto').val())) ) {
	          e.preventDefault();
	        }else{
	            $(t).parent().parent().find('.valor_restante').html(valorInicial - valor);
	        }
	      }else{
	        valorInicial = parseInt($(t).parent().parent().find('.valor_concepto').val());
	        valor = $(t).val();
	        $(t).parent().parent().find('.valor_restante').html(valorInicial - valor);
	        e.preventDefault();
	      }
	  }
	  function calcularTotalPago() {
	    var total = 0;
	    $('.abono').each(function(i,elemento){
	      if($.isNumeric($(elemento).val())) {
	        total += parseInt($(elemento).val());
	      }
	    }).promise().done(function(){
	      if($.isNumeric($("#valor_mayor").val()))
	        total += parseInt($("#valor_mayor").val());
	      $("#lbl_valor_total").html(total);
	      $("#valor_total").val(total);
	      $("#valor_total_c").html(total);

	    });
	  }

});