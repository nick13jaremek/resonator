Feature: the server receives a request to send a the details of a given email template

  Scenario Outline: return successfully the details associated to a given email template
    Given an authenticated identity in the app with <identity_id>
    Then a request for template details is sent to <endpoint> yielding the template in <response>

    Examples:
      | identity_id              | endpoint                                      | response                                     |
      | 01f0000000000000003f0001 | /api/notification/template/details/some-template.html | template/valid_template_details_response.js  |

  Scenario Outline: fail to return the details associated to a given email template
    Given an authenticated identity in the app with <identity_id>
    Then a request for template details is sent to <endpoint> and fails yielding the error in <response>

    Examples:
      | identity_id              | endpoint                                        | response                                           |
      | 01f0000000000000003f0001 | /api/notification/template/details/no-file.html | template/invalid_template_details_response.js      |