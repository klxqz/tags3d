<?php
$plugin_id = array('shop', 'tags3d');
$app_settings_model = new waAppSettingsModel();
$app_settings_model->set($plugin_id, 'status', '1');
$app_settings_model->set($plugin_id, 'default_output', '1');
$app_settings_model->set($plugin_id, 'count', '50');
$app_settings_model->set($plugin_id, 'speed', '0.03');
$app_settings_model->set($plugin_id, 'tag_color', '0000CC');
$app_settings_model->set($plugin_id, 'color_outline', '0000CC');
$app_settings_model->set($plugin_id, 'width', '260');
$app_settings_model->set($plugin_id, 'height', '260');
