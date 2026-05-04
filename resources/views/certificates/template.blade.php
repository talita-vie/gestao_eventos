<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Certificado</title>
    <style>
        /* O DomPDF entende CSS básico. Aqui você estiliza a página. */
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            border: 10px solid #2c3e50;
        }
        .titulo { font-size: 40px; font-weight: bold; margin-bottom: 30px; }
        .texto { font-size: 20px; line-height: 1.6; }
        .destaque { font-weight: bold; text-transform: uppercase; }
        .rodape { margin-top: 50px; font-size: 12px; color: #7f8c8d; }
    </style>
</head>
<body>

    <div class="titulo">Certificado de Conclusão</div>

    <div class="texto">
        Certificamos que <span class="destaque">{{ $certificate->participant_name_snapshot }}</span><br>
        participou com êxito do evento <br>
        <span class="destaque">{{ $certificate->event_title_snapshot }}</span>,<br>
        realizado em {{ $certificate->event_start_date_snapshot }} à {{ $certificate->event_end_date_snapshot }},<br>
        com carga horária total de {{ $certificate->event_hours_snapshot }} horas.
    </div>

    <div class="rodape">
        Para verificar a autenticidade deste documento, acesse nosso site e informe o código:<br>
        <strong>{{ $certificate->validation_code }}</strong>
    </div>

</body>
</html>