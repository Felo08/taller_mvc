<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Inicio</title>
</head>

<body>
  <div class="container">
    <i class="h1">Parqueadero </i>
    <div class="table-responsive" id="contenedor_lista_vehiculos">
      <?php
      //$data = $data;

      include("lista_vehiculos.php")
      ?>
    </div>
    <div id="contenedor_logo_añadir" class="float-right">
      <div id="logo_anadir">
        <svg id="icono" class="bi bi-plus-circle-fill" width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" data-toggle="tooltip" data-placement="right" title="Ingresar Vehiculo">
          <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4a.5.5 0 0 0-1 0v3.5H4a.5.5 0 0 0 0 1h3.5V12a.5.5 0 0 0 1 0V8.5H12a.5.5 0 0 0 0-1H8.5V4z" />
        </svg>
      </div>
    </div>

    <div id="contenedor_logo_excel" class="float-right">
      <div id="logo_excel" data-toggle="tooltip" data-placement="right" title="Reporte excel" data-toggle="modal" data-target="#Modal_form_excel">
        <svg id="icono_excel" class="bi bi-file-earmark-spreadsheet" width="90%" height="90%" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M13 9H3V8h10v1zm0 3H3v-1h10v1z" />
          <path fill-rule="evenodd" d="M5 14V9h1v5H5zm4 0V9h1v5H9z" />
          <path d="M4 1h5v1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6h1v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" />
          <path d="M9 4.5V1l5 5h-3.5A1.5 1.5 0 0 1 9 4.5z" />
        </svg>
      </div>
    </div>

  </div> <!-- contenedor principal -->

  <!-- The Modal registro -->
  <div class="modal fade" id="Modal_form">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Ingreso de Vehiculo</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form id="ingresar_vehiculo" method="POST">
            <div class="form-row">
              <div class="col-7">
                <input type="text" name="placa_vehiculo" class="form-control" placeholder="Placa del Vehiculo" required />
              </div>
              <div class="col">
                <select name="tipo_vehiculo" class="form-control" required>
                  <option value="#" disabled selected>Tipo Vehiculo</option>
                  <option value="Carro">Carro</option>
                  <option value="Moto">Moto</option>
                </select>
                <input type="hidden" name="action" value="insertarVehiculo" />
              </div>
            </div>
          </form>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button id="btn_close_modal" type="button" class="btn btn-danger" data-dismiss="modal" style="position: absolute; left: 13px;">
            Cancelar
          </button>
          <button id="btn_enviar" type="button" class="btn btn-success">
            Ingresar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- The Modal Excel -->
  <div class="modal fade" id="Modal_form_excel">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Reporte excel</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form id="ingresar_exportar">
            <div class="form-row">
              <div class="col-7">
                <input type="date" name="fecha_inicial" class="form-control" required />
              </div>
              <div class="col">
                <input type="date" name="fecha_final" class="form-control" required />
                <input type="hidden" name="action" value="ExportarVehiculosFecha" />
              </div>
            </div>
          </form>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button id="btn_close_modal_excel" type="button" class="btn btn-danger" data-dismiss="modal" style="position: absolute; left: 13px;">
            Cancelar
          </button>
          <button id="btn_expotar" type="button" class="btn btn-success">
            Ingresar
          </button>
        </div>
      </div>
    </div>
  </div>

  </div>
</body>

</html>