<?php
    require "XElement.class.php";

    function some_html_js_as_php(){
        $page_orders = XDefaults::createTag("form", ["id" => "order_wrapper"], [
            "text" => XDefaults::concat([
                XDefaults::createInput('text', [], 'order_number', 'Order Number: '),
                XDefaults::createTag('div', ["id" => "order_number_generate"], [
                    "text" => XDefaults::concat([
                        XDefaults::createTag('button', ['id' => 'generateOrderNumber'], ['text' => 'Generate']),
                        XDefaults::createTag('script', [], [
                            "text" => JS::addEventListener("generateOrderNumber", "click", "
                                ".JS::RANDOM_STRING_FUNCTION."
                                let generateOrderNumber = ".JS::getElementById('order_number').";
                                generateOrderNumber.value = generateRandomString();
                            ")
                        ])
                    ])
                ]),
                XDefaults::createTag("hr"),
                XDefaults::createTag("div", ['id' => 'order_information'], [
                    "text" => XDefaults::concat([
                        XDefaults::createInput("text", [], "input_field_name", "Field Name: "),
                        XDefaults::createInput("text", [], "input_field_value", "Field Value: "),
                        XDefaults::createTag("button", ["id" => "addField"], ['text' => "Add Field"]),
                        XDefaults::createTag("button", ["id" => "createOrder"], ['text' => "Create Order"]),
                        XDefaults::createTag("hr"),
                        XDefaults::createTag("div", ['id' => 'order_fields'], []),
                        XDefaults::createInput("hidden", ["value" => "add_order"], "action"),
                        XDefaults::createTag("script", [], [
                            "text" => XDefaults::concat([
                                JS::createGlobalVariable("field_counter", 0),
                                JS::addEventListener("addField", "click", XDefaults::concat([
                                    JS::getElementById('input_field_name', 'field_name'),
                                    JS::getElementById('input_field_value', 'field_value'),
                                    JS::expression("field_name && field_value", XDefaults::concat([
                                        JS::getElementById('order_fields', 'order_fields'),
                                        JS::createElement('div', 'new_field', [
                                            'id' => "'field'"
                                        ]),
                                        JS::createElement('input', 'new_field_name', [
                                            'type' => "'text'",
                                            'id' => "\"field_name_\" + field_counter",
                                            'name' => "\"field_name_\" + field_counter",
                                            'value' => "field_value.value"
                                        ]),
                                        JS::createElement('input', 'new_field_value', [
                                            'type' => "'text'",
                                            'id' => "\"field_value_\" + field_counter",
                                            'name' => "\"field_value_\" + field_counter",
                                            'value' => "field_value.value"
                                        ]),
                                        JS::createElement('div', 'new_field_remove', [], [
                                            'textContent' => "'X'"
                                        ]),
                                        JS::addEventListener('new_field_remove', 'click', XDefaults::concat([
                                            JS::eventCurrentTarget() . ".parentNode.remove()"
                                        ]), true),
                                        JS::appendChild('new_field', 'new_field_name'),
                                        JS::appendChild('new_field', 'new_field_value'),
                                        JS::appendChild('new_field', 'new_field_remove'),
                                        JS::appendChild('order_fields', 'new_field'),
                                        JS::incrementVariable('field_counter', '1')
                                    ]))
                                ]))
                            ])
                        ]),
                        XDefaults::createTag("script", [], [
                            "text" => JS::addEventListener("createOrder", 'click', XDefaults::concat([
                                JS::eventCurrentTarget() . ".form.submit()"
                            ]))
                        ])
                    ])
                ]),
            ])
        ]);
        return $page_orders;
    }