<html>

<body>

    <table border="1">
        <tr>
            <td style="background-color:green; color:white;">placa vehiculo</td>
            <td style="background-color:green; color:white;">tipo vehiculo</td>
            <td style="background-color:green; color:white;">fecha y hora ingreso</td>
            <td style="background-color:green; color:white;">fecha y hora salida</td>

        </tr>

        <?php

        foreach ($data as $vehiculo) {

        ?>
            <tr>
                <td><?php echo $vehiculo['placa_vehiculo']; ?></td>
                <td><?php echo $vehiculo['tipo_vehiculo']; ?></td>
                <td><?php echo $vehiculo['fecha_ingreso']; ?>, hora:<?php echo $vehiculo['hora_ingreso']; ?></td>
                <td><?php
                    if ($vehiculo['fecha_salida'] != '0000-00-00' && $vehiculo['fecha_salida'] != '00:00:00') {
                        echo $vehiculo['fecha_salida']; ?>, hora:<?php echo $vehiculo['hora_salida'];
                                                                } else {
                                                                    echo 'No ha salido';
                                                                } ?></td>

            </tr>
        <?php
        }
        ?>

    </table>
</body>

</html>