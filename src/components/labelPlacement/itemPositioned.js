import React, { Component } from "react";
import PropTypes from "prop-types";

class ItemPositioned extends Component {
    constructor(props) {
        super(props);
        // Use anchor coordinates before actual position is computed
        this.state = {
            top: props.y,
            left: props.x,
            visible: props.visible || !props.allowHidden,
        };
    }

    setPosition(top, left, visible) {
        this.setState({
            top,
            left,
            visible: visible || !this.props.allowHidden,
        });
    }

    getVisible() {
        return this.state.visible;
    }

    getPosition() {
        return {
            width: this.root.offsetWidth,
            height: this.root.offsetHeight,
            x: this.props.x,
            y: this.props.y,
            initialDistance: this.props.distance,
            initialAngle: this.props.angle,
            visible: this.state.visible,
            priority: this.props.priority,
        };
    }

    render() {
        const style = { ...this.state, position: "absolute" };
        if (this.state.visible) {
            return (
                <div ref={(ref) => { this.root = ref; }} style={style}>
                    {this.props.children}
                </div>
            );
        }
        return <div/>;
    }
}

ItemPositioned.defaultProps = {
    angle: 0,
    visible: true,
    allowHidden: false,
    priority: 1,
};

ItemPositioned.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    distance: PropTypes.number.isRequired,
    angle: PropTypes.number,
    children: PropTypes.element.isRequired,
    visible: PropTypes.bool,
    allowHidden: PropTypes.bool,
    priority: PropTypes.number,
};

export default ItemPositioned;
