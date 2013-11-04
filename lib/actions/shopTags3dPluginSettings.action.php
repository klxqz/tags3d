<?php

class shopTags3dPluginSettingsAction extends waViewAction
{
    protected $tmp_path = 'plugins/tags3d/templates/Tags3d.html';
    
    public function execute()
    {
        
        $app_settings_model = new waAppSettingsModel();
        $vals = $app_settings_model->get(array('shop', 'tags3d'));

        $change_tpl = false;
        $template_path = wa()->getDataPath($this->tmp_path, false, 'shop', true);
        if(file_exists($template_path)) {
            $change_tpl = true;
        } else {
            $template_path = wa()->getAppPath($this->tmp_path, 'shop');
        }

        $template = file_get_contents($template_path);
        
        $this->view->assign('change_tpl', $change_tpl);   
        $this->view->assign('vals', $vals);
        $this->view->assign('template', $template);
    }
}