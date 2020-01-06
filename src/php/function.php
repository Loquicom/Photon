<?php

function get_request($url, $params = [], $json = true, $isJson = true) {
    if (empty($params)) {
        $result = file_get_contents($url);
        if ($isJson) {
            return parse_json($result);
        }
        return $result;
    }
    return http_request("GET", $url, $params, $json, $isJson);
}

function post_request($url, $params = [], $json = true, $isJson = true) {
    return http_request("POST", $url, $params, $json, $isJson);
}

/**
 * 
 * @param $method HTTP method
 * @param $url URL to call
 * @param $params Request parameters
 * @param $json Send params in JSON (otherwise usa an URL-encoded query string)
 * @param $isJson The answer is in json
 * @return Object|String
 */
function http_request($method, $url, $params = [], $json = true, $isJson = true) {
    $options = ['http' => [
            'method' => strtoupper($method),
        ]
    ];
    if (!empty($params)) {
        $data = null;
        if ($json) {
            $data = json_encode($params);
        } else {
            $data = urldecode(http_build_query($params));
        }
        $options['http']['header'] ='Content-type: ' . ($json ? 'application/json' : 'application/x-www-form-urlencoded');
        $options['http']['content'] = $data;
    }
    $contexte = stream_context_create($options);
    $result = file_get_contents($url, false, $contexte);
    if ($isJson) {
        return parse_json($result);
    }
    return $result;
}

function parse_json($data) {
    $result = json_decode($data);
    if ($result !== false) {
        return $result;
    }
    return $data;
}