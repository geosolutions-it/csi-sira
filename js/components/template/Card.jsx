/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {isObject} = require('lodash');
const {connect} = require('react-redux');
// include application component
const TemplateSira = require('./TemplateSira');
const {Modal} = require('react-bootstrap');

const Draggable = require('react-draggable');
require("./card.css");

const Card = React.createClass({
    propTypes: {
        card: React.PropTypes.shape({
                template: React.PropTypes.oneOfType([
                        React.PropTypes.string,
                        React.PropTypes.func]),
                loadingCardTemplateError: React.PropTypes.oneOfType([
                        React.PropTypes.string,
                        React.PropTypes.object]),
                show: React.PropTypes.bool
        }),
        model: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            card: {
                template: "",
                loadingCardTemplateError: null,
                show: false
            },
            model: {}
        };
    },
     renderLoadTemplateException() {
        let exception = this.props.card.loadingCardTemplateError;
        if (isObject(exception)) {
            exception = exception.status + ": " + exception.data;
        }

        return (
            <Modal show={ (exception) ? true : false} bsSize="small">
                <Modal.Header closeButton>
                    <Modal.Title>Data Exception</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mapstore-error">{exception}</div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        );
    },
    renderCard() {
        return (this.props.card.loadingCardTemplateError) ? (
                this.renderLoadTemplateException()
            ) : (
            <Draggable>
            <div className="scheda-sira">
                <TemplateSira template={this.props.card.template} model={this.props.model}/>
            </div>
            </Draggable>);
    },
    render() {
        return (this.props.card.show) ? this.renderCard() : null;
    }
});
module.exports = connect((state) => {
    return {
        card: state.cardtemplate || {}
    };
})(Card);
