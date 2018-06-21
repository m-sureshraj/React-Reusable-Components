import React from 'react';
import { render } from 'react-dom';
import '../public/assets/css/index.css';

// Tabs
import { Tabs, TabList, Tab, TabPanels, TabPanel } from './components/tabs';

// Accordion
import { Accordion, AccordionItem, AccordionItemHead, AccordionItemBody } from './components/accordion';

class App extends React.Component {
    render() {
        return (
            <div className="wrapper">
                {/* <ParentCmp /> */}

                {/* Tabs */}
                <Tabs activeTab={2}>
                    <TabList>
                        <Tab>One</Tab>
                        <Tab disabled>Two</Tab>
                        <Tab>Three</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            This is first tab content
                        </TabPanel>
                        <TabPanel>
                            This is two tab content
                        </TabPanel>
                        <TabPanel>
                            This is three tab content
                        </TabPanel>
                    </TabPanels>
                </Tabs>

                {/* Accordion */}
                <Accordion>
                    <AccordionItem>
                        <AccordionItemHead>One</AccordionItemHead>
                        <AccordionItemBody>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Autem blanditiis culpa cum dolorem dolorum expedita fugiat hic labore
                            molestiae molestias nobis omnis quam quas quod ratione, suscipit tempore
                            velit voluptatum?</AccordionItemBody>
                    </AccordionItem>

                    <AccordionItem disabled>
                        <AccordionItemHead>Two</AccordionItemHead>
                        <AccordionItemBody>Content Two</AccordionItemBody>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionItemHead>Three</AccordionItemHead>
                        <AccordionItemBody>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Autem blanditiis culpa cum dolorem dolorum expedita fugiat hic labore
                            molestiae molestias nobis omnis quam quas quod ratione, suscipit tempore
                            velit voluptatum?</AccordionItemBody>
                    </AccordionItem>
                </Accordion>


            </div>
        );
    }
}

render(<App/>, document.querySelector('#root'));
