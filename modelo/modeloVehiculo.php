<?php
require_once 'conexion.php';

class Vehiculo extends Conexion
{

    public function __construct()
    {

        parent::__construct();
    }

    public function IngresarVehiculo($placa_vehiculo, $tipo_vehiculo, $fecha_ingreso, $hora_ingreso)
    {
        $sql = "INSERT INTO vehiculos VALUES ('','$placa_vehiculo', '$tipo_vehiculo', '$fecha_ingreso','$hora_ingreso', '000-00-00','00:00:00')";
        return $this->ejecutar($sql);
    }

    public function SalidaVehiculo($id_vehiculo, $fecha_salida, $hora_salida)
    {
        $sql = "UPDATE vehiculos SET fecha_salida = '$fecha_salida', hora_salida = '$hora_salida' WHERE id_vehiculo = '$id_vehiculo'";
        return $this->ejecutar($sql);
    }

    public function MostrarVehiculos()
    {
        $sql = "SELECT * FROM vehiculos WHERE fecha_salida = '000-00-00' AND hora_salida = '00:00:00'";
        return $this->consultar($sql);
    }

    public function contarVehiculos()
    {
        $sql = "SELECT COUNT(id_vehiculo) FROM vehiculos WHERE fecha_salida = '000-00-00' AND hora_salida = '00:00:00'";
        $cantidad = $this->consultar($sql);

        return $cantidad[0];
    }

    public function ExportarVehiculosFecha($fecha_inicial, $fecha_final)
    {

        $sql = "SELECT * FROM vehiculos WHERE fecha_ingreso between '$fecha_inicial' and '$fecha_final' ORDER BY fecha_ingreso ASC";
        return $this->consultar($sql);
    }
}
