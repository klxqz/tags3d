<?php


class shopTags3dPlugin extends shopPlugin
{  
    public function frontendNav()
    {
        if($this->getSettings('default_output')) {
            return self::display();
        }
    }
    
    public static function display()
    {
        $tmp_path='plugins/tags3d/templates/Tags3d.html';
        $app_settings_model = new waAppSettingsModel();
        $settings = $app_settings_model->get(array('shop', 'tags3d'));
        if(!$settings['status']) {
            return;
        }
            
        $tag_model = new shopTagModel();
        $tags = $tag_model->getCloud(null, $settings['count']);

        $view = wa()->getView();
        
        $view->assign('settings', $settings);
        $view->assign('tags', $tags);

        $template_path = wa()->getDataPath($tmp_path, false, 'shop', true);
        if(!file_exists($template_path)) {
            $template_path = wa()->getAppPath($tmp_path, 'shop');
        }
        
		$html = $view->fetch($template_path);
        return $html;
    }
}

