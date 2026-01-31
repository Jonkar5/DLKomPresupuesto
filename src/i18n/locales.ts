export type Language = 'eu' | 'es';

export const translations = {
    eu: {
        // Header
        budget: 'Aurrekontua',
        reset: 'Berrezarri',
        calculator: 'm² Kalkulagailua',
        show_prices: 'Prezioak erakutsi',
        hide_prices: 'Prezioak ezkutatu',
        view_pdf: 'PDF Ikusi',
        import: 'Inportatu',
        save_pc: 'Gorde PCan',
        onedrive: 'OneDrive',
        syncing: 'Sinkronizatzen...',
        synced: 'Sinkronizatuta',

        // Client Form
        client_data: 'Bezeroaren Datuak',
        client_name: 'Izena',
        address: 'Helbidea',
        city: 'Herria',
        dni_cif: 'IFA / IFZ',
        date: 'Data',
        project: 'Proiektua',

        // Budget Builder
        add_item: 'Gehitu Partida',
        concept: 'Kontzeptua / Azalpena',
        total: 'Guztira',
        remove_item: 'Ezabatu partida?',
        confirm_reset: 'Ziur zaude aurrekontu guztia ezabatu nahi duzula?',

        // Summary Card
        summary: 'Laburpena',
        base_imponible: 'Oinarri Zerga-lagun',
        iva: 'BEZ',
        total_budget: 'AURREKONTUA GUZTIRA',

        // Company Data
        company_data: 'Enpresaren Datuak',
        commercial_name: 'Izen Komertziala',
        phone: 'Telefonoa',
        email: 'Emaila',
        upload_logo: 'Logoa Igo',
        upload_stamp: 'Zilua Igo',
        lock_data: 'Datuak Blokeatu',
        unlock_data: 'Datuak Desblokeatu',
        configure_payments: 'Ordainketak Konfiguratu',

        // Signature
        client_signature: 'BEZEROAREN SINADURA',
        accept_conditions: 'Baldintzak onartzen ditut',
        draw_signature: 'Sinatu hemen',
        clear: 'Garbitu',
        save: 'Gorde',
        close: 'Itxi',

        // Excel
        export_excel: 'Excelera Esportatu',

        // Notes
        notes_title: 'Aurrekontuaren Oharrak eta Baldintzak',
        notes_placeholder: 'Idatzi hemen baldintza legalak, epeak, ordaintzeko moduak...',
        notes_print_notice: 'Ohar hauek aurrekontuaren amaieran orrialde berezi batean inprimatuko dira.',
        general_conditions: 'Baldintza Orokorrak eta Oharrak',

        // Payment Terms
        payment_method: 'ORDAINTZEKO MODUA',
        account_number: 'KONTU ZENBAKIA (LA CAIXA)',
        validity_notice: 'Aurrekontu honek 15 eguneko balioa du.',
        materials_notice: 'Prezio guztiek materialak eta eskulanak barne hartzen dituzte.'
    },
    es: {
        // Header
        budget: 'Presupuesto',
        reset: 'Reiniciar',
        calculator: 'Calculadora m²',
        show_prices: 'Mostrar Precios',
        hide_prices: 'Ocultar Precios',
        view_pdf: 'Vista PDF',
        import: 'Importar',
        save_pc: 'Guardar en PC',
        onedrive: 'OneDrive',
        syncing: 'Guardando...',
        synced: 'Sincronizado',

        // Client Form
        client_data: 'Datos del Cliente',
        client_name: 'Nombre',
        address: 'Dirección',
        city: 'Localidad',
        dni_cif: 'NIF / CIF',
        date: 'Fecha',
        project: 'Proyecto',

        // Budget Builder
        add_item: 'Añadir Partida',
        concept: 'Descripción / Concepto',
        total: 'Total',
        remove_item: '¿Estás seguro de que quieres eliminar esta partida?',
        confirm_reset: '¿Estás seguro de que quieres borrar todo el presupuesto?',

        // Summary Card
        summary: 'Resumen',
        base_imponible: 'Base Imponible',
        iva: 'IVA',
        total_budget: 'TOTAL PRESUPUESTO',

        // Company Data
        company_data: 'Datos de Empresa',
        commercial_name: 'Nombre Comercial',
        phone: 'Teléfono',
        email: 'Email',
        upload_logo: 'Subir Logo',
        upload_stamp: 'Subir Sello',
        lock_data: 'Bloquear Datos',
        unlock_data: 'Desbloquear Datos',
        configure_payments: 'Configurar Pagos',

        // Signature
        client_signature: 'FIRMA CLIENTE',
        accept_conditions: 'Acepto condiciones',
        draw_signature: 'Firme aquí',
        clear: 'Limpiar',
        save: 'Guardar',
        close: 'Cerrar',

        // Excel
        export_excel: 'Exportar Excel',

        // Notes
        notes_title: 'Notas y Condiciones del Presupuesto',
        notes_placeholder: 'Escribe aquí las condiciones legales, plazos, formas de pago...',
        notes_print_notice: 'Estas notas se imprimirán en una página aparte al final del presupuesto.',
        general_conditions: 'Condiciones Generales y Notas',

        // Payment Terms
        payment_method: 'FORMA DE PAGO',
        account_number: 'Nº DE CUENTA (LA CAIXA)',
        validity_notice: 'Este presupuesto tiene una validez de 15 días.',
        materials_notice: 'Todos los precios incluyen materiales y mano de obra.'
    }
};
