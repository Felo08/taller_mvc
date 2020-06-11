<?php
require '../config.php';



include_once BASEPATH . '/TDEA_Desarrollo_web/taller_mvc/modelo/modeloVehiculo.php';

class cvehiculos
{
    public function __construct()
    {
        $this->modeloVehiculo = new Vehiculo();
    }

    public function inicioVehiculos()
    {
?>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <!-- <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script> -->
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>
        <script src="../libreria/libreria_jq.js"></script>
        <script src="../public/jquery.validate/jquery.validate.min.js"></script>
        <script src="../public/jquery.validate/localization/messages_es.js"></script>
        <script src="../public/notify/notify.min.js" type="text/javascript"></script>
        <script src="../public/jquery.validate/jquery.validate.min.js" type="text/javascript"></script>
        <link rel="stylesheet" href="../css/style.css">
<?php
        $vehiculos = $this->modeloVehiculo->MostrarVehiculos();
        include(BASEPATH . "/TDEA_Desarrollo_web/taller_mvc/vista/_paginaInicial.php");
    }

    public function insertarVehiculo()
    {
        date_default_timezone_set('America/Bogota');
        $placa_vehiculo = strtoupper($_POST['placa_vehiculo']);
        $tipo_vehiculo = $_POST['tipo_vehiculo'];
        $fecha_ingreso = date("Y-m-d");
        $hora_ingreso = date("h:i:sa");

        $respuesta = $this->modeloVehiculo->IngresarVehiculo($placa_vehiculo, $tipo_vehiculo, $fecha_ingreso, $hora_ingreso);

        if ($respuesta > 0) {
            echo json_encode(array('resultado' => true, 'mensaje' => 'Proceso exitoso del registro del vehiculo'));
        } else {
            echo json_encode(array('resultado' => false, 'mensaje' => 'Error al registrar el vehiculo'));
        }
    }

    public function salidaVehiculo()
    {
        date_default_timezone_set('America/Bogota');
        $id_vehiculo = $_POST['id_vehiculo'];
        $fecha_salida = date("Y-m-d");
        $hora_salida = date("h:i:sa");

        $respuesta = $this->modeloVehiculo->salidaVehiculo($id_vehiculo, $fecha_salida, $hora_salida);

        if ($respuesta > 0) {
            echo json_encode(array('resultado' => true, 'mensaje' => 'Proceso exitoso de salida de vehiculo'));
        } else {
            echo json_encode(array('resultado' => false, 'mensaje' => 'Error al registrar salida de vehiculo'));
        }
    }

    public function contarVehiculos()
    {
        $respuesta = $this->modeloVehiculo->contarVehiculos();
        echo json_encode(array('cantidad' => $respuesta['COUNT(id_vehiculo)']));
    }

    public function ExportarVehiculosFecha()
    {


        $data = $this->modeloVehiculo->ExportarVehiculosFecha($_REQUEST['fecha_inicial'], $_REQUEST['fecha_final']);
        ob_start();
        include_once(BASEPATH . '/TDEA_Desarrollo_web/taller_mvc/vista/exportar_excel.php');
        $string = ob_get_clean();
        header("Content-type: application/vnd.ms-xls");
        header("Content-Disposition: attachment; filename=Reporte vehiculos.xls");
        header("mso-number-format: @");
        echo $string;

        //http://localhost/tdea/mvc/Controlador/CLibreria.php?action=ExportarLibrosFecha&fecha_inicial=2020-01-01&fecha_final=2020-06-30

    }

    public function recargar_tabla()
    {
        $vehiculos = $this->modeloVehiculo->MostrarVehiculos();
        include("../vista/lista_vehiculos.php");
    }
}

$pagina = new cvehiculos;

if (isset($_REQUEST['action'])) {
    $pagina->{$_REQUEST['action']}();
} else {
    $pagina->inicioVehiculos();
}

?>