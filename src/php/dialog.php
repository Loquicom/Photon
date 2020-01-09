<?php

class Dialog {

    private $parent;

    public function __construct(Photon $parent) {
        $this->parent = $parent;
    }

    public function open(int $type, string $title, string $message, array $buttons) {
        $textType = static::constant_to_text($type);
        if ($textType === false) {
            return false;
        }
        $options = [
            'title' => $title,
            'message' => $message,
            'buttons' => $buttons
        ];
        return get_request($this->parent->generate_node_url("dialog/" . static::constant_to_text($type)), $options);
    }

    public function error(string $title, string $message) {
        $options = [
            'title' => $title,
            'message' => $message
        ];
        return get_request($this->parent->generate_node_url("dialog/error"), $options);
    }

    public function custom(string $html) {

    }

    public function custom_file(string $path) {
        if (!file_exists($path)) {
            return false;
        }
        return $this->custom(file_get_contents($path));
    }

    private static function constant_to_text(int $constant) {
        switch ($constant) {
            case ERROR_DIALOG:
                return "error";
            case INFO_DIALOG:
                return "information";
            case QUEST_DIALOG:
                return "question";
            case WARN_DIALOG:
                return "warning";
            case CUSTOM_DIALOG:
                return "custom";
            default:
                return false;
        }
    }

}