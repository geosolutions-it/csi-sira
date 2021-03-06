/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const Node = require('./Node');
const VisibilityCheck = require('./fragments/VisibilityCheck');
const Title = require('./fragments/Title');
const InlineSpinner = require('@mapstore/components/misc/spinners/InlineSpinner/InlineSpinner');
const WMSLegend = require('./fragments/WMSLegend');
const ConfirmModal = require('@mapstore/components/maps/modals/ConfirmModal');
const LayersTool = require('./fragments/LayersTool');
const Message = require('@mapstore/components/I18N/Message');
const PropTypes = require('prop-types');

class DefaultLayer extends React.Component {
    static propTypes = {
        node: PropTypes.object,
        settings: PropTypes.object,
        propertiesChangeHandler: PropTypes.func,
        retrieveLayerData: PropTypes.func,
        onToggle: PropTypes.func,
        onToggleQuerypanel: PropTypes.func,
        onZoom: PropTypes.func,
        onSettings: PropTypes.func,
        style: PropTypes.object,
        sortableStyle: PropTypes.object,
        hideSettings: PropTypes.func,
        updateSettings: PropTypes.func,
        updateNode: PropTypes.func,
        removeNode: PropTypes.func,
        activateLegendTool: PropTypes.bool,
        activateRemoveLayer: PropTypes.bool,
        activateSettingsTool: PropTypes.bool,
        activateQueryTool: PropTypes.bool,
        activateZoomTool: PropTypes.bool,
        settingsText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        opacityText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        saveText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        closeText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        confirmDeleteText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        confirmDeleteMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        modalOptions: PropTypes.object,
        settingsOptions: PropTypes.object,
        visibilityCheckType: PropTypes.string,
        includeDeleteButtonInSettings: PropTypes.bool,
        groups: PropTypes.array
    };

    static defaultProps = {
        style: {},
        sortableStyle: {},
        propertiesChangeHandler: () => {},
        onToggle: () => {},
        onZoom: () => {},
        onSettings: () => {},
        retrieveLayerData: () => {},
        onToggleQuerypanel: () => {},
        activateRemoveLayer: false,
        activateLegendTool: false,
        activateSettingsTool: false,
        activateQueryTool: false,
        activateZoomTool: false,
        includeDeleteButtonInSettings: false,
        modalOptions: {},
        settingsOptions: {},
        confirmDeleteText: <Message msgId="layerProperties.deleteLayer" />,
        confirmDeleteMessage: <Message msgId="layerProperties.deleteLayerMessage" />,
        visibilityCheckType: "glyph"
    };

    state = {
        showDeleteDialog: false
    };

    onConfirmDelete = () => {
        this.props.removeNode(this.props.node.id, "layers");
        this.closeDeleteDialog();
    };

    renderCollapsible = () => {
        let tools = [];
        if (this.props.activateRemoveLayer) {
            tools.push((<LayersTool
                node={this.props.node}
                key="removelayer"
                className="clayer_removal_button"
                onClick={this.displayDeleteDialog}
                tooltip="toc.removeLayer"
                glyph="1-close"
            />));
        }
        tools.push(
            <LayersTool node={this.props.node} key="toolsettings"
                tooltip="toc.editLayerProperties"
                glyph="cog"
                onClick={(node) => this.props.onSettings(node.id, "layers",
                    {opacity: parseFloat(node.opacity !== undefined ? node.opacity : 1)})}/>
        );
        if (this.props.activateQueryTool && this.props.node.search) {
            tools.push(
                <LayersTool key="toolquery"
                    tooltip="toc.searchFeatures"
                    className="toc-queryTool"
                    node={this.props.node}
                    ref="target"
                    style={{"float": "right", cursor: "pointer"}}
                    glyph="search"
                    onClick={(node) => this.props.onToggleQuerypanel(node.search.url || node.url, node.name)}/>
            );
        }
        return (<div position="collapsible" className="collapsible-toc">
            <div style={{minHeight: "35px"}}>{tools}</div>
            <div><WMSLegend node={this.props.node}/></div>
        </div>);
    };

    renderTools = () => {
        const tools = [];
        if (this.props.visibilityCheckType) {
            tools.push(
                <VisibilityCheck key="visibilitycheck"
                    checkType={this.props.visibilityCheckType}
                    propertiesChangeHandler={this.props.propertiesChangeHandler}
                    style={{"float": "right", cursor: "pointer", marginLeft: 0, marginRight: 0, left: "-3px", fontSize: "29px"}}/>
            );
        }
        if (this.props.activateLegendTool) {
            tools.push(
                <LayersTool
                    tooltip="toc.displayLegendAndTools"
                    key="toollegend"
                    className="toc-legendTool"
                    ref="target"
                    style={{"float": "right", cursor: "pointer"}}
                    glyph="1-menu-manage"
                    onClick={(node) => this.props.onToggle(node.id, node.expanded)}/>
            );
        }
        if (this.props.activateZoomTool && this.props.node.bbox && !this.props.node.loadingError) {
            tools.push(
                <LayersTool key="toolzoom"
                    tooltip="toc.zoomToLayerExtent"
                    className="toc-zoomTool"
                    ref="target"
                    style={{"float": "right", cursor: "pointer"}}
                    glyph="1-full-screen"
                    onClick={(node) => this.props.onZoom(node.bbox.bounds, node.bbox.crs)}/>
            );
        }
        return tools;
    };

    render() {
        let {children, propertiesChangeHandler, onToggle, ...other } = this.props;
        return (
            <Node className="toc-default-layer" sortableStyle={this.props.sortableStyle} style={this.props.style} type="layer" {...other}>
                <Title onClick={this.props.onToggle}/>
                <LayersTool key="loadingerror"
                    style={{"display": this.props.node.loadingError ? "block" : "none", color: "red", cursor: "default"}}
                    glyph="ban-circle"
                    tooltip="toc.loadingerror"
                />
                {this.renderCollapsible()}
                {this.renderTools()}
                <InlineSpinner loading={this.props.node.loading}/>
                <ConfirmModal ref="removelayer" className="clayer_removal_confirm_button" show= {this.state.showDeleteDialog} onHide={this.closeDeleteDialog} onClose={this.closeDeleteDialog} onConfirm={this.onConfirmDelete} titleText={this.props.confirmDeleteText} confirmText={this.props.confirmDeleteText} cancelText={<Message msgId="cancel" />} body={this.props.confirmDeleteMessage} />
            </Node>
        );
    }

    closeDeleteDialog = () => {
        this.setState({
            showDeleteDialog: false
        });
    };

    displayDeleteDialog = () => {
        this.setState({
            showDeleteDialog: true
        });
    };
}

module.exports = DefaultLayer;
