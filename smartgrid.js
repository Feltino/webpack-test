const smartgrid = require('smart-grid');

const settings = {
    outputStyle: 'styl',
    filename: "_smart-grid",
    columns: 12,
    offset: '30px',
    container: {
        maxWidth: '1170px',
        fields: '30px'
    },
    breakPoints: {
        xl: {
            width: "1140px",
            fields: " 20px"
        },
        lg: {
            width: "960px",
            fields: "10px"
        },
        md: {
            width: "720px",
            fields: "5px"
        },
        sm: {
            width: "540px",
            fields: "5px"
        }
    },
    oldSizeStyle: false,
    properties: [
        'justify-content'
    ]
};

smartgrid('./src/precss/components', settings);