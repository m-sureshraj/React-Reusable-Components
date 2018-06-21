import React from 'react';
import PropTypes from 'prop-types';

export class Accordion extends React.Component {
    static propTypes = {
        activeItem: PropTypes.number
    };

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: this.getActiveItemIndex()
        };
    }

    getActiveItemIndex() {
        const { activeItem, children } = this.props;
        const type = typeof activeItem;

        if (type === 'undefined') return null;
        if (type === 'number' && activeItem < 0)
            throw new RangeError('Active item value should be positive number!');
        if (children.length < (activeItem + 1))
            throw new RangeError('Invalid active item index!');

        return activeItem;
    }

    onSelect = (selectedIndex) => {
        this.setState((prevState) => {
            return {
                activeIndex: (prevState.activeIndex === selectedIndex) ? null : selectedIndex
            }
        });
    };

    render() {
        const modifiedChildren = React.Children.map(this.props.children, (item, index) => {
            const localProps = {
                onSelect: this.onSelect,
                index
            };

            if (index === this.state.activeIndex) {
                localProps.isActive = true;
            }

            return React.cloneElement(item, localProps);
        });

        return (<div className="accordion">{ modifiedChildren }</div>);
    }
}

export const AccordionItem = ({ children, isActive, onSelect, index, disabled }) => {
    if (isActive && disabled) {
        throw new Error('Can\'t disable currently active item.!');
    }

    const modifiedChildren = React.Children.map(children, (item) => {
        if (item.type === AccordionItemHead) {
            return React.cloneElement(item, {
                isActive,
                toggleAccordion: disabled ? null : () => { onSelect(index); }
            });
        }

        return React.cloneElement(item, { isActive });
    });

    const classNames = [
        'accordion-item',
        isActive ? 'active' : null
    ].join(' ').trim();

    return (
        <div className={classNames}>{ modifiedChildren }</div>
    );
};

export const AccordionItemHead = ({ children, isActive, toggleAccordion }) => {
    const classNames = [
        'accordion-head',
        (typeof toggleAccordion !== 'function') ? 'accordion-disabled' : null
    ].join(' ').trim();

    return (
        <div className={classNames} onClick={toggleAccordion}>
            <p className="accordion-head__title">{ children }</p>
            <span className="icon arrow" />
        </div>
    );
};

export const AccordionItemBody = ({ children, isActive }) => {
    const classNames = [
        'accordion-body',
        isActive ? null : 'hide'
    ].join(' ').trim();

    return (
        <div className={classNames}>{ children }</div>
    );
};
