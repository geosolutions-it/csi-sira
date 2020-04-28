const axios = require('../../MapStore2/web/client/libs/ajax');

const TREE_LOADED = 'TREE_LOADED';
const TREE_LOAD_ERROR = 'TREE_LOAD_ERROR';
const CLOSE_TREE = 'CLOSE_TREE';

function treeLoaded(xmlData, template) {
    return {
        type: TREE_LOADED,
        show: 'block',
        card: {
            xml: xmlData,
            treeTemplate: template
        }
    };
}

function configureTree(xmlData, treeTemplate) {
    return (dispatch) => {
        return axios.get(treeTemplate).then((response) => {
            let template = response.data;
            dispatch(treeLoaded(xmlData, template));
        });
    };
}

function treeLoadError(e) {
    return {
        type: TREE_LOAD_ERROR,
        error: e
    };
}

function closeTree() {
    return {
        type: CLOSE_TREE
    };
}

module.exports = {
    TREE_LOADED,
    TREE_LOAD_ERROR,
    CLOSE_TREE,
    configureTree,
    closeTree,
    treeLoadError
};
