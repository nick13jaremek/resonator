Feature: the server receives a request to send a list of the available email templates

  Scenario Outline: list successfully the names of the generated email templates
    Given an authenticated identity in the app with <identity_id>
    Then a request for template listing is sent to <endpoint> yielding the list of templates in <response>

    Examples:
      | identity_id              | endpoint                              | response                                     |
      | 01f0000000000000003f0001 | /api/notification/template/list | template/valid_template_list_response.js     |

  Scenario Outline: fail to list the names of the generated email templates
    Given an authenticated identity in the app with <identity_id>
    Then a request for template listing is sent to <endpoint> and fails yielding the error in <response>

    Examples:
      | identity_id              | endpoint                              | response                                     |
      | 01f0000000000000003f0001 | /api/notification/template/list | template/invalid_template_list_response.js   |