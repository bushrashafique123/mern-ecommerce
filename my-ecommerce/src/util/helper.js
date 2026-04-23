import $ from 'jquery';
import toastr from "toastr/build/toastr.min.js";
import "toastr/build/toastr.min.css";

export const toastBuilder = (type, message) => {
    if (type == 'success') {
        toastr.success(
            message,
            "Success",
            { timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 1000, timeOut: 3000, progressBar: true, }
        );
    } else if (type == 'info') {
        toastr.info(
            message,
            "info",
            { timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 1000, timeOut: 3000, progressBar: true, }
        );
    } else if (type == 'warning') {
        toastr.warning(
            message,
            "Warning",
            { timeOut: 3000, extendedTimeOut: 0, closeButton: true, closeDuration: 1000, progressBar: true }
        );
    } else {
        toastr.error(
            message,
            "Error",
            { timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 1000, timeOut: 3000, progressBar: true, }
        );
    }
}
export const renderResponseMessage = (response, alertType, alertDiv = '', nextPage = false) => {
    $(alertDiv).html('')
    if (response[0]) {
        toastBuilder('success', response[1]);
    } else {
        let message = '';
        let field_link = '';
        const invalidArrayItems = {};
    
        if (alertType === 'under_field_message') {
            for (const key in response[1]) {
                if (!Object.hasOwnProperty.call(response[1], key)) continue;

                message = '';
                const errors = response[1][key];
                for (let i = 0; i < errors.length; i++) {
                    message += `<div>${errors[i]}</div>`;
                }
                const arrayFieldMatch = key.match(/^(\w+)\.(\d+)\.(\w+)$/);
                if (arrayFieldMatch) {
                    const [, arrayName, index, field] = arrayFieldMatch;
                    $(`div[data-field="${key}"]`).html(message);

                    if (!invalidArrayItems[arrayName]) {
                        invalidArrayItems[arrayName] = new Set();
                    }
                    invalidArrayItems[arrayName].add(index);
                }
    
                else if (key.match(/^\w+$/) && Array.isArray(errors)) {
                    $(`div[data-field="${key}"]`).html(message);
                    field_link += `<li onclick="scrollToElem('${key}')" class="cursor-pointer">${key.replaceAll('_', ' ')} is missing or incomplete</li>`;
                }
          
                else {
                    $(`div[data-field="${key}"]`).html(message);
                    field_link += `<li onclick="scrollToElem('${key}')" class="cursor-pointer">${key.replaceAll('_', ' ')} is missing</li>`;
                }
            }
            for (const arrayName in invalidArrayItems) {
                $(`.array-item[data-array="${arrayName}"]`).removeClass('border border-danger');
                $(`[data-array-field="${arrayName}"]`).html('Information missing');
                for (const index of invalidArrayItems[arrayName]) {
                    $(`.array-item[data-array="${arrayName}"][data-index="${index}"]`).addClass('border border-danger');
                }
            }
    
            if (alertDiv.length !== 0) {
                $(alertDiv).html(
                    `<div class="alert alert-danger d-flex align-items-center p-1">
                        <div class="d-flex flex-column"><ul>${field_link}</ul></div>
                    </div>`
                );
                toastBuilder('error', 'Please make sure every information is added');
            }

        } else if (alertType == 'popup') {
            toastBuilder('error', response[1]);
        } else if (alertType == 'div_alert') {
            message = response[1];
            $(alertDiv).html(`<div class="alert alert-danger d-flex align-items-center p-1"><div class="d-flex flex-column">${message}</div></div>`);
        }
    }
}

