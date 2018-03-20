import React, { Component } from "react";
import PropTypes from "prop-types";

class ItemFixed extends Component {
    constructor(props) {
        super(props);
        this.state = { top: props.top, left: props.left };
        this.visible = true;
    }

    setPosition(top, left) {
        this.setState({ top, left });
    }

    getVisible() {
        return this.visible;
    }

    getPosition() {
        return {
            top: this.props.top,
            left: this.props.left,
            width: this.root.offsetWidth,
            height: this.root.offsetHeight,
            isFixed: true,
            visible: this.visible,
            priority: 1,
        };
    }

    render() {
        const style = { ...this.state, position: "absolute" };
        return (
            <div ref={(ref) => { this.root = ref; }} style={style}>
                {this.props.children}
            </div>
        );
    }
}

ItemFixed.propTypes = {
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    children: PropTypes.element.isRequired,
};

export default ItemFixed;
