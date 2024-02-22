export let ATConfigOptions =
    {
        "dev":
        {
            "REST_API_HOST": "http://174.138.20.250:3002",
            'fwg.dentistry.common': {
                "REST_API_HOST": "http://174.138.20.250:3002"
            },
            // WEBSOCKET
            "CACHE_ON":false,
            "SOCKET_API_HOST" : "ws://174.138.20.250:5001"
        },
        "shared_configuration":
        {
            "DEFAULT_NAMESPACE": "fwg.dentistry.common",
            "AMAZON_S3_HOST": "https://fastworldtech.sgp1.digitaloceanspaces.com",
            "AMAZON_S3_UPLOAD_FOLDER": "at/dev"
        }
    };

    export let UrlImage = ATConfigOptions.shared_configuration.AMAZON_S3_HOST+ '/' + ATConfigOptions.shared_configuration.AMAZON_S3_UPLOAD_FOLDER + '/'






