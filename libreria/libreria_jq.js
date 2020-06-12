$(document).ready(function () {

  $('[data-toggle="tooltip"]').tooltip();

  $('#logo_anadir').click(function () {

    $.post('../controlador/cvehiculos.php', { action: "contarVehiculos" }, function (respuesta) {

      if (respuesta.cantidad >= 10) {

        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success ml-3',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        })

        swalWithBootstrapButtons.fire(
          'Sin espacio',
          'No hay lugares disponibles',
          'warning'
        )

      } else {

        console.log('Se llama al modal');
        $('#Modal_form').modal('show');

      }
    }, "json");
  });

  $("#btn_close_modal").click(function (e) {
    $("#ingresar_vehiculo")[0].reset();
  });

  $("#btn_enviar").click(function (e) {
    if ($("#ingresar_vehiculo").valid()) {

      $.post("../controlador/cvehiculos.php", $("#ingresar_vehiculo").serialize(), function (respuesta) {
        if (respuesta.resultado) {

          $("#ingresar_vehiculo")[0].reset();
          $('#Modal_form').modal('hide');
          $.notify(respuesta.mensaje, "success");
           setTimeout(recargar_tabla, 500);

        } else {

          $.notify(respuesta.mensaje, "error");
        }
      },
        "json"
      );
    }
    e.preventDefault();
  });

  $('#btn_salida').click(function (e) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ml-3',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Seguro?',
      text: "Se registrara la salida del vehiculo",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, registrar salida',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        salidaVehiculo();
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Que bueno que te quedes',
          'error'
        )
      }
    })
  });

  $('#logo_excel').click(function () {
    $('#Modal_form_excel').modal('show');
  })

  $("#btn_expotar").click(function (e) {


    if ($('#ingresar_exportar').valid()) {


      window.open('cvehiculos.php?' + $("#ingresar_exportar").serialize(), "_blank");


    }
    e.preventDefault();

  });

  $("#btn_close_modal_excel").click(function (e) {
    $("#ingresar_exportar")[0].reset();
  });

  function salidaVehiculo() {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    $.post('../controlador/cvehiculos.php', { action: "SalidaVehiculo", id_vehiculo: $('#btn_salida').val() }, function (respuesta) {

      if (respuesta.resultado) {
        swalWithBootstrapButtons.fire(
          'Adios!',
          respuesta.mensaje,
          'success'
        )
        setTimeout(recargar_tabla, 1000);

      } else {

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: respuesta.mensaje
        })
      }


    }, "json");
  }

  function recargar_tabla() { location.reload(); }


});
