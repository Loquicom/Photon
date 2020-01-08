<?php

class Dialog {

    private $parent;

    public function __construct(Photon $parent) {
        $this->parent = $parent;
    }

    public function open(int $type, string $title, string $message, array $buttons = null) {
        $options = [
            'title' => $title,
            'message' => $message
        ];
        if ($buttons !== null && !empty($buttons)) {
            $options['buttons'] = $buttons;
        }
        var_dump($this->parent->generate_node_url("dialog/" . static::constant_to_text($type)));
        return get_request($this->parent->generate_node_url("dialog/" . static::constant_to_text($type)), $options);
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