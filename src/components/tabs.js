import React from 'react';
import PropTypes from 'prop-types';

// Tabs V1
// export default class Tabs extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             activeTab: 0
//         };
//     }
//
//     switchTab(activeIndex) {
//         if (activeIndex === this.state.activeTab) {
//             return;
//         }
//
//         this.setState({
//             activeTab: activeIndex
//         });
//     }
//
//     renderTabs() {
//         const tabItems = this.props.data.map((item, index) => {
//             const isDisabled = this.props.disabled && this.props.disabled.includes(index);
//             const classNames = [
//                 this.state.activeTab === index ? 'active' : null,
//                 isDisabled ? 'disabled' : null
//             ].join(' ').trim();
//
//             return (
//                 <li
//                     key={index}
//                     className={'tab ' + classNames}
//                     onClick={isDisabled ? null : this.switchTab.bind(this, index)}
//                 >
//                     {item.title}
//                 </li>
//             );
//         });
//
//         return (
//             <ul className="tab-list">{tabItems}</ul>
//         );
//     }
//
//     renderPane() {
//         return (
//             <div className="tab-panel">{this.props.data[this.state.activeTab].body}</div>
//         );
//     }
//
//     render() {
//         return (
//             <div className="tab-wrapper">
//                 {this.renderTabs()}
//                 {this.renderPane()}
//             </div>
//         );
//     }
// }
//
// Tabs.propTypes = {
//     data: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
//     disabled: PropTypes.arrayOf(PropTypes.number.isRequired)
// };


// Tabs v2
export class Tabs extends React.Component {
    static propTypes = {
        active: PropTypes.number
    };

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: this.getActiveTabIndex()
        };
    }

    getActiveTabIndex() {
        const { activeTab, children } = this.props;

        if (!activeTab) return 0;
        if (activeTab < 0) throw new RangeError('ActiveTab value should be positive number!');

        for (let i = 0; i < children.length; i++) {
            if (children[i]['type'] === TabList) {
                if (children[i]['props']['children'].length < (activeTab + 1)) {
                    throw new RangeError('Invalid activeTab index!');
                }

                return activeTab;
            }
        }
    }

    handleSwitchTab = (index) => {
        this.setState({
            activeIndex: index
        });
    };

    render() {
        const children = React.Children.map(this.props.children, (child) => {
            if (child.type === TabPanels) {
                return React.cloneElement(child, {
                    activeIndex: this.state.activeIndex
                });
            }

            if (child.type === TabList) {
                return React.cloneElement(child, {
                    activeIndex: this.state.activeIndex,
                    onSwitchTab: this.handleSwitchTab
                });
            }

            return child;
        });

        return (
            <div className="tab-wrapper">{children}</div>
        );
    }
}

export const TabList = ({ children, activeIndex, onSwitchTab }) => {
    const modifiedChildren = React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
            isActive: index === activeIndex,
            activateTab: () => {
                if (index === activeIndex) return;
                onSwitchTab(index);
            }
        });
    });

    return (
        <ul className="tab-list">{modifiedChildren}</ul>
    );
};

export const Tab = ({ children, isActive, disabled, activateTab }) => {
    if (isActive && disabled) {
        throw new Error('Can\'t disable currently active tab.!');
    }

    const classNames = [
        (isActive) ? 'active' : null,
        (disabled) ? 'disabled' : null
    ].join(' ').trim();

    return (
        <li
            className={'tab ' + classNames}
            onClick={!disabled ? activateTab : null}
        >
            {children}
        </li>
    );
};

export const TabPanels = ({ children, activeIndex }) => {
    return (
        <div className="tab-panels">{children[activeIndex]}</div>
    );
};

export const TabPanel = ({ children }) => {
    return (
        <div className="tab-panel">{children}</div>
    );
};
