<?php

return array(
    'name' => '3D Облако тегов',
    'description' => 'Вращающийся 3D шар из тегов',
    'vendor'=>903438,
    'version'=>'1.0.0',
    'img'=>'img/tags3d.png',
    'shop_settings' => true,
    'frontend'    => true,
    'icons'=>array(
        16=>'img/tags3d.png',
    ),
    'handlers' => array(
        'frontend_nav' => 'frontendNav'
    ),

);
//EOF
