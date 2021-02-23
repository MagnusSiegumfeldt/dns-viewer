import React, { Component } from 'react'
import ShortcutSection from './ShortcutSection';
import DnsSection from './DnsSection';
import InfoSection from './InfoSection';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

export class ContentContainer extends Component {

    render() {
        return (
            <div>
                <Tabs defaultActiveKey="dns">
                    <Tab eventKey="dns" title="DNS">
                        <DnsSection domain={this.props.domain} />
                    </Tab>
                    <Tab eventKey="domain" title="Domain">
                        <InfoSection domain={this.props.domain} />
                    </Tab>
                </Tabs>
                <ShortcutSection domain={this.props.domain} />
            </div>
        )
    }
}

export default ContentContainer
