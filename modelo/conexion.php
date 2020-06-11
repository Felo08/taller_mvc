<?php
class Conexion
{

    public $conexion;

    function __construct()
    {
        $this->host = "localhost";
        $this->bd = "parqueadero";
        $this->usuario = "root";
        $this->password = "";
        $this->conectar();
    }

    public function conectar()
    {
        $user = 'root';
        $pwd = '';
        return new PDO('mysql:host=localhost;dbname=parqueadero', $user, $pwd);
    }

    public function consultar($query)
    {
        $bd = $this->conectar();
        $consulta = $bd->query($query);

        $datos = array();
        while ($data = $consulta->fetch())
            $datos[] = $data;

        return $datos;
    }


    public function ejecutar($query)
    {
        $bd = $this->conectar();

        if ($bd->query($query) === TRUE) {

            return 0;
        } else {

            return 1;
        }
    }

    public static function conexion($className)
    {
        try {
            $reflection = new ReflectionClass($className);
            return $reflection->newInstance();
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }
}
