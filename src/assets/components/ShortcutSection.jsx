import React, { Component } from 'react'
import { Button } from 'reactstrap';

export class ShortcutSection extends Component {

    state = {
        domain: null
    }


    componentDidUpdate(prevProps) {
        if (this.props.domain !== prevProps.domain) {
            this.setState({
                domain: this.props.domain,
            })
        }
    }
    handleClick(e, url) {
        e.preventDefault();
        chrome.tabs.create({ url: url, active: false });
    }

    render() {
        return (
            <div className="shortcut-section">
                {
                    this.state.domain ? (
                        <div>
                            <Button className="shortcut-btn" onClick={(e) => this.handleClick(e, "https://dnskit.dk/" + this.state.domain)}>DnsKit</Button>
                            <Button className="shortcut-btn" onClick={(e) => this.handleClick(e, "https://securitytrails.com/domain/" + this.state.domain + "/history/a")}>SecurityTrails</Button>
                            <Button className="shortcut-btn" onClick={(e) => this.handleClick(e, "http://www.google.com/search?q=site:" + this.state.domain)}>Site:{this.state.domain}</Button>
                            <Button className="shortcut-btn" onClick={(e) => this.handleClick(e, "http://" + this.state.domain + "/sitemap.xml")}>Sitemap.xml</Button>
                        </div>
                    ) : (
                            <div>
                                Loading..
                            </div>
                        )
                }
            </div>
        )
    }
}

export default ShortcutSection
