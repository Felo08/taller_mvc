<table class="table table-striped" style="text-align: center;">
    <thead class="thead-dark">
        <tr>
            <th scope="col">Placa del Vehiculo</th>
            <th scope="col">Tipo de Vehiculo</th>
            <th scope="col">fecha y hora de ingreso</th>
            <th scope="col">Salida</th>
        </tr>
    </thead>
    <tbody>
        <?php
        foreach ($vehiculos as $vehiculo) {
        ?>
            <tr>
                <td scope="row"><?php echo $vehiculo['placa_vehiculo']; ?></td>
                <td><?php echo $vehiculo['tipo_vehiculo']; ?></td>
                <td><?php echo $vehiculo['fecha_ingreso']; ?>, hora:<?php echo $vehiculo['hora_ingreso']; ?></td>
                <td><button id="btn_salida" type="button" class="btn btn-danger" <?php echo 'value="' . $vehiculo['id_vehiculo'] . '"' ?>>Registrar Salida</button></td>
            </tr>
        <?php
        }
        ?>
    </tbody>
</table>