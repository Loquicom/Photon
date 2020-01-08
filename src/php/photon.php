<?php

require 'dialog.php';

class Photon {

    private $info;

    public $dialog;

    public function __construct(array $info) {
        $this->info = $info;
        $this->dialog = new Dialog($this);
    }

    public function get_node_url() {
        return "http://localhost:" . $this->info['port']['node'];
    }

    public function get_token() {
        return $this->info['token'];
    }

    public function generate_node_url(string $ressource) {
        $ressource = ($ressource[0] !== '/') ? '/' . $ressource : $ressource;
        $ressource .= ($ressource[strlen($ressource) - 1] !== '/') ? '/' : '';
        return $this->get_node_url() . $ressource . $this->get_token();
    }

}