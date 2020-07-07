window.isPracticing = window.location.host.indexOf('hightopo') >= 0;

window.hteditor_config = {
    // color_select: 'red',
    locale: 'zh',
    locateFileEnabled: !isPracticing,
    componentsVisible: !isPracticing,

    displaysModifiable: !isPracticing,
    symbolsModifiable: !isPracticing,
    componentsModifiable: !isPracticing,
    assetsModifiable: !isPracticing,

    expandedTitles: {
        TitleExtension: false
    },
    subConfigs: [
        'custom/configs/config-handleEvent.js',
        'custom/configs/config-valueTypes.js',
        'custom/configs/config-dataBindings.js',
        'custom/configs/config-inspectorFilter.js',
        'custom/configs/config-customProperties.js',
        'custom/configs/config-onTitleCreating.js',
        'custom/configs/config-onMainToolbarCreated.js',
        'custom/configs/config-onMainMenuCreated.js',
        'custom/configs/config-onRightToolbarCreated.js'
    ]
};
