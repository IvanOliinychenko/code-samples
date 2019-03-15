<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

/**
 * booxi Ingenico API
 * API to perform operations from the Ingenico terminal.
 *
 * OpenAPI spec version: 1.0.0
 * Contact: support@booxi.com
 *
 */

 /**
 * booxi Ingenico API
 * @version 1.0.0
 */

$router->group(['prefix' => 'ingenico/v1'], function () use ($router) {
    /**
     * post recordLog
     * Summary: 
     * Notes: Log terminal errors. Log priorities by descending.   - critical   - error   - warning   - info   - debug 
     * Output-Formats: [application/json]
     */
    $router->post('log', ['as' => 'log', 'uses' => 'SystemController@recordLog']);
    
    /**
     * get getVersion
     * Summary: 
     * Notes: Get API version.
     * Output-Formats: [application/json]
     */
    $router->get('version', ['as' => 'version', 'uses' => 'SystemController@getVersion']);

    /**
     * get getTransactions
     * Summary: 
     * Notes: Get a list of transactions.
     * Output-Formats: [application/json]
     */
    $router->get('transaction', ['as' => 'transactions', 'uses' => 'TransactionController@getTransactions']);
    
    /**
     * post setTransaction
     * Summary: 
     * Notes: Update the state of a given transaction based on payment result and create a payment record.
     * Output-Formats: [application/json]
     */
    $router->post('transaction/{invoiceId}', ['as' => 'transactions', 'uses' => 'TransactionController@setTransaction']);

    /**
     * post registerTerminal
     * Summary: 
     * Notes: Register a terminal using a previously generated PIN.
     * Output-Formats: [application/json]
     */
    $router->post('register', ['as' => 'register', 'uses' => 'TerminalController@registerTerminal']);

    /**
     * delete unregisterTerminal
     * Summary: 
     * Notes: Unregister a terminal.
     * Output-Formats: [application/json]
     */
    $router->delete('register', ['as' => 'unregister', 'uses' => 'TerminalController@unregisterTerminal']);

    /**
     * get getTerminals
     * Summary: 
     * Notes: Get a list of terminals.
     * Output-Formats: [application/json]
     */
    $router->get('terminal', ['as' => 'terminals', 'uses' => 'TerminalController@getTerminals']);

    /**
     * post createPin
     * Summary: 
     * Notes: Generate pin for paring the terminal. Valid for 2 minutes. Require X-Booxi-Inbound-Key header to be presented.
     * Output-Formats: [application/json]
     */
    $router->post('pin', ['as' => 'pin', 'uses' => 'PinController@createPin']);
});

// TODO: remove in prod, code below for testing headers
// $router->post('/', function () use ($router) {
//     // return $router->app->version();
//     $headers = array();
//     foreach ($_SERVER as $key => $value) {
//         if (strpos($key, 'HTTP_') === 0) {
//             $headers[str_replace(' ', '', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))))] = $value;
//         }
//     }
//     return response(var_dump($headers), 200, ['Content-Type' => 'application/x-www-form-urlencoded']);
// });

// $router->get('/', function () use ($router) {
//     // return $router->app->version();
//     $headers = array();
//     foreach ($_SERVER as $key => $value) {
//         if (strpos($key, 'HTTP_') === 0) {
//             $headers[str_replace(' ', '', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))))] = $value;
//         }
//     }
//     return response(var_dump($headers), 200, ['Content-Type' => 'application/x-www-form-urlencoded']);
// });