/*
 * Copyright (c) 2020 Andrés Romero
 * The accompanying program is provided under the terms of MIT License ('agreement').
 * Written by Andres Romero <andresromeroh,cr@gmail.com>, November 2020.
*/
var dollarEnabled = false;
var dollarExchange = 0;
var salariesTotal = 0;
var aguinaldoColonesTotal = 0;
var aguinaldoDollarsTotal = 0;
var baseMoneyMount = '0.00';
var baseUsdMount = 'USD 0.00'
var baseCrcMount = 'CRC 0.00';
var currentFirstMonth = 'Diciembre (' + ((new Date().getFullYear()) - 1) + ')';

$(document).ready(function () {
    var headers = new Headers();
    headers.append('accept', '*/*');

    var options = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    fetch('https://tipodecambio.paginasweb.cr/api', options)
        .then(response => response.json())
        .then(result => {
            dollarExchange = result.compra
            $('#exchange-input').val(dollarExchange);
        })
        .catch(error => console.log('error', error));

    $('#december-label').text(currentFirstMonth);
    document.getElementById('select-from').options[0].innerText = currentFirstMonth;

    $('#calculator').submit(function (e) {
        e.preventDefault();

        $('.month').each(function (_, monthSalary) {
            salariesTotal = salariesTotal + Number(monthSalary.value);
        });

        if (dollarEnabled) {
            aguinaldoDollarsTotal = (salariesTotal / 12);
            $('#aguinaldo-total-dollars').html(aguinaldoDollarsTotal.toLocaleString('en'));

            aguinaldoColonesTotal = (salariesTotal / 12) * dollarExchange;
            $('#aguinaldo-total-colones').html(aguinaldoColonesTotal.toLocaleString('en'));
        } else {
            aguinaldoColonesTotal = salariesTotal / 12;
            $('#aguinaldo-total-colones').html(aguinaldoColonesTotal.toLocaleString('en'));
        }

        salariesTotal = 0;
        aguinaldoColonesTotal = 0;
        aguinaldoDollarsTotal = 0;
    });

    $('#calculator-reset').click(function (e) {
        e.preventDefault();

        document.getElementById('calculator').reset()

        $('#salary-period').val('');
        $('#aguinaldo-total-dollars').html(baseMoneyMount);
        $('#aguinaldo-total-colones').html(baseMoneyMount)
    });

    $('#btn-salary-add').click(function (e) {
        e.preventDefault();

        var from = $('#select-from').val();
        var to = $('#select-to').val();
        var salary = $('#salary-period').val();

        addSalaryToMultipleMonths(from, to, salary);

        $('#modal-salary').modal('hide');
    });

    $('#dollar-toggle').change(function (e) {
        e.preventDefault();
        if (e.target.checked) {
            dollarEnabled = true;
            $('.dollar-display').show();
            $('.month').each(function (_, monthSalary) {
                monthSalary.placeholder = baseUsdMount;
            });
            document.getElementById('salary-period').placeholder = baseUsdMount;
        } else {
            dollarEnabled = false;
            $('.dollar-display').hide();
            $('#salary-period').placeholder = baseCrcMount;
            $('.month').each(function (_, monthSalary) {
                monthSalary.placeholder = baseCrcMount;
            });
            document.getElementById('salary-period').placeholder = baseCrcMount;
        }
    });

    $('#exchange-input').change(function (e) {
        e.preventDefault();
        dollarExchange = e.target.value;
    });
});

function addSalaryToMultipleMonths(from, to, salary) {
    var fromNumber = Number(from.split('-')[1]);
    var toNumber = Number(to.split('-')[1]);

    $('.month').each(function (_, monthSalary) {
        const monthNumber = Number(monthSalary.id.split('-')[2]);

        if (monthNumber >= fromNumber && monthNumber <= toNumber) {
            $(monthSalary).val(salary);
        }
    });
}